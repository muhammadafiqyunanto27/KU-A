"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { queryOne } from "@/lib/db";
import {
  createSession,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/session";
import type { Role } from "@/lib/types";

async function findAuthUser(email: string) {
  return await queryOne<{
    id: string;
    email: string;
    role: Role;
    password_hash: string;
  }>(
    `select id, email, role, password_hash from profiles where lower(email) = lower($1)`,
    [email],
  );
}

export async function loginAction(
  formData: FormData,
): Promise<{ error: string } | void> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/dashboard");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  let user;
  try {
    user = await findAuthUser(email);
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? err.message
          : "Database belum dikonfigurasi. Cek variabel lingkungan.",
    };
  }

  if (!user) {
    return { error: "Email atau password salah. Coba lagi." };
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return { error: "Email atau password salah. Coba lagi." };
  }

  const token = await createSession({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const store = await cookies();
  store.set(SESSION_COOKIE, token, sessionCookieOptions());

  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard");
}

export async function logoutAction(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/");
}