import type { Area, CountryCode, NormType, Status } from "@/lib/taxonomy";

export interface IndexedRegulation {
  id: string;
  slug: string;
  shortTitle: string;
  officialTitle: string;
  aliases: string[];
  citation: string;
  country: CountryCode;
  countryName: string;
  countryFlag: string;
  areas: Area[];
  status: Status;
  normType: NormType;
  publicationDate?: string;
  year?: number;
  enforcingAuthority?: string[];
  tags: string[];
  summary: string;
  hasCriticalAnalysis: boolean;
  confidenceLevel: "alto" | "medio" | "bajo";
  officialUrl: string;
  /** Has an extracted official text available at /texts/{slug}.txt. */
  hasOfficialText?: boolean;
  officialTextSource?: string;
  officialTextBytes?: number;
}
