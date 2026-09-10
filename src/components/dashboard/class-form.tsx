"use client";

import { useState, type CSSProperties } from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateClassProfileAction } from "@/lib/actions/class";
import type { ClassProfile, TextStyle } from "@/lib/types";

const FONT_OPTIONS = [
  { value: "inter", label: "Inter" },
  { value: "sans", label: "Sans (sistem)" },
  { value: "serif", label: "Serif" },
  { value: "mono", label: "Mono" },
];

const FONT_STACKS: Record<string, string> = {
  inter: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
  sans: "ui-sans-serif, system-ui, -apple-system, sans-serif",
  serif: 'Georgia, "Times New Roman", serif',
  mono: 'ui-monospace, "Cascadia Code", "JetBrains Mono", monospace',
};

type StylePrefix = "class_name" | "tagline" | "description";

const STYLE_LABELS: Record<StylePrefix, string> = {
  class_name: "Nama Kelas",
  tagline: "Tagline",
  description: "Deskripsi",
};

const DEFAULT_COLOR = "#4b5565";
const DEFAULT_SIZE = "";
const DEFAULT_FONT = "inter";
const DEFAULT_OPACITY = "1";

function StyledField({
  prefix,
  field,
  initialText,
  initialStyle,
}: {
  prefix: StylePrefix;
  field: "input" | "textarea";
  initialText: string;
  initialStyle?: TextStyle;
}) {
  const [textVal, setText] = useState(initialText);
  const [sizeVal, setSize] = useState(initialStyle?.size?.toString() ?? DEFAULT_SIZE);
  const [colorVal, setColor] = useState(initialStyle?.color ?? DEFAULT_COLOR);
  const [fontVal, setFont] = useState(initialStyle?.font ?? DEFAULT_FONT);
  const [opacityVal, setOpacity] = useState(
    (initialStyle?.opacity ?? 1).toString(),
  );

  function resetStyle() {
    setSize(DEFAULT_SIZE);
    setColor(DEFAULT_COLOR);
    setFont(DEFAULT_FONT);
    setOpacity(DEFAULT_OPACITY);
  }

  const previewStyle: CSSProperties = {
    fontSize: sizeVal !== "" ? `${Number(sizeVal) || 0}px` : undefined,
    color: colorVal || undefined,
    fontFamily: FONT_STACKS[fontVal] ?? undefined,
    opacity: Number(opacityVal) || 1,
  };

  const controlClass =
    "h-10 w-full rounded-lg border border-line-strong bg-surface-strong/70 px-3 text-sm text-ink outline-none focus:border-cocoa";

  return (
    <div className="rounded-2xl border border-line-strong bg-surface-muted/40 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
          {STYLE_LABELS[prefix]}
        </p>
        <button
          type="button"
          onClick={resetStyle}
          className="rounded-lg px-2 py-1 text-xs font-medium text-cocoa transition-colors hover:bg-cocoa/10"
        >
          Reset gaya
        </button>
      </div>

      {field === "input" ? (
        <input
          type="text"
          name={prefix}
          value={textVal}
          onChange={(e) => setText(e.target.value)}
          placeholder={prefix === "class_name" ? "KU-A" : "Slogan singkat class"}
          className="glass-soft mt-3 h-11 w-full rounded-xl px-4 text-sm text-ink outline-none focus:border-strong focus:ring-2 focus:ring-cocoa/40"
        />
      ) : (
        <textarea
          name={prefix}
          value={textVal}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="Deskripsi profil kelas…"
          className="glass-soft mt-3 w-full rounded-xl px-4 py-3 text-sm text-ink outline-none focus:border-strong focus:ring-2 focus:ring-cocoa/40"
        />
      )}

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <label className="grid gap-1">
          <span className="text-xs text-ink-muted">Ukuran (px)</span>
          <input
            type="number"
            name={`${prefix}_size`}
            min={8}
            max={220}
            value={sizeVal}
            onChange={(e) => setSize(e.target.value)}
            placeholder="Auto"
            className={controlClass}
          />
        </label>
        <label className="grid gap-1">
          <span className="text-xs text-ink-muted">Warna</span>
          <input
            type="color"
            name={`${prefix}_color`}
            value={colorVal}
            onChange={(e) => setColor(e.target.value)}
            className="h-10 w-full cursor-pointer rounded-lg border border-line-strong bg-surface-strong/70 px-1"
          />
        </label>
        <label className="grid gap-1">
          <span className="text-xs text-ink-muted">Font</span>
          <select
            name={`${prefix}_font`}
            value={fontVal}
            onChange={(e) => setFont(e.target.value)}
            className={controlClass}
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
            <span className="text-ink-faint">{Math.round(Number(opacityVal) * 100)}%</span>
          </span>
          <input
            type="range"
            name={`${prefix}_opacity`}
            min={0.3}
            max={1}
            step={0.05}
            value={opacityVal}
            onChange={(e) => setOpacity(e.target.value)}
            className="h-10 w-full accent-cocoa"
          />
        </label>
      </div>

      <p
        className="mt-3 rounded-xl border border-dashed border-line px-3 py-3 text-ink-muted"
        style={previewStyle}
      >
        {textVal.trim() || "Pratinjau teks akan tampil di sini"}
      </p>
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
    <form action={action} className="glass flex flex-col gap-5 rounded-2xl p-6">
      <div className="border-b border-line pb-4">
        <h2 className="text-lg font-semibold text-ink">Teks Profil Kelas</h2>
        <p className="mt-0.5 text-sm text-ink-muted">
          Tulis teks dan atur gaya hero (ukuran, warna, font, transparansi) lewat satu panel.
        </p>
      </div>

      <StyledField
        prefix="class_name"
        field="input"
        initialText={klass?.class_name ?? ""}
        initialStyle={klass?.hero_style?.class_name}
      />
      <StyledField
        prefix="tagline"
        field="input"
        initialText={klass?.tagline ?? ""}
        initialStyle={klass?.hero_style?.tagline}
      />
      <StyledField
        prefix="description"
        field="textarea"
        initialText={klass?.description ?? ""}
        initialStyle={klass?.hero_style?.description}
      />

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