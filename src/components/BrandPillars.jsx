import React from "react";
import { CplFlaskIcon } from "./CplLogo";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Leaf, BarChart3, Check } from "lucide-react";
import { useCpl } from "../hooks/useCpl";

export function BrandPillars() {
  const { t } = useCpl();

  const pillars = [
    {
      id: "real-food",
      number: "01",
      icon: Leaf,
      title: "REAL FOOD",
      subhead: t("pillar2Title"),
      description: t("pillar2Desc"),
      highlights: [t("pillar2H1"), t("pillar2H2"), t("pillar2H3")],
    },
    {
      id: "clear-data",
      number: "02",
      icon: BarChart3,
      title: "CLEAR DATA",
      subhead: t("pillar1Title"),
      description: t("pillar1Desc"),
      highlights: [t("pillar1H1"), t("pillar1H2"), t("pillar1H3")],
    },
    {
      id: "better-you",
      number: "03",
      icon: CplFlaskIcon,
      title: "BETTER YOU",
      subhead: t("pillar3Title"),
      description: t("pillar3Desc"),
      highlights: [t("pillar3H1"), t("pillar3H2"), t("pillar3H3")],
    },
  ];

  return (
    <section
      id="pillars"
      className="border-b border-[var(--cpl-border-muted)] bg-[var(--cpl-white)] py-12 sm:py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-8 max-w-3xl space-y-3 text-center sm:mb-16">
          <Badge variant="default">
            <span>{t("pillarsEyebrow")}</span>
          </Badge>
          <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight text-[var(--cpl-dark)] sm:text-5xl">
            {t("pillarsTitle")}
          </h2>
          <p className="text-xs leading-5 text-[var(--cpl-dark-muted)] sm:text-base sm:leading-normal">
            {t("pillarsSubtitle")}
          </p>
        </div>

        {/* 3 Grid Cards */}
        <div className="grid gap-2.5 sm:gap-4 md:grid-cols-3 md:gap-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Card
                key={pillar.id}
                className="relative grid min-h-0 w-full grid-cols-[2.75rem_1fr] gap-x-3 rounded-none border border-[var(--cpl-border-muted)] bg-[var(--cpl-white)] p-4 transition-all hover:border-[var(--cpl-sage)] sm:grid-cols-[3rem_1fr] sm:p-5 md:flex md:min-h-[320px] md:flex-col md:justify-between md:p-8"
              >
                <div className="contents md:block md:space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--cpl-sage-light)] text-[var(--cpl-sage-dark)] sm:h-11 sm:w-11 md:h-12 md:w-12">
                      <Icon size={22} />
                    </div>
                    <span className="hidden font-display text-2xl font-black text-[var(--cpl-sand)] md:block">
                      {pillar.number}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-extrabold uppercase tracking-tight text-[var(--cpl-dark)] sm:text-xl md:text-2xl">
                      {pillar.title}
                    </h3>
                    <div className="mt-0.5 font-display text-[10px] font-bold uppercase tracking-wider text-[var(--cpl-sage-dark)] sm:text-xs">
                      {pillar.subhead}
                    </div>
                  </div>

                  <p className="col-start-2 mt-2 text-[10px] font-normal leading-4 text-[var(--cpl-dark-muted)] sm:text-[11px] sm:leading-5 md:mt-0 md:text-xs md:leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="col-span-2 mt-3 grid grid-cols-1 gap-1 border-t border-[var(--cpl-border-muted)] pt-3 sm:grid-cols-3 sm:gap-2 md:mt-6 md:block md:space-y-2 md:pt-6">
                  {pillar.highlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 text-[10px] font-semibold text-[var(--cpl-dark)] sm:text-[11px] md:gap-2 md:text-xs"
                    >
                      <Check
                        size={12}
                        className="text-[var(--cpl-sage)] flex-shrink-0 md:size-[14px]"
                      />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
