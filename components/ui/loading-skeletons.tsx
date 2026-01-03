import { Loading } from "@/components/ui/loading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Reusable skeleton for main content + sidebar layout
export function MainContentWithSidebarSkeleton({
  mainContentRows = 5,
  sidebarRows = 4,
  className = "",
}: {
  mainContentRows?: number;
  sidebarRows?: number;
  className?: string;
}) {
  return (
    <div className={`flex flex-col lg:flex-row gap-6 w-full ${className}`}>
      {/* Main content area skeleton */}
      <div className="flex-1">
        <Loading type="skeleton" variant="default" skeletonRows={mainContentRows} />
      </div>

      {/* Sidebar skeleton */}
      <div className="lg:w-1/3 lg:flex-shrink-0">
        <Loading type="skeleton" variant="default" skeletonRows={sidebarRows} />
      </div>
    </div>
  );
}

// Reusable skeleton for tweet cards
export function TweetCardSkeleton() {
  return (
    <div className="p-4 border rounded-lg">
      <Loading type="skeleton" variant="inline" skeletonRows={4} />
    </div>
  );
}

// Reusable skeleton for multiple tweet cards
export function TweetListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <TweetCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Reusable skeleton for settings card
export function SettingsCardSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader>
        <Loading type="skeleton" variant="inline" skeletonRows={1} />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Loading type="skeleton" variant="inline" skeletonRows={3} />
      </CardContent>
    </Card>
  );
}

// Reusable skeleton for form inputs
export function FormSkeleton({ rows = 3 }: { rows?: number }) {
  return <Loading type="skeleton" variant="inline" skeletonRows={rows} />;
}

// Reusable skeleton for profile info
export function ProfileSkeleton() {
  return <Loading type="skeleton" variant="default" skeletonRows={4} />;
}
