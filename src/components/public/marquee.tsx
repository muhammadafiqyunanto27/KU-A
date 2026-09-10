const ITEMS = ["KU-A", "KELAS", "PROFIL", "PORTOFOLIO", "KAS KELAS"];

export function Marquee() {
  const strip = (key: number) => (
    <div aria-hidden="true" className="flex shrink-0 items-center">
      {ITEMS.map((item, i) => (
        <span
          key={`${key}-${i}`}
          className="flex items-center gap-6 px-6 text-sm font-semibold uppercase tracking-[0.3em] text-ink-faint"
        >
          {item}
          <span className="text-cocoa/70">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <section className="overflow-hidden border-t border-line pb-8 pt-16">
      <div className="marquee-track flex w-max">
        {strip(1)}
        {strip(2)}
      </div>
    </section>
  );
}