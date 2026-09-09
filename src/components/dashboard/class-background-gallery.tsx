"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  addClassBackgroundsAction,
  removeClassBackgroundAction,
} from "@/lib/actions/class";
import { deleteBackgroundFile } from "@/lib/actions/upload";
import { CropModal } from "@/components/dashboard/image-cropper";
import type { ClassBackground } from "@/lib/types";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

type PendingBackground = { url: string; path: string | null };
type QueuedFile = { file: File; src: string };
type CroppedFile = { blob: Blob; name: string; preview: string };

export function ClassBackgroundGallery({ images }: { images: ClassBackground[] }) {
  const router = useRouter();
  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [cropOpen, setCropOpen] = useState(false);
  const [cropped, setCropped] = useState<CroppedFile[]>([]);
  const [uploaded, setUploaded] = useState<PendingBackground[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ name: string; pct: number } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length === 0) return;
    const invalid = selected.find(
      (f) => !f.type.startsWith("image/") || f.size > MAX_SIZE_BYTES,
    );
    if (invalid) {
      setUploadError(
        invalid.type.startsWith("image/")
          ? `"${invalid.name}" melebihi batas 5 MB.`
          : `"${invalid.name}" bukan file gambar.`,
      );
      return;
    }
    setUploadError(null);
    setAddError(null);
    setUploaded([]);
    setCropped([]);
    const items = selected.map((file) => ({ file, src: URL.createObjectURL(file) }));
    setQueue(items);
    setQueueIndex(0);
    setCropOpen(true);
  }

  function pushCropped(blob: Blob, name: string) {
    setCropped((prev) =>
      prev.concat({ blob, name, preview: URL.createObjectURL(blob) }),
    );
  }

  function advanceQueue() {
    const current = queue[queueIndex];
    if (current) URL.revokeObjectURL(current.src);
    if (queueIndex + 1 < queue.length) {
      setQueueIndex(queueIndex + 1);
    } else {
      setQueue([]);
      setQueueIndex(0);
      setCropOpen(false);
    }
  }

  async function handleUpload() {
    if (cropped.length === 0) return;
    setUploading(true);
    setUploadError(null);
    const results: PendingBackground[] = [];
    let failed = false;
    for (const item of cropped) {
      if (!item.blob.type.startsWith("image/")) {
        setUploadError(`"${item.name}" bukan file gambar.`);
        failed = true;
        break;
      }
      if (item.blob.size > MAX_SIZE_BYTES) {
        setUploadError(`"${item.name}" melebihi batas 5 MB.`);
        failed = true;
        break;
      }
      try {
        const ext = (item.name.split(".").pop() ?? "jpg").toLowerCase();
        const pathname = `background/${crypto.randomUUID()}.${ext}`;
        const blob = await upload(pathname, item.blob, {
          access: "public",
          handleUploadUrl: "/api/upload",
          onUploadProgress: ({ percentage }) =>
            setUploadProgress({ name: item.name, pct: Math.round(percentage) }),
        });
        results.push({ url: blob.url, path: blob.pathname ?? null });
      } catch (err) {
        setUploadError(
          err instanceof Error ? err.message : `Upload "${item.name}" gagal.`,
        );
        failed = true;
        break;
      }
    }
    setUploading(false);
    setUploadProgress(null);
    if (failed || results.length === 0) return;
    setUploaded(results);
  }

  async function handleApply() {
    if (uploaded.length === 0) return;
    setApplying(true);
    setAddError(null);
    const fd = new FormData();
    fd.set("backgrounds", JSON.stringify(uploaded));
    const res = await addClassBackgroundsAction(fd);
    if (res) {
      setAddError(res.error);
      setApplying(false);
      return;
    }
    for (const item of cropped) URL.revokeObjectURL(item.preview);
    setUploaded([]);
    setCropped([]);
    setApplying(false);
    router.refresh();
  }

  async function handleRemove(img: ClassBackground) {
    setRemovingId(img.id);
    const fd = new FormData();
    fd.set("id", img.id);
    if (img.path) await deleteBackgroundFile(img.path);
    const res = await removeClassBackgroundAction(fd);
    if (res) setAddError(res.error);
    setRemovingId(null);
    router.refresh();
  }

  const current = queue[queueIndex];

  return (
    <div className="glass flex flex-col gap-4 rounded-2xl p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-ink">Foto Background (Slideshow)</h3>
          <p className="mt-0.5 text-xs text-ink-muted">
            Tampil bergantian di latar seluruh halaman, berganti tiap 2 detik. Foto bisa diatur
            (crop) dulu sebelum diunggah.
          </p>
        </div>
        <span className="text-xs font-medium text-cocoa">{images.length} foto aktif</span>
      </div>

      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img) => (
            <div key={img.id} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-line-strong bg-surface-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemove(img)}
                disabled={removingId === img.id}
                aria-label="Hapus foto"
                className="absolute right-2 top-2 grid size-7 place-items-center rounded-lg bg-black/60 text-xs text-white opacity-0 backdrop-blur transition-opacity hover:bg-sunrise group-hover:opacity-100 focus-visible:opacity-100 disabled:opacity-40"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid place-items-center rounded-xl border border-dashed border-line-strong bg-surface-muted px-6 py-10 text-center text-sm text-ink-faint">
          Belum ada foto — unggah foto kelas untuk dijadikan latar slideshow.
        </div>
      )}

      {cropped.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {cropped.map((item) => (
            <div key={item.preview} className="aspect-[4/3] overflow-hidden rounded-xl border border-line-strong">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.preview} alt="Pratinjau" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <span className="grid gap-1">
          <Input
            label="Pilih Foto (bisa banyak)"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            className="file:mr-3 file:rounded-lg file:border-0 file:bg-surface-strong file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-ink"
          />
          {uploading && uploadProgress ? (
            <p role="status" className="text-xs text-ink-muted">
              Mengunggah {uploadProgress.name} — {uploadProgress.pct}%
            </p>
          ) : null}
        </span>
        <Button
          type="button"
          variant="secondary"
          onClick={handleUpload}
          disabled={cropped.length === 0 || uploading}
          loading={uploading}
          className="sm:w-auto"
        >
          {uploading ? "Mengunggah…" : `Upload ${cropped.length} Foto`}
        </Button>
      </div>

      {uploadError ? (
        <p role="alert" className="rounded-xl border border-sunrise/30 bg-sunrise/10 px-3 py-2 text-sm text-sunrise">
          {uploadError}
        </p>
      ) : null}

      {uploaded.length > 0 ? (
        <div className="flex flex-col gap-3">
          {addError ? (
            <p role="alert" className="rounded-xl border border-sunrise/30 bg-sunrise/10 px-3 py-2 text-sm text-sunrise">
              {addError}
            </p>
          ) : null}
          <Button
            type="button"
            onClick={handleApply}
            disabled={applying}
            loading={applying}
            className="self-start"
          >
            {applying ? "Menyimpan…" : `Terapkan ${uploaded.length} Foto`}
          </Button>
        </div>
      ) : null}

      {cropOpen && current ? (
        <CropModal
          src={current.src}
          onSkip={() => {
            pushCropped(current.file, current.file.name);
            advanceQueue();
          }}
          onDone={(blob) => {
            pushCropped(
              blob,
              current.file.name.replace(/\.(jpe?g|png|webp|gif)$/i, ".jpg"),
            );
            advanceQueue();
          }}
        />
      ) : null}
    </div>
  );
}