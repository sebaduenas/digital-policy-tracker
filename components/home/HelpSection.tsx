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
    tone: "#4F5DE7",
    bg: "bg-indigo-50",
  },
  {
    href: "/comparar",
    title: "Comparador lado a lado",
    desc: "Selecciona hasta 4 normas y visualízalas en columnas alineadas.",
    icon: GitCompareArrows,
    tone: "#16A34A",
    bg: "bg-emerald-50",
  },
  {
    href: "/dashboard",
    title: "Dashboard analítico",
    desc: "KPIs, heatmap país × área, treemap, timeline y mapa térmico.",
    icon: PieChart,
    tone: "#EA580C",
    bg: "bg-orange-50",
  },
  {
    href: "/paises",
    title: "Vista por jurisdicción",
    desc: "Cada país con sus normas, autoridades de aplicación y fuentes oficiales.",
    icon: Map,
    tone: "#0891B2",
    bg: "bg-cyan-50",
  },
  {
    href: "/areas",
    title: "10 áreas curadas",
    desc: "IA, datos personales, ciberseguridad, plataformas, fintech y más.",
    icon: Hash,
    tone: "#7C3AED",
    bg: "bg-violet-50",
  },
  {
    href: "/metodologia",
    title: "Cita académica",
    desc: "APA, BibTeX, RIS y página de metodología con criterios editoriales.",
    icon: Quote,
    tone: "#DB2777",
    bg: "bg-pink-50",
  },
];

export function HelpSection() {
  return (
    <section className="bg-nav-bg text-nav-fg py-20">
      <div className="container-app">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Cómo te ayudamos
          </h2>
          <div className="mx-auto mt-3 h-0.5 w-12 bg-accent" />
          <p className="mt-4 text-nav-fg-muted max-w-2xl mx-auto">
            Una plataforma curada para investigación académica, asesoría legal,
            policy making y periodismo regulatorio.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <Link
                key={f.href}
                href={f.href}
                className="group rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 p-6 transition-all"
              >
                <div className="flex items-start gap-4">
                  <span
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: `${f.tone}25`,
                      color: f.tone,
                    }}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2.2} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-nav-fg">{f.title}</h3>
                      <ArrowUpRight className="h-4 w-4 text-nav-fg-muted group-hover:text-nav-fg shrink-0 transition-colors" />
                    </div>
                    <p className="mt-1.5 text-sm text-nav-fg-muted leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
