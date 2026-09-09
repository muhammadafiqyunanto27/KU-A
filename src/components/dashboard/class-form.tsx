"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateClassProfileAction } from "@/lib/actions/class";
import type { ClassProfile } from "@/lib/types";

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