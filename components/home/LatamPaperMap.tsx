import Link from "next/link";
import { COUNTRIES, type CountryCode } from "@/lib/taxonomy";
import type { IndexedRegulation } from "@/lib/index-types";

interface Spot {
  code: CountryCode;
  x: number;
  y: number;
}

// Geographic positions roughly mapping to LATAM (svg viewBox 0..100 x 0..140)
const SPOTS: Spot[] = [
  { code: "MX", x: 22, y: 26 },
  { code: "GT", x: 28, y: 40 },
  { code: "SV", x: 28, y: 44 },
  { code: "CR", x: 33, y: 51 },
  { code: "PA", x: 38, y: 56 },
  { code: "DO", x: 47, y: 41 },
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

export function LatamPaperMap({
  data,
  highlight,
}: {
  data: IndexedRegulation[];
  highlight?: CountryCode[];
}) {
  const counts: Partial<Record<CountryCode, number>> = {};
  data.forEach((d) => {
    counts[d.country] = (counts[d.country] || 0) + 1;
  });
  const max = Math.max(1, ...Object.values(counts) as number[]);

  return (
    <div className="relative w-full" style={{ aspectRatio: "100 / 140" }}>
      <svg
        viewBox="0 0 100 140"
        className="absolute inset-0 w-full h-full"
        role="img"
        aria-label="Mapa de América Latina con fichas por país"
      >
        {/* paper continent silhouette */}
        <path
          d="M22 18 L34 14 L46 24 L48 34 L42 44 L40 50 L48 50 L52 56 L52 64 L60 56 L66 60 L62 68 L58 72 L60 78 L72 80 L82 78 L86 86 L82 96 L72 100 L66 108 L62 116 L58 122 L52 128 L48 130 L46 122 L48 114 L46 104 L48 96 L44 90 L40 82 L38 74 L34 66 L30 58 L26 48 L22 38 Z"
          fill="rgb(var(--accent) / 0.06)"
          stroke="rgb(var(--accent) / 0.25)"
          strokeWidth="0.4"
          strokeLinejoin="round"
        />

        {SPOTS.map((s) => {
          const n = counts[s.code] || 0;
          if (n === 0)
            return (
              <circle
                key={s.code}
                cx={s.x}
                cy={s.y}
                r={0.8}
                fill="rgb(var(--fg-muted) / 0.35)"
              />
            );
          const intensity = n / max;
          const r = 1.4 + intensity * 3;
          return (
            <a
              key={s.code}
              href={`/paises/${s.code.toLowerCase()}`}
              aria-label={`${COUNTRIES[s.code].name}: ${n} ficha${n === 1 ? "" : "s"}`}
            >
              <circle
                cx={s.x}
                cy={s.y}
                r={r + 1}
                fill="rgb(var(--accent) / 0.12)"
                className="transition-all"
              />
              <circle
                cx={s.x}
                cy={s.y}
                r={r}
                fill="rgb(var(--accent))"
                className="transition-all"
              />
              <text
                x={s.x}
                y={s.y + r + 3.5}
                fontSize="2.5"
                textAnchor="middle"
                fill="rgb(var(--fg))"
                opacity={intensity > 0.15 ? 1 : 0.6}
                className="font-medium pointer-events-none"
              >
                {COUNTRIES[s.code].name}
              </text>
              <text
                x={s.x}
                y={s.y + 0.8}
                fontSize="2.2"
                textAnchor="middle"
                fill="rgb(var(--accent-fg))"
                className="font-medium pointer-events-none"
              >
                {n}
              </text>
            </a>
          );
        })}
      </svg>
    </div>
  );
}
