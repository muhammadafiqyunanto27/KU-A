"use server";

import { revalidatePath } from "next/cache";
import { getSessionProfile } from "@/lib/auth";
import { query, queryOne } from "@/lib/db";
import type { HeroStyle, Role, TextStyle } from "@/lib/types";

type ActionResult = { error: string } | void;

const ALLOWED_ROLES: Role[] = ["super_admin", "ketua_kelas"];

type ClassAdminSession = { ok: true; userId: string } | { ok: false; error: string };

function readTextStyle(prefix: string, fd: FormData): TextStyle | undefined {
  const out: TextStyle = {};

  const size = Number(fd.get(`${prefix}_size`));
  if (Number.isFinite(size) && size >= 8 && size <= 220) {
    out.size = Math.round(size);
  }

  const color = String(fd.get(`${prefix}_color`) ?? "").trim().toLowerCase();
  if (/^#[0-9a-f]{6}$/.test(color)) out.color = color;

  const font = String(fd.get(`${prefix}_font`) ?? "").trim();
  if (["inter", "sans", "serif", "mono"].includes(font)) out.font = font;

  const opacity = Number(fd.get(`${prefix}_opacity`));
  if (Number.isFinite(opacity) && opacity >= 0.3 && opacity <= 1) {
    out.opacity = Math.round(opacity * 100) / 100;
  }

  return Object.keys(out).length ? out : undefined;
}

function readHeroStyle(fd: FormData): HeroStyle {
  const style: HeroStyle = {};
  for (const key of ["class_name", "tagline", "description"] as const) {
    const value = readTextStyle(key, fd);
    if (value) style[key] = value;
  }
  return style;
}

async function requireClassAdmin(): Promise<ClassAdminSession> {
  const session = await getSessionProfile();
  if (!session) return { ok: false, error: "Sesi berakhir. Silakan masuk kembali." };
  if (!session.profile || !ALLOWED_ROLES.includes(session.profile.role)) {
    return { ok: false, error: "Anda tidak berhak mengubah profil class." };
  }
  return { ok: true, userId: session.user.id };
}

export async function updateClassProfileAction(
  formData: FormData,
): Promise<ActionResult> {
  const guard = await requireClassAdmin();
  if (!guard.ok) return { error: guard.error };

  const updates = {
    class_name: String(formData.get("class_name") ?? "").trim() || null,
    tagline: String(formData.get("tagline") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim() || null,
    socials: {
      instagram: String(formData.get("instagram") ?? "").trim() || null,
      github: String(formData.get("github") ?? "").trim() || null,
      tiktok: String(formData.get("tiktok") ?? "").trim() || null,
      youtube: String(formData.get("youtube") ?? "").trim() || null,
    },
    contact: {
      email: String(formData.get("contact_email") ?? "").trim() || null,
      phone: String(formData.get("contact_phone") ?? "").trim() || null,
      address: String(formData.get("contact_address") ?? "").trim() || null,
      schedule: String(formData.get("contact_schedule") ?? "").trim() || null,
    },
    hero_style: readHeroStyle(formData),
  };

  try {
    const existing = await queryOne<{ id: string }>(
      `select id from class_profile limit 1`,
    );

    if (existing?.id) {
      await query(
        `update class_profile
         set class_name = $2, tagline = $3, description = $4,
             socials = $5::jsonb, contact = $6::jsonb, hero_style = $7::jsonb,
             updated_by = $8, updated_at = now()
         where id = $1`,
        [
          existing.id,
          updates.class_name,
          updates.tagline,
          updates.description,
          JSON.stringify(updates.socials),
          JSON.stringify(updates.contact),
          JSON.stringify(updates.hero_style),
          guard.userId,
        ],
      );
    } else {
      await query(
        `insert into class_profile
         (class_name, tagline, description, socials, contact, hero_style, updated_by)
         values ($1, $2, $3, $4::jsonb, $5::jsonb, $6::jsonb, $7)`,
        [
          updates.class_name,
          updates.tagline,
          updates.description,
          JSON.stringify(updates.socials),
          JSON.stringify(updates.contact),
          JSON.stringify(updates.hero_style),
          guard.userId,
        ],
      );
    }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Gagal menyimpan profil kelas.",
    };
  }

  revalidatePath("/");
  revalidatePath("/dashboard/class");
}

export async function addClassBackgroundsAction(
  formData: FormData,
): Promise<ActionResult> {
  const guard = await requireClassAdmin();
  if (!guard.ok) return { error: guard.error };

  let items: { url: string; path: string | null }[];
  try {
    items = JSON.parse(String(formData.get("backgrounds") ?? "[]"));
  } catch {
    return { error: "Data foto tidak valid." };
  }

  if (!Array.isArray(items) || items.length === 0) {
    return { error: "Tidak ada foto untuk disimpan." };
  }

  const blobPattern = /^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\//;
  for (const item of items) {
    if (!item?.url || !blobPattern.test(item.url)) {
      return { error: "Ada URL foto yang tidak valid." };
    }
  }

  try {
    const last = await queryOne<{ position: number | null }>(
      `select position from class_backgrounds order by position desc limit 1`,
    );

    let position = (last?.position ?? -1) + 1;
    const urls = items.map((item) => item.url);
    const paths = items.map((item) => item.path ?? null);
    const positions = items.map(() => position++);

    await query(
      `insert into class_backgrounds (url, path, position)
       select * from unnest($1::text[], $2::text[], $3::int[])`,
      [urls, paths, positions],
    );
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Gagal menyimpan foto.",
    };
  }

  revalidatePath("/");
  revalidatePath("/dashboard/class");
}

export async function removeClassBackgroundAction(
  formData: FormData,
): Promise<ActionResult> {
  const guard = await requireClassAdmin();
  if (!guard.ok) return { error: guard.error };

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "ID foto tidak valid." };

  try {
    await query(`delete from class_backgrounds where id = $1`, [id]);
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Gagal menghapus foto.",
    };
  }

  revalidatePath("/");
  revalidatePath("/dashboard/class");
}