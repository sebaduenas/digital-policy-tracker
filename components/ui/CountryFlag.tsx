import Link from "next/link";
import { COUNTRIES, type CountryCode } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";

interface Props {
  code: CountryCode;
  link?: boolean;
  showName?: boolean;
  className?: string;
}

export function CountryFlag({ code, link = true, showName = true, className }: Props) {
  const meta = COUNTRIES[code];
  if (!meta) return null;
  const node = (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-sm",
        link && "hover:text-accent transition-colors",
        className,
      )}
    >
      <span aria-hidden className="text-base leading-none">
        {meta.flag}
      </span>
      {showName && <span>{meta.name}</span>}
    </span>
  );
  if (!link) return node;
  return (
    <Link href={`/paises/${code.toLowerCase()}`} aria-label={`Ver país ${meta.name}`}>
      {node}
    </Link>
  );
}
