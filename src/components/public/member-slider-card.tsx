import Link from "next/link";
import { ROLE_LABELS, type Profile } from "@/lib/types";
import { getInitialsAvatarColor, initialsOf, profileSlug } from "@/lib/utils";

export function MemberSliderCard({ member }: { member: Profile }) {
  const name = member.full_name ?? "Tanpa nama";

  return (
    <Link
      href={`/members/${profileSlug(member)}`}
      data-slide
      className="group w-[78vw] shrink-0 snap-center transition-transform duration-300 sm:w-[45%] md:w-[300px] lg:hover:scale-[1.02]"
    >
      <div className="flex flex-col gap-4 pt-2">
        <div className="h-[44dvh] w-full overflow-hidden rounded-2xl border border-line-strong bg-surface-muted sm:h-auto sm:aspect-[3/4]">
          {member.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={member.avatar_url}
              alt={name}
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03] sm:object-cover"
            />
          ) : (
            <div
              className="grid h-full w-full place-items-center"
              style={{ backgroundColor: getInitialsAvatarColor(name) }}
            >
              <span className="text-5xl font-extrabold text-white/90">
                {initialsOf(name)}
              </span>
            </div>
          )}
        </div>

        <div>
          <h3 className="truncate font-semibold leading-snug text-ink transition-colors group-hover:text-cocoa">
            {name}
          </h3>
          <p className="mt-0.5 text-sm text-ink-muted">{ROLE_LABELS[member.role]}</p>
          {member.skills && member.skills.length > 0 ? (
            <p className="mt-2 line-clamp-2 text-xs uppercase tracking-wide text-ink-faint">
              {member.skills.slice(0, 3).join("  ·  ")}
            </p>
          ) : null}
        </div>

        <span className="inline-flex items-center gap-1 text-sm font-medium text-cocoa">
          Lihat profil
          <span className="transition-transform duration-200 group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}