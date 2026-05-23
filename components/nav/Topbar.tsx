"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Bell,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  ChevronsRight,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/regulaciones", label: "Catálogo" },
  { href: "/paises", label: "Países" },
  { href: "/areas", label: "Áreas" },
  { href: "/comparar", label: "Comparar" },
  { href: "/dashboard", label: "Dashboard" },
];

const NAV_SECONDARY = [
  { href: "/tags", label: "Tags" },
  { href: "/metodologia", label: "Metodología" },
  { href: "/glosario", label: "Glosario" },
  { href: "/about", label: "About" },
];

interface Props {
  onOpenSearch?: () => void;
  totalRegs: number;
  totalCountries: number;
}

export function Topbar({ onOpenSearch, totalRegs, totalCountries }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const current = resolvedTheme || theme;

  return (
    <header className="sticky top-0 z-40 bg-nav-bg text-nav-fg">
      <div className="container-app">
        <div className="h-16 flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0"
            onClick={() => setOpen(false)}
            aria-label="Inicio"
          >
            <Brand />
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm">
            {NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-1.5 rounded-md transition-colors",
                    active
                      ? "text-nav-fg font-semibold"
                      : "text-nav-fg-muted hover:text-nav-fg",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenSearch}
              aria-label="Buscar (Cmd+K)"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/8 hover:bg-white/15 text-nav-fg-muted hover:text-nav-fg transition-colors"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setTheme(current === "dark" ? "light" : "dark")}
              aria-label="Cambiar tema"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/8 hover:bg-white/15 text-nav-fg-muted hover:text-nav-fg transition-colors"
            >
              {mounted ? (
                current === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )
              ) : (
                <span className="h-4 w-4" />
              )}
            </button>

            <div className="hidden sm:flex items-center gap-2 ml-1 px-3 py-1.5 rounded-full bg-white/8 text-nav-fg-muted text-[0.7rem] tabular-nums">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {totalRegs} normas · {totalCountries} países
            </div>

            <button
              type="button"
              aria-label="Menú"
              onClick={() => setOpen((o) => !o)}
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/8 hover:bg-white/15 text-nav-fg transition-colors"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <nav className="md:hidden bg-nav-bg border-t border-white/10">
          <div className="container-app py-3 flex flex-col">
            {[...NAV, ...NAV_SECONDARY].map((item) => {
              const active =
                item.href === "/"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm transition-colors",
                    active
                      ? "bg-white/10 text-nav-fg font-semibold"
                      : "text-nav-fg-muted hover:bg-white/5 hover:text-nav-fg",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}

export function Brand() {
  return (
    <span className="flex items-center gap-2">
      <span className="inline-flex items-center justify-center h-9 w-9 rounded-md bg-accent text-accent-fg">
        <ChevronsRight className="h-4 w-4" strokeWidth={3} />
      </span>
      <span className="display-tight text-[22px] tracking-tight leading-none">
        Policy<span className="text-accent">.lat</span>
      </span>
    </span>
  );
}
