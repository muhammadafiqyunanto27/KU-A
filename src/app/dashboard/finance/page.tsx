import { Metadata } from "next";
import { redirect } from "next/navigation";
import { FinanceManager } from "@/components/dashboard/finance-manager";
import { getSessionProfile } from "@/lib/auth";
import { getFinanceTransactions, summarizeFinance } from "@/lib/data";

export const metadata: Metadata = {
  title: "Keuangan",
};

export const dynamic = "force-dynamic";

export default async function DashboardFinancePage() {
  const session = await getSessionProfile();

  if (!session) {
    redirect("/login?next=/dashboard/finance");
  }

  const role = session.profile?.role ?? "anggota";
  if (role !== "super_admin" && role !== "bendahara") {
    redirect("/dashboard");
  }

  const result = await getFinanceTransactions();
  const transactions = result.data ?? [];
  const summary = summarizeFinance(transactions);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">Keuangan</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Kelola pemasukan & pengeluaran kas class. Tampil publik di halaman keuangan.
        </p>
      </header>

      <FinanceManager
        transactions={transactions}
        summary={
          summary
            ? {
                total_income: summary.total_income,
                total_expense: summary.total_expense,
                balance: summary.balance,
              }
            : null
        }
      />
    </div>
  );
}