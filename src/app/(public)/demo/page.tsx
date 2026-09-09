import { Metadata } from "next";
import { CardSlider } from "@/components/public/card-slider";
import { MemberSliderCard } from "@/components/public/member-slider-card";
import { TransactionSliderCard } from "@/components/public/transaction-slider-card";
import { SectionLabel } from "@/components/public/section-label";
import type { FinanceTransaction, Profile } from "@/lib/types";

export const metadata: Metadata = {
  title: "Ilustrasi",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const members: Profile[] = [
  { id: "m1", full_name: "Bima Saputra", nickname: "Bima", role: "super_admin", avatar_url: null, bio: null, skills: ["UI Design", "Figma", "Mentor"], socials: null, created_at: "2026-01-01", updated_at: "2026-01-01" },
  { id: "m2", full_name: "Salsabila Putri", nickname: "Salsa", role: "ketua_kelas", avatar_url: null, bio: null, skills: ["Public Speaking", "Organisasi"], socials: null, created_at: "2026-01-01", updated_at: "2026-01-01" },
  { id: "m3", full_name: "Rizky Maulana", nickname: "Rizky", role: "bendahara", avatar_url: null, bio: null, skills: ["Accounting", "Spreadsheet"], socials: null, created_at: "2026-01-01", updated_at: "2026-01-01" },
  { id: "m4", full_name: "Nadia Rahmawati", nickname: "Nadia", role: "anggota", avatar_url: null, bio: null, skills: ["Frontend", "React", "Tailwind"], socials: null, created_at: "2026-01-01", updated_at: "2026-01-01" },
  { id: "m5", full_name: "Fajar Hidayat", nickname: "Fajar", role: "anggota", avatar_url: null, bio: null, skills: ["Backend", "Node.js", "PostgreSQL"], socials: null, created_at: "2026-01-01", updated_at: "2026-01-01" },
  { id: "m6", full_name: "Dinda Ayu", nickname: "Dinda", role: "anggota", avatar_url: null, bio: null, skills: ["Desain Grafis", "Illustrator"], socials: null, created_at: "2026-01-01", updated_at: "2026-01-01" },
  { id: "m7", full_name: "Andi Pratama", nickname: "Andi", role: "anggota", avatar_url: null, bio: null, skills: ["Video Editing", "Content"], socials: null, created_at: "2026-01-01", updated_at: "2026-01-01" },
  { id: "m8", full_name: "Citra Lestari", nickname: "Citra", role: "anggota", avatar_url: null, bio: null, skills: ["Copywriting", "SEO"], socials: null, created_at: "2026-01-01", updated_at: "2026-01-01" },
];

const transactions: FinanceTransaction[] = [
  { id: "t1", type: "income", amount: 500000, description: "Iuran kas bulanan", category: "Iuran", date: "2026-08-01", receipt_url: null, created_by: null, created_at: "2026-08-01" },
  { id: "t2", type: "expense", amount: 125000, description: "Cetak banner kelas", category: "Perlengkapan", date: "2026-08-05", receipt_url: null, created_by: null, created_at: "2026-08-05" },
  { id: "t3", type: "income", amount: 300000, description: "Donasi wali murid", category: "Donasi", date: "2026-08-09", receipt_url: null, created_by: null, created_at: "2026-08-09" },
  { id: "t4", type: "expense", amount: 45000, description: "Snack rapat kelas", category: "Konsumsi", date: "2026-08-12", receipt_url: null, created_by: null, created_at: "2026-08-12" },
  { id: "t5", type: "income", amount: 500000, description: "Iuran kas bulanan", category: "Iuran", date: "2026-09-01", receipt_url: null, created_by: null, created_at: "2026-09-01" },
  { id: "t6", type: "expense", amount: 200000, description: "Kaos angkatan", category: "Perlengkapan", date: "2026-09-10", receipt_url: null, created_by: null, created_at: "2026-09-10" },
];

export default function DemoPage() {
  return (
    <>
      <header className="py-10">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-cocoa">
          Halaman ilustrasi · demo
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          Slider Kartu (gaya Sumzap)
        </h1>
        <p className="mt-3 max-w-xl text-ink-muted">
          Contoh data palsu — geser kiri/kanan (atau pakai tombol panah di layar besar).
          Taruh di pelan dan lihat dulu.
        </p>
      </header>

      <section className="py-10">
        <SectionLabel num="01" label="Anggota" />
        <div className="mt-8">
          <CardSlider>
            {members.map((member) => (
              <MemberSliderCard key={member.id} member={member} />
            ))}
          </CardSlider>
        </div>
      </section>

      <section className="border-t border-line py-10">
        <SectionLabel num="02" label="Kas Kelas" />
        <div className="mt-8">
          <CardSlider>
            {transactions.map((tx) => (
              <TransactionSliderCard key={tx.id} tx={tx} />
            ))}
          </CardSlider>
        </div>
      </section>
    </>
  );
}