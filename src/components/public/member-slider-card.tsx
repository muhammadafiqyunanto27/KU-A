import Link from "next/link";
import { ROLE_LABELS, type Profile } from "@/lib/types";
import { getInitialsAvatarColor, initialsOf, profileSlug } from "@/lib/utils";

export function MemberSliderCard({ member }: { member: Profile }) {
  const name = member.full_name ?? "Tanpa nama";

  return (
    <Link
      href={`/members/${profileSlug(member)}`}
      draggable={false}
      className="group flex h-full w-full flex-col rounded-2xl border border-line-strong bg-surface/80 p-2.5 backdrop-blur-sm sm:p-3"
    >
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl bg-surface-muted">
        {member.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.avatar_url}
            alt={name}
            className="absolute inset-0 h-full w-full object-contain"
          />
        ) : (
          <div
            className="grid h-full w-full place-items-center"
            style={{ backgroundColor: getInitialsAvatarColor(name) }}
          >
            <span className="text-2xl font-extrabold text-white/90 sm:text-4xl">
              {initialsOf(name)}
            </span>
          </div>
        )}
      </div>

      <div className="flex h-[88px] shrink-0 flex-col pt-2">
        <h3 className="line-clamp-2 text-[11px] font-semibold leading-tight text-ink">
          {name}
        </h3>
        {member.skills && member.skills.length > 0 ? (
          <p className="line-clamp-1 text-[9px] uppercase tracking-wide text-ink-faint">
            {member.skills.slice(0, 3).join("  ·  ")}
          </p>
        ) : null}
        <div className="mt-auto pt-1">
          <p className="text-[10px] text-ink-muted">
            {ROLE_LABELS[member.role]}
          </p>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-cocoa">
            Lihat profil
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}