"use client";

import * as React from "react";
import { Toaster as Sonner, ToasterProps } from "sonner";

const toasterClassName = `toaster group [&_[data-description]]:opacity-90 [&_[data-description]]:text-inherit`;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className={toasterClassName}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
