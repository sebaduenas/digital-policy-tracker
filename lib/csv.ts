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
  "officialTextSource",
  "officialTextBytes",
  "officialText",
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

export interface CsvOptions {
  // CSV con texto crudo crece mucho. Permitimos omitirlo (descarga ligera).
  includeOfficialText?: boolean;
}

export function toCSV(
  rows: IndexedRegulation[],
  options: CsvOptions = {},
): string {
  const { includeOfficialText = true } = options;
  const headers = includeOfficialText
    ? CSV_HEADERS
    : CSV_HEADERS.filter((h) => h !== "officialText");
  const lines = [headers.join(",")];
  for (const r of rows) {
    const row = [
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
      r.officialTextSource ?? "",
      r.officialTextBytes?.toString() ?? "",
    ];
    if (includeOfficialText) row.push(r.officialText ?? "");
    lines.push(row.map((v) => escape(String(v ?? ""))).join(","));
  }
  return lines.join("\n");
}
