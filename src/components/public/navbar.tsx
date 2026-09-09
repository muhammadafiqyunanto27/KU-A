"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/#anggota", label: "Anggota" },
  { href: "/finance", label: "Keuangan" },
];

function isActive(href: string, pathname: string, hash: string): boolean {
  if (href.includes("#")) {
    const [path, anchor] = href.split("#");
    return pathname === path && hash === `#${anchor}`;
  }
  if (href === "/") {
    return pathname === "/" && hash === "";
  }
  return pathname === href;
}

export function Navbar({ loggedIn }: { loggedIn: boolean }) {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const update = () => setHash(window.location.hash);
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  const tabs = [
    { href: "/", label: "Beranda", Icon: HomeIcon },
    { href: "/#anggota", label: "Anggota", Icon: UsersIcon },
    { href: "/finance", label: "Keuangan", Icon: WalletIcon },
    ...(loggedIn ? [{ href: "/dashboard", label: "Dashboard", Icon: GridIcon }] : []),
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-[4.5rem] sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-tight text-ink">KU-A</span>
          </Link>

          <div className="flex items-center gap-1">
            <nav className="mr-1 hidden items-center gap-1 sm:flex">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 text-sm font-medium transition-colors",
                    isActive(link.href, pathname, hash)
                      ? "text-ink"
                      : "text-ink-muted hover:text-ink",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <ThemeToggle />
            {loggedIn ? (
              <Link href="/dashboard" className="ml-1">
                <Button size="sm">Dashboard</Button>
              </Link>
            ) : null}
          </div>
        </div>
      </header>

      {/* Bottom tab bar — mobile (WhatsApp iOS style) */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-background/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl sm:hidden">
        <div className="flex items-stretch">
          {tabs.map((tab) => {
            const active = isActive(tab.href, pathname, hash);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 py-2.5 transition-colors",
                  active ? "text-cocoa" : "text-ink-muted",
                )}
              >
                <tab.Icon className="size-5" />
                <span className={cn("text-[10px] leading-none", active ? "font-semibold" : "font-medium")}>
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20h14V9.5" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c.6-3.4 3.2-5 6.5-5s5.9 1.6 6.5 5" />
      <path d="M16 5a3.5 3.5 0 0 1 0 6" />
      <path d="M18 15.2c1.7.6 2.9 2 3.3 4.8" />
    </svg>
  );
}

function WalletIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="18" height="13" rx="2.5" />
      <path d="M3 10h18" />
      <circle cx="16.5" cy="14.5" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

function GridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </svg>
  );
}