"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/regulaciones", label: "Regulaciones" },
  { href: "/paises", label: "Países" },
  { href: "/areas", label: "Áreas" },
  { href: "/comparar", label: "Comparar" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/metodologia", label: "Metodología" },
];

export function Header({ onOpenSearch }: { onOpenSearch?: () => void }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b transition-all",
        scrolled
          ? "bg-bg/85 backdrop-blur-md border-border"
          : "bg-bg border-transparent",
      )}
    >
      <div className="container flex h-14 items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 group"
          onClick={() => setOpen(false)}
        >
          <Logo />
          <span className="font-serif text-base font-semibold tracking-tight">
            Digital Policy Tracker{" "}
            <span className="text-accent font-normal">LATAM</span>
          </span>
        </Link>

        <nav className="ml-auto hidden md:flex items-center gap-1 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 py-1.5 rounded-md text-fg-muted hover:text-fg hover:bg-bg-elevated transition-colors",
                pathname.startsWith(item.href) && "text-fg bg-bg-elevated",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto md:ml-2 flex items-center gap-1">
          <button
            type="button"
            aria-label="Buscar (Cmd+K)"
            onClick={onOpenSearch}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-bg-elevated px-2.5 py-1.5 text-xs text-fg-muted hover:text-fg transition-colors"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Buscar regulaciones…</span>
            <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-border bg-bg px-1.5 font-mono text-[0.65rem]">
              ⌘K
            </kbd>
          </button>
          <button
            type="button"
            aria-label="Abrir menú"
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-bg-elevated"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-border bg-bg-elevated">
          <div className="container py-2 flex flex-col">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "px-3 py-2 rounded-md text-sm text-fg-muted hover:text-fg hover:bg-bg transition-colors",
                  pathname.startsWith(item.href) && "text-fg bg-bg",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

function Logo() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className="text-accent"
    >
      <rect x="2" y="2" width="28" height="28" rx="6" fill="currentColor" opacity="0.1" />
      <path
        d="M8 12h16M8 16h10M8 20h13M8 24h7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="24" cy="20" r="2" fill="currentColor" />
    </svg>
  );
}
