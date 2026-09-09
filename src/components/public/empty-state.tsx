import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <section className="flex flex-col items-start gap-4 border-t border-line py-16">
      <h2 className="text-2xl font-bold tracking-tight text-ink">{title}</h2>
      <p className="max-w-md text-ink-muted">{description}</p>
      {action ? <div className="mt-2">{action}</div> : null}
    </section>
  );
}