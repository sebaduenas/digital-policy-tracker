import Link from "next/link";
import { COUNTRIES, type CountryCode } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";
import { Flag } from "@/components/ui/Flag";

interface Props {
  code: CountryCode;
  link?: boolean;
  showName?: boolean;
  /** Flag height in px. */
  size?: number;
  className?: string;
}

export function CountryFlag({
  code,
  link = true,
  showName = true,
  size = 16,
  className,
}: Props) {
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
      <Flag code={code} size={size} />
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
