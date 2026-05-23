"use client";

import { useMemo, useState } from "react";
import { Topbar } from "@/components/nav/Topbar";
import { MainFooter } from "@/components/nav/MainFooter";
import { CommandPaletteRoot } from "@/components/search/CommandPaletteRoot";
import { LocaleProvider } from "@/lib/i18n";
import type { IndexedRegulation } from "@/lib/index-types";

export function AppShell({
  children,
  index,
}: {
  children: React.ReactNode;
  index: IndexedRegulation[];
}) {
  const [open, setOpen] = useState(false);
  const totalCountries = useMemo(
    () => new Set(index.map((i) => i.country)).size,
    [index],
  );
  return (
    <LocaleProvider>
      <div className="app-frame flex flex-col">
        <Topbar
          onOpenSearch={() => setOpen(true)}
          totalRegs={index.length}
          totalCountries={totalCountries}
        />
        <main className="flex-1">{children}</main>
        <MainFooter />
        <CommandPaletteRoot index={index} open={open} setOpen={setOpen} />
      </div>
    </LocaleProvider>
  );
}
