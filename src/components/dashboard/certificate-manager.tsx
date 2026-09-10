"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CropModal } from "@/components/dashboard/image-cropper";
import {
  addCertificateAction,
  deleteCertificateAction,
} from "@/lib/actions/profile";
import type { Certificate } from "@/lib/types";

const MAX_SIZE_BYTES = 8 * 1024 * 1024;

export function CertificateManager({
  certificates,
}: {
  certificates: Certificate[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [src, setSrc] = useState<string | null>(null);
  const [queued, setQueued] = useState<File | null>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploadedPath, setUploadedPath] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("File yang dipilih bukan gambar.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError("Foto melebihi batas 8 MB.");
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
      const result = await upload("certificate/upload.jpg", blob, {
        access: "public",
        handleUploadUrl: "/api/upload-cert",
      });
      setUploadedUrl(result.url);
      setUploadedPath(result.pathname ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload sertifikat gagal.");
    } finally {
      setUploading(false);
      if (src) URL.revokeObjectURL(src);
      setSrc(null);
      setQueued(null);
      setCropOpen(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim() || !uploadedUrl) return;
    setSubmitting(true);
    setError(null);
    const fd = new FormData();
    fd.set("title", title);
    fd.set("url", uploadedUrl);
    fd.set("path", uploadedPath ?? "");
    const res = await addCertificateAction(fd);
    if (res) {
      setError(res.error);
      setSubmitting(false);
      return;
    }
    setTitle("");
    setUploadedUrl(null);
    setUploadedPath(null);
    setSubmitting(false);
    router.refresh();
  }

  async function handleDelete(cert: Certificate) {
    setDeletingId(cert.id);
    setError(null);
    const fd = new FormData();
    fd.set("id", cert.id);
    const res = await deleteCertificateAction(fd);
    if (res) setError(res.error);
    setDeletingId(null);
    router.refresh();
  }

  return (
    <div className="glass flex flex-col gap-4 rounded-2xl p-6">
      <div>
        <h3 className="text-sm font-semibold text-ink">Sertifikat</h3>
        <p className="mt-0.5 text-xs text-ink-muted">
          Upload sertifikat/pencapaian kamu — tampil publik di halaman profil anggota.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Nama Sertifikat"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Mis. Juara 1 Lomba Desain"
            required
            className="sm:col-span-2"
          />
          <div className="grid gap-1">
            <Input
              label={uploadedUrl ? "Ganti Foto Sertifikat" : "Foto Sertifikat"}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleFiles}
              className="file:mr-3 file:rounded-lg file:border-0 file:bg-surface-strong file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-ink"
            />
            {uploading ? (
              <p role="status" className="text-xs text-ink-muted">
                Mengunggah…
              </p>
            ) : null}
          </div>
        </div>

        {uploadedUrl ? (
          <div className="flex items-center gap-4 rounded-xl border border-line bg-surface-muted/50 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={uploadedUrl}
              alt="Pratinjau sertifikat"
              className="h-20 w-28 shrink-0 rounded-lg border border-line-strong object-cover"
            />
            <p className="text-xs text-ink-muted">
              Foto siap disimpan. Lanjutkan dengan mengklik tombol Tambah Sertifikat.
            </p>
          </div>
        ) : null}

        {error ? (
          <p role="alert" className="rounded-xl border border-sunrise/30 bg-sunrise/10 px-3 py-2 text-sm text-sunrise">
            {error}
          </p>
        ) : null}

        <Button
          type="submit"
          loading={submitting}
          disabled={!title.trim() || !uploadedUrl}
          className="self-end"
        >
          {submitting ? "Menambah…" : "Tambah Sertifikat"}
        </Button>
      </form>

      {certificates.length > 0 ? (
        <div className="flex flex-col gap-3">
          {certificates.map((cert) => (
            <Card key={cert.id} className="flex items-center gap-4 p-4">
              {cert.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cert.image_url}
                  alt={cert.title}
                  className="h-16 w-24 shrink-0 rounded-lg border border-line object-cover"
                />
              ) : null}
              <p className="min-w-0 flex-1 truncate font-semibold text-ink">
                {cert.title}
              </p>
              <Button
                type="button"
                variant="danger"
                size="sm"
                loading={deletingId === cert.id}
                onClick={() => handleDelete(cert)}
              >
                Hapus
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-sm text-ink-muted">
          Belum ada sertifikat. Tambahkan lewat form di atas.
        </p>
      )}

      {cropOpen && src ? (
        <CropModal
          src={src}
          defaultAspect={0}
          onSkip={() => queued && finishUpload(queued)}
          onDone={finishUpload}
        />
      ) : null}
    </div>
  );
}