import { Metadata } from "next";
import { navigateToTimelineIfUserIsLoggedIn } from "@/utils/server-utils";
import { createClient } from "@/utils/supabase/supabase-server-client";
import { Button } from "@/components/ui/button";
import { Heading1, Text } from "@/components/ui/typography";
import { routes } from "@/app/constants";
import Link from "next/link";
import { createPageMetadata } from "@/utils/seo-utils";

export const metadata: Metadata = createPageMetadata("home");

export default async function Page() {
  const dbClient = await createClient();
  await navigateToTimelineIfUserIsLoggedIn(dbClient);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-4">
      <div className="text-center max-w-4xl">
        <Heading1>Welcome to Kickoff</Heading1>
        <Text className="mt-4">Ship your SaaS, web app, or startup faster with Kickoff.</Text>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href={routes.publicRoutes.auth}>
          <Button size="lg" className="w-full sm:w-auto">
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
}
