import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, label, error, id, ...props }, ref) {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label ? (
          <label htmlFor={inputId} className="text-sm font-medium text-ink-muted">
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "glass-soft h-11 w-full rounded-xl px-4 text-sm text-ink placeholder:text-ink-faint transition-colors outline-none focus:border-strong focus:ring-2 focus:ring-cocoa/40",
            error && "border-sunrise focus:border-sunrise focus:ring-sunrise/40",
            className,
          )}
          {...props}
        />
        {error ? <span className="text-xs text-sunrise">{error}</span> : null}
      </div>
    );
  },
);