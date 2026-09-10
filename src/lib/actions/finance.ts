"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth";
import { query } from "@/lib/db";
import type { Role, TransactionType } from "@/lib/types";

type ActionResult = { error: string } | void;

const ALLOWED_ROLES: Role[] = [
  "super_admin",
  "ketua_kelas",
  "wakil_ketua_kelas",
  "bendahara",
];

async function getAuthorized(): Promise<{ userId: string } | null> {
  const session = await getSessionProfile();
  if (!session) return null;
  if (!session.profile || !ALLOWED_ROLES.includes(session.profile.role)) {
    return null;
  }
  return { userId: session.user.id };
}

function parseAmount(value: FormDataEntryValue | null): number {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function parseDate(value: FormDataEntryValue | null): string {
  const raw = String(value ?? "");
  return raw.slice(0, 10) || new Date().toISOString().slice(0, 10);
}

export async function addTransactionAction(
  formData: FormData,
): Promise<ActionResult> {
  const ctx = await getAuthorized();
  if (!ctx) redirect("/dashboard");

  const type = String(formData.get("type") ?? "") as TransactionType;
  const amount = parseAmount(formData.get("amount"));

  if (type !== "income" && type !== "expense") return { error: "Jenis transaksi tidak valid." };
  if (amount <= 0) return { error: "Nominal harus lebih dari 0." };

  try {
    await query(
      `insert into finance_transactions (type, amount, description, category, date, created_by)
       values ($1, $2, $3, $4, $5::date, $6)`,
      [
        type,
        amount,
        String(formData.get("description") ?? "").trim() || null,
        String(formData.get("category") ?? "").trim() || null,
        parseDate(formData.get("date")),
        ctx.userId,
      ],
    );
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Gagal menambah transaksi.",
    };
  }

  revalidatePath("/finance");
  revalidatePath("/dashboard/finance");
}

export async function updateTransactionAction(
  formData: FormData,
): Promise<ActionResult> {
  const ctx = await getAuthorized();
  if (!ctx) redirect("/dashboard");

  const id = String(formData.get("id") ?? "");
  const type = String(formData.get("type") ?? "") as TransactionType;
  const amount = parseAmount(formData.get("amount"));

  if (!id) return { error: "Transaksi tidak ditemukan." };
  if (type !== "income" && type !== "expense") return { error: "Jenis transaksi tidak valid." };
  if (amount <= 0) return { error: "Nominal harus lebih dari 0." };

  try {
    await query(
      `update finance_transactions
       set type = $2, amount = $3, description = $4, category = $5, date = $6::date
       where id = $1`,
      [
        id,
        type,
        amount,
        String(formData.get("description") ?? "").trim() || null,
        String(formData.get("category") ?? "").trim() || null,
        parseDate(formData.get("date")),
      ],
    );
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Gagal mengubah transaksi.",
    };
  }

  revalidatePath("/finance");
  revalidatePath("/dashboard/finance");
}

export async function deleteTransactionAction(
  formData: FormData,
): Promise<ActionResult> {
  const ctx = await getAuthorized();
  if (!ctx) redirect("/dashboard");

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Transaksi tidak ditemukan." };

  try {
    await query(`delete from finance_transactions where id = $1`, [id]);
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Gagal menghapus transaksi.",
    };
  }

  revalidatePath("/finance");
  revalidatePath("/dashboard/finance");
}