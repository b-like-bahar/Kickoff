import React from "react";
import { Navbar } from "@/components/navbar/navbar";
import { getCurrentUserWithProfile } from "@/data/user";
import { createClient } from "@/utils/supabase/supabase-server-client";

export default async function LoggedInLayout({ children }: { children: React.ReactNode }) {
  const dbClient = await createClient();
  const { user, profile } = await getCurrentUserWithProfile(dbClient);

  return (
    <div className="min-h-screen bg-background">
      <Navbar avatarUrl={profile?.avatar_url} userId={user.id} />
      <div className="flex container mx-auto py-6 px-4 lg:px-0">
        <main className="w-full">{children}</main>
      </div>
    </div>
  );
}
