"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/regulaciones", label: "Catálogo" },
  { href: "/paises", label: "Países" },
  { href: "/areas", label: "Materias" },
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

export function Topbar({ onOpenSearch }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const current = resolvedTheme || theme;

  return (
    <header className="sticky top-0 z-40 bg-bg border-b border-border">
      <div className="container-app">
        <div className="h-[72px] flex items-center gap-8">
          <Link
            href="/"
            className="shrink-0 hover:opacity-90 transition-opacity"
            onClick={() => setOpen(false)}
            aria-label="Inicio"
          >
            <Brand />
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm mx-auto">
            {NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-md transition-colors",
                    active
                      ? "text-fg font-semibold"
                      : "text-fg-muted hover:text-fg",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenSearch}
              aria-label="Buscar (Cmd+K)"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-fg-muted hover:text-fg hover:bg-bg-sunken transition-colors"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setTheme(current === "dark" ? "light" : "dark")}
              aria-label="Cambiar tema"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-fg-muted hover:text-fg hover:bg-bg-sunken transition-colors"
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
            <Link
              href="/regulaciones"
              className="hidden sm:inline-flex btn-pill btn-primary ml-1"
            >
              Abrir catálogo
            </Link>
            <button
              type="button"
              aria-label="Menú"
              onClick={() => setOpen((o) => !o)}
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md text-fg hover:bg-bg-sunken transition-colors"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <nav className="md:hidden bg-bg border-t border-border">
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
                      ? "bg-bg-sunken text-fg font-medium"
                      : "text-fg-muted hover:bg-bg-sunken hover:text-fg",
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
    <span
      className="display-tight text-[26px] leading-none font-extrabold"
      style={{ color: "rgb(var(--accent))" }}
    >
      policytracker<span className="text-fg">.lat</span>
    </span>
  );
}
