"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { del } from "@vercel/blob";
import { getSessionProfile } from "@/lib/auth";
import { query, queryOne } from "@/lib/db";

type ActionResult = { error: string } | void;

async function getAuthorizedUser() {
  const session = await getSessionProfile();
  if (!session) return null;
  return { userId: session.user.id };
}

function parseList(value: FormDataEntryValue | null): string[] {
  if (!value || typeof value !== "string") return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function updateProfileAction(
  formData: FormData,
): Promise<ActionResult> {
  const ctx = await getAuthorizedUser();
  if (!ctx) redirect("/login");

  const updates = {
    full_name: String(formData.get("full_name") ?? "").trim() || null,
    nickname: String(formData.get("nickname") ?? "").trim() || null,
    bio: String(formData.get("bio") ?? "").trim() || null,
    skills: parseList(formData.get("skills")),
    socials: {
      instagram: String(formData.get("instagram") ?? "").trim() || null,
      github: String(formData.get("github") ?? "").trim() || null,
      linkedin: String(formData.get("linkedin") ?? "").trim() || null,
      whatsapp: String(formData.get("whatsapp") ?? "").trim() || null,
      email: String(formData.get("email") ?? "").trim() || null,
    },
  };

  try {
    await query(
      `update profiles
       set full_name = $2, nickname = $3, bio = $4, skills = $5::text[],
           socials = $6::jsonb, updated_at = now()
       where id = $1`,
      [
        ctx.userId,
        updates.full_name,
        updates.nickname,
        updates.bio,
        updates.skills,
        JSON.stringify(updates.socials),
      ],
    );
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Gagal menyimpan profil." };
  }

  revalidatePath("/dashboard/profile");
  revalidatePath("/");
}

export async function updateAvatarAction(
  formData: FormData,
): Promise<ActionResult> {
  const ctx = await getAuthorizedUser();
  if (!ctx) redirect("/login");

  const url = String(formData.get("avatar_url") ?? "").trim();
  const path = String(formData.get("avatar_path") ?? "").trim();
  const blobPattern =
    /^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\/avatar\//;
  if (!url || !path || !blobPattern.test(url) || !path.startsWith(`avatar/${ctx.userId}/`)) {
    return { error: "URL foto tidak valid." };
  }

  try {
    const current = await queryOne<{ avatar_url: string | null }>(
      `select avatar_url from profiles where id = $1`,
      [ctx.userId],
    );

    await query(
      `update profiles set avatar_url = $2, updated_at = now() where id = $1`,
      [ctx.userId, url],
    );

    const old = current?.avatar_url;
    if (old && old !== url && old.includes("blob.vercel-storage.com")) {
      await del(old).catch(() => null);
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Gagal menyimpan foto." };
  }

  revalidatePath("/dashboard/profile");
  revalidatePath("/");
}

export async function addPortfolioAction(
  formData: FormData,
): Promise<ActionResult> {
  const ctx = await getAuthorizedUser();
  if (!ctx) redirect("/login");

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Judul portofolio wajib diisi." };

  try {
    await query(
      `insert into portfolios (user_id, title, description, project_url, tags)
       values ($1, $2, $3, $4, $5::text[])`,
      [
        ctx.userId,
        title,
        String(formData.get("description") ?? "").trim() || null,
        String(formData.get("project_url") ?? "").trim() || null,
        parseList(formData.get("tags")),
      ],
    );
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Gagal menambah portofolio.",
    };
  }

  revalidatePath("/dashboard/profile");
}

export async function updatePortfolioAction(
  formData: FormData,
): Promise<ActionResult> {
  const ctx = await getAuthorizedUser();
  if (!ctx) redirect("/login");

  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  if (!id || !title) return { error: "Data portofolio tidak lengkap." };

  try {
    const existing = await queryOne<{ user_id: string }>(
      `select user_id from portfolios where id = $1`,
      [id],
    );
    if (!existing || existing.user_id !== ctx.userId) {
      return { error: "Anda tidak berhak mengubah portofolio ini." };
    }

    await query(
      `update portfolios
       set title = $2, description = $3, project_url = $4, tags = $5::text[], updated_at = now()
       where id = $1 and user_id = $6`,
      [
        id,
        title,
        String(formData.get("description") ?? "").trim() || null,
        String(formData.get("project_url") ?? "").trim() || null,
        parseList(formData.get("tags")),
        ctx.userId,
      ],
    );
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Gagal mengubah portofolio.",
    };
  }

  revalidatePath("/dashboard/profile");
}

export async function deletePortfolioAction(
  formData: FormData,
): Promise<ActionResult> {
  const ctx = await getAuthorizedUser();
  if (!ctx) redirect("/login");

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Portofolio tidak ditemukan." };

  try {
    const existing = await queryOne<{ user_id: string }>(
      `select user_id from portfolios where id = $1`,
      [id],
    );
    if (!existing || existing.user_id !== ctx.userId) {
      return { error: "Anda tidak berhak menghapus portofolio ini." };
    }

    await query(
      `delete from portfolios where id = $1 and user_id = $2`,
      [id, ctx.userId],
    );
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Gagal menghapus portofolio.",
    };
  }

  revalidatePath("/dashboard/profile");
}