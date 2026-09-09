import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "default" | "cocoa" | "navy" | "sunshine" | "sunrise" | "sky";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

const tones: Record<BadgeTone, string> = {
  default: "bg-surface-muted text-ink-muted border-line-strong",
  cocoa: "bg-cocoa/15 text-cocoa border-cocoa/25",
  navy: "bg-navy/15 text-navy border-navy/25",
  sunshine: "bg-sunshine/20 text-sunshine border-sunshine/30",
  sunrise: "bg-sunrise/15 text-sunrise border-sunrise/25",
  sky: "bg-sky/15 text-sky border-sky/25",
};

export function Badge({ className, tone = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}