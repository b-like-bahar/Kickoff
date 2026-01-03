import { createClient } from "@/utils/supabase/supabase-server-client";
import { createAdminClient } from "@/utils/supabase/supabase-admin";
import { Database } from "@/types/supabase";
import { User, SupabaseClient } from "@supabase/supabase-js";
import { routes } from "@/app/constants";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type UserWithProfile = {
  user: User;
  profile: Profile;
};

async function signUpNewUser(email: string, password: string, dbClient?: SupabaseClient<Database>) {
  const db = dbClient || (await createClient());

  const { data, error } = await db.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}${routes.protectedRoutes.timeline}`,
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

async function signInUser(email: string, password: string, dbClient?: SupabaseClient<Database>) {
  const db = dbClient || (await createClient());

  const { data, error } = await db.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function getCurrentUser(dbClient?: SupabaseClient<Database>) {
  const db = dbClient || (await createClient());
  const { data, error } = await db.auth.getUser();
  if (error) {
    throw error;
  }
  return data;
}

async function getCurrentUserWithProfile(
  dbClient?: SupabaseClient<Database>
): Promise<UserWithProfile> {
  const db = dbClient || (await createClient());

  const {
    data: { user },
    error: authError,
  } = await db.auth.getUser();

  if (authError) {
    throw authError;
  }

  if (!user) throw new Error("User not found");

  const profile = await getProfileByUserId(user.id, db);

  if (!profile) throw new Error("Profile not found");

  return {
    user,
    profile,
  };
}

async function getAllProfiles(dbClient?: SupabaseClient<Database>): Promise<Profile[]> {
  const db = dbClient || (await createClient());

  const { data, error } = await db.from("profiles").select("*");

  if (error) {
    throw error;
  }

  return data;
}

async function getProfileByUserId(
  userId: string,
  dbClient?: SupabaseClient<Database>
): Promise<Profile | null> {
  const db = dbClient || (await createClient());

  const { data, error } = await db.from("profiles").select("*").eq("user_id", userId).single();

  if (error) {
    throw error;
  }

  return data;
}

async function updatePassword(
  password: string,
  dbClient?: SupabaseClient<Database>
): Promise<void> {
  const db = dbClient || (await createClient());

  const { error } = await db.auth.updateUser({
    password,
  });

  if (error) {
    throw error;
  }
}

async function deleteAccount(userId: string) {
  const supabaseAdmin = createAdminClient();
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) {
    throw error;
  }
}

async function signInWithGoogle(redirectTo: string, dbClient?: SupabaseClient<Database>) {
  const db = dbClient || (await createClient());

  const { data, error } = await db.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });

  if (error) {
    throw error;
  }

  return data;
}

export const usersDb = {
  signUpNewUser,
  signInUser,
  getCurrentUser,
  getCurrentUserWithProfile,
  getAllProfiles,
  getProfileByUserId,
  updatePassword,
  deleteAccount,
  signInWithGoogle,
};
