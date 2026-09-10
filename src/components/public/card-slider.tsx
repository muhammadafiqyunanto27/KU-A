"use client";

import {
  Children,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const DRAG_GAIN = 0.3;
const DECAY = 0.96;
const AUTOPLAY_DEG_S = 5;
const SNAP_HOLD_MS = 2200;
const MAX_SPEED = 1.5;
const DRAG_THRESHOLD = 8;

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

type Phase = "drag" | "inertia" | "snap" | "idle";

export function CardSlider({ children }: { children: ReactNode }) {
  const cards = Children.toArray(children);
  const count = cards.length;
  const step = count > 1 ? 360 / count : 0;

  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const [ready, setReady] = useState(false);
  const [canvas, setCanvas] = useState({
    faceW: 180,
    faceH: 279,
    radius: 828,
    persp: 2650,
    stageH: 462,
  });

  const rot = useRef(0);
  const vel = useRef(0);
  const phase = useRef<Phase>("idle");
  const lastX = useRef(0);
  const lastT = useRef(0);
  const lastInteract = useRef(0);
  const moved = useRef(false);
  const dragAcc = useRef(0);
  const captured = useRef(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    function measure() {
      const el = stageRef.current;
      if (!el) return;
      const w = el.clientWidth || window.innerWidth;
      const wide = w >= 640;
      const faceW = wide
        ? clamp(Math.round(w * 0.15), 170, 190)
        : clamp(Math.round(w * 0.42), 130, 150);
      const faceH = Math.round(faceW * 1.55);
      const radius = clamp(Math.round(faceW * 4.6), 620, 1000);
      const persp = Math.round(radius * 3.2);
      const scale = persp / (persp - radius);
      setCanvas({
        faceW,
        faceH,
        radius,
        persp,
        stageH: Math.round(faceH * scale + 56),
      });
    }

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (count < 2) return;
    let raf = 0;
    let prev = performance.now();

    const renderRing = () => {
      if (ringRef.current) {
        ringRef.current.style.transform = `rotateY(${rot.current.toFixed(3)}deg)`;
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(64, now - prev);
      prev = now;

      if (phase.current === "inertia") {
        rot.current += vel.current;
        vel.current *= DECAY;
        if (Math.abs(vel.current) < 0.3) phase.current = "snap";
      } else if (phase.current === "snap") {
        const nearest = Math.round(rot.current / step) * step;
        const diff = nearest - rot.current;
        if (Math.abs(diff) < 0.04) {
          rot.current = nearest;
          vel.current = 0;
          phase.current = "idle";
          lastInteract.current = performance.now();
        } else {
          rot.current += diff * 0.14;
          vel.current = 0;
        }
      } else if (
        phase.current === "idle" &&
        !reduced.current &&
        performance.now() - lastInteract.current > SNAP_HOLD_MS
      ) {
        rot.current += (AUTOPLAY_DEG_S * dt) / 1000;
      }

      renderRing();
      raf = requestAnimationFrame(tick);
    };

    renderRing();
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [count, step]);

  if (count < 2) return <>{children}</>;

  const { faceW, faceH, radius, persp, stageH } = canvas;

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    phase.current = "drag";
    moved.current = false;
    dragAcc.current = 0;
    captured.current = false;
    lastX.current = e.clientX;
    lastT.current = performance.now();
    vel.current = 0;
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (phase.current !== "drag") return;
    const dx = e.clientX - lastX.current;
    const dtMs = Math.max(1, performance.now() - lastT.current);
    const instVel = ((-dx * DRAG_GAIN) / dtMs) * 16.67;
    lastX.current = e.clientX;
    lastT.current = performance.now();

    dragAcc.current += dx;
    if (!captured.current && Math.abs(dragAcc.current) > DRAG_THRESHOLD) {
      moved.current = true;
      captured.current = true;
      stageRef.current?.setPointerCapture(e.pointerId);
    }

    vel.current =
      vel.current === 0
        ? instVel
        : vel.current * 0.7 + instVel * 0.3;
    rot.current -= dx * DRAG_GAIN;
  }

  function endDrag(e: React.PointerEvent<HTMLDivElement>) {
    if (phase.current === "drag") {
      vel.current = clamp(vel.current, -MAX_SPEED, MAX_SPEED);
      lastInteract.current = performance.now();
      phase.current = reduced.current ? "idle" : "inertia";
    }
    if (captured.current && stageRef.current?.hasPointerCapture(e.pointerId)) {
      stageRef.current.releasePointerCapture(e.pointerId);
    }
    captured.current = false;
  }

  return (
    <div
      ref={stageRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={(e) => {
        if (moved.current) {
          e.preventDefault();
          e.stopPropagation();
          moved.current = false;
        }
      }}
      className="relative w-full touch-pan-y select-none overflow-hidden lg:cursor-grab lg:active:cursor-grabbing"
      style={{
        height: stageH,
        perspective: persp,
        WebkitMaskImage:
          "radial-gradient(ellipse 72% 88% at 50% 50%, black 58%, transparent 97%)",
        maskImage:
          "radial-gradient(ellipse 72% 88% at 50% 50%, black 58%, transparent 97%)",
      }}
    >
      <div
        ref={ringRef}
        className="absolute left-1/2 top-1/2 block h-0 w-0"
        style={{ transformStyle: "preserve-3d" }}
      >
        {cards.map((card, i) => {
          const delay = count > 18 ? i * 28 : i * 55;
          return (
            <div
              key={i}
              className="absolute left-0 top-0 will-change-transform [&>*]:flex [&>*]:h-full [&>*]:w-full"
              style={{
                width: faceW,
                height: faceH,
                marginLeft: -faceW / 2,
                marginTop: -faceH / 2,
                transform: `rotateY(${i * step}deg) translateZ(${radius}px)`,
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
                opacity: ready ? 1 : 0,
                transition: `opacity 0.6s ease ${delay}ms`,
              }}
            >
              {card}
            </div>
          );
        })}
      </div>
    </div>
  );
}