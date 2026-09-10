import { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { PortfolioManager } from "@/components/dashboard/portfolio-manager";
import { CertificateManager } from "@/components/dashboard/certificate-manager";
import { getSessionProfile } from "@/lib/auth";
import { getCertificatesByUser, getPortfoliosByUser } from "@/lib/data";

export const metadata: Metadata = {
  title: "Profil Saya",
};

export const dynamic = "force-dynamic";

export default async function DashboardProfilePage() {
  const session = await getSessionProfile();

  if (!session) {
    redirect("/login?next=/dashboard/profile");
  }

  const [portfoliosResult, certificatesResult] = await Promise.all([
    getPortfoliosByUser(session.user.id),
    getCertificatesByUser(session.user.id),
  ]);
  const portfolios = portfoliosResult.data ?? [];
  const certificates = certificatesResult.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">Profil Saya</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Konten ini tampil untuk publik di halaman anggota.
        </p>
      </header>

      <ProfileForm profile={session.profile} />
      <PortfolioManager portfolios={portfolios} />
      <CertificateManager certificates={certificates} />
    </div>
  );
}