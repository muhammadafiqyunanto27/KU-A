"use server";

import { del, put } from "@vercel/blob";
import { getSessionProfile } from "@/lib/auth";
import type { Role } from "@/lib/types";

const ALLOWED_ROLES: Role[] = ["super_admin", "ketua_kelas"];
const MAX_SIZE_MB = 5;

export type UploadResult = { url?: string; path?: string; error?: string };

async function requireAdmin() {
  const session = await getSessionProfile();
  if (!session?.profile || !ALLOWED_ROLES.includes(session.profile.role)) {
    return false;
  }
  return true;
}

export async function uploadClassBackground(
  file: File,
): Promise<UploadResult> {
  if (!file.type.startsWith("image/")) return { error: "File harus berupa gambar." };
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return { error: `Ukuran foto maksimal ${MAX_SIZE_MB} MB.` };
  }
  if (!(await requireAdmin())) return { error: "Anda tidak berhak mengunggah foto." };

  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
  const pathname = `background/${crypto.randomUUID()}.${ext}`;

  try {
    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type,
    });
    return { url: blob.url, path: blob.pathname };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Upload gagal." };
  }
}

export async function deleteBackgroundFile(
  pathnameOrUrl: string,
): Promise<{ error?: string }> {
  if (!pathnameOrUrl) return {};
  try {
    await del(pathnameOrUrl);
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Gagal menghapus file." };
  }
}