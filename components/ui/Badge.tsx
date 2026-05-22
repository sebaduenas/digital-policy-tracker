import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "soft" | "solid";
  tone?: string;
}

export function Badge({
  className,
  variant = "default",
  tone,
  style,
  children,
  ...props
}: BadgeProps) {
  const colorStyle = tone
    ? variant === "solid"
      ? {
          backgroundColor: `rgb(${tone})`,
          color: "white",
          borderColor: `rgb(${tone})`,
        }
      : {
          color: `rgb(${tone})`,
          backgroundColor: `rgb(${tone} / 0.08)`,
          borderColor: `rgb(${tone} / 0.20)`,
        }
    : undefined;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.7rem] font-medium leading-none whitespace-nowrap",
        variant === "default" && "bg-bg-elevated text-fg-muted border-border",
        variant === "outline" && "bg-transparent text-fg-muted border-border",
        variant === "soft" && "bg-bg-elevated/60 text-fg-muted border-border/50",
        className,
      )}
      style={{ ...colorStyle, ...style }}
      {...props}
    >
      {children}
    </span>
  );
}
