import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  GitCompareArrows,
  MapPinned,
  Hash,
  PieChart,
  ScanSearch,
  Package,
} from "lucide-react";
import { getIndex } from "@/lib/index";
import { loadRegulations } from "@/lib/content";
import { AREAS, COUNTRIES, type Area, type CountryCode } from "@/lib/taxonomy";
import { Sparkle } from "@/components/home/Sparkle";
import { TrackerCard } from "@/components/home/TrackerCard";
import { ShipmentRow } from "@/components/home/ShipmentRow";
import { areaColor } from "@/components/ui/AreaChip";

const QUICK_ACTIONS = [
  {
    href: "/regulaciones",
    label: "Catálogo",
    desc: "80 normas",
    icon: BookOpen,
    tone: "var(--accent)",
    bg: "bg-accent-soft",
    text: "text-accent",
  },
  {
    href: "/paises",
    label: "Países",
    desc: "11 jurisdicciones",
    icon: MapPinned,
    tone: "#ea580c",
    bg: "bg-orange-100 dark:bg-orange-950/40",
    text: "text-orange-600 dark:text-orange-400",
  },
  {
    href: "/comparar",
    label: "Comparar",
    desc: "hasta 4 lado a lado",
    icon: GitCompareArrows,
    tone: "#7c3aed",
    bg: "bg-violet-100 dark:bg-violet-950/40",
    text: "text-violet-600 dark:text-violet-400",
  },
  {
    href: "/dashboard",
    label: "Dashboard",
    desc: "vista panorámica",
    icon: PieChart,
    tone: "#16a34a",
    bg: "bg-green-100 dark:bg-green-950/40",
    text: "text-green-600 dark:text-green-400",
  },
];

