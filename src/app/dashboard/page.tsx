import Link from "next/link";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { getSessionProfile } from "@/lib/auth";
import { ROLE_LABELS, type Role } from "@/lib/types";

export const metadata: Metadata = {
  title: "Dashboard",
};

export const dynamic = "force-dynamic";

const LINKS_BY_ROLE: Record<Role, { href: string; label: string; desc: string }[]> = {
  super_admin: [
    { href: "/dashboard/class", label: "Profil Kelas", desc: "Edit tampilan profil class." },
    { href: "/dashboard/finance", label: "Keuangan", desc: "Kelola kas & laporan." },
    { href: "/dashboard/users", label: "Anggota & Role", desc: "Kelola user & peran." },
    { href: "/dashboard/profile", label: "Profil Saya", desc: "Edit profil & portofolio kamu." },
  ],
  ketua_kelas: [
    { href: "/dashboard/class", label: "Profil Kelas", desc: "Edit tampilan profil class." },
    { href: "/dashboard/finance", label: "Keuangan", desc: "Kelola kas & laporan." },
    { href: "/dashboard/profile", label: "Profil Saya", desc: "Edit profil & portofolio kamu." },
  ],
  wakil_ketua_kelas: [
    { href: "/dashboard/class", label: "Profil Kelas", desc: "Edit tampilan profil class." },
    { href: "/dashboard/finance", label: "Keuangan", desc: "Kelola kas & laporan." },
    { href: "/dashboard/profile", label: "Profil Saya", desc: "Edit profil & portofolio kamu." },
  ],
  bendahara: [
    { href: "/dashboard/finance", label: "Keuangan", desc: "Kelola kas & laporan." },
    { href: "/dashboard/profile", label: "Profil Saya", desc: "Edit profil & portofolio kamu." },
  ],
  sekretaris: [
    { href: "/dashboard/class", label: "Profil Kelas", desc: "Edit tampilan profil class." },
    { href: "/dashboard/profile", label: "Profil Saya", desc: "Edit profil & portofolio kamu." },
  ],
  anggota: [
    { href: "/dashboard/profile", label: "Profil Saya", desc: "Edit profil & portofolio kamu." },
  ],
};

export default async function DashboardHomePage() {
  const session = await getSessionProfile();

  if (!session) {
    redirect("/login?next=/dashboard");
  }

  const role = session.profile?.role ?? "anggota";
  const links = LINKS_BY_ROLE[role] ?? LINKS_BY_ROLE.anggota;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">
          Halo, {session.profile?.nickname ?? session.profile?.full_name ?? "teman"}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Kamu masuk sebagai <span className="font-medium text-cocoa">{ROLE_LABELS[role]}</span>.
          Berikut menu yang tersedia untuk peranmu.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="group block">
            <Card className="h-full transition-transform duration-200 group-hover:-translate-y-0.5">
              <h2 className="font-semibold text-ink">{link.label}</h2>
              <p className="mt-1 text-sm text-ink-muted">{link.desc}</p>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="bg-surface-muted">
        <p className="text-sm text-ink-muted">
          Penting: semua perubahan langsung tampil untuk publik di halaman beranda, anggota,
          dan keuangan. Pastikan isi sesuai sebelum menyimpan.
        </p>
      </Card>
    </div>
  );
}