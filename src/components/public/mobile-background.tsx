"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SLIDE_INTERVAL_MS = 2000;

export function MobileBackground({ urls }: { urls: string[] }) {
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

  if (urls.length === 0) return null;

  return (
    <div className="sm:hidden">
      <div className="mx-auto mt-6 aspect-[16/9] w-[94%] max-w-2xl overflow-hidden rounded-2xl shadow-xl ring-1 ring-ink/10 max-sm:rounded-2xl">
        <Image
          src={urls[index]}
          alt=""
          width={800}
          height={450}
          priority={index === 0}
          sizes="94vw"
          unoptimized
          className="h-full w-full object-cover object-center"
        />
      </div>
    </div>
  );
}