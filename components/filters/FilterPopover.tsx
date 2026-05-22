"use client";

import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { ChevronDown, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface Props {
  label: string;
  options: Option[];
  selected: string[];
  onChange: (next: string[]) => void;
}

export function FilterPopover({ label, options, selected, onChange }: Props) {
  const toggle = (val: string) => {
    onChange(
      selected.includes(val)
        ? selected.filter((v) => v !== val)
        : [...selected, val],
    );
  };
  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1.5 h-9 px-3 rounded-md border text-sm transition-colors",
            selected.length > 0
              ? "border-accent/50 bg-accent/10 text-fg"
              : "border-border bg-bg-elevated text-fg-muted hover:text-fg",
          )}
        >
          <span>{label}</span>
          {selected.length > 0 && (
            <>
              <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full bg-accent text-accent-fg text-[0.65rem] font-medium">
                {selected.length}
              </span>
              <span
                role="button"
                tabIndex={0}
                onClick={clear}
                className="hover:bg-bg-elevated rounded p-0.5"
                aria-label={`Limpiar filtro de ${label}`}
              >
                <X className="h-3 w-3" />
              </span>
            </>
          )}
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          className="z-30 w-64 max-h-80 overflow-y-auto rounded-lg border border-border bg-bg-elevated p-1 shadow-lg animate-fade-in scrollbar-thin"
        >
          {options.map((opt) => {
            const checked = selected.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggle(opt.value)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-bg transition-colors",
                )}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded border",
                    checked
                      ? "bg-accent border-accent text-accent-fg"
                      : "border-border",
                  )}
                  aria-hidden
                >
                  {checked && <Check className="h-3 w-3" />}
                </span>
                {opt.icon}
                <span className="flex-1">{opt.label}</span>
              </button>
            );
          })}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
