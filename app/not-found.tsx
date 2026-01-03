import { Heading2, Text } from "@/components/ui/typography";
import { Heading1 } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { routes } from "@/app/constants";
import { createPageMetadata } from "@/utils/seo-utils";
import { Metadata } from "next";
import { createClient } from "@/utils/supabase/supabase-server-client";
import { tryCatch } from "@/utils/global-utils";

export const metadata: Metadata = createPageMetadata("notFound");

export default async function NotFound() {
  const dbClient = await createClient();
  const { data, error } = await tryCatch(dbClient.auth.getUser());
  const isAuthenticated = !error && Boolean(data?.data?.user);

  const backLink = isAuthenticated
    ? { href: routes.protectedRoutes.timeline, text: "← Back to Timeline" }
    : { href: routes.publicRoutes.home, text: "← Back to Home" };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-8 animate-fade-in">
      <div className="text-[5rem] mb-2 animate-bounce">😕</div>
      <Heading1 className="mb-2 text-6xl font-extrabold tracking-tight">404</Heading1>
      <Heading2 className="mb-2 text-2xl font-semibold">Oops! Page Not Found</Heading2>
      <Text variant="muted" className="mb-6 max-w-xl">
        We couldn&apos;t find the page you were looking for.
        <br />
        It might have been moved, deleted, or never existed.
        <br />
        But don&apos;t worry, you can always head back home!
      </Text>
      <Button asChild>
        <Link href={backLink.href}>{backLink.text}</Link>
      </Button>
    </div>
  );
}
