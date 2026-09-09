import { formatDate, formatRupiah } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { FinanceTransaction } from "@/lib/types";

export function TransactionSliderCard({ tx }: { tx: FinanceTransaction }) {
  const income = tx.type === "income";

  return (
    <div
      data-slide
      className={cn(
        "w-[78vw] max-w-[340px] shrink-0 snap-start rounded-2xl border p-5",
        income
          ? "border-sunshine/30 bg-sunshine/5"
          : "border-sunrise/25 bg-sunrise/5",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
            income
              ? "border-sunshine/40 bg-sunshine/10 text-sunshine"
              : "border-sunrise/30 bg-sunrise/10 text-sunrise",
          )}
        >
          {income ? "Masuk" : "Keluar"}
        </span>
        <time className="text-xs tabular-nums text-ink-faint">
          {formatDate(tx.date)}
        </time>
      </div>

      <p className={cn("mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl", income ? "text-sunshine" : "text-sunrise")}>
        {income ? "+" : "−"}
        {formatRupiah(Number(tx.amount))}
      </p>

      <p className="mt-2 line-clamp-2 text-sm text-ink">{tx.description ?? "—"}</p>

      {tx.category ? (
        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-ink-faint">
          {tx.category}
        </p>
      ) : null}
    </div>
  );
}