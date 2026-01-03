import { cn } from "@/utils/client-utils";
import React from "react";
import { Slot } from "@radix-ui/react-slot";

export type TextSize = "xs" | "sm" | "md" | "lg" | "xl";
export type TextWeight = "normal" | "medium" | "semibold" | "bold" | "extrabold";
export type TextVariant = "default" | "muted" | "destructive" | "success";

type TextProps = React.HTMLAttributes<HTMLParagraphElement> & {
  size?: TextSize;
  weight?: TextWeight;
  variant?: TextVariant;
  asChild?: boolean;
  as?: "p" | "span";
};

export const Text: React.FC<TextProps> = ({
  children,
  className,
  size = "md",
  weight = "normal",
  variant = "default",
  asChild = false,
  as = "p",
  ...props
}) => {
  const Text = asChild ? Slot : as;

  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const weightClasses = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold",
  };

  const variantClasses = {
    default: "",
    muted: "text-muted-foreground",
    destructive: "text-destructive",
    success: "text-green-600",
  };

  return (
    <Text
      className={cn(
        "leading-7",
        sizeClasses[size],
        weightClasses[weight],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </Text>
  );
};

export const Heading1: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => (
  <h1 className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight", className)} {...props}>
    {children}
  </h1>
);

export const Heading2: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => (
  <h2
    className={cn(
      "scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0",
      className
    )}
    {...props}
  >
    {children}
  </h2>
);

export const Heading3: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => (
  <h3 className={cn("scroll-m-20 text-2xl font-semibold tracking-tight", className)} {...props}>
    {children}
  </h3>
);

export const Heading4: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => (
  <h4 className={cn("scroll-m-20 text-xl font-semibold tracking-tight", className)} {...props}>
    {children}
  </h4>
);

export const Blockquote: React.FC<React.HTMLAttributes<HTMLQuoteElement>> = ({
  children,
  className,
  ...props
}) => (
  <blockquote className={cn("mt-6 border-l-2 pl-6 italic", className)} {...props}>
    {children}
  </blockquote>
);

export const UnorderedList: React.FC<React.HTMLAttributes<HTMLUListElement>> = ({
  children,
  className,
  ...props
}) => (
  <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)} {...props}>
    {children}
  </ul>
);

export const OrderedList: React.FC<React.HTMLAttributes<HTMLOListElement>> = ({
  children,
  className,
  ...props
}) => (
  <ol className={cn("my-6 ml-6 list-decimal [&>li]:mt-2", className)} {...props}>
    {children}
  </ol>
);

export const CodeSnippet: React.FC<React.HTMLAttributes<HTMLElement>> = ({
  children,
  className,
  ...props
}) => (
  <code
    className={cn(
      "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      className
    )}
    {...props}
  >
    {children}
  </code>
);
