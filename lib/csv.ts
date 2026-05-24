import type { IndexedRegulation } from "@/lib/index-types";
import { AREAS, COUNTRIES, NORM_TYPES, STATUSES } from "@/lib/taxonomy";

const CSV_HEADERS = [
  "id",
  "shortTitle",
  "officialTitle",
  "country",
  "countryName",
  "areas",
  "status",
  "normType",
  "year",
  "publicationDate",
  "enforcingAuthority",
  "tags",
  "url",
];

function escape(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

// Trim whitespace and any trailing slash so the env var (which may have a
// trailing space) doesn't break the exported URLs.
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://policytracker.lat")
  .trim()
  .replace(/\/+$/, "");

export function toCSV(rows: IndexedRegulation[]): string {
  const lines = [CSV_HEADERS.join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.id,
        r.shortTitle,
        r.officialTitle,
        r.country,
        r.countryName,
        r.areas.map((a) => AREAS[a].name).join("; "),
        STATUSES[r.status].label,
        NORM_TYPES[r.normType],
        r.year?.toString() ?? "",
        r.publicationDate ?? "",
        (r.enforcingAuthority ?? []).join("; "),
        r.tags.join("; "),
        `${SITE}/regulaciones/${r.slug}`,
      ]
        .map((v) => escape(String(v ?? "")))
        .join(","),
    );
  }
  return lines.join("\n");
}
