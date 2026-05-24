import type { MetadataRoute } from "next";
import { loadRegulations } from "@/lib/content";
import { getIndex } from "@/lib/index";
import { AREAS, COUNTRIES } from "@/lib/taxonomy";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://policytracker.lat")
  .trim()
  .replace(/\/+$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [regs, idx] = await Promise.all([loadRegulations(), getIndex()]);
  const now = new Date();
  const tagSet = new Set<string>();
  idx.forEach((i) => i.tags.forEach((t) => tagSet.add(t)));
  const base: MetadataRoute.Sitemap = [
    { url: SITE, lastModified: now, priority: 1 },
    { url: `${SITE}/regulaciones`, lastModified: now, priority: 0.9 },
    { url: `${SITE}/paises`, lastModified: now, priority: 0.8 },
    { url: `${SITE}/areas`, lastModified: now, priority: 0.8 },
    { url: `${SITE}/dashboard`, lastModified: now, priority: 0.7 },
    { url: `${SITE}/comparar`, lastModified: now, priority: 0.7 },
    { url: `${SITE}/metodologia`, lastModified: now, priority: 0.6 },
    { url: `${SITE}/glosario`, lastModified: now, priority: 0.6 },
    { url: `${SITE}/about`, lastModified: now, priority: 0.5 },
    { url: `${SITE}/tags`, lastModified: now, priority: 0.5 },
  ];

  const tags = Array.from(tagSet).map((t) => ({
    url: `${SITE}/tags/${encodeURIComponent(t)}`,
    lastModified: now,
    priority: 0.4,
  }));

  const countries = Object.keys(COUNTRIES).map((c) => ({
    url: `${SITE}/paises/${c.toLowerCase()}`,
    lastModified: now,
    priority: 0.6,
  }));

  const areas = Object.keys(AREAS).map((a) => ({
    url: `${SITE}/areas/${a}`,
    lastModified: now,
    priority: 0.6,
  }));

  const regulations = regs.map((r) => ({
    url: `${SITE}/regulaciones/${r.slug}`,
    lastModified: r.lastUpdated ? new Date(r.lastUpdated) : now,
    priority: 0.8,
  }));

  return [...base, ...countries, ...areas, ...tags, ...regulations];
}
