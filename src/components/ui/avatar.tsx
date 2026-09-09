import { getInitialsAvatarColor, initialsOf } from "@/lib/utils";
import { cn } from "@/lib/utils";

export interface AvatarProps {
  name?: string | null;
  src?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-16 text-xl",
  xl: "size-24 text-3xl",
};

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name ?? "avatar"}
        className={cn(
          "size-10 shrink-0 rounded-full object-cover border border-line-strong",
          sizes[size],
          className,
        )}
      />
    );
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white select-none",
        sizes[size],
        className,
      )}
      style={{ backgroundColor: getInitialsAvatarColor(name) }}
    >
      {initialsOf(name)}
    </span>
  );
}