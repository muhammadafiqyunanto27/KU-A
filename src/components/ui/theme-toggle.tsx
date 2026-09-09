"use client";

import { useTheme } from "@/components/ui/theme-hook";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      onClick={toggle}
      aria-label={dark ? "Ubah ke mode terang" : "Ubah ke mode gelap"}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-cocoa/60 focus-visible:ring-offset-2 ring-offset-background",
        dark
          ? "border-cocoa/50 bg-cocoa/25"
          : "border-line-strong bg-surface-muted",
      )}
    >
      <span
        className={cn(
          "grid size-5 place-items-center rounded-full shadow-md transition-transform duration-300",
          dark
            ? "translate-x-[22px] bg-navy text-sky"
            : "translate-x-[1px] bg-surface-strong text-cocoa",
        )}
      >
        {dark ? <MoonIcon /> : <SunIcon />}
      </span>
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      className="size-3"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      className="size-3"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}