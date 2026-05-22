import { Badge } from "@/components/ui/Badge";
import { AREAS, type Area } from "@/lib/taxonomy";
import Link from "next/link";

const COLOR_RGB: Record<Area, string> = {
  ia: "124 58 237",
  pdp: "37 99 235",
  ciberseguridad: "220 38 38",
  "propiedad-intelectual": "234 88 12",
  plataformas: "8 145 178",
  fintech: "22 163 74",
  telecom: "202 138 4",
  soberania: "147 51 234",
  "identidad-digital": "13 148 136",
  "menores-online": "219 39 119",
};

interface Props {
  area: Area;
  link?: boolean;
  variant?: "default" | "solid";
  short?: boolean;
}

export function AreaChip({ area, link = true, variant = "default", short }: Props) {
  const meta = AREAS[area];
  if (!meta) return null;
  const tone = COLOR_RGB[area];
  const chip = (
    <Badge tone={tone} variant={variant === "solid" ? "solid" : "default"}>
      {short ? meta.short : meta.name}
    </Badge>
  );
  if (!link) return chip;
  return (
    <Link href={`/areas/${area}`} aria-label={`Ver área ${meta.name}`}>
      {chip}
    </Link>
  );
}

export function areaColor(area: Area): string {
  return COLOR_RGB[area];
}
