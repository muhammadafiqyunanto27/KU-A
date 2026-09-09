import { cookies } from "next/headers";
import { queryOne } from "@/lib/db";
import { readSession, SESSION_COOKIE } from "@/lib/session";
import type { Profile, Role } from "@/lib/types";

export type SessionUser = {
  id: string;
  email: string;
};

export type SessionProfile = {
  user: SessionUser;
  profile: Profile | null;
};

export async function getSessionProfile(): Promise<SessionProfile | null> {
  const store = await cookies();
  const session = await readSession(store.get(SESSION_COOKIE)?.value);
  if (!session) return null;

  let profile: Profile | null = null;
  try {
    profile = await queryOne<Profile>(
      `select id, full_name, nickname, role, avatar_url, bio, skills, socials, created_at, updated_at
       from profiles where id = $1`,
      [session.id],
    );
  } catch {
    profile = null;
  }

  return {
    user: { id: session.id, email: session.email },
    profile,
  };
}

export function hasRole(profile: Profile | null, roles: Role[]): boolean {
  if (!profile) return false;
  return roles.includes(profile.role);
}

export async function getRole(): Promise<Role | null> {
  const session = await getSessionProfile();
  return session?.profile?.role ?? null;
}