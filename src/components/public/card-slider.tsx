"use client";

import { useRef, type ReactNode } from "react";

export function CardSlider({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scroll(dir: -1 | 1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-slide]");
    const step = Math.max(card?.offsetWidth ?? 300, 200) * 2;
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  return (
    <div>
      <div className="relative overflow-x-hidden">
        <div
          ref={trackRef}
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2 sm:mx-0 sm:px-0 md:-mx-6 md:px-6"
        >
          {children}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-10 bg-gradient-to-r from-background to-transparent lg:block" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-10 bg-gradient-to-l from-background to-transparent lg:block" />
      </div>

      <div className="mt-3 hidden items-center justify-end gap-2 lg:flex">
        <SliderArrow dir="left" onClick={() => scroll(-1)} />
        <SliderArrow dir="right" onClick={() => scroll(1)} />
      </div>
    </div>
  );
}

function SliderArrow({
  dir,
  onClick,
}: {
  dir: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "left" ? "Geser ke kiri" : "Geser ke kanan"}
      className="grid size-10 place-items-center rounded-full border border-line-strong text-ink-muted transition-colors hover:border-line-strong hover:bg-surface-muted hover:text-ink active:scale-95"
    >
      <svg
        className="size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {dir === "left" ? (
          <path d="M15 5l-7 7 7 7" />
        ) : (
          <path d="M9 5l7 7-7 7" />
        )}
      </svg>
    </button>
  );
}