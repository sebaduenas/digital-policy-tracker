import type { IndexedRegulation } from "@/lib/index-types";
import { AREAS, COUNTRIES, NORM_TYPES, STATUSES } from "@/lib/taxonomy";

const BASE_HEADERS = [
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

/**
 * Build a CSV of the catalog. When provided, `textsBySlug` is a map of
 * slug -> raw official text; the result will include an `officialText`
 * column with that text inlined per row. Without it, the CSV remains light
 * and is suitable for client-side generation.
 */
export function toCSV(
  rows: IndexedRegulation[],
  textsBySlug?: Map<string, string>,
): string {
  const headers = textsBySlug ? [...BASE_HEADERS, "officialText"] : BASE_HEADERS;
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
    if (textsBySlug) row.push(textsBySlug.get(r.slug) ?? "");
    lines.push(row.map((v) => escape(String(v ?? ""))).join(","));
  }
  return lines.join("\n");
}
