import type { Metadata } from "next";
import { getIndex } from "@/lib/index";
import { Dashboard } from "@/components/dashboard/Dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Panel analítico de la regulación tecnológica LATAM: distribución por área, estado, año y mapa de calor país × área.",
};

export default async function DashboardPage() {
  const data = await getIndex();
  return (
    <div className="container py-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
          Dashboard
        </h1>
        <p className="mt-2 text-fg-muted max-w-2xl">
          Visión panorámica del estado regulatorio en América Latina, con datos
          actualizados al cierre editorial vigente.
        </p>
      </header>
      <Dashboard data={data} />
    </div>
  );
}
