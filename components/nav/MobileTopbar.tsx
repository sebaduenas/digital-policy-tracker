"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Mark } from "@/components/nav/Sidebar";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/regulaciones", label: "Catálogo" },
  { href: "/paises", label: "Países" },
  { href: "/areas", label: "Áreas" },
  { href: "/comparar", label: "Comparar" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tags", label: "Tags" },
  { href: "/metodologia", label: "Metodología" },
  { href: "/glosario", label: "Glosario" },
  { href: "/about", label: "About" },
];

export function MobileTopbar({ onOpenSearch }: { onOpenSearch?: () => void }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const current = resolvedTheme || theme;

  return (
    <header className="lg:hidden sticky top-0 z-30 bg-bg/90 backdrop-blur-md border-b border-border">
      <div className="flex h-14 items-center px-4 gap-2">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Mark className="h-8 w-8" />
          <span className="display-italic text-base">
            policytracker<span className="text-accent">.lat</span>
          </span>
        </Link>
        <button
          type="button"
          aria-label="Buscar"
          onClick={onOpenSearch}
          className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-md text-fg-muted hover:bg-bg-sunken hover:text-fg transition-colors"
        >
          <Search className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Cambiar tema"
          onClick={() => setTheme(current === "dark" ? "light" : "dark")}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-fg-muted hover:bg-bg-sunken hover:text-fg transition-colors"
        >
          {current === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <button
          type="button"
          aria-label="Menú"
          onClick={() => setOpen((o) => !o)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-fg hover:bg-bg-sunken transition-colors"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-border bg-bg-elevated">
          <div className="px-3 py-2 flex flex-col">
            {NAV.map((item) => {
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
                      ? "bg-accent-soft text-accent font-medium"
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
