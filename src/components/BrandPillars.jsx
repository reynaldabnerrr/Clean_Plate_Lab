import React from 'react';
import { CplFlaskIcon } from './CplLogo';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Leaf, BarChart3, Check } from 'lucide-react';
import { useCpl } from '../hooks/useCpl';

export function BrandPillars() {
  const { t } = useCpl();

  const pillars = [
    {
      id: "real-food",
      number: "01",
      icon: Leaf,
      title: "REAL FOOD",
      subhead: t('pillar2Title'),
      description: t('pillar2Desc'),
      highlights: [
        t('pillar2H1'),
        t('pillar2H2'),
        t('pillar2H3')
      ]
    },
    {
      id: "clear-data",
      number: "02",
      icon: BarChart3,
      title: "CLEAR DATA",
      subhead: t('pillar1Title'),
      description: t('pillar1Desc'),
      highlights: [
        t('pillar1H1'),
        t('pillar1H2'),
        t('pillar1H3')
      ]
    },
    {
      id: "better-you",
      number: "03",
      icon: CplFlaskIcon,
      title: "BETTER YOU",
      subhead: t('pillar3Title'),
      description: t('pillar3Desc'),
      highlights: [
        t('pillar3H1'),
        t('pillar3H2'),
        t('pillar3H3')
      ]
    }
  ];

  return (
    <section id="pillars" className="py-20 bg-[var(--cpl-white)] border-b border-[var(--cpl-border-muted)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <Badge variant="default">
            <span>{t('pillarsEyebrow')}</span>
          </Badge>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-[var(--cpl-dark)]">
            {t('pillarsTitle')}
          </h2>
          <p className="text-base text-[var(--cpl-dark-muted)] font-normal">
            {t('pillarsSubtitle')}
          </p>
        </div>

        {/* 3 Grid Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Card 
                key={pillar.id}
                className="p-8 flex flex-col justify-between relative border border-[var(--cpl-border-muted)] hover:border-[var(--cpl-sage)] transition-all rounded-none bg-[var(--cpl-white)]"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-full bg-[var(--cpl-sage-light)] flex items-center justify-center text-[var(--cpl-sage-dark)]">
                      <Icon size={24} />
                    </div>
                    <span className="font-display text-2xl font-black text-[var(--cpl-sand)]">
                      {pillar.number}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-2xl font-extrabold text-[var(--cpl-dark)] uppercase tracking-tight">
                      {pillar.title}
                    </h3>
                    <div className="text-xs font-display font-bold text-[var(--cpl-sage-dark)] uppercase tracking-wider mt-0.5">
                      {pillar.subhead}
                    </div>
                  </div>

                  <p className="text-xs text-[var(--cpl-dark-muted)] leading-relaxed font-normal">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-[var(--cpl-border-muted)] space-y-2 mt-6">
                  {pillar.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-[var(--cpl-dark)]">
                      <Check size={14} className="text-[var(--cpl-sage)] flex-shrink-0" />
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
