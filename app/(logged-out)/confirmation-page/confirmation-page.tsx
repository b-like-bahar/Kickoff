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
      className="flex flex-col items-center justify-center h-screen"
      data-testid="confirmation-page"
    >
      <Heading1 className="text-center">{title}</Heading1>
      {subTitle && <Text className="text-center">{subTitle}</Text>}
      <Text className="text-center">{message}</Text>
    </div>
  );
}
