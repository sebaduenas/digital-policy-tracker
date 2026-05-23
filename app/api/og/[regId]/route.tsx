import { ImageResponse } from "next/og";
import { getRegulationById } from "@/lib/content";
import {
  AREAS,
  COUNTRIES,
  STATUSES,
  type Area,
  type CountryCode,
  type Status,
} from "@/lib/taxonomy";

export const runtime = "nodejs";

const AREA_COLORS: Record<Area, string> = {
  ia: "#7C3AED",
  pdp: "#2563EB",
  ciberseguridad: "#DC2626",
  "propiedad-intelectual": "#EA580C",
  plataformas: "#0891B2",
  fintech: "#16A34A",
  telecom: "#CA8A04",
  soberania: "#9333EA",
  "identidad-digital": "#0D9488",
  "menores-online": "#DB2777",
};

const STATUS_COLORS: Record<Status, string> = {
  vigente: "#16A34A",
  "vigencia-diferida": "#CA8A04",
  "proyecto-en-discusion": "#2563EB",
  "aprobado-pendiente-promulgacion": "#06B6D4",
  derogado: "#71717A",
  "veto-pendiente": "#DC2626",
  "reglamento-pendiente": "#EA580C",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ regId: string }> },
) {
  const { regId } = await params;
  const reg = await getRegulationById(regId);
  if (!reg) {
    return new Response("Not found", { status: 404 });
  }
  const country = COUNTRIES[reg.country as CountryCode];
  const primaryArea = (reg.areas as Area[])[0];
  const areaColor = AREA_COLORS[primaryArea] ?? "#1E40AF";
  const statusColor = STATUS_COLORS[reg.status as Status] ?? "#1E40AF";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 64,
          background:
            "linear-gradient(135deg, #FAFAF9 0%, #EEEEF2 50%, #E0E7FF 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: 8,
            width: "100%",
            background: areaColor,
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 22,
            color: "#52525B",
          }}
        >
          <span style={{ fontSize: 48 }}>{country?.flag}</span>
          <span style={{ fontWeight: 500 }}>{country?.name}</span>
          <span
            style={{
              padding: "4px 12px",
              borderRadius: 999,
              background: statusColor,
              color: "white",
              fontSize: 14,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {STATUSES[reg.status as Status]?.label}
          </span>
          <span
            style={{
              padding: "4px 12px",
              borderRadius: 999,
              border: `2px solid ${areaColor}`,
              color: areaColor,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {AREAS[primaryArea]?.name}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 64,
            fontWeight: 600,
            lineHeight: 1.05,
            color: "#18181B",
            letterSpacing: -1.5,
          }}
        >
          {reg.shortTitle.slice(0, 110)}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 16,
            fontSize: 22,
            lineHeight: 1.35,
            color: "#52525B",
          }}
        >
          {reg.summary.slice(0, 220)}
          {reg.summary.length > 220 ? "…" : ""}
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            color: "#52525B",
            fontSize: 18,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontWeight: 600, color: "#18181B", fontSize: 22 }}>
              Digital Policy Tracker LATAM
            </div>
            <div style={{ fontSize: 16, marginTop: 4 }}>{reg.citation}</div>
          </div>
          <div>policytracker.lat</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
