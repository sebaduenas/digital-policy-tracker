import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { IndexedRegulation } from "@/lib/index-types";
import { LatamAbstractMap } from "@/components/home/LatamAbstractMap";

interface Props {
  totalRegs: number;
  topRegulations: IndexedRegulation[];
}

export function HeroStrides({ totalRegs, topRegulations }: Props) {
  return (
    <section className="border-b border-border">
      <div className="container-app py-16 sm:py-20 lg:py-24">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
          {/* Left: copy */}
          <div>
            <h1 className="display-tight text-[3rem] sm:text-[3.75rem] lg:text-[4.5rem] leading-[1.04]">
              Tracker de regulación tecnológica para{" "}
              <span style={{ color: "rgb(var(--accent))" }}>LATAM</span>.
            </h1>
            <p className="mt-6 text-lg text-fg-muted leading-relaxed max-w-xl">
              Normas, decretos y proyectos sobre IA, datos personales,
              ciberseguridad, fintech, entre otros, en 12 jurisdicciones de
              América Latina.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/regulaciones" className="btn-pill btn-primary">
                Abrir catálogo
              </Link>
              <Link href="/comparar" className="btn-pill btn-text">
                Comparar normas <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right: mapa abstracto LATAM clickeable */}
          <div className="relative h-[420px] sm:h-[480px] lg:h-[520px] hidden md:block">
            <LatamAbstractMap data={topRegulations} />
          </div>
        </div>
      </div>
    </section>
  );
}
