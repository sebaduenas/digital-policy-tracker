import Link from "next/link";
import { COUNTRIES, type CountryCode } from "@/lib/taxonomy";
import type { IndexedRegulation } from "@/lib/index-types";

interface Spot {
  code: CountryCode;
  x: number;
  y: number;
}

// viewBox: 100 x 145 — posiciones aproximadas
const SPOTS: Spot[] = [
  // Norteamérica + Centroamérica
  { code: "MX", x: 24, y: 22 },
  { code: "GT", x: 30, y: 38 },
  { code: "SV", x: 31, y: 42 },
  { code: "HN", x: 33, y: 40 },
  { code: "NI", x: 35, y: 45 },
  { code: "CR", x: 36, y: 50 },
  { code: "PA", x: 41, y: 54 },
  // Caribe (islas)
  { code: "CU", x: 45, y: 30 },
  { code: "HT", x: 55, y: 36 },
  { code: "DO", x: 59, y: 36 },
  // Sudamérica
  { code: "VE", x: 56, y: 60 },
  { code: "CO", x: 47, y: 64 },
  { code: "EC", x: 42, y: 72 },
  { code: "PE", x: 48, y: 82 },
  { code: "BO", x: 60, y: 92 },
  { code: "BR", x: 72, y: 82 },
  { code: "PY", x: 63, y: 102 },
  { code: "CL", x: 52, y: 116 },
  { code: "AR", x: 60, y: 116 },
  { code: "UY", x: 68, y: 110 },
];

// Silueta aproximada con curvas Bézier que siguen geografía real
const MAINLAND = `
  M 14 18
  C 22 11, 36 9, 42 16
  C 44 22, 42 26, 40 28
  C 36 32, 32 36, 30 40
  C 28 44, 30 50, 34 54
  C 38 58, 44 56, 48 60
  C 52 62, 58 60, 62 62
  C 70 64, 78 70, 84 78
  C 88 86, 88 96, 84 102
  C 80 108, 74 112, 70 116
  C 66 122, 64 128, 62 132
  C 60 136, 56 138, 54 134
  C 52 128, 52 120, 50 112
  C 48 102, 46 92, 44 84
  C 42 76, 40 70, 38 64
  C 36 58, 34 54, 32 50
  C 28 46, 24 40, 22 34
  C 18 28, 14 22, 14 18
  Z
`;

// Islas del Caribe (Cuba, Haití+RD)
const CUBA = "M 38 28 C 44 26, 50 28, 52 30 C 50 32, 44 32, 38 30 Z";
const HISPANIOLA = "M 52 34 C 58 34, 62 35, 62 37 C 60 38, 54 38, 52 36 Z";

export function LatamAbstractMap({ data }: { data: IndexedRegulation[] }) {
  const counts: Partial<Record<CountryCode, number>> = {};
  data.forEach((d) => {
    counts[d.country] = (counts[d.country] || 0) + 1;
  });

  // Contour lines: 18 líneas horizontales con curvas suaves
  const contourLines = Array.from({ length: 18 }, (_, i) => {
    const y = 8 + i * 7;
    const amp = 1.2 + (i % 4) * 0.5;
    return `M -2 ${y} Q 25 ${y - amp} 50 ${y} T 102 ${y + amp * 0.4}`;
  });

  return (
    <div className="relative w-full h-full" style={{ aspectRatio: "100 / 145" }}>
      <svg
        viewBox="0 0 100 145"
        className="absolute inset-0 w-full h-full"
        role="img"
        aria-label="Mapa abstracto de América Latina"
      >
        <defs>
          <clipPath id="latam-clip">
            <path d={MAINLAND} />
            <path d={CUBA} />
            <path d={HISPANIOLA} />
          </clipPath>
          <linearGradient id="latam-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(var(--accent))" stopOpacity="0.9" />
            <stop offset="60%" stopColor="rgb(var(--accent))" stopOpacity="0.65" />
            <stop offset="100%" stopColor="rgb(var(--accent))" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Líneas de fondo muy sutiles */}
        <g opacity="0.06">
          {contourLines.map((d, i) => (
            <path
              key={`bg-${i}`}
              d={d}
              fill="none"
              stroke="rgb(var(--fg))"
              strokeWidth={0.2}
            />
          ))}
        </g>

        {/* Contour lines clipeadas a la silueta */}
        <g clipPath="url(#latam-clip)">
          {contourLines.map((d, i) => (
            <path
              key={`fg-${i}`}
              d={d}
              fill="none"
              stroke="url(#latam-grad)"
              strokeWidth={0.7}
            />
          ))}
        </g>

        {/* Outline sutil del continente */}
        <g
          fill="none"
          stroke="rgb(var(--accent))"
          strokeWidth={0.35}
          opacity="0.4"
        >
          <path d={MAINLAND} />
          <path d={CUBA} />
          <path d={HISPANIOLA} />
        </g>

        {/* Hotspots clickeables */}
        {SPOTS.map((s) => {
          const n = counts[s.code] || 0;
          const meta = COUNTRIES[s.code];
          if (!meta) return null;
          return (
            <Link
              key={s.code}
              href={`/paises/${s.code.toLowerCase()}`}
              aria-label={`${meta.name}${n > 0 ? `: ${n} ficha${n === 1 ? "" : "s"}` : ": próximamente"}`}
            >
              <g className="group cursor-pointer">
                <circle
                  cx={s.x}
                  cy={s.y}
                  r={3}
                  fill="rgb(var(--accent))"
                  opacity="0"
                  className="transition-opacity group-hover:opacity-25"
                />
                <circle
                  cx={s.x}
                  cy={s.y}
                  r={n > 0 ? 1.4 : 0.9}
                  fill={n > 0 ? "rgb(var(--accent))" : "rgb(var(--fg-muted))"}
                  opacity={n > 0 ? 1 : 0.55}
                  className="transition-all group-hover:opacity-100"
                />
                <circle cx={s.x} cy={s.y} r={4} fill="transparent" />
                <text
                  x={s.x}
                  y={s.y - 3}
                  fontSize={2.6}
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
