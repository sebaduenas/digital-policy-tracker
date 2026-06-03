import { loadRegulations } from "@/lib/content";
import { COUNTRIES } from "@/lib/taxonomy";
import type { IndexedRegulation } from "@/lib/index-types";

export async function getIndex(): Promise<IndexedRegulation[]> {
  const all = await loadRegulations();
  return all.map((r) => ({
    id: r.id,
    slug: r.slug,
    shortTitle: r.shortTitle,
    officialTitle: r.officialTitle,
    aliases: r.aliases ?? [],
    citation: r.citation,
    country: r.country as IndexedRegulation["country"],
    countryName: COUNTRIES[r.country as keyof typeof COUNTRIES]?.name ?? r.country,
    countryFlag: COUNTRIES[r.country as keyof typeof COUNTRIES]?.flag ?? "🏳️",
    areas: r.areas as IndexedRegulation["areas"],
    status: r.status as IndexedRegulation["status"],
    normType: r.normType as IndexedRegulation["normType"],
    publicationDate: r.publicationDate,
    year: r.publicationDate
      ? parseInt(r.publicationDate.slice(0, 4), 10)
      : r.introductionDate
        ? parseInt(r.introductionDate.slice(0, 4), 10)
        : undefined,
    enforcingAuthority: r.enforcingAuthority,
    tags: r.tags ?? [],
    summary: r.summary,
    hasCriticalAnalysis: r.hasCriticalAnalysis ?? false,
    confidenceLevel: r.confidenceLevel ?? "medio",
    officialUrl: r.officialUrl,
    hasOfficialText: !!r.officialTextMeta,
    officialTextSource: r.officialTextMeta?.source,
    officialTextBytes: r.officialTextMeta?.bytes,
  }));
}
