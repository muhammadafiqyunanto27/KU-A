import { redirect } from "next/navigation";
import { BackgroundBlobs } from "@/components/ui/background-blobs";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { getSessionProfile } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionProfile();

  if (!session) {
    redirect("/login?next=/dashboard");
  }

  return (
    <div className="relative flex min-h-dvh flex-col lg:flex-row">
      <BackgroundBlobs />
      <div className="px-4 pt-4 lg:w-64 lg:shrink-0">
        <DashboardSidebar profile={session.profile} />
      </div>
      <main className="flex-1 px-4 py-4 lg:p-6">
        <div className="mx-auto max-w-4xl">{children}</div>
      </main>
    </div>
  );
}