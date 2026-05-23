import type { Regulation } from "@/lib/schemas/regulation";
import { COUNTRIES } from "@/lib/taxonomy";

const AUTHOR = "Policy Tracker LATAM";
const PUBLISHER = "Policy Tracker LATAM";

export function toAPA(reg: Regulation, siteUrl?: string): string {
  const year = (reg.publicationDate || reg.introductionDate || "").slice(0, 4);
  const country = COUNTRIES[reg.country as keyof typeof COUNTRIES]?.name ?? reg.country;
  const accessed = new Date(reg.lastUpdated).toLocaleDateString("es-CL");
  const url =
    siteUrl != null
      ? `${siteUrl}/regulaciones/${reg.slug}`
      : `https://policytracker.lat/regulaciones/${reg.slug}`;
  return `${AUTHOR} (${year}). ${reg.officialTitle} [${country}]. ${PUBLISHER}. Recuperado el ${accessed} de ${url}`;
}

export function toBibTeX(reg: Regulation, siteUrl?: string): string {
  const year = (reg.publicationDate || reg.introductionDate || "n.d.").slice(0, 4);
  const country = COUNTRIES[reg.country as keyof typeof COUNTRIES]?.name ?? reg.country;
  const url =
    siteUrl != null
      ? `${siteUrl}/regulaciones/${reg.slug}`
      : `https://policytracker.lat/regulaciones/${reg.slug}`;
  return `@misc{${reg.id},
  author       = {${AUTHOR}},
  title        = {${escapeBibTeX(reg.officialTitle)}},
  year         = {${year}},
  howpublished = {${PUBLISHER}},
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
AU  - ${AUTHOR}
TI  - ${reg.officialTitle}
PY  - ${year}
PB  - ${PUBLISHER}
UR  - ${url}
N1  - ${reg.citation}
ER  -`;
}

function escapeBibTeX(s: string): string {
  return s.replace(/[{}]/g, "");
}
