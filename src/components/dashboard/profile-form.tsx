"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AvatarUploader } from "@/components/dashboard/avatar-uploader";
import { updateProfileAction } from "@/lib/actions/profile";
import type { Profile } from "@/lib/types";

export function ProfileForm({ profile }: { profile: Profile | null }) {
  const [state, action, pending] = useActionState(
    (_prev: { error: string } | void, formData: FormData) =>
      updateProfileAction(formData),
    undefined,
  );

  return (
    <>
      <AvatarUploader profile={profile} />

      <form action={action} className="glass flex flex-col gap-4 rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-ink">Informasi Dasar</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Nama Lengkap"
          name="full_name"
          defaultValue={profile?.full_name ?? ""}
          placeholder="Nama lengkap kamu"
        />
        <Input
          label="Nama Panggilan"
          name="nickname"
          defaultValue={profile?.nickname ?? ""}
          placeholder="Panggilan di class"
        />
      </div>

      <Textarea
        label="Bio Singkat"
        name="bio"
        defaultValue={profile?.bio ?? ""}
        placeholder="Ceritakan sedikit tentang kamu…"
      />

      <Input
        label="Skills (pisah dengan koma)"
        name="skills"
        defaultValue={profile?.skills?.join(", ") ?? ""}
        placeholder="Web design, UI/UX, Public speaking…"
      />

      <div className="border-t border-line pt-4">
        <h3 className="mb-3 text-sm font-semibold text-ink">Sosial & Kontak</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Instagram" name="instagram" defaultValue={profile?.socials?.instagram ?? ""} placeholder="@username" />
          <Input label="GitHub" name="github" defaultValue={profile?.socials?.github ?? ""} placeholder="github.com/username" />
          <Input label="LinkedIn" name="linkedin" defaultValue={profile?.socials?.linkedin ?? ""} placeholder="linkedin.com/in/username" />
          <Input label="WhatsApp" name="whatsapp" defaultValue={profile?.socials?.whatsapp ?? ""} placeholder="08xxxx" />
          <Input label="Email" name="email" type="email" defaultValue={profile?.socials?.email ?? ""} placeholder="email@kamu.com" className="sm:col-span-2" />
        </div>
      </div>

      {state?.error ? (
        <p role="alert" className="rounded-xl border border-sunrise/30 bg-sunrise/10 px-3 py-2 text-sm text-sunrise">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" loading={pending} className="mt-1 self-end">
        {pending ? "Menyimpan…" : "Simpan Profil"}
      </Button>
    </form>
    </>
  );
}