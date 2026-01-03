import { MainContentWithSidebarSkeleton } from "@/components/ui/loading-skeletons";

export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <MainContentWithSidebarSkeleton mainContentRows={5} sidebarRows={4} />
    </div>
  );
}
