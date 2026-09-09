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
import type { ClassBackground } from "@/lib/types";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

type PendingBackground = { url: string; path: string | null };

export function ClassBackgroundGallery({ images }: { images: ClassBackground[] }) {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [uploaded, setUploaded] = useState<PendingBackground[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ name: string; pct: number } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    setFiles(selected);
    setUploaded([]);
    setUploadError(null);
    setAddError(null);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
  }

  async function handleUpload() {
    if (files.length === 0) return;
    setUploading(true);
    setUploadError(null);
    const results: PendingBackground[] = [];
    let failed = false;
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setUploadError(`"${file.name}" bukan file gambar.`);
        failed = true;
        break;
      }
      if (file.size > MAX_SIZE_BYTES) {
        setUploadError(`"${file.name}" melebihi batas 5 MB.`);
        failed = true;
        break;
      }
      try {
        const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
        const pathname = `background/${crypto.randomUUID()}.${ext}`;
        const blob = await upload(pathname, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
          onUploadProgress: ({ percentage }) =>
            setUploadProgress({ name: file.name, pct: Math.round(percentage) }),
        });
        results.push({ url: blob.url, path: blob.pathname ?? null });
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : `Upload "${file.name}" gagal.`);
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
    setUploaded([]);
    setPreviews([]);
    setFiles([]);
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

  return (
    <div className="glass flex flex-col gap-4 rounded-2xl p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-ink">Foto Background (Slideshow)</h3>
          <p className="mt-0.5 text-xs text-ink-muted">
            Tampil bergantian di latar seluruh halaman, berganti tiap 2 detik. Bisa upload beberapa sekaligus.
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

      {previews.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {previews.map((preview) => (
            <div key={preview} className="aspect-[4/3] overflow-hidden rounded-xl border border-line-strong">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Pratinjau" className="h-full w-full object-cover" />
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
          disabled={files.length === 0 || uploading}
          loading={uploading}
          className="sm:w-auto"
        >
          {uploading ? "Mengunggah…" : "Upload"}
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
    </div>
  );
}