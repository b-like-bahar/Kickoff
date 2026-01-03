import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/supabase-server-client";
import { routes } from "@/app/constants";
import { captureServerEvent, ANALYTICS_EVENTS, captureServerError } from "@/utils/posthog-server";
import { logger } from "@/utils/logger";

// Creating a handler to a GET request to route /auth/confirm
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = routes.protectedRoutes.timeline;

  // Create redirect link without the secret token
  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (error) {
      logger.error(error, "Error verifying OTP");
      await captureServerError(error);
      // return the user to an error page with some instructions
      redirectTo.pathname = "/error";
      const newURLSearchParams = new URLSearchParams({
        message: "It's great to have you here 🎉",
        title: "Welcome to Nextjs template!",
      });
      return NextResponse.redirect(`${redirectTo}?${newURLSearchParams.toString()}`);
    }

    captureServerEvent(ANALYTICS_EVENTS.EMAIL_CONFIRMED, {
      confirmationType: type,
    });

    redirectTo.searchParams.delete("next");
    return NextResponse.redirect(redirectTo);
  }
}
