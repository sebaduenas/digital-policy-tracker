import type { IndexedRegulation } from "@/lib/index-types";
import type { Area, CountryCode, NormType, Status } from "@/lib/taxonomy";

export interface FilterState {
  q: string;
  countries: CountryCode[];
  areas: Area[];
  statuses: Status[];
  types: NormType[];
  yearFrom?: number;
  yearTo?: number;
  hasAnalysis?: boolean;
}

export const EMPTY_FILTERS: FilterState = {
  q: "",
  countries: [],
  areas: [],
  statuses: [],
  types: [],
};

export function parseFilters(
  params: URLSearchParams | ReadonlyURLSearchParams,
): FilterState {
  const get = (k: string) => params.get(k) || "";
  return {
    q: get("q"),
    countries: split(get("country")) as CountryCode[],
    areas: split(get("area")) as Area[],
    statuses: split(get("status")) as Status[],
    types: split(get("type")) as NormType[],
    yearFrom: get("from") ? parseInt(get("from"), 10) : undefined,
    yearTo: get("to") ? parseInt(get("to"), 10) : undefined,
    hasAnalysis: get("analysis") === "1" ? true : undefined,
  };
}

export function serializeFilters(f: FilterState): string {
  const params = new URLSearchParams();
  if (f.q.trim()) params.set("q", f.q.trim());
  if (f.countries.length) params.set("country", f.countries.join(","));
  if (f.areas.length) params.set("area", f.areas.join(","));
  if (f.statuses.length) params.set("status", f.statuses.join(","));
  if (f.types.length) params.set("type", f.types.join(","));
  if (f.yearFrom) params.set("from", String(f.yearFrom));
  if (f.yearTo) params.set("to", String(f.yearTo));
  if (f.hasAnalysis) params.set("analysis", "1");
  return params.toString();
}

function split(s: string): string[] {
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

export function activeFilterCount(f: FilterState): number {
  let n = 0;
  if (f.q.trim()) n++;
  n +=
    f.countries.length +
    f.areas.length +
    f.statuses.length +
    f.types.length;
  if (f.yearFrom) n++;
  if (f.yearTo) n++;
  if (f.hasAnalysis) n++;
  return n;
}

export function applyFilters(
  data: IndexedRegulation[],
  f: FilterState,
): IndexedRegulation[] {
  let r = data;
  if (f.countries.length) r = r.filter((x) => f.countries.includes(x.country));
  if (f.areas.length)
    r = r.filter((x) => x.areas.some((a) => f.areas.includes(a)));
  if (f.statuses.length) r = r.filter((x) => f.statuses.includes(x.status));
  if (f.types.length) r = r.filter((x) => f.types.includes(x.normType));
  if (f.yearFrom !== undefined)
    r = r.filter((x) => (x.year ?? 0) >= f.yearFrom!);
  if (f.yearTo !== undefined) r = r.filter((x) => (x.year ?? 9999) <= f.yearTo!);
  if (f.hasAnalysis) r = r.filter((x) => x.hasCriticalAnalysis);
  return r;
}

type ReadonlyURLSearchParams = {
  get(name: string): string | null;
};
