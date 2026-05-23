import Link from "next/link";
import {
  Search,
  GitCompareArrows,
  Map,
  Quote,
  Hash,
  PieChart,
  ArrowUpRight,
} from "lucide-react";

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
    href: "/dashboard",
    title: "Dashboard analítico",
    desc: "KPIs, heatmap país × área, distribución por materia y línea temporal.",
    icon: PieChart,
  },
  {
    href: "/paises",
    title: "Vista por jurisdicción",
    desc: "Cada país con sus normas, autoridades de aplicación y fuentes oficiales.",
    icon: Map,
  },
  {
    href: "/areas",
    title: "10 áreas curadas",
    desc: "IA, datos personales, ciberseguridad, plataformas, fintech y más.",
    icon: Hash,
  },
  {
    href: "/metodologia",
    title: "Cita académica",
    desc: "APA, BibTeX, RIS y página de metodología con criterios editoriales.",
    icon: Quote,
  },
];

export function HelpSection() {
  return (
    <section className="border-b border-border">
      <div className="container-app py-16">
        <div className="mb-10">
          <span className="eyebrow">Qué encuentras aquí</span>
          <h2
            className="display-tight text-2xl sm:text-3xl mt-2"
            style={{ color: "rgb(var(--navy))" }}
          >
            Cómo te ayuda el tracker
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 -mb-px">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <Link
                key={f.href}
                href={f.href}
                className="group flex items-start gap-4 p-6 border-t border-l border-border hover:bg-bg-sunken transition-colors"
                style={{
                  borderRightWidth: (i + 1) % 3 === 0 ? 0 : 1,
                  borderRightColor: "rgb(var(--border))",
                }}
              >
                <span
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center text-white"
                  style={{
                    background: "rgb(var(--navy))",
                    borderRadius: 2,
                  }}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className="font-medium text-base leading-snug"
                      style={{ color: "rgb(var(--navy))" }}
                    >
                      {f.title}
                    </h3>
                    <ArrowUpRight className="h-4 w-4 text-fg-muted group-hover:text-fg shrink-0 transition-colors" />
                  </div>
                  <p className="mt-1.5 text-sm text-fg-muted leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="border-b border-r border-l border-border" />
      </div>
    </section>
  );
}
