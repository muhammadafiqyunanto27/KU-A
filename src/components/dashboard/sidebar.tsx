"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { logoutAction } from "@/lib/actions/auth";
import { ROLE_LABELS, type Profile, type Role } from "@/lib/types";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  roles: Role[];
};

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Beranda", roles: ["super_admin", "ketua_kelas", "wakil_ketua_kelas", "bendahara", "sekretaris", "anggota"] },
  { href: "/dashboard/profile", label: "Profil Saya", roles: ["super_admin", "ketua_kelas", "wakil_ketua_kelas", "bendahara", "sekretaris", "anggota"] },
  { href: "/dashboard/class", label: "Profil Kelas", roles: ["super_admin", "ketua_kelas", "wakil_ketua_kelas", "sekretaris"] },
  { href: "/dashboard/finance", label: "Keuangan", roles: ["super_admin", "ketua_kelas", "wakil_ketua_kelas", "bendahara"] },
  { href: "/dashboard/users", label: "Anggota & Role", roles: ["super_admin"] },
];

export function DashboardSidebar({ profile }: { profile: Profile | null }) {
  const pathname = usePathname();
  const role = profile?.role ?? "anggota";
  const items = NAV_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <aside className="w-full lg:w-64 lg:shrink-0">
      <div className="glass sticky top-4 flex flex-col gap-2 rounded-2xl p-4">
        <Link href="/" className="mb-2 flex items-center gap-2 px-2 font-bold text-ink">
          <span className="grid size-8 place-items-center rounded-lg bg-cocoa text-sm font-bold text-white">
            KU
          </span>
          KU-A Dashboard
        </Link>

        <nav className="flex flex-row gap-1 overflow-x-auto no-scrollbar lg:flex-col">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-surface-muted text-ink"
                  : "text-ink-muted hover:text-ink",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-4 flex items-center gap-3 border-t border-line pt-4">
          <Avatar
            name={profile?.full_name ?? profile?.nickname}
            src={profile?.avatar_url}
            size="md"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">
              {profile?.full_name ?? "Anggota"}
            </p>
            <p className="text-xs text-ink-muted">{ROLE_LABELS[role]}</p>
          </div>
          <ThemeToggle />
        </div>

        <form action={logoutAction} className="mt-1">
          <Button type="submit" variant="ghost" size="sm" className="w-full justify-start">
            Keluar
          </Button>
        </form>
      </div>
    </aside>
  );
}