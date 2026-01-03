"use server";

import { ActionResponse, formatActionErrorMessage } from "@/utils/actions-utils";
import { tryCatch } from "@/utils/global-utils";
import { revalidatePath } from "next/cache";
import { routes } from "@/app/constants";
import { avatarFileSchema } from "@/utils/validators";
import { flattenValidationErrors } from "@/utils/server-utils";
import { uploadAvatarToStorage, updateUserAvatar, removeUserAvatar } from "@/data/avatar";
import { AvatarUploadResult } from "@/db/db-avatars";
import { createClient } from "@/utils/supabase/supabase-server-client";
import { ANALYTICS_EVENTS, captureServerError, captureServerEvent } from "@/utils/posthog-server";
import sharp from "sharp";

async function processImage(file: File): Promise<Buffer> {
  // Convert file to Buffer for processing
  const arrayBuffer = await file.arrayBuffer();
  const inputBuffer = Buffer.from(arrayBuffer);

  // Process image with Sharp
  const { data: processedImageBuffer, error: sharpError } = await tryCatch(
    sharp(inputBuffer, { limitInputPixels: 24000000 })
      .rotate()
      .resize(400, 400, {
        fit: "cover",
        position: "center",
      })
      .webp({
        quality: 85,
        effort: 6,
      })
      .toBuffer()
  );

  if (sharpError) {
    throw sharpError;
  }

  return processedImageBuffer;
}

export async function uploadAvatarAction(
  formData: FormData
): ActionResponse<{ avatarUrl: string }> {
  const validatedFields = avatarFileSchema.safeParse({
    avatar: formData.get("avatar"),
  });

  if (!validatedFields.success) {
    await captureServerError(new Error("Avatar upload failed due to validation errors"));
    return {
      error: flattenValidationErrors(validatedFields.error),
      data: null,
    };
  }

  const { avatar: file } = validatedFields.data;
  const dbClient = await createClient();
  const {
    data: { user },
    error: authError,
  } = await dbClient.auth.getUser();
  if (authError || !user) {
    await captureServerError(new Error("Unauthorized"));
    return {
      data: null,
      error: "Unauthorized",
    };
  }
  const userId = user.id;

  // Process the image
  const { data: processedImageBuffer, error: processError } = await tryCatch(processImage(file));
  if (processError || !processedImageBuffer) {
    await captureServerError(processError ?? new Error("Failed to process image"));
    return {
      data: null,
      error: formatActionErrorMessage(processError),
    };
  }

  // Upload processed image to storage and update profile
  const { error: uploadError, data: uploadResult } = (await tryCatch(
    uploadAvatarToStorage(processedImageBuffer, userId, dbClient)
  )) as { error: Error | null; data: AvatarUploadResult | null };

  if (uploadError || !uploadResult) {
    await captureServerError(uploadError ?? new Error("Failed to upload avatar"));
    return {
      data: null,
      error: formatActionErrorMessage(uploadError),
    };
  }

  // Update user profile with new avatar URL
  const { error: updateError } = await tryCatch(
    updateUserAvatar(userId, uploadResult.avatarUrl, dbClient)
  );

  if (updateError) {
    await captureServerError(updateError);
    return {
      data: null,
      error: formatActionErrorMessage(updateError),
    };
  }

  // Revalidate pages that show the avatar
  revalidatePath(routes.protectedRoutes.settings);
  revalidatePath(routes.protectedRoutes.timeline);
  revalidatePath(`${routes.protectedRoutes.userProfile}/${userId}`);

  captureServerEvent(ANALYTICS_EVENTS.AVATAR_UPDATED, {
    userId,
    avatarUrl: uploadResult.avatarUrl,
  });

  return {
    data: { avatarUrl: uploadResult.avatarUrl },
    error: null,
  };
}

export async function deleteAvatarAction(): ActionResponse<null> {
  const dbClient = await createClient();

  // Get the authenticated user from session
  const {
    data: { user },
    error: authError,
  } = await dbClient.auth.getUser();

  if (authError || !user) {
    await captureServerError(new Error("Unauthorized"));
    return {
      data: null,
      error: "Unauthorized",
    };
  }

  const userId = user.id;

  // Remove avatar from database and storage
  const { error: removeError } = await tryCatch(removeUserAvatar(userId, dbClient));

  if (removeError) {
    await captureServerError(removeError);
    return {
      data: null,
      error: formatActionErrorMessage(removeError),
    };
  }

  // Revalidate pages that show the avatar
  revalidatePath(routes.protectedRoutes.settings);
  revalidatePath(routes.protectedRoutes.timeline);
  revalidatePath(`/user/${userId}`);

  captureServerEvent(ANALYTICS_EVENTS.AVATAR_DELETED, {
    userId,
  });

  return {
    data: null,
    error: null,
  };
}
