export function Footer() {
  return (
    <footer className="relative z-10 mt-auto border-t border-line bg-background/85 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <p className="text-center text-[11px] text-ink-faint">
          © {new Date().getFullYear()} Kelas KU - A.
        </p>
      </div>
    </footer>
  );
}