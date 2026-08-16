import React from "react";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import { Seo } from "../components/Seo";
import { Hero } from "../components/Hero";
import { ThisWeekMenuSection } from "../components/ThisWeekMenuSection";
import { MenuArchiveSection } from "../components/MenuArchiveSection";
import { FaqSection } from "../components/FaqSection";

import { FounderSection } from "../components/FounderSection";
import { MacroCalculator } from "../components/MacroCalculator";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { proteinTiers, standards } from "../data/site";
import { formatCurrency } from "../lib/order";
import { analytics } from "../lib/analytics";
import { useCpl } from "../hooks/useCpl";
import { useSiteCopy } from "../hooks/useSiteCopy";
import { readStoredState, writeStoredState } from "../lib/storage";

const PRICING_PERIODS = ["monthly", "weekly", "daily"];

function LegacySectionHeader({
  eyebrow,
  title,
  description,
  dark = false,
  compact = false,
}) {
  return (
    <div
      className={`mx-auto max-w-3xl space-y-4 text-center ${compact ? "mb-8 sm:mb-12" : "mb-12 sm:mb-16"}`}
    >
      <Badge
        variant={dark ? "solid" : "default"}
        className={dark ? "bg-[#8D9B7D] text-white" : ""}
      >
        {eyebrow}
      </Badge>
      <h2
        className={`font-display text-3xl font-extrabold uppercase tracking-tight sm:text-5xl ${dark ? "text-white" : "text-[var(--cpl-dark)]"}`}
      >
        {title}
      </h2>
      <p
        className={`text-sm leading-relaxed sm:text-base ${dark ? "text-white/65" : "text-[var(--cpl-dark-muted)]"}`}
      >
        {description}
      </p>
    </div>
  );
}

