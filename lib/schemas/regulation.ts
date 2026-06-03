import { z } from "zod";
import {
  AREA_KEYS,
  COUNTRY_CODES,
  NORM_TYPE_KEYS,
  STATUS_KEYS,
} from "@/lib/taxonomy";

const DateString = z.preprocess((val) => {
  if (val instanceof Date) return val.toISOString().slice(0, 10);
  return val;
}, z.string());

const ISODateTime = z.preprocess((val) => {
  if (val instanceof Date) return val.toISOString();
  return val;
}, z.string());

const SourceSchema = z.object({
  type: z.enum(["oficial", "doctrina", "prensa", "jurisprudencia"]),
  title: z.string(),
  author: z.string().optional(),
  url: z.string().url(),
  accessedOn: DateString,
});

export const RegulationFrontmatterSchema = z.object({
  id: z.string().regex(/^[a-z]{2}-[a-z0-9-]+$/i, {
    message: "id debe seguir el formato cc-slug, ej. cl-21719",
  }),
  slug: z.string(),
  officialTitle: z.string().min(10),
  shortTitle: z.string().min(2),
  aliases: z.array(z.string()).optional(),
  citation: z.string(),

  country: z.enum(COUNTRY_CODES as [string, ...string[]]),
  areas: z.array(z.enum(AREA_KEYS as [string, ...string[]])).min(1),
  status: z.enum(STATUS_KEYS as [string, ...string[]]),
  normType: z.enum(NORM_TYPE_KEYS as [string, ...string[]]),
  branches: z
    .array(
      z.enum(["publico", "privado", "administrativo", "penal", "internacional"]),
    )
    .default([]),

  publicationDate: DateString.optional(),
  effectiveDate: DateString.optional(),
  introductionDate: DateString.optional(),
  lastStatusChange: DateString.optional(),

  legislativeFile: z
    .object({
      boletinNumber: z.string().optional(),
      chamberOfOrigin: z.string().optional(),
      currentStage: z.string().optional(),
      url: z.string().url().optional(),
    })
    .optional(),

  enforcingAuthority: z.array(z.string()).optional(),
  applicationScope: z.string().optional(),

  summary: z.string().min(60),
  keyProvisions: z.array(z.string()).optional(),
  penalties: z.string().optional(),
  tags: z.array(z.string()).default([]),

  officialUrl: z.string().url(),
  pdfUrl: z.string().url().optional(),
  relatedRegulations: z.array(z.string()).optional(),
  supersedes: z.array(z.string()).optional(),
  supersededBy: z.string().optional(),
  implementsTreaty: z.array(z.string()).optional(),

  editor: z.string(),
  editorOrcid: z.string().optional(),
  lastUpdated: ISODateTime,
  version: z.string().default("1.0.0"),
  sources: z.array(SourceSchema).default([]),
  confidenceLevel: z.enum(["alto", "medio", "bajo"]).default("medio"),

  hasCriticalAnalysis: z.boolean().default(false),
});

export type RegulationFrontmatter = z.infer<typeof RegulationFrontmatterSchema>;

export interface OfficialTextMeta {
  source: string;
  sourceType: "pdf" | "html" | "text" | "manual" | "unknown";
  fetchedAt: string;
  bytes: number;
  notes?: string;
}

export interface Regulation extends RegulationFrontmatter {
  body: string;
  filePath: string;
  officialText?: string;
  officialTextMeta?: OfficialTextMeta;
}
