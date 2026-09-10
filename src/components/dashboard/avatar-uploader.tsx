"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { CropModal } from "@/components/dashboard/image-cropper";
import { updateAvatarAction } from "@/lib/actions/profile";
import type { Profile } from "@/lib/types";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export function AvatarUploader({ profile }: { profile: Profile | null }) {
  const router = useRouter();
  const [src, setSrc] = useState<string | null>(null);
  const [queued, setQueued] = useState<File | null>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("File yang dipilih bukan gambar.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError("Foto melebihi batas 5 MB.");
      return;
    }
    setError(null);
    setQueued(file);
    setSrc(URL.createObjectURL(file));
    setCropOpen(true);
    e.target.value = "";
  }

  async function finishUpload(blob: Blob) {
    setUploading(true);
    setError(null);
    try {
      const result = await upload("avatar/upload.jpg", blob, {
        access: "public",
        handleUploadUrl: "/api/upload-avatar",
      });
      const fd = new FormData();
      fd.set("avatar_url", result.url);
      fd.set("avatar_path", result.pathname ?? result.url);
      const res = await updateAvatarAction(fd);
      if (res) {
        setError(res.error);
        return;
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload foto gagal.");
    } finally {
      setUploading(false);
      if (src) URL.revokeObjectURL(src);
      setSrc(null);
      setQueued(null);
      setCropOpen(false);
    }
  }

  return (
    <div className="glass flex flex-col gap-4 rounded-2xl p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar
            name={profile?.full_name ?? profile?.nickname}
            src={profile?.avatar_url}
            size="lg"
            className="rounded-2xl"
          />
          <div>
            <h3 className="text-sm font-semibold text-ink">Foto Profil</h3>
            <p className="mt-0.5 text-xs text-ink-muted">
              Tampil di profil anggota & kartu anggota. Maks 5 MB (JPG/PNG/WebP).
            </p>
          </div>
        </div>
        <div className="grid gap-1 sm:justify-items-end">
          <Input
            label="Unggah Foto"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleFiles}
            className="file:mr-3 file:rounded-lg file:border-0 file:bg-surface-strong file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-ink"
          />
          {uploading ? (
            <p role="status" className="text-xs text-ink-muted">
              Mengunggah & menyimpan…
            </p>
          ) : null}
        </div>
      </div>

      {error ? (
        <p role="alert" className="rounded-xl border border-sunrise/30 bg-sunrise/10 px-3 py-2 text-sm text-sunrise">
          {error}
        </p>
      ) : null}

      {cropOpen && src ? (
        <CropModal
          src={src}
          defaultAspect={1}
          onSkip={() => queued && finishUpload(queued)}
          onDone={finishUpload}
        />
      ) : null}
    </div>
  );
}