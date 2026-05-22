"use client";

import { useState } from "react";
import { Header } from "@/components/nav/Header";
import { Footer } from "@/components/nav/Footer";
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
  return (
    <>
      <Header onOpenSearch={() => setOpen(true)} />
      <main className="flex-1">{children}</main>
      <Footer />
      <CommandPaletteRoot index={index} open={open} setOpen={setOpen} />
    </>
  );
}
