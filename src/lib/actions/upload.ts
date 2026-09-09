"use server";

import { del } from "@vercel/blob";

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