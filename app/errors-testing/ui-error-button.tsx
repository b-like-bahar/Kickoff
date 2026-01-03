"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";

export function UiErrorButton() {
  const [, startTransition] = useTransition();

  const handleClick = () =>
    startTransition(() => {
      throw new Error("UI Error");
    });

  return (
    <Button type="button" onClick={handleClick}>
      Click me to throw an error
    </Button>
  );
}
