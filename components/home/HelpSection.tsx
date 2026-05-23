"use client";

import Link from "next/link";
import { Search, GitCompareArrows, Map, Layers } from "lucide-react";
import { useLocale } from "@/lib/i18n";

export function HelpSection() {
  const { t } = useLocale();
  const features = [
    {
      href: "/regulaciones",
      title: t("help.cards.catalog.title"),
      desc: t("help.cards.catalog.desc"),
      icon: Search,
    },
    {
      href: "/comparar",
      title: t("help.cards.compare.title"),
      desc: t("help.cards.compare.desc"),
      icon: GitCompareArrows,
    },
    {
      href: "/paises",
      title: t("help.cards.country.title"),
      desc: t("help.cards.country.desc"),
      icon: Map,
    },
    {
      href: "/areas",
      title: t("help.cards.areas.title"),
      desc: t("help.cards.areas.desc"),
      icon: Layers,
    },
  ];

  return (
    <section className="border-b border-border">
      <div className="container-app py-20">
        <div className="max-w-2xl mb-12">
          <h2 className="display-tight text-[2.5rem] sm:text-[3rem] leading-[1.05]">
            {t("help.title.before")}{" "}
            <span style={{ color: "rgb(var(--accent))" }}>
              {t("help.title.accent")}
            </span>
            {t("help.title.suffix")}
          </h2>
          <p className="mt-4 text-lg text-fg-muted max-w-xl">
            {t("help.subtitle")}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <Link
                key={f.href}
                href={f.href}
                className="feature-card group hover:bg-bg-mint transition-colors"
              >
                <Icon
                  className="h-5 w-5 mb-4"
                  strokeWidth={2}
                  style={{ color: "rgb(var(--accent))" }}
                />
                <h3 className="text-base font-semibold mb-1.5 text-fg">
                  {f.title}
                </h3>
                <p className="text-sm text-fg-muted leading-relaxed">
                  {f.desc}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
