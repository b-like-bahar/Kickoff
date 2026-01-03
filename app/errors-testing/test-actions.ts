"use server";

import { ActionResponse, formatActionErrorMessage } from "@/utils/actions-utils";
import { tryCatch } from "@/utils/global-utils";
import { captureServerError } from "@/utils/posthog-server";

export async function testErrorAction(formData: FormData): ActionResponse<{ message: string }> {
  const actionType = formData.get("actionType");

  if (!actionType || typeof actionType !== "string") {
    const error = new Error("Invalid action type provided");
    await captureServerError(error);
    return {
      data: null,
      error: "Invalid action type provided",
    };
  }

  // Intentionally throw different types of errors based on action type
  switch (actionType) {
    case "validation":
      const error = new Error("Validation error for testing");
      await captureServerError(error);
      return {
        data: null,
        error: "Validation error for testing",
      };

    case "runtime":
      // This will throw an unhandled runtime error
      throw new Error("Runtime error for testing error reporting");

    case "async":
      // Simulate an async operation that fails
      const { error: asyncError } = await tryCatch(
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Async operation failed")), 100);
        })
      );

      if (asyncError) {
        await captureServerError(asyncError);
        return {
          data: null,
          error: formatActionErrorMessage(asyncError),
        };
      }

      return {
        data: { message: "Async operation succeeded" },
        error: null,
      };

    default:
      const unknownError = new Error(`Unknown action type: ${actionType}`);
      await captureServerError(unknownError);
      return {
        data: null,
        error: `Unknown action type: ${actionType}`,
      };
  }
}
