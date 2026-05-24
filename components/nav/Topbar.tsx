"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n";

interface Props {
  onOpenSearch?: () => void;
  totalRegs: number;
  totalCountries: number;
}

export function Topbar({ onOpenSearch }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { t, locale, setLocale } = useLocale();

  const NAV = [
    { href: "/regulaciones", label: t("nav.catalog") },
    { href: "/paises", label: t("nav.countries") },
    { href: "/areas", label: t("nav.areas") },
    { href: "/comparar", label: t("nav.compare") },
    { href: "/dashboard", label: t("nav.dashboard") },
  ];

  const NAV_SECONDARY = [
    { href: "/tags", label: t("nav.tags") },
    { href: "/metodologia", label: t("nav.methodology") },
    { href: "/glosario", label: t("nav.glossary") },
    { href: "/about", label: t("nav.about") },
  ];

  return (
    <header className="sticky top-0 z-40 bg-bg border-b border-border">
      <div className="container-app">
        <div className="h-[72px] flex items-center gap-3 md:gap-8">
          <Link
            href="/"
            className="shrink-0 hover:opacity-90 transition-opacity"
            onClick={() => setOpen(false)}
            aria-label={t("nav.start")}
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

          <div className="flex items-center gap-1.5 ml-auto md:ml-0">
            <button
              type="button"
              onClick={onOpenSearch}
              aria-label={`${t("nav.search")} (Cmd+K)`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-fg-muted hover:text-fg hover:bg-bg-sunken transition-colors"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setLocale(locale === "es" ? "en" : "es")}
              aria-label={t("locale.aria")}
              title={t("locale.aria")}
              className="inline-flex h-9 px-2.5 items-center justify-center gap-1 rounded-md text-xs font-semibold text-fg-muted hover:text-fg hover:bg-bg-sunken transition-colors"
            >
              <span className={cn(locale === "es" ? "text-fg" : "")}>ES</span>
              <span className="text-fg-muted/40">/</span>
              <span className={cn(locale === "en" ? "text-fg" : "")}>EN</span>
            </button>
            <Link
              href="/regulaciones"
              className="hidden sm:inline-flex btn-pill btn-primary ml-1"
            >
              {t("nav.openCatalog")}
            </Link>
            <button
              type="button"
              aria-label={t("nav.menu")}
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
      className="display-tight text-[22px] sm:text-[26px] leading-none font-extrabold"
      style={{ color: "rgb(var(--accent))" }}
    >
      policytracker<span className="text-fg">.lat</span>
    </span>
  );
}
