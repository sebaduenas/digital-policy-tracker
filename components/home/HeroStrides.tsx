"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { IndexedRegulation } from "@/lib/index-types";
import { LatamAbstractMap } from "@/components/home/LatamAbstractMap";
import { useLocale } from "@/lib/i18n";

interface Props {
  totalRegs: number;
  topRegulations: IndexedRegulation[];
}

export function HeroStrides({ totalRegs, topRegulations }: Props) {
  const { t } = useLocale();
  return (
    <section className="border-b border-border">
      <div className="container-app py-16 sm:py-20 lg:py-24">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
          <div>
            <h1 className="display-tight text-[3rem] sm:text-[3.75rem] lg:text-[4.5rem] leading-[1.04]">
              {t("hero.title.before")}{" "}
              <span style={{ color: "rgb(var(--accent))" }}>
                {t("hero.title.accent")}
              </span>
              .
            </h1>
            <p className="mt-6 text-lg text-fg-muted leading-relaxed max-w-xl">
              {t("hero.subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/regulaciones" className="btn-pill btn-primary">
                {t("hero.cta.primary")}
              </Link>
              <Link href="/comparar" className="btn-pill btn-text">
                {t("hero.cta.secondary")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="relative h-[420px] sm:h-[480px] lg:h-[520px] hidden md:block">
            <LatamAbstractMap data={topRegulations} />
          </div>
        </div>
      </div>
    </section>
  );
}
