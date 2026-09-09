import { Metadata } from "next";
import { CardSlider } from "@/components/public/card-slider";
import { MemberSliderCard } from "@/components/public/member-slider-card";
import { EmptyState } from "@/components/public/empty-state";
import { getMembers } from "@/lib/data";

export const metadata: Metadata = {
  title: "Anggota",
  description: "Daftar anggota class KU-A",
};

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const result = await getMembers();
  const members = result.data ?? [];

  return (
    <>
      <header className="py-10 sm:py-14">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-cocoa">
          Anggota
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          Kelas KU-A
        </h1>
        <p className="mt-3 max-w-xl text-ink-muted">
          {members.length > 0
            ? `${members.length} anggota — geser untuk mengenal semuanya.`
            : "Profil, keahlian, dan portofolio tiap anggota."}
        </p>
      </header>

      {members.length === 0 ? (
        <EmptyState
          title="Belum ada anggota"
          description={
            result.error
              ? `Error memuat: ${result.error}`
              : "Profil anggota akan tampil di sini setelah diisi."
          }
        />
      ) : (
        <CardSlider>
          {members.map((member) => (
            <MemberSliderCard key={member.id} member={member} />
          ))}
        </CardSlider>
      )}
    </>
  );
}