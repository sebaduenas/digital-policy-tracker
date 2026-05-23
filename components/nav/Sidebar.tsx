"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Layers,
  MapPin,
  GitCompareArrows,
  PieChart,
  BookOpen,
  Hash,
  Search,
  Sun,
  Moon,
  Package,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutGrid;
  match?: "exact";
  count?: "all" | "countries" | "areas";
};

const PRIMARY: NavItem[] = [
  { href: "/", label: "Inicio", icon: LayoutGrid, match: "exact" },
  { href: "/regulaciones", label: "Catálogo", icon: BookOpen, count: "all" },
  { href: "/paises", label: "Países", icon: MapPin, count: "countries" },
  { href: "/areas", label: "Áreas", icon: Layers, count: "areas" },
  { href: "/comparar", label: "Comparar", icon: GitCompareArrows },
  { href: "/dashboard", label: "Dashboard", icon: PieChart },
  { href: "/tags", label: "Tags", icon: Hash },
];

const SECONDARY = [
  { href: "/metodologia", label: "Metodología" },
  { href: "/glosario", label: "Glosario" },
  { href: "/about", label: "About" },
];

interface SidebarProps {
  totalRegs: number;
  totalCountries: number;
  totalAreas: number;
  onOpenSearch?: () => void;
}

export function Sidebar({
  totalRegs,
  totalCountries,
  totalAreas,
  onOpenSearch,
}: SidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const current = resolvedTheme || theme;

  const counts: Record<string, number> = {
    all: totalRegs,
    countries: totalCountries,
    areas: totalAreas,
  };

  return (
    <aside className="sidebar">
      <div className="px-5 pt-6 pb-5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Mark />
          <div className="leading-none">
            <div className="display-italic text-[15px] text-fg">
              policytracker<span className="text-accent">.lat</span>
            </div>
            <div className="text-[9px] uppercase tracking-[0.22em] text-fg-muted font-semibold mt-1">
              LATAM tracker
            </div>
          </div>
        </Link>
      </div>

      <button
        type="button"
        onClick={onOpenSearch}
        className="mx-3 mb-4 flex items-center gap-2 rounded-full border border-border bg-bg-sunken px-3 py-2 text-xs text-fg-muted hover:bg-bg hover:border-border-strong transition-colors"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="flex-1 text-left">Buscar normas…</span>
        <kbd className="inline-flex h-4 items-center rounded border border-border bg-bg-elevated px-1 font-mono text-[0.55rem]">
          ⌘K
        </kbd>
      </button>

      <nav className="px-3 flex-1 overflow-y-auto scrollbar-thin">
        <ul className="space-y-0.5">
          {PRIMARY.map((item) => {
            const Icon = item.icon;
            const active =
              item.match === "exact"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-full px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-accent text-accent-fg font-semibold"
                      : "text-fg-muted hover:bg-bg-sunken hover:text-fg",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      active ? "text-accent-fg" : "text-fg-muted/70",
                    )}
                  />
                  <span className="flex-1">{item.label}</span>
                  {item.count && (
                    <span
                      className={cn(
                        "text-[0.65rem] tabular-nums",
                        active ? "text-accent-fg/85" : "text-fg-muted/50",
                      )}
                    >
                      {counts[item.count]}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 pt-4 border-t border-border">
          <p className="px-3 mb-1.5 eyebrow">Proyecto</p>
          <ul className="space-y-0.5">
            {SECONDARY.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block rounded-full px-3 py-1.5 text-xs transition-colors",
                      active
                        ? "text-accent font-semibold"
                        : "text-fg-muted hover:text-fg",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <div className="px-3 py-3 border-t border-border flex items-center justify-between">
        <span className="text-[0.65rem] text-fg-muted/70 tabular-nums">
          {totalRegs} normas · {totalCountries} países
        </span>
        <button
          type="button"
          onClick={() => setTheme(current === "dark" ? "light" : "dark")}
          aria-label="Cambiar tema"
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-fg-muted hover:text-fg hover:bg-bg-sunken transition-colors"
        >
          {mounted ? (
            current === "dark" ? (
              <Sun className="h-3.5 w-3.5" />
            ) : (
              <Moon className="h-3.5 w-3.5" />
            )
          ) : (
            <span className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </aside>
  );
}

export function Mark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-fg shrink-0",
        className,
      )}
      aria-hidden
    >
      <Package className="h-4 w-4" strokeWidth={2.5} />
      <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-bg-elevated" />
    </span>
  );
}
