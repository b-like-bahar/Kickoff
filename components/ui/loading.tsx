import * as React from "react";
import { cn } from "@/utils/client-utils";
import { cva, type VariantProps } from "class-variance-authority";

const loadingVariants = cva("flex items-center justify-center w-full h-full", {
  variants: {
    variant: {
      default: "min-h-[200px]",
      fullscreen: "min-h-screen",
      inline: "min-h-[100px]",
      compact: "min-h-[60px]",
    },
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

const spinnerVariants = cva("animate-spin rounded-full border-2 border-muted", {
  variants: {
    size: {
      sm: "h-4 w-4 border-t-primary",
      md: "h-6 w-6 border-t-primary",
      lg: "h-8 w-8 border-t-primary",
      xl: "h-12 w-12 border-t-primary",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const dotsVariants = cva("flex space-x-1", {
  variants: {
    size: {
      sm: "space-x-1",
      md: "space-x-1.5",
      lg: "space-x-2",
      xl: "space-x-2.5",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const dotVariants = cva("animate-pulse rounded-full bg-muted-foreground", {
  variants: {
    size: {
      sm: "h-1.5 w-1.5",
      md: "h-2 w-2",
      lg: "h-2.5 w-2.5",
      xl: "h-3 w-3",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface LoadingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingVariants> {
  type?: "spinner" | "dots" | "skeleton" | "text";
  text?: string;
  skeletonRows?: number;
  skeletonClassName?: string;
}

export function Loading({
  className,
  variant,
  size,
  type = "spinner",
  text = "Loading...",
  skeletonRows = 3,
  skeletonClassName,
  ...props
}: LoadingProps) {
  const renderSpinner = () => (
    <div className={cn(spinnerVariants({ size }))} role="status" aria-label="Loading" />
  );

  const renderDots = () => (
    <div className={cn(dotsVariants({ size }))}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className={cn(
            dotVariants({ size }),
            "animate-staggered-pulse",
            i === 0 && "animation-delay-0",
            i === 1 && "animation-delay-150",
            i === 2 && "animation-delay-300"
          )}
        />
      ))}
    </div>
  );

  const renderSkeleton = () => (
    <div className="w-full max-w-md space-y-3" role="status" aria-label="Loading content">
      {Array.from({ length: skeletonRows }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-4 bg-muted animate-pulse rounded",
            i === 0 && "w-3/4",
            i === 1 && "w-full",
            i === 2 && "w-2/3",
            skeletonClassName
          )}
        />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );

  const renderText = () => (
    <div
      className="flex items-center space-x-2 text-muted-foreground"
      role="status"
      aria-label={text}
    >
      <div className={cn(spinnerVariants({ size: "sm" }))} />
      <span className={cn("font-medium", size === "sm" && "text-sm")}>{text}</span>
    </div>
  );

  const renderContent = () => {
    switch (type) {
      case "spinner":
        return renderSpinner();
      case "dots":
        return renderDots();
      case "skeleton":
        return renderSkeleton();
      case "text":
        return renderText();
      default:
        return renderSpinner();
    }
  };

  return (
    <div className={cn(loadingVariants({ variant, size }), className)} {...props}>
      {renderContent()}
    </div>
  );
}
