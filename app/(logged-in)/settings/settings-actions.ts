"use server";

import { deleteAccount, updatePassword, getCurrentUser } from "@/data/user";
import { resetPasswordSchema } from "@/utils/validators";
import { flattenValidationErrors } from "@/utils/server-utils";
import { ActionResponse, formatActionErrorMessage } from "@/utils/actions-utils";
import { tryCatch } from "@/utils/global-utils";
import { createClient } from "@/utils/supabase/supabase-server-client";
import { captureServerEvent, ANALYTICS_EVENTS, captureServerError } from "@/utils/posthog-server";

export async function updatePasswordAction(formData: FormData): ActionResponse<null> {
  const validatedFields = resetPasswordSchema.safeParse({
    newPassword: formData.get("newPassword"),
    confirmNewPassword: formData.get("confirmNewPassword"),
  });

  if (!validatedFields.success) {
    await captureServerError(new Error("Password update failed"));
    return {
      error: flattenValidationErrors(validatedFields.error),
      data: null,
    };
  }

  const dbClient = await createClient();
  const { error } = await tryCatch(updatePassword(validatedFields.data.newPassword, dbClient));
  if (error) {
    await captureServerError(new Error("Password update failed"));
    return {
      data: null,
      error: formatActionErrorMessage(error),
    };
  }

  // Track successful password update
  captureServerEvent(ANALYTICS_EVENTS.PASSWORD_UPDATED, {});

  return {
    data: null,
    error: null,
  };
}

export async function deleteAccountAction(): ActionResponse<null> {
  const dbClient = await createClient();
  const { user } = await getCurrentUser(dbClient);
  if (!user) {
    await captureServerError(new Error("User not found when deleting account"));
    return {
      data: null,
      error: "User not found",
    };
  }

  const { error } = await tryCatch(deleteAccount(user.id));
  if (error) {
    await captureServerError(error);
    return {
      data: null,
      error: formatActionErrorMessage(error),
    };
  }

  // Track successful account deletion
  captureServerEvent(ANALYTICS_EVENTS.ACCOUNT_DELETED, {
    userId: user.id,
  });

  return {
    data: null,
    error: null,
  };
}
