"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search } from "lucide-react";
import { Mark } from "@/components/nav/Sidebar";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n";

export function MobileTopbar({ onOpenSearch }: { onOpenSearch?: () => void }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { t, locale, setLocale } = useLocale();

  const NAV = [
    { href: "/", label: t("nav.start") },
    { href: "/regulaciones", label: t("nav.catalog") },
    { href: "/paises", label: t("nav.countries") },
    { href: "/areas", label: t("nav.areas") },
    { href: "/comparar", label: t("nav.compare") },
    { href: "/dashboard", label: t("nav.dashboard") },
    { href: "/tags", label: t("nav.tags") },
    { href: "/metodologia", label: t("nav.methodology") },
    { href: "/glosario", label: t("nav.glossary") },
    { href: "/about", label: t("nav.about") },
  ];

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
          aria-label={t("nav.search")}
          onClick={onOpenSearch}
          className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-md text-fg-muted hover:bg-bg-sunken hover:text-fg transition-colors"
        >
          <Search className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setLocale(locale === "es" ? "en" : "es")}
          aria-label={t("locale.aria")}
          className="inline-flex h-9 px-2 items-center justify-center rounded-md text-xs font-semibold text-fg-muted hover:text-fg hover:bg-bg-sunken transition-colors"
        >
          {locale === "es" ? "EN" : "ES"}
        </button>
        <button
          type="button"
          aria-label={t("nav.menu")}
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
