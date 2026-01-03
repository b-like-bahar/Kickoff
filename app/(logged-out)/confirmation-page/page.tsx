import { Metadata } from "next";
import { Suspense } from "react";
import ClientConfirmationPage from "@/app/(logged-out)/confirmation-page/confirmation-page";
import { Heading1 } from "@/components/ui/typography";
import { createPageMetadata } from "@/utils/seo-utils";

export const metadata: Metadata = createPageMetadata("confirmationPage");

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<Heading1 className="text-center">Loading...</Heading1>}>
      <ClientConfirmationPage />
    </Suspense>
  );
}
