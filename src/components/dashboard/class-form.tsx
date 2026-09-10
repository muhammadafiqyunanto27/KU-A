"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateClassProfileAction } from "@/lib/actions/class";
import type { ClassProfile, TextStyle } from "@/lib/types";

const FONT_OPTIONS = [
  { value: "", label: "Inter (default)" },
  { value: "sans", label: "Sans (sistem)" },
  { value: "serif", label: "Serif" },
  { value: "mono", label: "Mono" },
];

type StylePrefix = "class_name" | "tagline" | "description";

const STYLE_LABELS: Record<StylePrefix, string> = {
  class_name: "Nama Kelas",
  tagline: "Tagline",
  description: "Deskripsi",
};

function StyleControl({
  prefix,
  value,
}: {
  prefix: StylePrefix;
  value?: TextStyle;
}) {
  return (
    <div className="rounded-xl border border-line-strong bg-surface-muted/50 p-3">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-faint">
        {STYLE_LABELS[prefix]}
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <label className="grid gap-1">
          <span className="text-xs text-ink-muted">Ukuran (px)</span>
          <input
            type="number"
            name={`${prefix}_size`}
            min={8}
            max={220}
            defaultValue={value?.size ?? ""}
            placeholder="Auto"
            className="h-10 rounded-lg border border-line-strong bg-surface-strong/70 px-3 text-sm text-ink outline-none focus:border-cocoa"
          />
        </label>
        <label className="grid gap-1">
          <span className="text-xs text-ink-muted">Warna</span>
          <input
            type="color"
            name={`${prefix}_color`}
            defaultValue={value?.color ?? "#4b5565"}
            className="h-10 w-full cursor-pointer rounded-lg border border-line-strong bg-surface-strong/70 px-1"
          />
        </label>
        <label className="grid gap-1">
          <span className="text-xs text-ink-muted">Font</span>
          <select
            name={`${prefix}_font`}
            defaultValue={value?.font ?? ""}
            className="h-10 rounded-lg border border-line-strong bg-surface-strong/70 px-2 text-sm text-ink outline-none focus:border-cocoa"
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1">
          <span className="text-xs text-ink-muted">
            Transparansi{" "}
            <span className="text-ink-faint">
              {Math.round((value?.opacity ?? 1) * 100)}%
            </span>
          </span>
          <input
            type="range"
            name={`${prefix}_opacity`}
            min={0.3}
            max={1}
            step={0.05}
            defaultValue={value?.opacity ?? 1}
            className="h-10 w-full accent-cocoa"
          />
        </label>
      </div>
      <p className="mt-2 text-[11px] text-ink-faint">
        Kosongkan ukuran biar pakai ukuran bawaan; warna kosong = ikut tema.
      </p>
    </div>
  );
}

export function ClassForm({ klass }: { klass: ClassProfile | null }) {
  const [state, action, pending] = useActionState(
    (_prev: { error: string } | void, formData: FormData) =>
      updateClassProfileAction(formData),
    undefined,
  );

  return (
    <form action={action} className="glass flex flex-col gap-4 rounded-2xl p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Nama Kelas"
          name="class_name"
          defaultValue={klass?.class_name ?? "KU-A"}
        />
        <Input
          label="Tagline"
          name="tagline"
          defaultValue={klass?.tagline ?? ""}
          placeholder="Slogan singkat class"
        />
      </div>

      <Textarea
        label="Deskripsi"
        name="description"
        defaultValue={klass?.description ?? ""}
        placeholder="Deskripsi profil kelas…"
        rows={4}
      />

      <div className="border-t border-line pt-4">
        <h3 className="mb-3 text-sm font-semibold text-ink">Tampilan Tulisan (Hero)</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StyleControl prefix="class_name" value={klass?.hero_style?.class_name} />
          <StyleControl prefix="tagline" value={klass?.hero_style?.tagline} />
          <StyleControl prefix="description" value={klass?.hero_style?.description} />
        </div>
      </div>

      <div className="border-t border-line pt-4">
        <h3 className="mb-3 text-sm font-semibold text-ink">Sosial</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Instagram" name="instagram" defaultValue={klass?.socials?.instagram ?? ""} placeholder="@kelas_ku_a" />
          <Input label="YouTube" name="youtube" defaultValue={klass?.socials?.youtube ?? ""} placeholder="youtube.com/@kelas" />
          <Input label="TikTok" name="tiktok" defaultValue={klass?.socials?.tiktok ?? ""} placeholder="@kelas_ku_a" />
          <Input label="GitHub" name="github" defaultValue={klass?.socials?.github ?? ""} placeholder="github.com/org" />
        </div>
      </div>

      <div className="border-t border-line pt-4">
        <h3 className="mb-3 text-sm font-semibold text-ink">Kontak</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Email" name="contact_email" type="email" defaultValue={klass?.contact?.email ?? ""} placeholder="kelas@email.com" />
          <Input label="Telepon" name="contact_phone" defaultValue={klass?.contact?.phone ?? ""} placeholder="08xxxx" />
          <Input label="Alamat / Tempat" name="contact_address" defaultValue={klass?.contact?.address ?? ""} placeholder="Sekolah / ruang kelas" className="sm:col-span-2" />
          <Input label="Jadwal / Waktu" name="contact_schedule" defaultValue={klass?.contact?.schedule ?? ""} placeholder="Mis. Pembelajaran: Senin–Jumat" className="sm:col-span-2" />
        </div>
      </div>

      {state?.error ? (
        <p role="alert" className="rounded-xl border border-sunrise/30 bg-sunrise/10 px-3 py-2 text-sm text-sunrise">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" loading={pending} className="mt-1 self-end">
        {pending ? "Menyimpan…" : "Simpan Profil Kelas"}
      </Button>
    </form>
  );
}