import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/public/empty-state";
import { getMembers, getPortfoliosByUser } from "@/lib/data";
import { ROLE_LABELS, type Profile } from "@/lib/types";
import { isUuid, profileSlug } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function resolveMember(
  idOrSlug: string,
): Promise<{ member: Profile | null; error?: string }> {
  const list = await getMembers();
  if (list.error) return { member: null, error: list.error };
  const members = (list.data ?? []).filter((m) => m.role === "anggota");
  if (isUuid(idOrSlug)) {
    return { member: members.find((m) => m.id === idOrSlug) ?? null };
  }
  const expected = idOrSlug.toLowerCase();
  return { member: members.find((m) => profileSlug(m) === expected) ?? null };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { member } = await resolveMember(id);
  return {
    title: member?.full_name ?? "Anggota",
  };
}

export default async function MemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [{ member, error }, portfoliosResult] = await Promise.all([
    resolveMember(id),
    getPortfoliosByUser(id),
  ]);

  const portfolios = member ? (portfoliosResult.data ?? []) : [];

  if (!member) {
    if (error) {
      return (
        <EmptyState
          title="Belum bisa dimuat"
          description="Data anggota belum tersedia karena Database belum dikonfigurasi."
        />
      );
    }
    notFound();
  }

  const socials = member.socials ?? {};

  return (
    <>
      <Link
        href="/#anggota"
        className="inline-flex items-center gap-1 py-6 text-sm text-ink-muted transition-colors hover:text-ink"
      >
        ← Anggota
      </Link>

      {/* Profile header */}
      <section className="flex flex-col gap-8 border-b border-line pb-12 sm:flex-row sm:items-start sm:gap-10">
        <Avatar
          name={member.full_name ?? member.nickname}
          src={member.avatar_url}
          size="xl"
          className="size-28 rounded-2xl border border-line-strong sm:size-40"
        />
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-cocoa">
            {ROLE_LABELS[member.role]}
          </p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            {member.full_name ?? "Tanpa nama"}
          </h1>
          {member.bio ? (
            <p className="mt-5 text-ink-muted sm:text-lg">{member.bio}</p>
          ) : null}

          {member.skills && member.skills.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
              {member.skills.map((skill) => (
                <span
                  key={skill}
                  className="border-b border-line-strong pb-0.5 text-xs font-medium uppercase tracking-[0.2em] text-ink-muted"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : null}

          {Object.values(socials).some(Boolean) ? (
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-muted">
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
        </div>
      </section>

      {/* Portfolios */}
      <section className="py-12">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Portofolio
          </h2>
          <span className="text-sm text-ink-faint">
            {portfolios.length} karya
          </span>
        </div>

        {portfolios.length === 0 ? (
          <EmptyState
            title="Belum ada portofolio"
            description="Portofolio akan tampil di sini setelah anggota mengisinya."
          />
        ) : (
          <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {portfolios.map((item) => (
              <article key={item.id} className="flex flex-col gap-4 border-t border-line pt-5">
                {item.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="aspect-[4/3] w-full rounded-xl border border-line-strong object-cover"
                  />
                ) : null}
                <div>
                  <h3 className="font-semibold leading-snug text-ink">{item.title}</h3>
                  {item.description ? (
                    <p className="mt-1 text-sm text-ink-muted">{item.description}</p>
                  ) : null}
                </div>
                {item.tags && item.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs uppercase tracking-[0.2em] text-ink-faint"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
                {item.project_url ? (
                  <a
                    href={item.project_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-cocoa hover:underline"
                  >
                    Lihat proyek
                    <span>↗</span>
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}