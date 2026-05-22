import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso?: string, locale = "es-CL"): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatYear(iso?: string): string {
  if (!iso) return "—";
  return iso.slice(0, 4);
}

export function pluralize(n: number, singular: string, plural: string) {
  return n === 1 ? singular : plural;
}
