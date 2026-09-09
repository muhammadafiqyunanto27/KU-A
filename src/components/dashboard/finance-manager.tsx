"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  addTransactionAction,
  deleteTransactionAction,
} from "@/lib/actions/finance";
import type { FinanceTransaction } from "@/lib/types";
import { cn, formatDate, formatRupiah } from "@/lib/utils";

export function FinanceManager({
  transactions,
  summary,
}: {
  transactions: FinanceTransaction[];
  summary: { total_income: number; total_expense: number; balance: number } | null;
}) {
  const [state, action, pending] = useActionState(
    (_prev: { error: string } | void, formData: FormData) =>
      addTransactionAction(formData),
    undefined,
  );

  return (
    <div className="flex flex-col gap-6">
      {summary ? (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <p className="text-sm text-ink-muted">Pemasukan</p>
            <p className="mt-1 text-xl font-bold text-sunshine sm:text-2xl">
              {formatRupiah(summary.total_income)}
            </p>
          </Card>
          <Card>
            <p className="text-sm text-ink-muted">Pengeluaran</p>
            <p className="mt-1 text-xl font-bold text-sunrise sm:text-2xl">
              {formatRupiah(summary.total_expense)}
            </p>
          </Card>
          <Card>
            <p className="text-sm text-ink-muted">Saldo Kas</p>
            <p className="mt-1 text-xl font-bold text-cocoa sm:text-2xl">
              {formatRupiah(summary.balance)}
            </p>
          </Card>
        </section>
      ) : null}

      <form action={action} className="glass flex flex-col gap-4 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-ink">Tambah Transaksi</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Jenis" name="type" defaultValue="income">
            <option value="income">Pemasukan</option>
            <option value="expense">Pengeluaran</option>
          </Select>
          <Input
            label="Kategori"
            name="category"
            placeholder="iuran, konsumsi, lomba…"
          />
          <Input
            label="Nominal (Rp)"
            name="amount"
            type="number"
            min="1"
            inputMode="numeric"
            placeholder="50000"
            required
          />
          <Input
            label="Tanggal"
            name="date"
            type="date"
            defaultValue={new Date().toISOString().slice(0, 10)}
          />
          <Textarea
            label="Keterangan"
            name="description"
            placeholder="Catatan transaksi…"
            rows={2}
            className="sm:col-span-2"
          />
        </div>

        {state?.error ? (
          <p role="alert" className="rounded-xl border border-sunrise/30 bg-sunrise/10 px-3 py-2 text-sm text-sunrise">
            {state.error}
          </p>
        ) : null}

        <Button type="submit" loading={pending} className="self-end">
          {pending ? "Menambah…" : "Tambah Transaksi"}
        </Button>
      </form>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-line px-6 py-4">
          <h2 className="text-lg font-semibold text-ink">Daftar Transaksi</h2>
        </div>
        {transactions.length === 0 ? (
          <div className="p-10 text-center text-sm text-ink-muted">
            Belum ada transaksi. Tambahkan lewat form di atas.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase text-ink-faint">
                  <th className="px-4 py-3 font-medium">Tanggal</th>
                  <th className="px-4 py-3 font-medium">Jenis</th>
                  <th className="px-4 py-3 font-medium">Kategori</th>
                  <th className="px-4 py-3 font-medium">Keterangan</th>
                  <th className="px-4 py-3 text-right font-medium">Jumlah</th>
                  <th className="px-4 py-3 text-right font-medium" />
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-line last:border-0">
                    <td className="whitespace-nowrap px-4 py-3 text-ink-muted">
                      {formatDate(tx.date)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium",
                          tx.type === "income"
                            ? "border-sunshine/30 bg-sunshine/20 text-sunshine"
                            : "border-sunrise/25 bg-sunrise/15 text-sunrise",
                        )}
                      >
                        {tx.type === "income" ? "Masuk" : "Keluar"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-muted">
                      {tx.category ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-ink">{tx.description ?? "—"}</td>
                    <td
                      className={cn(
                        "whitespace-nowrap px-4 py-3 text-right font-semibold",
                        tx.type === "income" ? "text-sunshine" : "text-sunrise",
                      )}
                    >
                      {tx.type === "income" ? "+" : "−"}
                      {formatRupiah(Number(tx.amount))}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DeleteTransaction id={tx.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function DeleteTransaction({ id }: { id: string }) {
  const run = () => {
    const form = new FormData();
    form.set("id", id);
    return deleteTransactionAction(form);
  };
  return (
    <button
      type="button"
      onClick={() => {
        if (window.confirm("Hapus transaksi ini?")) void run();
      }}
      className="rounded-lg px-2.5 py-1 text-xs font-medium text-sunrise transition-colors hover:bg-sunrise/10"
    >
      Hapus
    </button>
  );
}