import { Metadata } from "next";
import { ResetPasswordForm } from "@/app/(logged-in)/settings/components/reset-password-form";
import { DeleteAccountCard } from "@/app/(logged-in)/settings/components/delete-account-card";
import { AvatarUploadForm } from "@/app/(logged-in)/settings/components/avatar-upload-form";
import { Heading4 } from "@/components/ui/typography";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LogoutButton } from "@/app/(logged-in)/settings/components/logout-button";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/supabase-server-client";
import { getCurrentUserWithProfile } from "@/data/user";
import { createPageMetadata } from "@/utils/seo-utils";

// Force dynamic rendering because this page uses cookies for authentication
// via getCurrentUserWithProfile() which calls createClient() that accesses cookies
export const dynamic = "force-dynamic";

export const metadata: Metadata = createPageMetadata("settings");

export default async function SettingsPage() {
  const dbClient = await createClient();
  const { user, profile } = await getCurrentUserWithProfile(dbClient);

  const userId = user.id;
  const userEmail = user.email || "";

  return (
    <div>
      <div className="flex flex-col gap-6 max-w-lg mx-auto">
        <Card className="w-full" id="reset-password-form">
          <CardHeader>
            <Heading4>Settings</Heading4>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <ResetPasswordForm userId={userId} userEmail={userEmail} />
            <Separator />
            <LogoutButton />
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <Heading4>Profile Picture</Heading4>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <AvatarUploadForm currentAvatarUrl={profile.avatar_url} />
          </CardContent>
        </Card>

        <DeleteAccountCard />
      </div>
    </div>
  );
}
