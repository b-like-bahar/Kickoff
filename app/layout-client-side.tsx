"use client";

import { useDisplayMessageFromUrlParams } from "@/hooks/use-display-message-from-url-params";

export function LayoutClientSide() {
  useDisplayMessageFromUrlParams();
  return null;
}
