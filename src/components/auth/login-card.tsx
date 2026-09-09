import Link from "next/link";
import { BackgroundBlobs } from "@/components/ui/background-blobs";
import { LoginForm } from "@/components/auth/login-form";

export function LoginCard({
  title,
  subtitle,
  next,
}: {
  title: string;
  subtitle: string;
  next?: string;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-12">
      <BackgroundBlobs />
      <Link
        href="/"
        className="mb-6 flex items-center gap-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
      >
        ← Kembali ke beranda
      </Link>

      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl bg-cocoa text-xl font-bold text-white">
            KU
          </span>
          <h1 className="text-2xl font-bold text-ink">{title}</h1>
          <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>
        </div>

        <LoginForm next={next} />
      </div>
    </div>
  );
}