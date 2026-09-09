"use client";

import { useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type PixelCrop,
} from "react-image-crop";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Aspect = number;

const PRESETS: { label: string; value: Aspect }[] = [
  { label: "Web (16:9)", value: 16 / 9 },
  { label: "Bebas", value: 0 },
  { label: "4:3", value: 4 / 3 },
  { label: "1:1", value: 1 },
];

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Gambar tidak bisa diproses."));
    img.src = src;
  });
}

function centeredCrop(width: number, height: number, ratio: Aspect): PixelCrop {
  if (ratio <= 0) {
    return centerCrop(
      {
        unit: "px",
        x: Math.round(width * 0.1),
        y: Math.round(height * 0.1),
        width: Math.round(width * 0.8),
        height: Math.round(height * 0.8),
      },
      width,
      height,
    );
  }
  return centerCrop(
    makeAspectCrop({ unit: "px", width: Math.round(width * 0.6) }, ratio, width, height),
    width,
    height,
  );
}

export async function cropImageToBlob(
  src: string,
  pixelCrop: PixelCrop,
  el: HTMLImageElement,
): Promise<Blob> {
  const image = await loadImage(src);
  const scaleX = image.naturalWidth / el.width;
  const scaleY = image.naturalHeight / el.height;
  const sx = pixelCrop.x * scaleX;
  const sy = pixelCrop.y * scaleY;
  const sw = pixelCrop.width * scaleX;
  const sh = pixelCrop.height * scaleY;

  const MAX = 1920;
  const outScale = Math.min(MAX / sw, MAX / sh, 1);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(sw * outScale));
  canvas.height = Math.max(1, Math.round(sh * outScale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas tidak didukung oleh browser ini.");

  ctx.drawImage(image, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Gagal memproses foto.")),
      "image/jpeg",
      0.9,
    );
  });
}

export function CropModal({
  src,
  onSkip,
  onDone,
}: {
  src: string;
  onSkip: () => void;
  onDone: (blob: Blob) => void;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<Aspect>(16 / 9);
  const [pixelCrop, setPixelCrop] = useState<PixelCrop | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function initCrop(ratio: Aspect) {
    const img = imgRef.current;
    if (!img) return;
    setCrop(centeredCrop(img.width, img.height, ratio));
  }

  function changeAspect(ratio: Aspect) {
    setAspect(ratio);
    const img = imgRef.current;
    if (!img) return;
    if (ratio === 0) {
      setCrop(
        centerCrop(
          {
            unit: "px",
            x: Math.round(img.width * 0.1),
            y: Math.round(img.height * 0.1),
            width: Math.round(img.width * 0.8),
            height: Math.round(img.height * 0.8),
          },
          img.width,
          img.height,
        ),
      );
      return;
    }
    setCrop(centeredCrop(img.width, img.height, ratio));
  }

  async function confirm() {
    const el = imgRef.current;
    if (!pixelCrop || !el) return;
    setSaving(true);
    setError(null);
    try {
      const blob = await cropImageToBlob(src, pixelCrop, el);
      onDone(blob);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal crop foto.");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="glass flex w-full max-w-lg flex-col gap-4 rounded-2xl p-5">
        <div>
          <h3 className="text-sm font-semibold text-ink">Atur foto</h3>
          <p className="mt-0.5 text-xs text-ink-muted">
            Geser kotak atau tarik pojoknya untuk menyesuaikan potongan, lalu simpan.
          </p>
        </div>

        <div className="grid h-72 w-full place-items-center overflow-hidden rounded-xl bg-black/20">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(pc) => setPixelCrop(pc)}
            aspect={aspect || undefined}
            keepSelection
            minWidth={40}
            minHeight={40}
            className="max-h-full max-w-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={src}
              alt="Crop"
              onLoad={() => initCrop(aspect)}
              className="max-h-[272px] max-w-full object-contain"
            />
          </ReactCrop>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">
            Rasio
          </span>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => changeAspect(p.value)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                aspect === p.value
                  ? "bg-cocoa text-white"
                  : "bg-surface-strong text-ink-muted hover:text-ink",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        {error ? (
          <p role="alert" className="text-sm text-sunrise">
            {error}
          </p>
        ) : null}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onSkip} disabled={saving}>
            Lewati tanpa edit
          </Button>
          <Button type="button" onClick={confirm} disabled={!pixelCrop || saving} loading={saving}>
            {saving ? "Menyimpan…" : "Simpan & Lanjut"}
          </Button>
        </div>
      </div>
    </div>
  );
}