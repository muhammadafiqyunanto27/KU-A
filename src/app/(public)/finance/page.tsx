import { Metadata } from "next";
import { CardSlider } from "@/components/public/card-slider";
import { TransactionSliderCard } from "@/components/public/transaction-slider-card";
import { EmptyState } from "@/components/public/empty-state";
import { getFinanceTransactions, summarizeFinance } from "@/lib/data";
import { formatRupiah } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Keuangan",
  description: "Laporan keuangan kas class KU-A",
};

export const dynamic = "force-dynamic";

export default async function FinancePage() {
  const result = await getFinanceTransactions();
  const transactions = result.data ?? [];
  const summary = summarizeFinance(transactions);

  return (
    <>
      <header className="py-10 sm:py-14">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-cocoa">
          Kas Kelas
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          Laporan Keuangan
        </h1>
        <p className="mt-3 max-w-xl text-ink-muted">
          Pemasukan, pengeluaran, dan saldo kas class KU-A — transparan untuk semua.
        </p>
      </header>

      {!summary ? (
        <EmptyState
          title="Belum ada data keuangan"
          description={
            result.error
              ? "Data belum bisa dimuat karena Database belum dikonfigurasi."
              : "Laporan keuangan akan tampil di sini setelah bendahara mengisinya."
          }
        />
      ) : (
        <>
          {/* Stats */}
          <section className="grid grid-cols-1 gap-8 py-10 sm:grid-cols-3">
            {[
              {
                label: "Pemasukan",
                value: formatRupiah(summary.total_income),
                valueClass: "text-sunshine",
              },
              {
                label: "Pengeluaran",
                value: formatRupiah(summary.total_expense),
                valueClass: "text-sunrise",
              },
              {
                label: "Saldo Kas",
                value: formatRupiah(summary.balance),
                valueClass: "text-cocoa",
              },
            ].map((item) => (
              <div key={item.label} className="px-2">
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-ink-faint">
                  {item.label}
                </p>
                <p className={`mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl ${item.valueClass}`}>
                  {item.value}
                </p>
              </div>
            ))}
          </section>

          {/* Transaction cards */}
          <section className="py-12">
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                Rincian
              </h2>
              <span className="text-sm text-ink-faint">
                {summary.transaction_count} transaksi
              </span>
            </div>

            {transactions.length === 0 ? (
              <p className="py-8 text-ink-muted">Belum ada transaksi.</p>
            ) : (
              <CardSlider>
                {transactions.map((tx) => (
                  <TransactionSliderCard key={tx.id} tx={tx} />
                ))}
              </CardSlider>
            )}
          </section>
        </>
      )}
    </>
  );
}