import { cn } from "@/lib/utils";

export function BackgroundBlobs({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden dark:hidden",
        className,
      )}
    >
      <div className="animate-blob absolute -top-40 -left-32 size-[34rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(66,86,122,0.55),rgba(66,86,122,0)_70%)] opacity-70 dark:bg-[radial-gradient(circle_at_center,rgba(76,94,140,0.6),rgba(32,24,16,0)_70%)]" />
      <div className="animate-blob absolute top-1/4 -right-40 size-[30rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(222,159,55,0.32),rgba(222,159,55,0)_70%)] opacity-60 dark:bg-[radial-gradient(circle_at_center,rgba(180,130,90,0.5),rgba(32,24,16,0)_70%)] [animation-delay:-5s]" />
      <div className="animate-blob absolute -bottom-48 left-1/4 size-[32rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(143,182,220,0.3),rgba(143,182,220,0)_70%)] opacity-60 dark:bg-[radial-gradient(circle_at_center,rgba(88,100,130,0.5),rgba(32,24,16,0)_70%)] [animation-delay:-9s]" />
      <div className="animate-blob absolute inset-x-0 top-1/2 mx-auto size-[24rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(244,234,221,0.45),rgba(244,234,221,0)_70%)] opacity-50 dark:bg-[radial-gradient(circle_at_center,rgba(140,110,70,0.28),rgba(32,24,16,0)_70%)] [animation-delay:-13s]" />
    </div>
  );
}