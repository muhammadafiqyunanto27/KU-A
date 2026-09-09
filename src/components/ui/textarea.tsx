import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, label, error, id, rows = 4, ...props }, ref) {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label ? (
          <label htmlFor={textareaId} className="text-sm font-medium text-ink-muted">
            {label}
          </label>
        ) : null}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            "glass-soft w-full rounded-xl px-4 py-3 text-sm text-ink placeholder:text-ink-faint transition-colors outline-none focus:border-strong focus:ring-2 focus:ring-cocoa/40",
            error && "border-sunrise focus:ring-sunrise/40",
            className,
          )}
          {...props}
        />
        {error ? <span className="text-xs text-sunrise">{error}</span> : null}
      </div>
    );
  },
);