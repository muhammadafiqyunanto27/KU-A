import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ className, label, error, id, children, ...props }, ref) {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label ? (
          <label htmlFor={selectId} className="text-sm font-medium text-ink-muted">
            {label}
          </label>
        ) : null}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "glass-soft h-11 w-full rounded-xl px-4 text-sm text-ink outline-none focus:border-strong focus:ring-2 focus:ring-cocoa/40",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        {error ? <span className="text-xs text-sunrise">{error}</span> : null}
      </div>
    );
  },
);