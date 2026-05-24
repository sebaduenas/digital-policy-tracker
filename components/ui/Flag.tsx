import Image from "next/image";
import { cn } from "@/lib/utils";
import { COUNTRIES, type CountryCode } from "@/lib/taxonomy";

/**
 * Local SVG country flag (from /public/flags) rendered via next/image.
 * Replaces emoji flags, which don't render on Windows 10 and some enterprise
 * browsers. Flags are 4:3 (lipis/flag-icons). Decorative by default (alt=""),
 * since a country name is almost always shown alongside.
 */
export function Flag({
  code,
  size = 18,
  className,
  alt = "",
}: {
  code: CountryCode | string;
  /** Height in px; width is derived from the 4:3 ratio. */
  size?: number;
  className?: string;
  alt?: string;
}) {
  const cc = String(code).toLowerCase();
  const width = Math.round((size * 4) / 3);
  const label =
    alt || COUNTRIES[String(code).toUpperCase() as CountryCode]?.name || "";
  return (
    <Image
      src={`/flags/${cc}.svg`}
      alt={label}
      width={width}
      height={size}
      unoptimized
      style={{ width, height: size }}
      className={cn(
        "inline-block shrink-0 rounded-[2px] object-cover align-middle ring-1 ring-black/10 dark:ring-white/15",
        className,
      )}
    />
  );
}
