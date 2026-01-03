import { createClient } from "@/utils/supabase/supabase-server-client";
import { type Database } from "@/types/supabase";
import { SupabaseClient } from "@supabase/supabase-js";
import { logger } from "@/utils/logger";
import { DEFAULT_AVATAR_URL } from "@/utils/client-utils";

export type AvatarUploadResult = {
  avatarUrl: string;
  fileName: string;
};

function tryGetAvatarObjectNameFromPublicUrl(avatarUrl: string): string | null {
  // We only want to delete files that are actually in the Supabase "avatars" bucket.
  // - Skip our app default avatar (local public asset)
  // - Skip any non-URL / relative paths
  if (!avatarUrl.startsWith("http")) return null;
  if (!avatarUrl.includes("/avatars/")) return null;

  try {
    const url = new URL(avatarUrl);
    const pathParts = url.pathname.split("/");
    const fileName = pathParts[pathParts.length - 1];
    return fileName || null;
  } catch {
    return null;
  }
}

async function uploadAvatarToStorage(
  imageBuffer: Buffer,
  userId: string,
  dbClient?: SupabaseClient<Database>
): Promise<AvatarUploadResult> {
  const supabase = dbClient || (await createClient());

  // First, get the current avatar URL to delete the old file
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("user_id", userId)
    .single();

  if (profileError) {
    throw profileError;
  }

  // Delete old avatar file if it exists
  if (profile?.avatar_url) {
    const oldFileName = tryGetAvatarObjectNameFromPublicUrl(profile.avatar_url);
    if (oldFileName) {
      const { error: deleteError } = await supabase.storage.from("avatars").remove([oldFileName]);
      if (deleteError) {
        // Log the error but don't fail the upload since it's not critical
        logger.error(`Failed to delete old avatar: ${deleteError.message}`);
      }
    }
  }

  // Use combination of userId and timestamp for filename
  const fileExt = "webp";
  const fileName = `${userId}-${Date.now()}.${fileExt}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, imageBuffer, {
      contentType: "image/webp",
      cacheControl: "3600",
    });

  if (uploadError) {
    // Cleanup: remove the file if it was partially uploaded
    await supabase.storage.from("avatars").remove([fileName]);
    throw uploadError;
  }

  // Get public URL
  const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName);

  if (!urlData.publicUrl) {
    throw new Error("Supabase returned an empty public URL for the uploaded avatar");
  }

  return {
    avatarUrl: urlData.publicUrl,
    fileName,
  };
}

async function updateUserAvatar(
  userId: string,
  avatarUrl: string,
  dbClient?: SupabaseClient<Database>
): Promise<void> {
  const supabase = dbClient || (await createClient());

  // Update profile with new avatar URL
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("user_id", userId);

  if (updateError) {
    // Cleanup: remove the uploaded file if profile update fails
    const url = new URL(avatarUrl);
    const pathParts = url.pathname.split("/");
    const fileName = pathParts[pathParts.length - 1];
    await supabase.storage.from("avatars").remove([fileName]);
    throw updateError;
  }
}

async function removeUserAvatar(
  userId: string,
  dbClient?: SupabaseClient<Database>
): Promise<void> {
  const supabase = dbClient || (await createClient());

  // First, get the current avatar URL to extract the filename
  const { data: profile, error: fetchError } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("user_id", userId)
    .single();

  if (fetchError) {
    throw fetchError;
  }

  // Reset to the default avatar until the user uploads a new one
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: DEFAULT_AVATAR_URL })
    .eq("user_id", userId);

  if (updateError) {
    throw updateError;
  }

  // Delete the avatar file from storage if it exists
  if (profile?.avatar_url) {
    const fileName = tryGetAvatarObjectNameFromPublicUrl(profile.avatar_url);
    if (fileName) {
      const { error: deleteError } = await supabase.storage.from("avatars").remove([fileName]);
      if (deleteError) {
        // Log the error but don't fail the removal since it's not critical
        logger.error(`Failed to delete avatar: ${deleteError.message}`);
      }
    }
  }
}

export const avatarsDb = {
  uploadAvatarToStorage,
  updateUserAvatar,
  removeUserAvatar,
};
