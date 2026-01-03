import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/supabase-server-client";
import { routes } from "@/app/constants";
import { ZodError } from "zod";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";
import { NextResponse } from "next/server";

export async function navigateToTimelineIfUserIsLoggedIn(supabase?: SupabaseClient<Database>) {
  const client = supabase || (await createClient());
  const {
    data: { user },
  } = await client.auth.getUser();

  const newURLParams = new URLSearchParams();
  newURLParams.set("message", "You must be signed out to access this page");
  newURLParams.set("messageType", "warning");
  if (user) {
    return redirect(`${routes.protectedRoutes.timeline}?${newURLParams}`);
  }
}

/**
 * Flattens Zod validation errors into a single string
 * @param error - ZodError from validation
 * @returns A single string with all error messages joined by commas
 *
 * @example
 * ```typescript
 * const result = settingsFormSchema.safeParse(data);
 * if (!result.success) {
 *   const errorMessage = flattenValidationErrors(result.error);
 *   // Returns: "Name is required, Username must be at least 3 characters"
 * }
 * ```
 */
export function flattenValidationErrors(error: ZodError): string {
  const fieldErrors = error.flatten().fieldErrors;
  const formErrors = error.flatten().formErrors;

  const allErrors: string[] = [];

  // Collect field-specific errors
  Object.values(fieldErrors).forEach(errors => {
    if (errors && errors.length > 0) {
      allErrors.push(...errors);
    }
  });

  // Collect form-level errors
  if (formErrors && formErrors.length > 0) {
    allErrors.push(...formErrors);
  }

  return allErrors.join(", ");
}

export function redirectWithErrorMessage(
  request: Request,
  error: string | Error,
  redirectUrl?: string
): NextResponse {
  const url = new URL(request.url);
  if (redirectUrl) {
    url.pathname = redirectUrl;
  } else {
    url.pathname = "/";
  }
  url.searchParams.set("message", typeof error === "string" ? error : error.message);
  url.searchParams.set("messageType", "error");
  return NextResponse.redirect(url);
}
