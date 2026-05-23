import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import type { IndexedRegulation } from "@/lib/index-types";
import { COUNTRIES, type CountryCode } from "@/lib/taxonomy";

interface FloatingChip {
  country: CountryCode;
  title: string;
  meta: string;
  pct: number;
}

interface Props {
  totalRegs: number;
  topRegulations: IndexedRegulation[];
}

function buildChips(items: IndexedRegulation[]): FloatingChip[] {
  return items.slice(0, 4).map((r) => {
    const meta =
      r.status === "vigente"
        ? "Plenamente vigente"
        : r.status === "vigencia-diferida"
          ? "Vigencia diferida"
          : r.status === "proyecto-en-discusion"
            ? "Proyecto en discusión"
            : r.status === "aprobado-pendiente-promulgacion"
              ? "Aprobado"
              : "Norma vigente";
    const pct =
      r.confidenceLevel === "alto" ? 95 : r.confidenceLevel === "medio" ? 80 : 65;
    return {
      country: r.country as CountryCode,
      title: r.shortTitle,
      meta,
      pct,
    };
  });
}

export function HeroStrides({ totalRegs, topRegulations }: Props) {
  const chips = buildChips(topRegulations);
  // Positions: (top, side, alignment)
  const positions = [
    { side: "left", top: "10%", offset: "lg:-translate-x-8" },
    { side: "left", top: "60%", offset: "lg:-translate-x-12" },
    { side: "right", top: "16%", offset: "lg:translate-x-8" },
    { side: "right", top: "55%", offset: "lg:translate-x-12" },
  ] as const;

  return (
    <section className="relative overflow-hidden">
      {/* Lavender gradient */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-hero-from via-hero-to to-bg"
      />
      {/* Concentric rings */}
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <svg
          viewBox="0 0 1200 800"
          className="w-[140%] max-w-none opacity-40"
          preserveAspectRatio="xMidYMid slice"
        >
          {[80, 160, 240, 320, 400, 480, 560].map((r, i) => (
            <circle
              key={r}
              cx="600"
              cy="400"
              r={r}
              fill="none"
              stroke="rgb(255 255 255 / 0.35)"
              strokeWidth={i === 3 ? 1.2 : 0.6}
              strokeDasharray={i % 2 === 0 ? "none" : "3 4"}
            />
          ))}
          {/* dots on rings */}
          {[
            [340, 200],
            [880, 220],
            [200, 460],
            [990, 460],
            [600, 720],
            [600, 60],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="3" fill="rgb(255 255 255 / 0.55)" />
          ))}
        </svg>
      </div>

      <div className="relative container-app pt-16 pb-20 sm:pt-24 sm:pb-28">
        {/* Headline */}
        <div className="text-center max-w-4xl mx-auto relative z-10">
          <h1 className="display-tight text-white text-5xl sm:text-6xl lg:text-[5.5rem] leading-[0.95] text-balance">
            Explora la regulación{" "}
            <span className="block">tecnológica con</span>
            <span className="block display-outline mt-2">curaduría académica</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-white/90 max-w-xl mx-auto">
            {totalRegs} normas, decretos y proyectos de ley sobre IA, datos
            personales, ciberseguridad, plataformas digitales y fintech en
            América Latina.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link
              href="/regulaciones"
              className="btn-pill bg-accent text-accent-fg hover:bg-accent-deep shadow-lg shadow-accent/30"
            >
              Abrir catálogo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/comparar"
              className="btn-pill bg-white text-fg hover:bg-white/90 shadow-md"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                <path
                  d="M7 9l3 3 3-3M7 15l3-3 3 3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="16"
                  rx="3"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              Comparar normas
            </Link>
          </div>
        </div>

        {/* Floating chips */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none">
          {chips.map((chip, i) => {
            const pos = positions[i];
            const cMeta = COUNTRIES[chip.country];
            const slug = topRegulations[i]?.slug;
            return (
              <Link
                key={i}
                href={slug ? `/regulaciones/${slug}` : "/regulaciones"}
                className={`absolute pointer-events-auto ${
                  pos.side === "left" ? "left-4 xl:left-12" : "right-4 xl:right-12"
                } ${pos.offset}`}
                style={{ top: pos.top }}
              >
                <div className="card-glass rounded-full pl-2 pr-3 py-1.5 flex items-center gap-2 hover:scale-[1.03] transition-transform w-[240px]">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-base shadow-sm">
                    {cMeta.flag}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.7rem] font-semibold text-fg truncate leading-tight">
                      {chip.title}
                    </p>
                    <p className="text-[0.6rem] text-fg-muted truncate leading-tight">
                      {chip.meta}
                    </p>
                    <div className="mt-0.5 inline-flex items-center gap-1 rounded-sm bg-green-200/80 px-1 py-px text-[0.55rem] font-bold text-green-900">
                      {chip.pct}% confianza · {cMeta.name}
                    </div>
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-fg-muted shrink-0" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
