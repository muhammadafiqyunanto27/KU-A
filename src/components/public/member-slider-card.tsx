import Link from "next/link";
import { ROLE_LABELS, type Profile } from "@/lib/types";
import { getInitialsAvatarColor, initialsOf } from "@/lib/utils";

export function MemberSliderCard({ member }: { member: Profile }) {
  const name = member.full_name ?? "Tanpa nama";
  const handle = member.nickname ?? name;

  return (
    <Link
      href={`/members/${member.id}`}
      data-slide
      className="group w-[72vw] max-w-[300px] shrink-0 snap-start"
    >
      <div className="flex flex-col gap-4 border-t border-line pt-5">
        <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl border border-line-strong bg-surface-muted">
          {member.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={member.avatar_url}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
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
          <h3 className="font-semibold leading-snug text-ink transition-colors group-hover:text-cocoa">
            {name}
          </h3>
          <p className="mt-0.5 text-sm text-ink-muted">
            {ROLE_LABELS[member.role]}
            {member.nickname ? ` · “${member.nickname}”` : ""}
          </p>
          {member.skills && member.skills.length > 0 ? (
            <p className="mt-2 line-clamp-2 text-xs uppercase tracking-wide text-ink-faint">
              {member.skills.slice(0, 3).join("  ·  ")}
            </p>
          ) : null}
        </div>

        <span className="inline-flex items-center gap-1 text-sm font-medium text-cocoa">
          {handle}
          <span className="transition-transform duration-200 group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}