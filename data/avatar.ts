"use server";

import { Database } from "@/types/supabase";
import { SupabaseClient } from "@supabase/supabase-js";
import { Buffer } from "buffer";
import { db } from "@/db";
import { tryCatch } from "@/utils/global-utils";
import { logger } from "@/utils/logger";

export const uploadAvatarToStorage = async (
  fileOrBuffer: File | Buffer,
  userId: string,
  dbClient?: SupabaseClient<Database>
): Promise<{ avatarUrl: string; fileName: string }> => {
  // Convert to Buffer if needed
  const buffer = Buffer.isBuffer(fileOrBuffer)
    ? fileOrBuffer
    : Buffer.from(await fileOrBuffer.arrayBuffer());

  const { data, error } = await tryCatch(
    db.avatars.uploadAvatarToStorage(buffer, userId, dbClient)
  );
  if (error) {
    logger.error(error);
    throw error;
  }
  return data;
};

export const updateUserAvatar = async (
  userId: string,
  avatarUrl: string,
  dbClient?: SupabaseClient<Database>
): Promise<void> => {
  const { error } = await tryCatch(db.avatars.updateUserAvatar(userId, avatarUrl, dbClient));
  if (error) {
    logger.error(error);
    throw error;
  }
};

export const removeUserAvatar = async (
  userId: string,
  dbClient?: SupabaseClient<Database>
): Promise<void> => {
  const { error } = await tryCatch(db.avatars.removeUserAvatar(userId, dbClient));
  if (error) {
    logger.error(error);
    throw error;
  }
};
