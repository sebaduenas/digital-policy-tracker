import { Badge } from "@/components/ui/Badge";
import { STATUSES, type Status } from "@/lib/taxonomy";

const COLOR_RGB: Record<Status, string> = {
  vigente: "22 163 74",
  "vigencia-diferida": "202 138 4",
  "proyecto-en-discusion": "37 99 235",
  "aprobado-pendiente-promulgacion": "6 182 212",
  derogado: "113 113 122",
  "veto-pendiente": "220 38 38",
  "reglamento-pendiente": "234 88 12",
};

export function StatusBadge({ status }: { status: Status }) {
  const meta = STATUSES[status];
  if (!meta) return null;
  return (
    <Badge tone={COLOR_RGB[status]} variant="default">
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: `rgb(${COLOR_RGB[status]})` }}
        aria-hidden
      />
      {meta.label}
    </Badge>
  );
}

export function statusColor(status: Status): string {
  return COLOR_RGB[status];
}
