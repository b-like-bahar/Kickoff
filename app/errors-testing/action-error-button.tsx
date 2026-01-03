"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { testErrorAction } from "./test-actions";
import { toast } from "@/utils/toast";

export function ActionErrorButton() {
  const [isPending, startTransition] = useTransition();
  const [lastError, setLastError] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<string | null>(null);

  const handleActionError = (actionType: string) => {
    setLastError(null);
    setActiveType(actionType);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("actionType", actionType);

      const result = await testErrorAction(formData);

      if (result.error) {
        setLastError(result.error);
        toast({
          type: "error",
          message: result.error,
        });
      } else if (result.data) {
        toast({
          type: "success",
          message: result.data.message,
        });
      }
      setActiveType(null);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          onClick={() => handleActionError("validation")}
          disabled={isPending}
          variant="outline"
        >
          {isPending && activeType === "validation" ? "Testing..." : "Test Validation Error"}
        </Button>

        <Button
          type="button"
          onClick={() => handleActionError("runtime")}
          disabled={isPending}
          variant="destructive"
        >
          {isPending && activeType === "runtime" ? "Testing..." : "Test Runtime Error"}
        </Button>

        <Button
          type="button"
          onClick={() => handleActionError("async")}
          disabled={isPending}
          variant="outline"
        >
          {isPending && activeType === "async" ? "Testing..." : "Test Async Error"}
        </Button>
      </div>

      {lastError && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive">
            <strong>Last Error:</strong> {lastError}
          </p>
        </div>
      )}
    </div>
  );
}
