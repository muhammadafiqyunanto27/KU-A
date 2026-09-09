import { Metadata } from "next";
import { CardSlider } from "@/components/public/card-slider";
import { MemberSliderCard } from "@/components/public/member-slider-card";
import { EmptyState } from "@/components/public/empty-state";
import { Marquee } from "@/components/public/marquee";
import { getClassProfile, getMembers } from "@/lib/data";

export const metadata: Metadata = {
  title: "Profil Kelas",
  description: "Halaman profil class KU-A",
};

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const [classResult, membersResult] = await Promise.all([
    getClassProfile(),
    getMembers(),
  ]);

  const klass = classResult.data;
  const members = (membersResult.data ?? []).filter(
    (m) => m.role === "anggota",
  );

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
      <section className="pb-8 pt-14 sm:pt-20">
        <div className="flex flex-col items-center gap-5 text-center opacity-80">
          <h1 className="rise-up text-[22vw] font-extrabold leading-[0.9] tracking-tight text-ink sm:text-8xl lg:text-9xl">
            {klass?.class_name ?? "KU-A"}
          </h1>

          {klass?.tagline ? (
            <p className="rise-up rise-up-delay-1 max-w-xl text-xl font-medium text-ink sm:text-2xl">
              {klass.tagline}
            </p>
          ) : null}

          {klass?.description ? (
            <p className="rise-up rise-up-delay-2 max-w-2xl text-ink-muted sm:text-lg">
              {klass.description}
            </p>
          ) : null}
        </div>
      </section>

      <Marquee />

      {/* Members */}
      <section id="anggota" className="pt-10 sm:pt-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Profil &amp; portofolio
          </h2>
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

      {/* Kontak */}
      <section className="pb-10 pt-20 sm:pt-28" id="kontak">
        <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Terhubung dengan kami
        </h2>
        <div className="mt-6 flex max-w-xl flex-col gap-3 text-sm text-ink-muted sm:text-base">
          {Object.entries(socials).map(([key, value]) =>
            value ? (
              <a
                key={key}
                href={value.startsWith("http") ? value : `https://${value}`}
                target="_blank"
                rel="noreferrer"
                className="group flex items-baseline gap-3 hover:text-ink"
              >
                <span className="w-20 shrink-0 text-xs font-medium uppercase tracking-wide text-ink-faint">
                  {key}
                </span>
                <span className="break-all underline decoration-dotted underline-offset-4 group-hover:no-underline">
                  {value.replace(/^https?:\/\//, "")}
                </span>
              </a>
            ) : null,
          )}
          {contact.email ? (
            <a
              href={`mailto:${contact.email}`}
              className="group flex items-baseline gap-3 hover:text-ink"
            >
              <span className="w-20 shrink-0 text-xs font-medium uppercase tracking-wide text-ink-faint">
                Email
              </span>
              <span className="break-all underline decoration-dotted underline-offset-4 group-hover:no-underline">
                {contact.email}
              </span>
            </a>
          ) : null}
          {contact.phone ? (
            <a
              href={`tel:${contact.phone}`}
              className="group flex items-baseline gap-3 hover:text-ink"
            >
              <span className="w-20 shrink-0 text-xs font-medium uppercase tracking-wide text-ink-faint">
                Telepon
              </span>
              <span>{contact.phone}</span>
            </a>
          ) : null}
          {contact.schedule ? (
            <span className="flex items-baseline gap-3">
              <span className="w-20 shrink-0 text-xs font-medium uppercase tracking-wide text-ink-faint">
                Jadwal
              </span>
              <span>{contact.schedule}</span>
            </span>
          ) : null}
          {contact.address ? (
            <span className="flex items-baseline gap-3">
              <span className="w-20 shrink-0 text-xs font-medium uppercase tracking-wide text-ink-faint">
                Alamat
              </span>
              <span>{contact.address}</span>
            </span>
          ) : null}
        </div>
      </section>
    </>
  );
}