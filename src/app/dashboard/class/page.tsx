import { redirect } from "next/navigation";
import { ClassBackgroundGallery } from "@/components/dashboard/class-background-gallery";
import { ClassForm } from "@/components/dashboard/class-form";
import { getClassBackgrounds, getClassProfile } from "@/lib/data";
import { getSessionProfile } from "@/lib/auth";

export const metadata = {
  title: "Profil Kelas",
};

export const dynamic = "force-dynamic";

export default async function DashboardClassPage() {
  const session = await getSessionProfile();

  if (!session) {
    redirect("/login?next=/dashboard/class");
  }

  const role = session.profile?.role ?? "anggota";
  if (
    role !== "super_admin" &&
    role !== "ketua_kelas" &&
    role !== "wakil_ketua_kelas" &&
    role !== "sekretaris"
  ) {
    redirect("/dashboard");
  }

  const [classResult, backgroundsResult] = await Promise.all([
    getClassProfile(),
    getClassBackgrounds(),
  ]);
  const klass = classResult.data;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">Profil Kelas</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Konten ini tampil untuk publik di halaman utama.
        </p>
      </header>
      <ClassForm klass={klass} />
      <ClassBackgroundGallery images={backgroundsResult.data ?? []} />
    </div>
  );
}