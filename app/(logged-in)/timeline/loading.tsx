import {
  MainContentWithSidebarSkeleton,
  TweetListSkeleton,
  FormSkeleton,
} from "@/components/ui/loading-skeletons";
import { Heading2 } from "@/components/ui/typography";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Main content area */}
        <div className="flex-1">
          <Heading2>Timeline</Heading2>

          {/* Create tweet card skeleton */}
          <div className="mt-4">
            <FormSkeleton rows={2} />
          </div>

          {/* Tweets skeleton */}
          <div className="mt-8">
            <TweetListSkeleton count={3} />
          </div>
        </div>

        {/* Sidebar skeleton */}
        <div className="lg:w-1/3 lg:flex-shrink-0">
          <div className="lg:sticky lg:top-6">
            <MainContentWithSidebarSkeleton
              mainContentRows={6}
              sidebarRows={0}
              className="flex-col"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