export default function HomePage({ onBuild, onOpenAdmin }) {
  const { language } = useCpl();
  const copy = useSiteCopy();
  const isIndonesian = language === "ID";
  const [pricingPeriod, setPricingPeriod] = React.useState(
    () =>
      readStoredState("pricing-period", (value) =>
        PRICING_PERIODS.includes(value),
      ) || "monthly",
  );

  React.useEffect(() => {
    writeStoredState("pricing-period", pricingPeriod);
  }, [pricingPeriod]);

  return (
    <>
      <Seo
        title="Clean Plate Lab | High-Protein Meal Prep Makassar"
        description="High-protein meals made with food science, clear nutrition data, and food you actually want to eat. Build your meal and order via WhatsApp."
        path="/"
      />

      <Hero
        onOpenOrder={() => onBuild("hero")}
        onScrollToLabel={() =>
          document
            .getElementById("menu")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      />

      <section
        id="how-it-works"
        className="border-b border-[#1E1E1E] bg-[#1E1E1E] py-12 text-white sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <LegacySectionHeader
            compact
            dark
            eyebrow={copy.how.eyebrow}
            title={copy.how.title}
            description={copy.how.description}
          />
          <div className="grid border-2 border-white/25 md:grid-cols-3">
            {copy.how.steps.map((step, index) => (
              <article
                key={step.title}
                className="grid grid-cols-[2.5rem_1fr] gap-x-3 border-b border-white/25 p-4 last:border-b-0 sm:p-5 md:block md:border-b-0 md:border-r md:p-9 md:last:border-r-0"
              >
                <span className="row-span-2 font-mono text-xs font-bold text-[#8D9B7D] md:row-span-auto">
                  0{index + 1}
                </span>
                <h3 className="font-display text-base font-extrabold uppercase leading-tight sm:text-lg md:mt-10 md:min-h-[3.75rem] md:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-1 text-[10px] leading-4 text-white/60 sm:text-[11px] sm:leading-5 md:mt-3 md:text-xs md:leading-6">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="protein-tiers"
        className="border-b border-[var(--cpl-border)] bg-[var(--cpl-white)] py-12 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <LegacySectionHeader
            compact
            eyebrow={copy.protein.eyebrow}
            title={copy.protein.title}
            description={copy.protein.description}
          />
          <div className="mb-6 flex flex-col items-center gap-3 sm:mb-8">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B7860]">
              {copy.protein.periodFilter}
            </p>
            <div
              className="grid w-full max-w-md grid-cols-3 border-2 border-[#1E1E1E] bg-white p-1 shadow-[3px_3px_0_#1E1E1E]"
              role="group"
              aria-label={copy.protein.periodFilter}
            >
              {PRICING_PERIODS.map((period) => {
                const isActive = pricingPeriod === period;

                return (
                  <button
                    key={period}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setPricingPeriod(period)}
                    className={`min-h-10 px-2 font-display text-[10px] font-extrabold uppercase tracking-wider transition-colors focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8D9B7D] focus-visible:ring-inset sm:min-h-11 sm:text-xs ${
                      isActive
                        ? "bg-[#8D9B7D] text-white"
                        : "bg-white text-[#1E1E1E] hover:bg-[#E1ECD3] hover:text-[#6B7860]"
                    }`}
                  >
                    {copy.protein[period]}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="border-2 border-[#1E1E1E] bg-[#1E1E1E] shadow-[5px_5px_0_#8D9B7D]">
            <div className="grid gap-0.5 bg-[#1E1E1E] sm:grid-cols-2 lg:grid-cols-5">
              {proteinTiers.map((tier) => (
                <Card
                  key={tier.protein}
                  className="group relative grid min-h-0 grid-cols-[4.5rem_1fr_auto] items-center gap-3 rounded-none border-0 bg-white p-3 shadow-none transition-colors hover:bg-[#FEFDF9] sm:last:col-span-2 lg:flex lg:min-h-[250px] lg:flex-col lg:items-stretch lg:gap-0 lg:p-5 lg:last:col-span-1"
                >
                  {tier.protein === 80 ? (
                    <span className="absolute right-0 top-0 z-10 inline-flex items-center gap-1.5 bg-[#1E1E1E] px-2.5 py-1 font-mono text-[8px] font-black uppercase tracking-wider text-white shadow-[-3px_3px_0_#8D9B7D] lg:px-3 lg:py-1.5 lg:text-[9px]">
                      <span
                        className="size-1.5 rounded-full bg-[#C8D8B8]"
                        aria-hidden="true"
                      />
                      {copy.protein.bestSeller}
                    </span>
                  ) : null}
                  <div>
                    <p className="hidden font-mono text-[9px] font-bold uppercase tracking-widest text-[#6B7860] lg:block">
                      {copy.protein.label}
                    </p>
                    <p className="font-display text-3xl font-black tracking-tighter lg:mt-3 lg:text-5xl">
                      {tier.protein}
                      <span className="text-base lg:text-2xl">g</span>
                    </p>
                  </div>
                  <p className="hidden text-[11px] leading-[1.45] text-[var(--cpl-dark-muted)] lg:mt-3 lg:line-clamp-2 lg:block lg:text-xs lg:leading-5">
                    {isIndonesian ? tier.descriptionID : tier.description}
                  </p>
                  <div className="contents lg:mt-auto lg:block lg:border-t lg:border-[#1E1E1E]/20 lg:pt-4">
                    <div className="flex items-end justify-between gap-2">
                      <div>
                        <p className="font-mono text-[8px] font-bold uppercase tracking-wider text-[#6B7860] lg:text-[9px] lg:tracking-widest">
                          {copy.protein[pricingPeriod]}
                        </p>
                        <p className="mt-0.5 whitespace-nowrap font-display text-base font-black tracking-tight text-[#1E1E1E] lg:mt-1 lg:text-xl">
                          {formatCurrency(tier.prices[pricingPeriod])}
                        </p>
                      </div>
                      <span className="hidden pb-0.5 text-right font-mono text-[8px] font-bold uppercase leading-tight text-[#1E1E1E]/50 lg:block">
                        {copy.protein.perServing}
                      </span>
                    </div>
                    <Button
                      type="button"
                      onClick={() => {
                        analytics.proteinTierSelected(tier.protein);
                        onBuild("protein_tier", tier.protein);
                      }}
                      className="h-9 w-auto rounded-none px-3 text-[8px] lg:mt-3 lg:h-11 lg:w-full lg:px-5 lg:text-[10px]"
                    >
                      {copy.protein.cta}
                      <ArrowRight size={13} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-3 border border-[#1E1E1E] bg-[#FEFDF9] p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5">
            <div>
              <p className="font-display text-sm font-extrabold uppercase text-[#1E1E1E] sm:text-base">
                {copy.protein.calculatorPrompt}
              </p>
              <p className="mt-1 text-[10px] leading-4 text-[var(--cpl-dark-muted)] sm:text-xs sm:leading-5">
                {copy.protein.calculatorDescription}
              </p>
            </div>
            <Button
              asChild
              variant="dark"
              size="sm"
              className="w-full shrink-0 rounded-none sm:w-auto"
            >
              <a href="#calculator">
                {copy.protein.calculatorCta}
                <ArrowRight size={13} />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <ThisWeekMenuSection />

      <MenuArchiveSection />

      <MacroCalculator
        onOpenOrder={(proteinTier) => onBuild("calculator", proteinTier, 2)}
      />

      <section
        id="why-cpl"
        className="border-b border-[var(--cpl-border)] bg-[var(--cpl-cream)] py-12 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-6 sm:gap-10 lg:grid-cols-2">
            <div className="border-2 border-[#1E1E1E] bg-white p-2 shadow-[7px_7px_0_#1E1E1E]">
              <img
                src="/images/ayam_cabe_ijo.webp"
                alt="Ayam cabe ijo meal prepared by Clean Plate Lab"
                loading="lazy"
                decoding="async"
                className="aspect-[2/1] w-full object-cover sm:aspect-[4/3]"
              />
            </div>
            <div>
              <Badge variant="default">{copy.why.eyebrow}</Badge>
              <h2 className="mt-3 font-display text-2xl font-extrabold uppercase tracking-tight sm:mt-5 sm:text-5xl">
                {copy.why.title}
              </h2>
              <p className="mt-3 text-xs leading-5 text-[var(--cpl-dark-muted)] sm:mt-5 sm:text-sm sm:leading-7">
                {copy.why.description}
              </p>
              <ul className="mt-5 border-y border-[#1E1E1E] sm:mt-8">
                {copy.why.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-2.5 border-b border-[#1E1E1E]/20 py-3 text-[11px] font-bold last:border-0 sm:gap-3 sm:py-4 sm:text-xs"
                  >
                    <Check
                      size={14}
                      className="shrink-0 text-[#8D9B7D] sm:size-[15px]"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t-2 border-[#1E1E1E] pt-8 sm:mt-16 sm:pt-12">
            <div className="mb-6 grid gap-3 sm:mb-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-12">
              <div>
                <Badge variant="default">{copy.standard.eyebrow}</Badge>
                <h3 className="mt-3 font-display text-2xl font-extrabold uppercase tracking-tight sm:mt-5 sm:text-4xl">
                  {copy.standard.title}
                </h3>
              </div>
              <p className="text-xs leading-5 text-[var(--cpl-dark-muted)] sm:text-sm sm:leading-7">
                {copy.standard.description}
              </p>
            </div>
            <div className="grid gap-2.5 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
              {standards.map((standard, index) => (
                <Card
                  key={standard.title}
                  className="grid min-h-0 grid-cols-[2.25rem_1fr] gap-x-3 rounded-none border border-[#1E1E1E] bg-white p-4 sm:p-5 md:block md:min-h-[210px] md:p-6"
                >
                  <span className="row-span-2 font-mono text-[10px] font-bold text-[#6B7860] md:row-span-auto">
                    0{index + 1}
                  </span>
                  <h4 className="font-display text-base font-extrabold uppercase sm:text-lg md:mt-8 md:text-xl">
                    {isIndonesian ? standard.titleID : standard.title}
                  </h4>
                  <p className="mt-1 text-[10px] leading-4 text-[var(--cpl-dark-muted)] sm:text-[11px] sm:leading-5 md:mt-3 md:text-xs md:leading-6">
                    {isIndonesian
                      ? standard.descriptionID
                      : standard.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* Full-width quote — anchored to bottom of section */}
          <blockquote className="mt-10 sm:mt-16">
            <div className="border-2 border-[#1E1E1E] bg-[#1E1E1E] px-6 py-8 shadow-[5px_5px_0_#8D9B7D] sm:px-12 sm:py-12 sm:shadow-[7px_7px_0_#8D9B7D]">
              <p className="font-display text-2xl font-black uppercase leading-snug tracking-tight text-white sm:text-4xl sm:leading-tight lg:text-5xl">
                {copy.why.quote}
              </p>
              <span className="mt-5 block font-mono text-[10px] font-bold uppercase tracking-widest text-[#8D9B7D] sm:mt-7 sm:text-xs">
                — Clean Plate Lab
              </span>
            </div>
          </blockquote>
        </div>
      </section>

      <FounderSection />

      <FaqSection />
      <section className="border-b border-[#1E1E1E] bg-[var(--cpl-cream)] px-4 py-12 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl border-2 border-[#1E1E1E] bg-[#1E1E1E] p-6 text-center text-white shadow-[6px_6px_0_#8D9B7D] sm:p-14 sm:shadow-[8px_8px_0_#8D9B7D]">
          <MessageCircle size={28} className="mx-auto text-[#8D9B7D]" />
          <h2 className="mx-auto mt-4 max-w-4xl font-display text-2xl font-extrabold uppercase tracking-tight sm:mt-6 sm:text-6xl">
            {copy.final.title}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-xs leading-5 text-white/60 sm:mt-5 sm:text-sm sm:leading-7">
            {copy.final.description}
          </p>
          <Button
            size="lg"
            onClick={() => onBuild("final_cta")}
            className="mt-5 h-12 rounded-none px-5 text-xs sm:mt-8 sm:h-14 sm:px-8 sm:text-sm"
          >
            {copy.final.cta}
            <ArrowRight size={17} />
          </Button>
        </div>
      </section>
    </>
  );
}
