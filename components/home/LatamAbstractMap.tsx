import Link from "next/link";
import { COUNTRIES, type CountryCode } from "@/lib/taxonomy";
import type { IndexedRegulation } from "@/lib/index-types";
import {
  LATAM_VIEWBOX,
  LATAM_COUNTRY_PATHS,
  LATAM_DOTS,
} from "@/components/home/latam-geo";

export function LatamAbstractMap({ data }: { data: IndexedRegulation[] }) {
  const counts: Partial<Record<CountryCode, number>> = {};
  data.forEach((d) => {
    counts[d.country] = (counts[d.country] || 0) + 1;
  });

  const { w, h } = LATAM_VIEWBOX;
  const codes = (Object.keys(LATAM_COUNTRY_PATHS) as CountryCode[]).filter(
    (c) => LATAM_COUNTRY_PATHS[c],
  );

  // Horizontal "stride" lines, gently waved, that fill the landmass.
  const step = 3.6;
  const lines = Array.from({ length: Math.ceil(h / step) + 1 }, (_, i) => {
    const y = i * step;
    const amp = 0.5 + (i % 3) * 0.35;
    return `M -2 ${y} Q ${w / 2} ${(y - amp).toFixed(2)} ${w + 2} ${y}`;
  });

  return (
    <div
      className="relative w-full h-full"
      style={{ aspectRatio: `${w} / ${h}` }}
    >
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="absolute inset-0 w-full h-full"
        role="img"
        aria-label="Mapa de América Latina con las jurisdicciones cubiertas"
      >
        <defs>
          <clipPath id="latam-clip">
            {codes.map((c) => (
              <path key={c} d={LATAM_COUNTRY_PATHS[c]} />
            ))}
          </clipPath>
          <linearGradient id="latam-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(var(--accent))" stopOpacity="0.9" />
            <stop offset="55%" stopColor="rgb(var(--accent))" stopOpacity="0.6" />
            <stop
              offset="100%"
              stopColor="rgb(var(--accent))"
              stopOpacity="0.32"
            />
          </linearGradient>
        </defs>

        {/* Faint full-bleed lines in the background */}
        <g opacity="0.05">
          {lines.map((d, i) => (
            <path
              key={`bg-${i}`}
              d={d}
              fill="none"
              stroke="rgb(var(--fg))"
              strokeWidth={0.16}
            />
          ))}
        </g>

        {/* Stride lines clipped to the real landmass */}
        <g clipPath="url(#latam-clip)">
          {lines.map((d, i) => (
            <path
              key={`fg-${i}`}
              d={d}
              fill="none"
              stroke="url(#latam-grad)"
              strokeWidth={0.5}
            />
          ))}
        </g>

        {/* Country borders (real geometry) */}
        <g
          fill="none"
          stroke="rgb(var(--accent))"
          strokeWidth={0.28}
          strokeLinejoin="round"
          opacity="0.55"
        >
          {codes.map((c) => (
            <path key={c} d={LATAM_COUNTRY_PATHS[c]} />
          ))}
        </g>

        {/* Clickable country hotspots */}
        {codes.map((c) => {
          const dot = LATAM_DOTS[c];
          const meta = COUNTRIES[c];
          if (!dot || !meta) return null;
          const n = counts[c] || 0;
          return (
            <Link
              key={c}
              href={`/paises/${c.toLowerCase()}`}
              aria-label={`${meta.name}${n > 0 ? `: ${n} ficha${n === 1 ? "" : "s"}` : ": próximamente"}`}
            >
              <g className="group cursor-pointer">
                <circle
                  cx={dot.x}
                  cy={dot.y}
                  r={2.6}
                  fill="rgb(var(--accent))"
                  opacity="0"
                  className="transition-opacity group-hover:opacity-20"
                />
                <circle
                  cx={dot.x}
                  cy={dot.y}
                  r={n > 0 ? 1.2 : 0.8}
                  fill={n > 0 ? "rgb(var(--accent))" : "rgb(var(--fg-muted))"}
                  opacity={n > 0 ? 1 : 0.5}
                  className="transition-all group-hover:opacity-100"
                />
                <circle cx={dot.x} cy={dot.y} r={3.2} fill="transparent" />
                <text
                  x={dot.x}
                  y={dot.y - 2.4}
                  fontSize={2.4}
                  textAnchor="middle"
                  fill="rgb(var(--fg))"
                  opacity="0"
                  className="transition-opacity group-hover:opacity-100 pointer-events-none font-semibold"
                >
                  {meta.name}
                  {n > 0 ? ` · ${n}` : ""}
                </text>
              </g>
            </Link>
          );
        })}
      </svg>
    </div>
  );
}
