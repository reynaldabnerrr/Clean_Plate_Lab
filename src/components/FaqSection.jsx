import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { faqs } from '../data/site';
import { useCpl } from '../hooks/useCpl';
import { useSiteCopy } from '../hooks/useSiteCopy';

const categories = ['All', ...new Set(faqs.map((faq) => faq.category))];

export function FaqSection() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const { language } = useCpl();
  const copy = useSiteCopy();
  const isIndonesian = language === 'ID';
  const filteredFaqs = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return faqs.filter((faq) => (category === 'All' || faq.category === category)
      && (!normalized || `${faq.question} ${faq.questionID} ${faq.answer} ${faq.answerID} ${faq.category} ${faq.categoryID}`.toLowerCase().includes(normalized)));
  }, [category, query]);

  const categoryLabel = (item) => {
    if (item === 'All') return copy.faq.all;
    const faq = faqs.find((entry) => entry.category === item);
    return isIndonesian ? faq?.categoryID : item;
  };

  return (
    <section id="faq" className="scroll-mt-20 border-b border-[var(--cpl-border)] bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow={copy.faq.eyebrow} title={copy.faq.title} description={copy.faq.description} align="center" />
        <div className="mt-10 flex flex-col gap-4 border-b-2 border-black pb-7 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative block w-full max-w-lg">
            <span className="sr-only">{copy.faq.search}</span>
            <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/45" />
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.faq.search} className="min-h-12 w-full rounded-lg border-2 border-[#1E1E1E] bg-[var(--cpl-cream)] pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-[var(--cpl-sage)]" />
          </label>
          <div className="flex max-w-full gap-2 overflow-x-auto pb-1" aria-label="FAQ categories">
            {categories.map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)} className={`min-h-11 whitespace-nowrap border-2 border-[#1E1E1E] px-4 text-[10px] font-bold uppercase tracking-wider ${category === item ? 'bg-[var(--cpl-dark)] text-white' : 'bg-[var(--cpl-cream)]'}`}>{categoryLabel(item)}</button>)}
          </div>
        </div>
        <div className="mx-auto mt-8 grid max-w-4xl gap-4">
          {filteredFaqs.map((faq) => (
            <details key={faq.question} className="group border-2 border-[#1E1E1E] bg-[var(--cpl-cream)] px-5 py-5 shadow-[3px_3px_0_#1E1E1E] sm:px-6">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-5 font-display text-lg font-extrabold uppercase leading-tight marker:hidden sm:text-xl">
                <span>{isIndonesian ? faq.questionID : faq.question}</span><span className="text-[var(--cpl-sage-dark)] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 max-w-3xl border-t border-black/20 pt-4 text-sm leading-7 text-[var(--cpl-dark-muted)]">{isIndonesian ? faq.answerID : faq.answer}</p>
              <p className="mt-3 font-mono text-[9px] font-bold uppercase tracking-wider text-[var(--cpl-sage-dark)]">{isIndonesian ? faq.categoryID : faq.category}</p>
            </details>
          ))}
          {filteredFaqs.length === 0 ? <p className="border-2 border-dashed border-black/30 py-14 text-center text-sm text-black/50">{copy.faq.empty}</p> : null}
        </div>
      </div>
    </section>
  );
}
