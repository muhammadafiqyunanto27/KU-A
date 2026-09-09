import { BackgroundBlobs } from "@/components/ui/background-blobs";
import { BackgroundCarousel } from "@/components/public/background-carousel";
import { Footer } from "@/components/public/footer";
import { Navbar } from "@/components/public/navbar";
import { getSessionProfile } from "@/lib/auth";
import { getClassBackgrounds } from "@/lib/data";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionProfile();
  const backgrounds = await getClassBackgrounds();
  const urls = (backgrounds.data ?? []).map((bg) => bg.url);

  return (
    <div className="relative flex min-h-dvh flex-col pb-[calc(3.5rem+env(safe-area-inset-bottom))] sm:pb-0">
      {urls.length > 0 ? <BackgroundCarousel urls={urls} /> : <BackgroundBlobs />}
      <Navbar loggedIn={Boolean(session)} />
      <main className="flex-1 px-4">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
      <Footer />
    </div>
  );
}