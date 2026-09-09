import { Metadata } from "next";
import { redirect } from "next/navigation";
import { UsersManager } from "@/components/dashboard/users-manager";
import { getSessionProfile } from "@/lib/auth";
import { getMembers } from "@/lib/data";

export const metadata: Metadata = {
  title: "Anggota & Role",
};

export const dynamic = "force-dynamic";

export default async function DashboardUsersPage() {
  const session = await getSessionProfile();

  if (!session) {
    redirect("/login?next=/dashboard/users");
  }

  if (session.profile?.role !== "super_admin") {
    redirect("/dashboard");
  }

  const result = await getMembers();
  const users = result.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">Anggota & Role</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Kelola peran setiap user. Hanya Super Admin yang bisa mengubah peran.
        </p>
      </header>

      {users.length === 0 ? (
        <p className="text-sm text-ink-muted">
          Belum ada user terdaftar, atau Database belum dikonfigurasi.
        </p>
      ) : (
        <UsersManager users={users} currentUserId={session.user.id} />
      )}
    </div>
  );
}