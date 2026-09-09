import { cn } from "@/lib/utils";

export function SectionLabel({
  num,
  label,
  className,
}: {
  num: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 text-xs font-medium uppercase tracking-[0.25em] text-ink-muted",
        className,
      )}
    >
      <span className="text-cocoa">{num}</span>
      <span>{label}</span>
    </div>
  );
}