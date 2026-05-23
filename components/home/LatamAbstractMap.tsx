import Link from "next/link";
import { COUNTRIES, type CountryCode } from "@/lib/taxonomy";
import type { IndexedRegulation } from "@/lib/index-types";

interface Spot {
  code: CountryCode;
  x: number;
  y: number;
}

// Posiciones aproximadas en el viewBox 0..100 x 0..140
const SPOTS: Spot[] = [
  { code: "MX", x: 22, y: 26 },
  { code: "GT", x: 28, y: 40 },
  { code: "SV", x: 28, y: 44 },
  { code: "HN", x: 30, y: 42 },
  { code: "NI", x: 33, y: 47 },
  { code: "CR", x: 33, y: 51 },
  { code: "PA", x: 38, y: 56 },
  { code: "CU", x: 39, y: 35 },
  { code: "HT", x: 46, y: 39 },
  { code: "DO", x: 49, y: 40 },
  { code: "VE", x: 52, y: 58 },
  { code: "CO", x: 44, y: 62 },
  { code: "EC", x: 41, y: 71 },
  { code: "PE", x: 47, y: 81 },
  { code: "BO", x: 58, y: 91 },
  { code: "BR", x: 70, y: 78 },
  { code: "PY", x: 62, y: 99 },
  { code: "CL", x: 51, y: 109 },
  { code: "AR", x: 60, y: 112 },
  { code: "UY", x: 67, y: 109 },
];

// Silueta aproximada LATAM (México hasta Tierra del Fuego + Caribe)
const SILHOUETTE = `
  M 16 16
  L 28 12
  L 36 22
  L 44 30
  L 48 36
  L 42 44
  L 40 48
  L 46 50
  L 52 54
  L 52 62
  L 60 56
  L 64 60
  L 62 68
  L 58 72
  L 60 78
  L 70 80
  L 80 78
  L 84 86
  L 80 96
  L 70 100
  L 64 108
  L 62 116
  L 58 122
  L 52 128
  L 48 130
  L 46 122
  L 48 114
  L 46 104
  L 48 96
  L 44 90
  L 40 82
  L 38 74
  L 34 66
  L 30 58
  L 26 48
  L 22 38
  Z
`;

export function LatamAbstractMap({ data }: { data: IndexedRegulation[] }) {
  const counts: Partial<Record<CountryCode, number>> = {};
  data.forEach((d) => {
    counts[d.country] = (counts[d.country] || 0) + 1;
  });

  // Contour lines: 24 líneas horizontales con curvas suaves
  const contourLines = Array.from({ length: 24 }, (_, i) => {
    const y = 12 + i * 5.2;
    const amp = 1.5 + (i % 3) * 0.8;
    return `M 0 ${y} Q 25 ${y - amp} 50 ${y} T 100 ${y + amp * 0.3}`;
  });

  return (
    <div className="relative w-full h-full" style={{ aspectRatio: "100 / 140" }}>
      <svg
        viewBox="0 0 100 140"
        className="absolute inset-0 w-full h-full"
        role="img"
        aria-label="Mapa abstracto de América Latina"
      >
        <defs>
          <clipPath id="latam-silhouette">
            <path d={SILHOUETTE} />
          </clipPath>
          <linearGradient id="latam-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(var(--accent))" stopOpacity="0.85" />
            <stop offset="60%" stopColor="rgb(var(--accent))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="rgb(var(--accent))" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {/* Líneas de fondo (sin clip) muy sutiles */}
        <g opacity="0.08">
          {contourLines.map((d, i) => (
            <path
              key={`bg-${i}`}
              d={d}
              fill="none"
              stroke="rgb(var(--fg))"
              strokeWidth={0.25}
            />
          ))}
        </g>

        {/* Contour lines clipeadas a la silueta de LATAM */}
        <g clipPath="url(#latam-silhouette)">
          {contourLines.map((d, i) => (
            <path
              key={`fg-${i}`}
              d={d}
              fill="none"
              stroke="url(#latam-fade)"
              strokeWidth={0.6}
            />
          ))}
        </g>

        {/* Outline sutil */}
        <path
          d={SILHOUETTE}
          fill="none"
          stroke="rgb(var(--accent))"
          strokeWidth={0.4}
          opacity="0.35"
        />

        {/* Hotspots clickeables por país */}
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
                {/* Halo en hover */}
                <circle
                  cx={s.x}
                  cy={s.y}
                  r={3}
                  fill="rgb(var(--accent))"
                  opacity="0"
                  className="transition-opacity group-hover:opacity-20"
                />
                {/* Dot principal */}
                <circle
                  cx={s.x}
                  cy={s.y}
                  r={n > 0 ? 1.3 : 0.8}
                  fill={n > 0 ? "rgb(var(--accent))" : "rgb(var(--fg-muted))"}
                  opacity={n > 0 ? 0.95 : 0.5}
                  className="transition-all group-hover:opacity-100"
                />
                {/* Hit area amplia invisible */}
                <circle
                  cx={s.x}
                  cy={s.y}
                  r={4}
                  fill="transparent"
                />
                {/* Label en hover */}
                <text
                  x={s.x}
                  y={s.y - 3}
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
