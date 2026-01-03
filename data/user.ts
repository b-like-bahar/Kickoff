"use server";

import { Database } from "@/types/supabase";
import { SupabaseClient } from "@supabase/supabase-js";
import { db } from "@/db";
import { tryCatch } from "@/utils/global-utils";
import { logger } from "@/utils/logger";

export const signUpNewUser = async (
  email: string,
  password: string,
  dbClient?: SupabaseClient<Database>
) => {
  const { data, error } = await tryCatch(db.users.signUpNewUser(email, password, dbClient));
  if (error) {
    logger.error(error);
    throw error;
  }
  return data;
};

export const signInUser = async (
  email: string,
  password: string,
  dbClient?: SupabaseClient<Database>
) => {
  const { data, error } = await tryCatch(db.users.signInUser(email, password, dbClient));
  if (error) {
    logger.error(error);
    throw error;
  }
  return data;
};

export const getCurrentUserWithProfile = async (dbClient?: SupabaseClient<Database>) => {
  const { data, error } = await tryCatch(db.users.getCurrentUserWithProfile(dbClient));
  if (error) {
    logger.error(error);
    throw error;
  }
  return data;
};

export const getCurrentUser = async (dbClient?: SupabaseClient<Database>) => {
  const { data, error } = await tryCatch(db.users.getCurrentUser(dbClient));
  if (error) {
    logger.error(error);
    throw error;
  }
  return data;
};

export const getAllProfiles = async (dbClient?: SupabaseClient<Database>) => {
  const { data, error } = await tryCatch(db.users.getAllProfiles(dbClient));
  if (error) {
    logger.error(error);
    throw error;
  }
  return data;
};

export const getProfileByUserId = async (userId: string, dbClient?: SupabaseClient<Database>) => {
  const { data, error } = await tryCatch(db.users.getProfileByUserId(userId, dbClient));
  if (error) {
    logger.error(error);
    throw error;
  }
  return data;
};

export const updatePassword = async (
  password: string,
  dbClient?: SupabaseClient<Database>
): Promise<void> => {
  const { data, error } = await tryCatch(db.users.updatePassword(password, dbClient));
  if (error) {
    logger.error(error);
    throw error;
  }
  return data;
};

export const deleteAccount = async (userId: string) => {
  const { data, error } = await tryCatch(db.users.deleteAccount(userId));
  if (error) {
    logger.error(error);
    throw error;
  }
  return data;
};

export const signInWithGoogle = async (redirectTo: string, dbClient?: SupabaseClient<Database>) => {
  const { data, error } = await tryCatch(db.users.signInWithGoogle(redirectTo, dbClient));
  if (error) {
    logger.error(error);
    throw error;
  }
  return data;
};
