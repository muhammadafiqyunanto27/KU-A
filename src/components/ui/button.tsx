import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const base =
  "relative inline-flex select-none items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-cocoa/60 focus-visible:ring-offset-2 ring-offset-background active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-cocoa text-white shadow-sm hover:bg-cocoa/90 hover:shadow-md hover:-translate-y-px active:translate-y-0",
  secondary:
    "border border-line-strong bg-surface-strong/70 text-ink shadow-sm backdrop-blur hover:bg-surface-muted",
  ghost: "text-ink-muted hover:bg-surface-muted hover:text-ink",
  danger: "bg-sunrise text-white shadow-sm hover:bg-sunrise/90 hover:shadow-md",
  outline:
    "border border-line-strong bg-transparent text-ink hover:bg-surface-muted",
};

const sizes = {
  sm: "h-9 gap-1.5 px-3.5 text-sm",
  md: "h-11 gap-2 px-6 text-sm",
  lg: "h-12 gap-2 px-7 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ className, variant = "primary", size = "md", loading, children, ...props }, ref) {
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? <Spinner className="size-4" /> : null}
        {children}
      </button>
    );
  },
);

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
      />
    </svg>
  );
}