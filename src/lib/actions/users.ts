"use server";

import { revalidatePath } from "next/cache";
import { getSessionProfile } from "@/lib/auth";
import { query } from "@/lib/db";
import { ROLES, type Role } from "@/lib/types";

type ActionResult = { error: string } | void;

export async function updateUserRoleAction(
  formData: FormData,
): Promise<ActionResult> {
  const session = await getSessionProfile();
  if (!session) return { error: "Sesi berakhir. Silakan masuk kembali." };

  if (session.profile?.role !== "super_admin") {
    return { error: "Hanya Super Admin yang bisa mengubah peran user." };
  }

  const targetId = String(formData.get("user_id") ?? "");
  const role = String(formData.get("role") ?? "") as Role;

  if (!targetId) return { error: "User tidak ditemukan." };
  if (!ROLES.includes(role)) return { error: "Peran tidak valid." };

  try {
    await query(`update profiles set role = $2 where id = $1`, [targetId, role]);
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Gagal mengubah peran user.",
    };
  }

  revalidatePath("/dashboard/users");
}