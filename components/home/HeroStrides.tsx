import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import type { IndexedRegulation } from "@/lib/index-types";
import { COUNTRIES, type CountryCode } from "@/lib/taxonomy";

interface Props {
  totalRegs: number;
  topRegulations: IndexedRegulation[];
}

const BULLETS = [
  `Catálogo curado`,
  `Filtros por país y materia`,
  `Comparador lado a lado`,
];

export function HeroStrides({ totalRegs, topRegulations }: Props) {
  const countriesCount = new Set(topRegulations.map((r) => r.country)).size;
  // pick 3 fichas para "stacked policy cards" visual: una mint, una dark, una sand
  const featured = topRegulations
    .filter((r) => r.hasCriticalAnalysis)
    .slice(0, 3);
  const visualCards = featured.length >= 3 ? featured : topRegulations.slice(0, 3);

  return (
    <section className="border-b border-border">
      <div className="container-app py-16 sm:py-20 lg:py-24">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
          {/* Left: copy */}
          <div>
            <h1 className="display-tight text-[3rem] sm:text-[3.75rem] lg:text-[4.5rem] leading-[1.04]">
              Tracker de regulación tecnológica para{" "}
              <span style={{ color: "rgb(var(--accent))" }}>LATAM</span>.
            </h1>
            <p className="mt-6 text-lg text-fg-muted leading-relaxed max-w-xl">
              {totalRegs} normas, decretos y proyectos sobre IA, datos
              personales, ciberseguridad, plataformas digitales y fintech en{" "}
              {countriesCount > 0 ? countriesCount : 11} jurisdicciones de
              América Latina.
            </p>
            <ul className="mt-6 space-y-3">
              {BULLETS.map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm">
                  <span
                    className="inline-flex h-5 w-5 items-center justify-center rounded-full"
                    style={{
                      background: "rgb(var(--accent-soft))",
                      color: "rgb(var(--accent-deep))",
                    }}
                  >
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="text-fg">{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/regulaciones" className="btn-pill btn-primary">
                Abrir catálogo
              </Link>
              <Link href="/comparar" className="btn-pill btn-text">
                Comparar normas <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right: stacked "policy cards" */}
          <div className="relative h-[360px] sm:h-[420px] lg:h-[460px] hidden md:block">
            <PolicyCardVisual cards={visualCards} />
          </div>
        </div>
      </div>
    </section>
  );
}

const CARD_PALETTES = [
  {
    bg: "rgb(var(--accent))",
    text: "white",
    sub: "rgba(255,255,255,0.7)",
  },
  {
    bg: "rgb(var(--bg-dark))",
    text: "white",
    sub: "rgba(255,255,255,0.6)",
  },
  {
    bg: "rgb(var(--sand))",
    text: "rgb(var(--bg-dark))",
    sub: "rgba(23,23,23,0.7)",
  },
];

function PolicyCardVisual({ cards }: { cards: IndexedRegulation[] }) {
  return (
    <div className="absolute inset-0">
      {cards.slice(0, 3).map((c, i) => {
        const palette = CARD_PALETTES[i];
        const country = COUNTRIES[c.country as CountryCode];
        // staggered overlapping cards
        const transform = [
          "rotate(-8deg) translate(-12%, 8%)",
          "rotate(2deg) translate(8%, -6%)",
          "rotate(10deg) translate(28%, 4%)",
        ][i];
        const z = [10, 20, 5][i];
        return (
          <div
            key={c.id}
            className="absolute top-1/2 left-1/2 w-[280px] sm:w-[320px] aspect-[1.6/1] -translate-x-1/2 -translate-y-1/2 rounded-2xl shadow-card p-5 flex flex-col justify-between"
            style={{
              background: palette.bg,
              color: palette.text,
              transform,
              zIndex: z,
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p
                  className="text-[0.65rem] uppercase tracking-[0.12em] font-semibold"
                  style={{ color: palette.sub }}
                >
                  policytracker.lat
                </p>
                <p className="mt-3 font-semibold text-base leading-tight line-clamp-2">
                  {c.shortTitle}
                </p>
              </div>
              <span className="text-2xl shrink-0 ml-2" aria-hidden>
                {country?.flag}
              </span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p
                  className="text-[0.6rem] uppercase tracking-wider"
                  style={{ color: palette.sub }}
                >
                  Jurisdicción
                </p>
                <p className="text-xs font-medium">{country?.name}</p>
              </div>
              <div className="text-right">
                <p
                  className="text-[0.6rem] uppercase tracking-wider"
                  style={{ color: palette.sub }}
                >
                  Año
                </p>
                <p className="font-mono text-xs">{c.year}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
