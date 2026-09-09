"use client";

import { useActionState, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  addPortfolioAction,
  deletePortfolioAction,
} from "@/lib/actions/profile";
import type { Portfolio } from "@/lib/types";

export function PortfolioManager({ portfolios }: { portfolios: Portfolio[] }) {
  const [state, action, pending] = useActionState(
    (_prev: { error: string } | void, formData: FormData) =>
      addPortfolioAction(formData),
    undefined,
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <form action={action} className="glass flex flex-col gap-4 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-ink">Tambah Portofolio</h2>

        <Input
          label="Judul Proyek"
          name="title"
          placeholder="Judul proyek / karya"
          required
        />
        <Textarea
          label="Deskripsi Singkat"
          name="description"
          placeholder="Ceritakan proyek ini…"
          rows={3}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Link Proyek"
            name="project_url"
            placeholder="https://…"
            type="url"
          />
          <Input
            label="Tags (pisah dengan koma)"
            name="tags"
            placeholder="React, SQL, Desain…"
          />
        </div>

        {state?.error ? (
          <p role="alert" className="rounded-xl border border-sunrise/30 bg-sunrise/10 px-3 py-2 text-sm text-sunrise">
            {state.error}
          </p>
        ) : null}

        <Button type="submit" loading={pending} className="self-end">
          {pending ? "Menambah…" : "Tambah"}
        </Button>
      </form>

      {portfolios.length > 0 ? (
        <div className="flex flex-col gap-3">
          {portfolios.map((item) => (
            <Card key={item.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-semibold text-ink">{item.title}</p>
                {item.description ? (
                  <p className="mt-0.5 line-clamp-1 text-sm text-ink-muted">
                    {item.description}
                  </p>
                ) : null}
                {item.tags && item.tags.length > 0 ? (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                ) : null}
              </div>
              <Button
                type="button"
                variant="danger"
                size="sm"
                loading={deleteId === item.id}
                onClick={() => {
                  setDeleteId(item.id);
                  const form = new FormData();
                  form.set("id", item.id);
                  deletePortfolioAction(form).then(() => setDeleteId(null));
                }}
              >
                Hapus
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-sm text-ink-muted">
          Belum ada portofolio. Tambahkan lewat form di atas.
        </p>
      )}
    </div>
  );
}