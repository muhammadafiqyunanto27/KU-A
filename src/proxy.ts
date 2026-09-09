import { NextResponse, type NextRequest } from "next/server";
import { readSession, SESSION_COOKIE } from "@/lib/session";
import type { Role } from "@/lib/types";

const ROLE_REQUIREMENTS: Record<string, Role[]> = {
  "/dashboard/class": ["super_admin", "ketua_kelas"],
  "/dashboard/finance": ["super_admin", "bendahara"],
  "/dashboard/users": ["super_admin"],
};

export async function proxy(request: NextRequest) {
  const session = await readSession(request.cookies.get(SESSION_COOKIE)?.value);
  const { pathname } = request.nextUrl;

  if (!session) {
    if (pathname.startsWith("/dashboard")) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  const required = Object.entries(ROLE_REQUIREMENTS).find(
    ([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (required) {
    const allowed = required[1];
    if (!allowed.includes(session.role)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};