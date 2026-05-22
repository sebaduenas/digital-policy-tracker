import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Digital Policy Tracker LATAM";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 64,
          background: "linear-gradient(135deg, #FAFAF9 0%, #E0E7FF 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 18,
            color: "#1E40AF",
            fontWeight: 500,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          <span style={{ width: 8, height: 8, background: "#1E40AF", borderRadius: 9999 }} />
          Curaduría académica
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 78,
            fontWeight: 600,
            lineHeight: 1.05,
            color: "#18181B",
            maxWidth: 1000,
            letterSpacing: -1,
          }}
        >
          El mapa regulatorio de la tecnología en América Latina.
        </div>
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            color: "#52525B",
            fontSize: 22,
          }}
        >
          <div style={{ fontWeight: 600, color: "#18181B" }}>
            Digital Policy Tracker LATAM
          </div>
          <div>policytracker.lat</div>
        </div>
      </div>
    ),
    size,
  );
}
