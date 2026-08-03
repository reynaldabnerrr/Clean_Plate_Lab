import React from 'react';
import { ArrowRight, Check, MessageCircle } from 'lucide-react';
import { Seo } from '../components/Seo';
import { Hero } from '../components/Hero';
import { BrandPillars } from '../components/BrandPillars';
import { MenuArchiveSection } from '../components/MenuArchiveSection';
import { FaqSection } from '../components/FaqSection';
import { MacroCalculator } from '../components/MacroCalculator';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { proteinTiers, standards } from '../data/site';
import { formatCurrency } from '../lib/order';
import { analytics } from '../lib/analytics';
import { useCpl } from '../hooks/useCpl';
import { useSiteCopy } from '../hooks/useSiteCopy';

function LegacySectionHeader({ eyebrow, title, description, dark = false }) {
  return (
    <div className="mx-auto mb-12 max-w-3xl space-y-4 text-center sm:mb-16">
      <Badge variant={dark ? 'solid' : 'default'} className={dark ? 'bg-[#8A9C7A] text-white' : ''}>{eyebrow}</Badge>
      <h2 className={`font-display text-3xl font-extrabold uppercase tracking-tight sm:text-5xl ${dark ? 'text-white' : 'text-[var(--cpl-dark)]'}`}>{title}</h2>
      <p className={`text-sm leading-relaxed sm:text-base ${dark ? 'text-white/65' : 'text-[var(--cpl-dark-muted)]'}`}>{description}</p>
    </div>
  );
}

