"use client";

/**
 * A React hook that checks URL parameters for message and type, displays a toast notification
 * with the message content, and cleans up the URL afterwards.
 **/
import { useEffect } from "react";
import { toast } from "@/utils/toast";

export function useDisplayMessageFromUrlParams() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get("message");
    const messageType = urlParams.get("messageType");

    if (!message) return;

    switch (messageType) {
      case "success":
        toast({
          type: "success",
          message: "Success",
          description: message,
        });
        break;
      case "error":
        toast({
          type: "error",
          message: "Error",
          description: message,
        });
        break;
      case "warning":
        toast({
          type: "warning",
          message: "Warning",
          description: message,
        });
        break;
      case "info":
      default:
        toast({
          type: "info",
          message: "Info",
          description: message,
        });
        break;
    }

    // Clean up just the message parameters but keep other URL parameters
    urlParams.delete("message");
    urlParams.delete("messageType");
    const newSearch = urlParams.toString();
    const newPath = newSearch
      ? `${window.location.pathname}?${newSearch}`
      : window.location.pathname;
    window.history.replaceState({}, "", newPath);
  }, []);
}
