import Link from "next/link";
import { Metadata } from "next";
import { CardSlider } from "@/components/public/card-slider";
import { MemberSliderCard } from "@/components/public/member-slider-card";
import { TransactionSliderCard } from "@/components/public/transaction-slider-card";
import { EmptyState } from "@/components/public/empty-state";
import { Marquee } from "@/components/public/marquee";
import { SectionLabel } from "@/components/public/section-label";
import { formatRupiah } from "@/lib/utils";
import { getClassProfile, getFinanceTransactions, getMembers, summarizeFinance } from "@/lib/data";

export const metadata: Metadata = {
  title: "Profil Kelas",
  description: "Halaman profil class KU-A",
};

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const [classResult, membersResult, financeResult] = await Promise.all([
    getClassProfile(),
    getMembers(),
    getFinanceTransactions(),
  ]);

  const klass = classResult.data;
  const members = membersResult.data ?? [];
  const transactions = financeResult.data ?? [];
  const summary = summarizeFinance(financeResult.data);

  if (!klass && classResult.error) {
    return (
      <EmptyState
        title="Belum ada konfigurasi"
        description="Database belum dikonfigurasi atau data class belum diisi. Setting env lalu seed data class di dashboard."
      />
    );
  }

  const socials = klass?.socials ?? {};
  const contact = klass?.contact ?? {};

  return (
    <>
      {/* Hero */}
      <section className="py-14 sm:py-24">
        <div className="flex flex-col gap-6">
          <p className="rise-up text-xs font-medium uppercase tracking-[0.35em] text-cocoa">
            Website Kelas
          </p>

          <h1 className="rise-up rise-up-delay-1 text-[22vw] font-extrabold leading-[0.9] tracking-tight text-ink sm:text-8xl lg:text-9xl">
            {klass?.class_name ?? "KU-A"}
          </h1>

          {klass?.tagline ? (
            <p className="rise-up rise-up-delay-2 max-w-xl text-xl font-medium text-ink sm:text-2xl">
              {klass.tagline}
            </p>
          ) : null}

          {klass?.description ? (
            <p className="rise-up rise-up-delay-2 max-w-2xl text-ink-muted sm:text-lg">
              {klass.description}
            </p>
          ) : null}

          <div className="rise-up rise-up-delay-3 flex flex-col gap-4 pt-2">
            {Object.values(socials).some(Boolean) ? (
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-muted">
                {Object.entries(socials).map(([key, value]) =>
                  value ? (
                    <a
                      key={key}
                      href={value.startsWith("http") ? value : `https://${value}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 capitalize hover:text-ink"
                    >
                      {key}
                      <span className="text-cocoa">↗</span>
                    </a>
                  ) : null,
                )}
              </div>
            ) : null}

            {Object.values(contact).some(Boolean) ? (
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-muted">
                {contact.email ? (
                  <a href={`mailto:${contact.email}`} className="hover:text-ink">
                    {contact.email}
                  </a>
                ) : null}
                {contact.phone ? (
                  <a href={`tel:${contact.phone}`} className="hover:text-ink">
                    {contact.phone}
                  </a>
                ) : null}
                {contact.schedule ? <span>{contact.schedule}</span> : null}
                {contact.address ? (
                  <span className="flex items-center gap-1">
                    {contact.address}
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <Marquee />

      {/* Members preview */}
      <section className="py-16 sm:py-24">
        <SectionLabel num="01" label="Anggota" />
        <div className="mt-6 flex items-end justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Profil &amp; portofolio
          </h2>
          <Link
            href="/members"
            className="shrink-0 text-sm font-medium text-cocoa hover:underline"
          >
            Semua anggota →
          </Link>
        </div>
        <p className="mt-2 max-w-xl text-ink-muted">
          Kenalan dengan class KU-A dan lihat karya tiap anggota.
        </p>

        {members.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              title="Belum ada anggota terdaftar"
              description="Profil anggota akan muncul di sini setelah data diisi."
            />
          </div>
        ) : (
          <div className="mt-10">
            <CardSlider>
              {members.map((member) => (
                <MemberSliderCard key={member.id} member={member} />
              ))}
            </CardSlider>
          </div>
        )}
      </section>

      {/* Finance preview */}
      <section className="py-16 sm:py-24">
        <SectionLabel num="02" label="Kas Kelas" />
        <div className="mt-6 flex items-end justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Transparansi keuangan
          </h2>
          <Link
            href="/finance"
            className="shrink-0 text-sm font-medium text-cocoa hover:underline"
          >
            Laporan lengkap →
          </Link>
        </div>

        {summary ? (
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: "Pemasukan", value: formatRupiah(summary.total_income) },
              { label: "Pengeluaran", value: formatRupiah(summary.total_expense) },
              { label: "Saldo Kas", value: formatRupiah(summary.balance) },
            ].map((item, i) => (
              <div key={item.label}>
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-ink-faint">
                  {item.label}
                </p>
                <p
                  className={[
                    "mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl",
                    i === 0 ? "text-sunshine" : i === 1 ? "text-sunrise" : "text-cocoa",
                  ].join(" ")}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-10 text-ink-muted">
            {financeResult.error
              ? "Data keuangan belum bisa dimuat karena Database belum dikonfigurasi."
              : "Laporan kas akan tampil setelah bendahara mengisinya."}
          </p>
        )}

        {transactions.length > 0 ? (
          <div className="mt-10">
            <CardSlider>
              {transactions.map((tx) => (
                <TransactionSliderCard key={tx.id} tx={tx} />
              ))}
            </CardSlider>
          </div>
        ) : null}
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-cocoa">
              Ikut berkarya
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Anggota KU-A? Kelola profil kamu.
            </h2>
          </div>
        </div>
      </section>
    </>
  );
}