import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UiErrorButton } from "@/app/errors-testing/ui-error-button";
import { ActionErrorButton } from "@/app/errors-testing/action-error-button";

// This is used to make sure we are getting error reports in production. We can programmatically throw errors by navigating to this page and make sure that our error monitoring and alerting is working.
export default function ErrorPage() {
  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Error Testing Page</h1>
        <p className="text-muted-foreground">
          Click the buttons below to trigger different types of errors for testing error reporting.
        </p>
      </div>

      <Alert className="mb-6">
        <AlertDescription>
          <strong>Warning:</strong> This page is for testing purposes only. The buttons below will
          intentionally throw errors to test your error reporting system.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Error Tests</CardTitle>
          <CardDescription>Simple error scenarios for testing error reporting</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Client-Side Errors</h3>
            <div className="flex flex-wrap gap-3">
              <UiErrorButton />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Server Action Errors</h3>
            <ActionErrorButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