export default function HomePage({ onBuild }) {
  const { language } = useCpl();
  const copy = useSiteCopy();
  const isIndonesian = language === 'ID';

  return (
    <>
      <Seo title="Clean Plate Lab | High-Protein Meal Prep Makassar" description="High-protein meals made with food science, clear nutrition data, and food you actually want to eat. Build your meal and order via WhatsApp." path="/" />

      <Hero onOpenOrder={() => onBuild('hero')} onScrollToLabel={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })} />
      <BrandPillars />

      <section id="protein-tiers" className="border-b border-[var(--cpl-border)] bg-[var(--cpl-cream)] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <LegacySectionHeader eyebrow={copy.protein.eyebrow} title={copy.protein.title} description={copy.protein.description} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {proteinTiers.map((tier) => (
              <Card key={tier.protein} className="group flex min-h-[250px] flex-col rounded-none border-2 border-[#1E1E1E] bg-white p-5 shadow-[4px_4px_0_#1E1E1E] transition-transform hover:-translate-y-1 motion-reduce:transform-none">
                <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#647554]">{copy.protein.label}</p>
                <p className="mt-4 font-display text-5xl font-black tracking-tighter">{tier.protein}<span className="text-2xl">g</span></p>
                <p className="mt-4 text-xs leading-5 text-[var(--cpl-dark-muted)]">{isIndonesian ? tier.descriptionID : tier.description}</p>
                <div className="mt-auto border-t border-[#1E1E1E]/20 pt-4">
                  <dl className="grid gap-1.5 font-mono text-[9px] font-bold uppercase">
                    <div className="flex justify-between gap-2"><dt>{isIndonesian ? 'Harian' : 'Daily'}</dt><dd>{formatCurrency(tier.prices.daily)}</dd></div>
                    <div className="flex justify-between gap-2"><dt>{isIndonesian ? 'Mingguan' : 'Weekly'}</dt><dd>{formatCurrency(tier.prices.weekly)}</dd></div>
                    <div className="flex justify-between gap-2"><dt>{isIndonesian ? 'Bulanan' : 'Monthly'}</dt><dd>{formatCurrency(tier.prices.monthly)}</dd></div>
                  </dl>
                  <Button type="button" onClick={() => { analytics.proteinTierSelected(tier.protein); onBuild('protein_tier', tier.protein); }} className="mt-3 w-full rounded-none text-[10px]">{copy.protein.cta}<ArrowRight size={14} /></Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-b border-[#1E1E1E] bg-[#1E1E1E] py-16 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <LegacySectionHeader dark eyebrow={copy.how.eyebrow} title={copy.how.title} description={copy.how.description} />
          <div className="grid gap-0 border-2 border-white/25 md:grid-cols-3">
            {copy.how.steps.map((step, index) => (
              <article key={step.title} className="border-b border-white/25 p-7 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 sm:p-9">
                <span className="font-mono text-xs font-bold text-[#8A9C7A]">0{index + 1}</span>
                <h3 className="mt-10 font-display text-2xl font-extrabold uppercase">{step.title}</h3>
                <p className="mt-3 text-xs leading-6 text-white/60">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <MenuArchiveSection />

      <section className="border-b border-[var(--cpl-border)] bg-[var(--cpl-cream)] py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="border-2 border-[#1E1E1E] bg-white p-2 shadow-[7px_7px_0_#1E1E1E]">
            <img src="/images/ayam_cabe_ijo.webp" alt="Ayam cabe ijo meal prepared by Clean Plate Lab" loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
          </div>
          <div>
            <Badge variant="default">{copy.why.eyebrow}</Badge>
            <h2 className="mt-5 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-5xl">{copy.why.title}</h2>
            <p className="mt-5 text-sm leading-7 text-[var(--cpl-dark-muted)]">{copy.why.description}</p>
            <ul className="mt-8 border-y border-[#1E1E1E]">
              {copy.why.points.map((point) => <li key={point} className="flex items-center gap-3 border-b border-[#1E1E1E]/20 py-4 text-xs font-bold last:border-0"><Check size={15} className="text-[#8A9C7A]" />{point}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section id="our-standard" className="border-b border-[var(--cpl-border)] bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <LegacySectionHeader eyebrow={copy.standard.eyebrow} title={copy.standard.title} description={copy.standard.description} />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {standards.map((standard, index) => <Card key={standard.title} className="rounded-none border border-[#1E1E1E] bg-[var(--cpl-cream)] p-6"><span className="font-mono text-[10px] font-bold text-[#8A9C7A]">0{index + 1}</span><h3 className="mt-8 font-display text-xl font-extrabold uppercase">{isIndonesian ? standard.titleID : standard.title}</h3><p className="mt-3 text-xs leading-6 text-[var(--cpl-dark-muted)]">{isIndonesian ? standard.descriptionID : standard.description}</p></Card>)}
          </div>
        </div>
      </section>

      <MacroCalculator onOpenOrder={(proteinTier) => onBuild('calculator', proteinTier, 2)} />

      <section id="about" className="border-b border-[var(--cpl-border)] bg-[var(--cpl-cream)] py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div><Badge variant="default">{copy.about.eyebrow}</Badge><h2 className="mt-5 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-5xl">{copy.about.title}</h2><p className="mt-6 text-sm leading-7 text-[var(--cpl-dark-muted)]">{copy.about.description}</p></div>
          <blockquote className="cpl-label-paper flex items-center border-2 border-[#1E1E1E] p-7 font-display text-2xl font-bold leading-tight sm:p-10 sm:text-4xl">{copy.about.quote}</blockquote>
        </div>
      </section>

      <FaqSection />
      <section className="border-b border-[#1E1E1E] bg-[var(--cpl-cream)] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl border-2 border-[#1E1E1E] bg-[#1E1E1E] p-8 text-center text-white shadow-[8px_8px_0_#8A9C7A] sm:p-14">
          <MessageCircle size={28} className="mx-auto text-[#8A9C7A]" />
          <h2 className="mx-auto mt-6 max-w-4xl font-display text-3xl font-extrabold uppercase tracking-tight sm:text-6xl">{copy.final.title}</h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/60">{copy.final.description}</p>
          <Button size="lg" onClick={() => onBuild('final_cta')} className="mt-8 rounded-none">{copy.final.cta}<ArrowRight size={17} /></Button>
        </div>
      </section>
    </>
  );
}
