import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { faqs } from "../data/site";
import { useCpl } from "../hooks/useCpl";
import { useSiteCopy } from "../hooks/useSiteCopy";

const categories = ["All", ...new Set(faqs.map((faq) => faq.category))];

export function FaqSection() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [showAllOnMobile, setShowAllOnMobile] = useState(false);
  const { language } = useCpl();
  const copy = useSiteCopy();
  const isIndonesian = language === "ID";
  const filteredFaqs = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return faqs.filter(
      (faq) =>
        (category === "All" || faq.category === category) &&
        (!normalized ||
          `${faq.question} ${faq.questionID} ${faq.answer} ${faq.answerID} ${faq.category} ${faq.categoryID}`
            .toLowerCase()
            .includes(normalized)),
    );
  }, [category, query]);

  const categoryLabel = (item) => {
    if (item === "All") return copy.faq.all;
    const faq = faqs.find((entry) => entry.category === item);
    return isIndonesian ? faq?.categoryID : item;
  };
  const isDefaultView = category === "All" && !query.trim();
  const shouldLimitMobileResults = isDefaultView && !showAllOnMobile;

  return (
    <section
      id="faq"
      className="scroll-mt-20 border-b border-[var(--cpl-border)] bg-[var(--cpl-white)] py-12 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={copy.faq.eyebrow}
          title={copy.faq.title}
          description={copy.faq.description}
          align="center"
        />
        <div className="mt-6 flex flex-col gap-3 border-b-2 border-black pb-5 sm:mt-10 sm:gap-4 sm:pb-7 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative block w-full max-w-lg">
            <span className="sr-only">{copy.faq.search}</span>
            <Search
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/45"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.faq.search}
              className="min-h-11 w-full rounded-lg border-2 border-[#1E1E1E] bg-[var(--cpl-cream)] pl-11 pr-4 text-xs outline-none focus:ring-2 focus:ring-[var(--cpl-sage)] sm:min-h-12 sm:text-sm"
            />
          </label>
          <div
            className="flex max-w-full flex-wrap gap-2"
            aria-label="FAQ categories"
          >
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
                className={`min-h-10 whitespace-nowrap border-2 border-[#1E1E1E] px-3 text-[9px] font-bold uppercase tracking-wider sm:min-h-11 sm:px-4 sm:text-[10px] ${category === item ? "bg-[var(--cpl-dark)] text-white" : "bg-[var(--cpl-cream)]"}`}
              >
                {categoryLabel(item)}
              </button>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-5 grid max-w-4xl gap-2.5 sm:mt-8 sm:gap-4">
          {filteredFaqs.map((faq, index) => (
            <details
              key={faq.question}
              className={`${shouldLimitMobileResults && index >= 5 ? "hidden sm:block" : ""} group border-2 border-[#1E1E1E] bg-[var(--cpl-cream)] px-4 py-3.5 shadow-[2px_2px_0_#1E1E1E] sm:px-6 sm:py-5 sm:shadow-[3px_3px_0_#1E1E1E]`}
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-display text-base font-extrabold uppercase leading-tight marker:hidden sm:gap-5 sm:text-xl">
                <span>{isIndonesian ? faq.questionID : faq.question}</span>
                <span className="text-[var(--cpl-sage-dark)] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-3xl border-t border-black/20 pt-3 text-xs leading-5 text-[var(--cpl-dark-muted)] sm:mt-4 sm:pt-4 sm:text-sm sm:leading-7">
                {isIndonesian ? faq.answerID : faq.answer}
              </p>
              <p className="mt-2 font-mono text-[8px] font-bold uppercase tracking-wider text-[var(--cpl-sage-dark)] sm:mt-3 sm:text-[9px]">
                {isIndonesian ? faq.categoryID : faq.category}
              </p>
            </details>
          ))}
          {filteredFaqs.length === 0 ? (
            <p className="border-2 border-dashed border-black/30 py-14 text-center text-sm text-black/50">
              {copy.faq.empty}
            </p>
          ) : null}
          {isDefaultView && filteredFaqs.length > 5 ? (
            <button
              type="button"
              onClick={() => setShowAllOnMobile((current) => !current)}
              className="mt-1 min-h-11 border-2 border-[#1E1E1E] bg-white px-4 font-display text-[10px] font-extrabold uppercase tracking-wider text-[#1E1E1E] shadow-[2px_2px_0_#8D9B7D] transition-colors hover:bg-[#E1ECD3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8D9B7D] sm:hidden"
            >
              {showAllOnMobile ? copy.faq.showLess : copy.faq.showAll}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
