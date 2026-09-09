"use client";

import { useState } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CropArea = { x: number; y: number; width: number; height: number };
type Aspect = number;

const ASPECTS: { label: string; value: Aspect }[] = [
  { label: "Bebas", value: 0 },
  { label: "4:3", value: 4 / 3 },
  { label: "16:9", value: 16 / 9 },
  { label: "1:1", value: 1 },
];

export async function cropImageToBlob(
  src: string,
  area: CropArea,
): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Gambar tidak bisa diproses."));
    img.src = src;
  });

  const MAX = 1280;
  const scale = Math.min(MAX / area.width, MAX / area.height, 1);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(area.width * scale));
  canvas.height = Math.max(1, Math.round(area.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas tidak didukung oleh browser ini.");

  ctx.drawImage(
    image,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Gagal memproses foto."))),
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
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<Aspect>(4 / 3);
  const [area, setArea] = useState<CropArea | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    if (!area) return;
    setSaving(true);
    setError(null);
    try {
      const blob = await cropImageToBlob(src, area);
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
            Geser &amp; zoom untuk menyesuaikan, lalu simpan.
          </p>
        </div>

        <div className="relative h-72 w-full overflow-hidden rounded-xl bg-black/20">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={aspect || undefined}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, croppedAreaPixels) =>
              setArea(croppedAreaPixels as CropArea)
            }
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">
            Rasio
          </span>
          {ASPECTS.map((a) => (
            <button
              key={a.label}
              type="button"
              onClick={() => setAspect(a.value)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                aspect === a.value
                  ? "bg-cocoa text-white"
                  : "bg-surface-strong text-ink-muted hover:text-ink",
              )}
            >
              {a.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-3 text-xs text-ink-muted">
          <span className="shrink-0">Zoom</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-cocoa"
          />
        </label>

        {error ? (
          <p role="alert" className="text-sm text-sunrise">
            {error}
          </p>
        ) : null}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onSkip} disabled={saving}>
            Lewati tanpa edit
          </Button>
          <Button
            type="button"
            onClick={confirm}
            disabled={!area || saving}
            loading={saving}
          >
            {saving ? "Menyimpan…" : "Simpan & Lanjut"}
          </Button>
        </div>
      </div>
    </div>
  );
}