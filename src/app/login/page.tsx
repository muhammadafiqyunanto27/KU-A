import { Metadata } from "next";
import { LoginCard } from "@/components/auth/login-card";

export const metadata: Metadata = {
  title: "Masuk",
  description: "Login untuk mengelola konten sesuai otoritas.",
};

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <LoginCard
      title="Masuk ke KU-A"
      subtitle="Setiap akun hanya bisa mengubah sesuai otoritasnya."
      next={next}
    />
  );
}