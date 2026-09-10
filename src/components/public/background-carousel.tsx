"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SLIDE_INTERVAL_MS = 2000;

export function BackgroundCarousel({ urls }: { urls: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (urls.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % urls.length),
      SLIDE_INTERVAL_MS,
    );
    return () => clearInterval(timer);
  }, [urls.length]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 top-16 -z-10 overflow-hidden sm:top-[4.5rem]"
    >
      {urls.map((url, i) => (
        <Image
          key={url}
          src={url}
          alt=""
          fill
          priority={i === 0}
          sizes="100vw"
          unoptimized
          className={cn(
            "object-cover object-center transition-opacity duration-1000 max-sm:scale-110 max-sm:blur-[7px]",
            i === index ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
      <div className="absolute inset-0 bg-white/65 dark:bg-black/65 max-sm:bg-white/70 dark:max-sm:bg-black/75" />
    </div>
  );
}