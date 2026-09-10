import { cn } from "@/lib/utils";

export function AdaptiveAmount({
  value,
  className,
  base = 30,
  min = 15,
}: {
  value: string;
  className?: string;
  base?: number;
  min?: number;
}) {
  const digits = value.replace(/\D/g, "").length;
  const size = Math.max(min, Math.round(base - Math.max(0, digits - 7) * 1.5));

  return (
    <p
      className={cn(
        "break-words font-extrabold leading-tight tracking-tight tabular-nums",
        className,
      )}
      style={{ fontSize: size }}
    >
      {value}
    </p>
  );
}