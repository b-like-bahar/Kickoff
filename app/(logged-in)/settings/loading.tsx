import { SettingsCardSkeleton, FormSkeleton } from "@/components/ui/loading-skeletons";

export default function Loading() {
  return (
    <div>
      <div className="flex flex-col gap-6 max-w-lg mx-auto">
        <SettingsCardSkeleton />
        <FormSkeleton rows={2} />
      </div>
    </div>
  );
}
