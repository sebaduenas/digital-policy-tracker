import Link from "next/link";
import { Search, GitCompareArrows, Map, Layers } from "lucide-react";

const FEATURES = [
  {
    href: "/regulaciones",
    title: "Catálogo filtrable",
    desc: "Filtra por país, área, estado, tipo normativo y búsqueda fuzzy.",
    icon: Search,
  },
  {
    href: "/comparar",
    title: "Comparador lado a lado",
    desc: "Selecciona hasta 4 normas y visualízalas en columnas alineadas.",
    icon: GitCompareArrows,
  },
  {
    href: "/paises",
    title: "Vista por jurisdicción",
    desc: "Cada país con sus normas, autoridades de aplicación y fuentes oficiales.",
    icon: Map,
  },
  {
    href: "/areas",
    title: "10 materias curadas",
    desc: "IA, datos personales, ciberseguridad, plataformas, fintech y más.",
    icon: Layers,
  },
];

export function HelpSection() {
  return (
    <section className="border-b border-border">
      <div className="container-app py-20">
        <div className="max-w-2xl mb-12">
          <h2 className="display-tight text-[2.5rem] sm:text-[3rem] leading-[1.05]">
            Una plataforma para{" "}
            <span style={{ color: "rgb(var(--accent))" }}>
              toda la regulación
            </span>
            .
          </h2>
          <p className="mt-4 text-lg text-fg-muted max-w-xl">
            Diseñada para investigadores, abogados, policy makers y periodistas
            que necesitan referencias verificables y comparadas.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => {
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
