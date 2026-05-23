import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import type { IndexedRegulation } from "@/lib/index-types";
import { NORM_TYPES } from "@/lib/taxonomy";

export function ShipmentRow({ reg }: { reg: IndexedRegulation }) {
  return (
    <Link
      href={`/regulaciones/${reg.slug}`}
      className="group flex items-center gap-3 rounded-xl bg-bg-elevated border border-border p-4 hover:border-accent/50 hover:shadow-soft transition-all"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bg-sunken text-fg-muted group-hover:bg-accent-soft group-hover:text-accent transition-colors">
        <Package className="h-3.5 w-3.5" strokeWidth={2.5} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-fg text-sm truncate group-hover:text-accent transition-colors">
          {reg.shortTitle}
        </p>
        <p className="text-[0.7rem] text-fg-muted truncate">
          <span aria-hidden>{reg.countryFlag}</span> {reg.countryName} ·{" "}
          {NORM_TYPES[reg.normType]} · {reg.year}
        </p>
      </div>
      <ChevronRight className="h-4 w-4 text-fg-muted/50 group-hover:text-accent transition-colors shrink-0" />
    </Link>
  );
}
