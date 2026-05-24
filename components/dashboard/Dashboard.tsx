"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from "recharts";
import Link from "next/link";
import type { IndexedRegulation } from "@/lib/index-types";
import {
  AREAS,
  COUNTRIES,
  STATUSES,
  type Area,
  type CountryCode,
  type Status,
} from "@/lib/taxonomy";
import { areaColor } from "@/components/ui/AreaChip";
import { statusColor } from "@/components/ui/StatusBadge";

export function Dashboard({ data }: { data: IndexedRegulation[] }) {
  const total = data.length;
  const countries = new Set(data.map((d) => d.country)).size;
  const inForce = data.filter((d) => d.status === "vigente").length;
  const projects = data.filter((d) =>
    d.status.startsWith("proyecto"),
  ).length;

  const byArea = (Object.keys(AREAS) as Area[]).map((a) => ({
    name: AREAS[a].short,
    fullName: AREAS[a].name,
    slug: a,
    size: data.filter((d) => d.areas.includes(a)).length,
    fill: `rgb(${areaColor(a)})`,
  }));

  const countriesWithFichas = (Object.keys(COUNTRIES) as CountryCode[])
    .map((c) => ({
      code: c,
      ...COUNTRIES[c],
      count: data.filter((d) => d.country === c).length,
    }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);

  const byCountryByStatus = countriesWithFichas.map((c) => {
    const obj: Record<string, string | number> = {
      country: c.name,
      flag: c.flag,
    };
    (Object.keys(STATUSES) as Status[]).forEach((s) => {
      obj[s] = data.filter((d) => d.country === c.code && d.status === s).length;
    });
    return obj;
  });

  const byYear = (() => {
    const byYr: Record<number, number> = {};
    data.forEach((d) => {
      if (d.year) byYr[d.year] = (byYr[d.year] || 0) + 1;
    });
    const years = Object.keys(byYr).map(Number).sort();
    if (!years.length) return [];
    const min = Math.min(...years);
    const max = Math.max(...years);
    const series: { year: number; count: number; cumulative: number }[] = [];
    let cum = 0;
    for (let y = min; y <= max; y++) {
      const c = byYr[y] || 0;
      cum += c;
      series.push({ year: y, count: c, cumulative: cum });
    }
    return series;
  })();

  return (
    <div className="space-y-8">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi value={total} label="Regulaciones" />
        <Kpi value={countries} label="Países cubiertos" />
        <Kpi
          value={inForce}
          label="Vigentes"
          accentColor={`rgb(${statusColor("vigente")})`}
        />
        <Kpi
          value={projects}
          label="Proyectos en discusión"
          accentColor={`rgb(${statusColor("proyecto-en-discusion")})`}
        />
      </div>

      {/* Country counts */}
      <Section title="Número de regulaciones por país">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {countriesWithFichas.map((c) => {
            return (
              <Link
                key={c.code}
                href={`/paises/${c.code.toLowerCase()}`}
                className="group rounded-lg border border-border p-3 hover:border-accent/60 transition-all"
                style={{ background: "rgb(var(--accent) / 0.08)" }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl">{c.flag}</span>
                  <span className="text-2xl font-display font-semibold text-accent">
                    {c.count}
                  </span>
                </div>
                <p className="text-xs text-fg-muted truncate group-hover:text-fg transition-colors">
                  {c.name}
                </p>
              </Link>
            );
          })}
        </div>
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section
          title="Distribución por área"
          subtitle="Fichas por materia, ordenadas de mayor a menor"
        >
          <div className="space-y-2.5">
            {(() => {
              const sorted = [...byArea]
                .filter((a) => a.size > 0)
                .sort((a, b) => b.size - a.size);
              const max = Math.max(1, ...sorted.map((a) => a.size));
              return sorted.map((a) => {
                const pct = (a.size / max) * 100;
                return (
                  <div
                    key={a.slug}
                    className="grid grid-cols-[minmax(0,11rem)_1fr_2.5rem] items-center gap-3"
                  >
                    <Link
                      href={`/areas/${a.slug}`}
                      className="text-xs text-fg-muted hover:text-fg text-right leading-tight"
                      title={a.fullName}
                    >
                      {a.fullName}
                    </Link>
                    <div className="relative h-5 rounded-md bg-bg-sunken overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 rounded-md transition-all"
                        style={{
                          width: `${pct}%`,
                          background: "rgb(var(--accent))",
                          opacity: 0.4 + (pct / 100) * 0.6,
                        }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-fg tabular-nums text-right">
                      {a.size}
                    </span>
                  </div>
                );
              });
            })()}
          </div>
        </Section>

        <Section
          title="Estado por país"
          subtitle="Distribución de regulaciones según vigencia y trámite"
        >
          <div className="flex-1 min-h-[18rem]">
            <ResponsiveContainer>
              <BarChart
                data={byCountryByStatus}
                margin={{ top: 8, right: 8, bottom: 8, left: 12 }}
              >
                <CartesianGrid strokeDasharray="2 4" stroke="rgb(var(--border))" vertical={false} />
                <XAxis
                  dataKey="country"
                  tick={{ fill: "rgb(var(--fg-muted))", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  angle={-90}
                  height={110}
                  textAnchor="end"
                />
                <YAxis
                  tick={{ fill: "rgb(var(--fg-muted))", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<ChartTooltip />} />
                {(Object.keys(STATUSES) as Status[]).map((s) => (
                  <Bar
                    key={s}
                    dataKey={s}
                    name={STATUSES[s].label}
                    stackId="status"
                    fill={`rgb(${STATUSES[s].color})`}
                    radius={0}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>
      </div>

      <Section
        title="Heatmap país × área"
        subtitle="Densidad de regulaciones cruzando jurisdicción y materia"
      >
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left p-2 text-fg-muted font-medium sticky left-0 bg-bg-elevated/60 z-10">
                  País
                </th>
                {(Object.keys(AREAS) as Area[]).map((a) => (
                  <th
                    key={a}
                    className="p-2 text-fg-muted font-medium text-center whitespace-nowrap"
                    title={AREAS[a].name}
                  >
                    {AREAS[a].short}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {countriesWithFichas.map((c) => (
                <tr key={c.code} className="border-t border-border">
                  <td className="p-2 whitespace-nowrap sticky left-0 bg-bg-elevated/60">
                    <Link
                      href={`/paises/${c.code.toLowerCase()}`}
                      className="hover:text-accent"
                    >
                      {c.flag} {c.name}
                    </Link>
                  </td>
                  {(Object.keys(AREAS) as Area[]).map((a) => {
                    const n = data.filter(
                      (d) => d.country === c.code && d.areas.includes(a),
                    ).length;
                    if (n === 0)
                      return (
                        <td
                          key={a}
                          className="p-2 text-center text-fg-muted/30"
                        >
                          ·
                        </td>
                      );
                    const intensity = Math.min(1, 0.25 + n * 0.18);
                    return (
                      <td key={a} className="p-1.5 text-center">
                        <Link
                          href={`/regulaciones?country=${c.code}&area=${a}`}
                          className="inline-flex items-center justify-center w-7 h-7 rounded font-medium hover:scale-110 transition-transform"
                          style={{
                            background: `rgb(var(--accent) / ${intensity})`,
                            color: intensity > 0.55 ? "white" : "rgb(var(--accent-deep))",
                          }}
                        >
                          {n}
                        </Link>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        title="Línea temporal"
        subtitle="Publicación de normativa por año (acumulada)"
      >
        <div className="h-64">
          <ResponsiveContainer>
            <LineChart data={byYear} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="rgb(var(--border))" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fill: "rgb(var(--fg-muted))", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "rgb(var(--fg-muted))", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Line
                type="monotone"
                dataKey="count"
                name="Publicadas en el año"
                stroke="rgb(var(--accent))"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="cumulative"
                name="Acumulado"
                stroke="rgb(var(--fg-muted))"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Section>
    </div>
  );
}

function Kpi({
  value,
  label,
  accentColor,
}: {
  value: number | string;
  label: string;
  accentColor?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-bg-elevated p-5">
      <p className="font-display text-3xl font-semibold" style={{ color: accentColor }}>
        {value}
      </p>
      <p className="text-xs text-fg-muted uppercase tracking-wider mt-1">{label}</p>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col rounded-xl border border-border bg-bg-elevated/40 p-5">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      {subtitle && <p className="text-xs text-fg-muted mt-0.5 mb-4">{subtitle}</p>}
      {children}
    </section>
  );
}


function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-bg-elevated p-2.5 shadow-md text-xs">
      <p className="font-medium mb-1">{label}</p>
      {payload
        .filter((p: any) => p.value > 0)
        .map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-sm"
              style={{ background: p.color || p.fill }}
            />
            <span className="text-fg-muted">{p.name}</span>
            <span className="ml-auto font-medium">{p.value}</span>
          </div>
        ))}
    </div>
  );
}
