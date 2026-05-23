import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import type { IndexedRegulation } from "@/lib/index-types";
import { COUNTRIES, type CountryCode } from "@/lib/taxonomy";

interface FloatingChip {
  country: CountryCode;
  title: string;
  meta: string;
  year: number;
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
    return {
      country: r.country as CountryCode,
      title: r.shortTitle,
      meta,
      year: r.year ?? 0,
    };
  });
}

export function HeroStrides({ totalRegs, topRegulations }: Props) {
  const chips = buildChips(topRegulations);
  // Positions in a grid that never touches the central headline column.
  const positions = [
    { side: "left", top: "14%" },
    { side: "left", top: "68%" },
    { side: "right", top: "20%" },
    { side: "right", top: "62%" },
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
        <div className="text-center max-w-[640px] mx-auto relative z-10 px-2">
          <h1 className="display-tight text-white text-4xl sm:text-5xl lg:text-[4.25rem] leading-[1] text-balance">
            Explora la regulación{" "}
            <span className="block">tecnológica en</span>
            <span className="block display-outline mt-1">Latinoamérica</span>
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
          </div>
        </div>

        {/* Floating chips — only render on xl+ where there's room outside the headline */}
        <div className="hidden xl:block absolute inset-0 pointer-events-none">
          {chips.map((chip, i) => {
            const pos = positions[i];
            const cMeta = COUNTRIES[chip.country];
            const slug = topRegulations[i]?.slug;
            return (
              <Link
                key={i}
                href={slug ? `/regulaciones/${slug}` : "/regulaciones"}
                className={`absolute pointer-events-auto ${
                  pos.side === "left" ? "left-0" : "right-0"
                }`}
                style={{ top: pos.top }}
              >
                <div className="card-glass rounded-full pl-1.5 pr-3 py-1 flex items-center gap-2 hover:scale-[1.03] transition-transform w-[210px]">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-base shadow-sm">
                    {cMeta.flag}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.65rem] font-semibold text-fg truncate leading-tight">
                      {chip.title}
                    </p>
                    <p className="text-[0.58rem] text-fg-muted truncate leading-tight">
                      {chip.meta}
                    </p>
                    <div className="mt-0.5 inline-flex items-center gap-1 rounded-sm bg-accent-soft px-1 py-px text-[0.52rem] font-bold text-accent-deep">
                      {cMeta.name}{chip.year ? ` · ${chip.year}` : ""}
                    </div>
                  </div>
                  <ArrowUpRight className="h-3 w-3 text-fg-muted shrink-0" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