export default async function HomePage() {
  const data = await getIndex();
  const allRegs = await loadRegulations();
  const countriesCount = new Set(data.map((d) => d.country)).size;

  const currentShipment = [...data]
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
    .find((r) => r.hasCriticalAnalysis)!;
  const currentReg = allRegs.find((r) => r.id === currentShipment.id)!;

  const recentShipments = [...data]
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
    .slice(0, 5);

  const annotated = data.filter((d) => d.hasCriticalAnalysis).slice(0, 3);

  const byCountry = (Object.keys(COUNTRIES) as CountryCode[])
    .map((c) => ({
      code: c,
      ...COUNTRIES[c],
      count: data.filter((d) => d.country === c).length,
    }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <div className="px-4 sm:px-8 lg:px-10 py-6 sm:py-8 max-w-[1200px] mx-auto">
      {/* HERO teal block */}
      <section className="relative overflow-hidden rounded-3xl bg-accent text-accent-fg p-8 sm:p-12 lg:p-16 mb-10">
        {/* sparkles deco */}
        <Sparkle className="absolute top-8 right-[18%] text-white/50" size={18} />
        <Sparkle className="absolute top-24 right-[38%] text-white/30" size={28} />
        <Sparkle className="absolute bottom-12 left-[42%] text-white/40" size={14} />
        <Sparkle className="absolute bottom-32 right-[8%] text-white/35" size={22} />
        <div
          aria-hidden
          className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/8 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-white/5 blur-3xl"
        />

        <div className="relative max-w-2xl">
          <div className="flex items-center gap-3 mb-8">
            <span className="display-italic text-3xl">Policy.lat</span>
            <Package
              className="h-7 w-7 text-white/90"
              strokeWidth={2.2}
            />
          </div>

          <h1 className="display-italic text-5xl sm:text-6xl lg:text-[5.5rem] leading-[0.9] text-balance">
            LATAM Tech Policy
            <br />
            Tracker
          </h1>

          <ul className="mt-8 space-y-2.5 text-base sm:text-lg">
            {[
              `${data.length} normas y proyectos curados`,
              `${countriesCount} jurisdicciones de América Latina`,
              "Comparador, mapa, dashboard y citas APA/BibTeX",
            ].map((line) => (
              <li key={line} className="flex items-center gap-3">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12l5 5 9-11"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/regulaciones"
              className="btn-pill bg-white text-accent hover:bg-white/95"
            >
              Abrir catálogo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/comparar"
              className="btn-pill border-2 border-white/40 text-white hover:bg-white/10"
            >
              <GitCompareArrows className="h-4 w-4" />
              Comparar normas
            </Link>
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="mb-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((q) => {
            const Icon = q.icon;
            return (
              <Link
                key={q.href}
                href={q.href}
                className="group flex flex-col items-center text-center rounded-2xl bg-bg-elevated border border-border p-5 hover:border-accent/50 hover:shadow-soft transition-all"
              >
                <span
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${q.bg} ${q.text} mb-3 transition-transform group-hover:scale-110`}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.2} />
                </span>
                <p className="font-semibold text-fg text-sm">{q.label}</p>
                <p className="text-[0.7rem] text-fg-muted mt-0.5">{q.desc}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CURRENT SHIPMENT */}
      <section className="mb-10">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-lg font-bold tracking-tight">
            En tramitación destacada
          </h2>
          <Link
            href="/regulaciones?status=proyecto-en-discusion,aprobado-pendiente-promulgacion,vigencia-diferida"
            className="text-xs text-accent hover:underline font-semibold"
          >
            Ver todas →
          </Link>
        </div>
        <TrackerCard
          reg={currentShipment}
          publicationDate={currentReg.publicationDate}
          effectiveDate={currentReg.effectiveDate}
          authority={currentReg.enforcingAuthority?.[0]}
        />
      </section>

      {/* ANNOTATED (3 trackers) */}
      {annotated.length > 1 && (
        <section className="mb-10">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-lg font-bold tracking-tight">
              Fichas con análisis crítico
            </h2>
            <Link
              href="/regulaciones?analysis=1"
              className="text-xs text-accent hover:underline font-semibold"
            >
              Ver todas →
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {annotated.map((r) => {
              const full = allRegs.find((x) => x.id === r.id)!;
              return (
                <TrackerCard
                  key={r.id}
                  reg={r}
                  publicationDate={full.publicationDate}
                  effectiveDate={full.effectiveDate}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* RECENT (shipment list) */}
      <section className="mb-10">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-lg font-bold tracking-tight">
            Últimas publicadas
          </h2>
          <Link
            href="/regulaciones"
            className="text-xs text-accent hover:underline font-semibold"
          >
            Catálogo completo →
          </Link>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {recentShipments.map((r) => (
            <ShipmentRow key={r.id} reg={r} />
          ))}
        </div>
      </section>

      {/* AREAS / COUNTRIES strip */}
      <section className="grid lg:grid-cols-2 gap-3 mb-10">
        <div className="rounded-2xl bg-bg-elevated border border-border p-6">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-base font-bold tracking-tight">Áreas</h2>
            <Link href="/areas" className="text-xs text-accent hover:underline font-semibold">
              Ver todas →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(AREAS) as Area[]).map((a) => {
              const count = data.filter((d) => d.areas.includes(a)).length;
              const color = areaColor(a);
              return (
                <Link
                  key={a}
                  href={`/areas/${a}`}
                  className="group flex items-center gap-2.5 rounded-xl bg-bg-sunken/60 p-2.5 hover:bg-bg-sunken transition-colors"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ background: `rgb(${color})` }}
                  />
                  <span className="flex-1 text-xs font-medium text-fg group-hover:text-accent transition-colors truncate">
                    {AREAS[a].name}
                  </span>
                  <span className="text-[0.65rem] text-fg-muted tabular-nums">
                    {count}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl bg-bg-elevated border border-border p-6">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-base font-bold tracking-tight">Países</h2>
            <Link href="/paises" className="text-xs text-accent hover:underline font-semibold">
              Ver todos →
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {byCountry.map((c) => (
              <Link
                key={c.code}
                href={`/paises/${c.code.toLowerCase()}`}
                className="inline-flex items-baseline gap-1.5 rounded-full border border-border bg-bg-sunken/60 px-3 py-1 text-xs hover:border-accent/50 hover:text-accent transition-colors"
              >
                <span className="text-sm leading-none">{c.flag}</span>
                <span>{c.name}</span>
                <span className="text-fg-muted tabular-nums">{c.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-bg-elevated border border-border p-8 text-center">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-accent-soft text-accent mb-3">
          <ScanSearch className="h-5 w-5" />
        </div>
        <h3 className="display-italic text-2xl mb-2">¿Buscas una norma específica?</h3>
        <p className="text-fg-muted max-w-md mx-auto mb-5 text-sm">
          Usa el buscador con ⌘K o navega el catálogo completo por filtros de país,
          área, estado y tipo normativo.
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <Link href="/regulaciones" className="btn-pill bg-accent text-accent-fg hover:bg-accent/90">
            Catálogo
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/tags" className="btn-pill bg-bg-sunken text-fg hover:bg-border/60">
            <Hash className="h-4 w-4" /> Tags
          </Link>
        </div>
      </section>
    </div>
  );
}
