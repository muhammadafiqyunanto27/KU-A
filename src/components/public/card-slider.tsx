"use client";

import { useEffect, useRef, type ReactNode } from "react";

const AUTOPLAY_MS = 2600;
const GAP_PX = 16;

export function CardSlider({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({
    active: false,
    startX: 0,
    startScroll: 0,
    moved: false,
    lastInteract: 0,
  });

  function scrollBySlot(dir: 1 | -1) {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>("[data-slide]");
    if (!track || !card) return;
    const slot = card.offsetWidth + GAP_PX;
    const max = track.scrollWidth - track.clientWidth;
    if (dir > 0 && track.scrollLeft >= max - 4) {
      track.scrollTo({ left: 0, behavior: "smooth" });
    } else if (dir < 0 && track.scrollLeft <= 4) {
      track.scrollTo({ left: max, behavior: "smooth" });
    } else {
      track.scrollBy({ left: dir * slot, behavior: "smooth" });
    }
  }

  function updateArc() {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const cards = track.querySelectorAll<HTMLElement>("[data-slide]");
    for (const card of cards) {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      let pct = (cardCenter - center) / (rect.width / 2);
      pct = Math.max(-1, Math.min(1, pct));
      const abs = Math.abs(pct);
      const scale = 1.06 - 0.24 * abs;
      const rotate = pct * 13;
      card.style.transform = `scale(${scale}) rotateY(${rotate}deg)`;
      card.style.zIndex = String(Math.round(30 - abs * 26));
      card.style.opacity = String(1 - abs * 0.4);
    }
  }

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updateArc();
    track.addEventListener("scroll", updateArc, { passive: true });
    window.addEventListener("resize", updateArc);
    return () => {
      track.removeEventListener("scroll", updateArc);
      window.removeEventListener("resize", updateArc);
    };
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (drag.current.active) return;
      if (Date.now() - drag.current.lastInteract < 3500) return;
      scrollBySlot(1);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, []);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    drag.current.active = true;
    drag.current.lastInteract = Date.now();
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;
    drag.current = {
      active: true,
      startX: e.clientX,
      startScroll: track.scrollLeft,
      moved: false,
      lastInteract: Date.now(),
    };
    track.setPointerCapture(e.pointerId);
    track.style.scrollSnapType = "none";
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const track = trackRef.current;
    if (!track || !drag.current.active || e.pointerType !== "mouse") return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    track.scrollLeft = drag.current.startScroll - dx;
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    const track = trackRef.current;
    if (!track) return;
    if (track.hasPointerCapture(e.pointerId)) {
      track.releasePointerCapture(e.pointerId);
    }
    track.style.scrollSnapType = "";
    if (drag.current.active) {
      drag.current.active = false;
      drag.current.lastInteract = Date.now();
    }
  }

  function onClickCapture(e: React.MouseEvent) {
    if (!drag.current.moved) return;
    e.preventDefault();
    e.stopPropagation();
    drag.current.moved = false;
  }

  return (
    <div className="[perspective:1200px]">
      <div className="relative overflow-x-hidden">
        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onClickCapture={onClickCapture}
          className="no-scrollbar -mx-4 flex select-none snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 scroll-pl-[11vw] scroll-pr-[11vw] scroll-smooth sm:mx-0 sm:px-0 sm:scroll-pl-[calc((100%_-_45%)/2)] sm:scroll-pr-[calc((100%_-_45%)/2)] md:-mx-6 md:px-6 md:scroll-pl-[calc((100%_-_300px)/2)] md:scroll-pr-[calc((100%_-_300px)/2)] lg:cursor-grab lg:active:cursor-grabbing"
        >
          {children}
        </div>
      </div>
    </div>
  );
}