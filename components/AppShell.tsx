"use client";

import { useState, useMemo } from "react";
import { Sidebar } from "@/components/nav/Sidebar";
import { MobileTopbar } from "@/components/nav/MobileTopbar";
import { MainFooter } from "@/components/nav/MainFooter";
import { CommandPaletteRoot } from "@/components/search/CommandPaletteRoot";
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
  const totalAreas = useMemo(
    () => new Set(index.flatMap((i) => i.areas)).size,
    [index],
  );
  return (
    <div className="app-frame">
      <Sidebar
        totalRegs={index.length}
        totalCountries={totalCountries}
        totalAreas={totalAreas}
        onOpenSearch={() => setOpen(true)}
      />
      <div className="main flex flex-col min-h-screen">
        <MobileTopbar onOpenSearch={() => setOpen(true)} />
        <div className="flex-1">{children}</div>
        <MainFooter />
      </div>
      <CommandPaletteRoot index={index} open={open} setOpen={setOpen} />
    </div>
  );
}
