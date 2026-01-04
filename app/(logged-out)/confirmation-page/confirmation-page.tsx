"use client";

import { useSearchParams } from "next/navigation";
import { Heading1, Text } from "@/components/ui/typography";

type ConfirmationType = "sign-up" | "forgot-password";

export default function ClientConfirmationPage() {
  const searchParams = useSearchParams();

  const email = searchParams?.get("email") || "your email address";
  const type = (searchParams?.get("type") as ConfirmationType) || "sign-up";

  const title = type === "sign-up" ? "Check your inbox" : "Done!";
  const subTitle = type === "sign-up" ? "Thank you for signing up for Kickoff" : undefined;
  const message =
    type === "sign-up"
      ? `We've sent you an email with a confirmation link to ${email}. Please click on the link to complete your registration.`
      : `We've sent you an email with a reset link to ${email}. Please click on the link to reset your password.`;

  return (
    <div
      className="flex min-h-screen items-center justify-center p-6"
      data-testid="confirmation-page"
    >
      <div className="w-full max-w-lg text-center flex flex-col items-center">
        <Heading1 className="text-center mb-4">{title}</Heading1>

        {subTitle && (
          <Text size="md" variant="muted" className="text-center mt-2">
            {subTitle}
          </Text>
        )}

        <Text size="lg" className="text-center mt-4">
          {message}
        </Text>

        {type === "sign-up" && (
          <Text size="md" variant="muted" className="text-center mt-3">
            If you don&apos;t see the email in your inbox, please check your spam or junk folder.
          </Text>
        )}
      </div>
    </div>
  );
}
