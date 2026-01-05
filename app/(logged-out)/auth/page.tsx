import { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignInForm } from "@/app/(logged-out)/auth/sign-in-form";
import { SignUpForm } from "@/app/(logged-out)/auth/sign-up-form";
import { Heading1, Text } from "@/components/ui/typography";
import { appConstants, createPageMetadata } from "@/utils/seo-utils";
import { GoogleAuthButton } from "@/app/(logged-out)/auth/google-auth-button";

export const metadata: Metadata = createPageMetadata("auth", {
  openGraph: {
    url: `${appConstants.appUrl}/auth`,
  },
});

export default function AuthPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-4">
      <div className="text-center max-w-md">
        <Heading1>Get Started</Heading1>
        <Text className="mt-4">Sign in or create an account to access your app dashboard.</Text>
      </div>
      <div className="w-full max-w-md">
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="flex justify-center w-full mb-6">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin" className="space-y-4">
            <SignInForm />
            <GoogleAuthButton type="login" />
          </TabsContent>
          <TabsContent value="signup" className="space-y-4">
            <SignUpForm />
            <GoogleAuthButton type="signup" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
