import type { Regulation } from "@/lib/schemas/regulation";
import { COUNTRIES } from "@/lib/taxonomy";

export function toAPA(reg: Regulation, siteUrl?: string): string {
  const year = (reg.publicationDate || reg.introductionDate || "").slice(0, 4);
  const country = COUNTRIES[reg.country as keyof typeof COUNTRIES]?.name ?? reg.country;
  const editor = reg.editor;
  const accessed = new Date(reg.lastUpdated).toLocaleDateString("es-CL");
  const url =
    siteUrl != null
      ? `${siteUrl}/regulaciones/${reg.slug}`
      : `https://policytracker.lat/regulaciones/${reg.slug}`;
  return `${editor} (${year}). ${reg.officialTitle} [${country}]. Digital Policy Tracker LATAM. Recuperado el ${accessed} de ${url}`;
}

export function toBibTeX(reg: Regulation, siteUrl?: string): string {
  const year = (reg.publicationDate || reg.introductionDate || "n.d.").slice(0, 4);
  const country = COUNTRIES[reg.country as keyof typeof COUNTRIES]?.name ?? reg.country;
  const url =
    siteUrl != null
      ? `${siteUrl}/regulaciones/${reg.slug}`
      : `https://policytracker.lat/regulaciones/${reg.slug}`;
  return `@misc{${reg.id},
  author       = {${escapeBibTeX(reg.editor)}},
  title        = {${escapeBibTeX(reg.officialTitle)}},
  year         = {${year}},
  howpublished = {Digital Policy Tracker LATAM},
  address      = {${escapeBibTeX(country)}},
  note         = {${escapeBibTeX(reg.citation)}},
  url          = {${url}}
}`;
}

export function toRIS(reg: Regulation, siteUrl?: string): string {
  const year = (reg.publicationDate || reg.introductionDate || "").slice(0, 4);
  const url =
    siteUrl != null
      ? `${siteUrl}/regulaciones/${reg.slug}`
      : `https://policytracker.lat/regulaciones/${reg.slug}`;
  return `TY  - LEGAL
AU  - ${reg.editor}
TI  - ${reg.officialTitle}
PY  - ${year}
PB  - Digital Policy Tracker LATAM
UR  - ${url}
N1  - ${reg.citation}
ER  -`;
}

function escapeBibTeX(s: string): string {
  return s.replace(/[{}]/g, "");
}
