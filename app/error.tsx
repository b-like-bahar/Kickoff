"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heading1, Text } from "@/components/ui/typography";
import { AlertTriangle, Home } from "lucide-react";
import Link from "next/link";
import { routes } from "@/app/constants";
import { useEffect } from "react";
import posthog from "posthog-js";
import { isLocalhost } from "@/utils/global-utils";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RootErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    if (!isLocalhost) {
      posthog.captureException(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="text-center">
          <CardHeader className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <CardTitle>
                <Heading1>Something went wrong</Heading1>
              </CardTitle>
              <CardDescription>
                <Text variant="muted" size="lg">
                  We encountered an unexpected error. Please try again or contact support if the
                  problem persists.
                </Text>
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 text-left">
              <Text size="sm" weight="semibold" className="mb-2">
                Error Details:
              </Text>
              <Text size="sm" variant="muted" className="font-mono break-all">
                {error.message}
              </Text>
              {error.digest && (
                <Text size="sm" variant="muted" className="font-mono mt-2">
                  Error ID: {error.digest}
                </Text>
              )}
            </div>

            <div className="space-y-3">
              <Button onClick={reset} className="w-full" size="lg">
                Try Again
              </Button>

              <div className="flex gap-2">
                <Link href={routes.publicRoutes.home} className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Home className="w-4 h-4" />
                    Home
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>

          <CardFooter className="justify-center">
            <Text size="sm" variant="muted">
              If this problem continues, please contact our support team.
            </Text>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
