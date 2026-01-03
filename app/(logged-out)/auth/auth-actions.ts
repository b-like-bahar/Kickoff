"use server";

import { signUpNewUser, signInUser, signInWithGoogle } from "@/data/user";
import { signInFormSchema, signUpFormSchema } from "@/utils/validators";
import { flattenValidationErrors } from "@/utils/server-utils";
import { revalidatePath } from "next/cache";
import { ActionResponse, formatActionErrorMessage } from "@/utils/actions-utils";
import { routes } from "@/app/constants";
import { tryCatch } from "@/utils/global-utils";
import { createClient } from "@/utils/supabase/supabase-server-client";
import { appConstants } from "@/utils/seo-utils";
import { redirect } from "next/navigation";
import { captureServerEvent, ANALYTICS_EVENTS, captureServerError } from "@/utils/posthog-server";

export async function signUpAction(formData: FormData): ActionResponse<{
  email: string;
  confirmationRequired: boolean;
}> {
  const validatedFields = signUpFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    await captureServerError(new Error("Sign up failed due to validation errors"));
    return {
      error: flattenValidationErrors(validatedFields.error),
      data: null,
    };
  }
  const dbClient = await createClient();
  const { error, data } = await tryCatch(
    signUpNewUser(validatedFields.data.email, validatedFields.data.password, dbClient)
  );
  if (error) {
    await captureServerError(error);
    return {
      data: null,
      error: formatActionErrorMessage(error),
    };
  }

  captureServerEvent(ANALYTICS_EVENTS.USER_SIGNED_UP, {
    signupMethod: "email",
  });

  revalidatePath(routes.protectedRoutes.timeline);
  return {
    data: {
      email: validatedFields.data.email,
      confirmationRequired: !data.user?.email_confirmed_at,
    },
    error: null,
  };
}

export async function signInAction(formData: FormData): Promise<ActionResponse<null>> {
  const validatedFields = signInFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!validatedFields.success) {
    await captureServerError(new Error("Sign in failed due to validation errors"));
    return {
      error: flattenValidationErrors(validatedFields.error),
      data: null,
    };
  }

  const dbClient = await createClient();
  const { error } = await tryCatch(
    signInUser(validatedFields.data.email, validatedFields.data.password, dbClient)
  );
  if (error) {
    await captureServerError(error);
    return {
      data: null,
      error: formatActionErrorMessage(error),
    };
  }

  captureServerEvent(ANALYTICS_EVENTS.USER_SIGNED_IN, {
    signinMethod: "email",
  });

  revalidatePath(routes.protectedRoutes.timeline);
  return {
    data: null,
    error: null,
  };
}

export async function googleAuthAction(
  next: string = routes.protectedRoutes.timeline
): ActionResponse<null> {
  const origin = process.env.NEXT_PUBLIC_API_URL || appConstants.appUrl;
  if (!origin) {
    await captureServerError(new Error("Authentication configuration error"));
    return { data: null, error: formatActionErrorMessage("Authentication configuration error") };
  }

  const dbClient = await createClient();

  const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(next)}`;

  const { error, data } = await tryCatch(signInWithGoogle(redirectTo, dbClient));

  if (error) {
    await captureServerError(error);
    return { data: null, error: formatActionErrorMessage(error) };
  }

  if (!data.url) {
    await captureServerError(new Error("No redirect URL provided"));
    return { data: null, error: "No redirect URL provided" };
  }
  captureServerEvent(ANALYTICS_EVENTS.GOOGLE_AUTH_SUCCESS, {
    authProvider: "google",
  });
  redirect(data.url);
}
