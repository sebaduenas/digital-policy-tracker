"use client";

import * as React from "react";
import { Command } from "cmdk";
import {
  Search,
  ArrowRight,
  FileText,
  MapPin,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import type { IndexedRegulation } from "@/lib/index-types";
import { COUNTRIES, AREAS } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";

interface Props {
  index: IndexedRegulation[];
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CommandPaletteRoot({ index, open, setOpen }: Props) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");

  const fuse = React.useMemo(
    () =>
      new Fuse(index, {
        keys: [
          { name: "shortTitle", weight: 0.4 },
          { name: "officialTitle", weight: 0.3 },
          { name: "aliases", weight: 0.15 },
          { name: "tags", weight: 0.1 },
          { name: "summary", weight: 0.05 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [index],
  );

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const regulations = React.useMemo(() => {
    if (!query.trim()) return index.slice(0, 8);
    return fuse.search(query).slice(0, 10).map((r) => r.item);
  }, [query, index, fuse]);

  const go = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[10vh] bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-xl border border-border bg-bg-elevated shadow-2xl overflow-hidden"
      >
        <Command label="Buscar regulaciones, países y áreas" shouldFilter={false}>
          <div className="flex items-center gap-2 border-b border-border px-3">
            <Search className="h-4 w-4 text-fg-muted" />
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Buscar regulaciones, países, áreas…"
              className="flex-1 h-12 bg-transparent outline-none text-sm placeholder:text-fg-muted/60"
              autoFocus
            />
            <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-border bg-bg px-1.5 font-mono text-[0.65rem] text-fg-muted">
              ESC
            </kbd>
          </div>
          <Command.List className="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin">
            <Command.Empty className="py-6 text-center text-sm text-fg-muted">
              Sin resultados para “{query}”.
            </Command.Empty>

            {regulations.length > 0 && (
              <Command.Group
                heading="Regulaciones"
                className="text-[0.65rem] uppercase tracking-wider text-fg-muted px-2 py-1.5"
              >
                {regulations.map((r) => (
                  <Command.Item
                    key={r.id}
                    value={`${r.shortTitle} ${r.officialTitle}`}
                    onSelect={() => go(`/regulaciones/${r.slug}`)}
                    className={cn(
                      "group flex items-start gap-3 rounded-md px-2 py-2 cursor-pointer",
                      "data-[selected=true]:bg-bg",
                    )}
                  >
                    <FileText className="h-4 w-4 mt-0.5 text-fg-muted shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-fg truncate">
                        <span className="text-fg-muted">{r.countryFlag}</span>{" "}
                        {r.shortTitle}
                      </p>
                      <p className="text-xs text-fg-muted truncate">
                        {r.officialTitle}
                      </p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-fg-muted opacity-0 group-data-[selected=true]:opacity-100" />
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {!query.trim() && (
              <>
                <Command.Group
                  heading="Saltar a país"
                  className="text-[0.65rem] uppercase tracking-wider text-fg-muted px-2 py-1.5 mt-1"
                >
                  {Object.entries(COUNTRIES)
                    .slice(0, 8)
                    .map(([code, c]) => (
                      <Command.Item
                        key={code}
                        value={`pais ${c.name}`}
                        onSelect={() => go(`/paises/${code.toLowerCase()}`)}
                        className="flex items-center gap-2 rounded-md px-2 py-1.5 cursor-pointer text-sm data-[selected=true]:bg-bg"
                      >
                        <MapPin className="h-3.5 w-3.5 text-fg-muted" />
                        <span>{c.flag}</span>
                        <span>{c.name}</span>
                      </Command.Item>
                    ))}
                </Command.Group>
                <Command.Group
                  heading="Áreas temáticas"
                  className="text-[0.65rem] uppercase tracking-wider text-fg-muted px-2 py-1.5 mt-1"
                >
                  {Object.entries(AREAS).map(([slug, a]) => (
                    <Command.Item
                      key={slug}
                      value={`area ${a.name}`}
                      onSelect={() => go(`/areas/${slug}`)}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 cursor-pointer text-sm data-[selected=true]:bg-bg"
                    >
                      <Layers className="h-3.5 w-3.5 text-fg-muted" />
                      <span>{a.name}</span>
                    </Command.Item>
                  ))}
                </Command.Group>
              </>
            )}
          </Command.List>
          <div className="border-t border-border px-3 py-2 text-[0.65rem] text-fg-muted flex justify-between">
            <span>↑↓ navegar · ↵ abrir · ESC cerrar</span>
            <span>{index.length} fichas indexadas</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
