"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAction } from "@/lib/actions/auth";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(
    (_prev: { error: string } | void, formData: FormData) => loginAction(formData),
    undefined,
  );

  return (
    <form
      action={action}
      className="glass flex flex-col gap-4 rounded-2xl p-6"
    >
      <input type="hidden" name="next" value={next ?? "/dashboard"} />

      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="nama@email.com"
        autoComplete="email"
        required
      />
      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        required
      />

      {state?.error ? (
        <p
          role="alert"
          className="rounded-xl border border-sunrise/30 bg-sunrise/10 px-3 py-2 text-sm text-sunrise"
        >
          {state.error}
        </p>
      ) : null}

      <Button type="submit" loading={pending} className="mt-2 w-full">
        {pending ? "Memproses…" : "Masuk"}
      </Button>
    </form>
  );
}