import React from 'react';
import { useCpl } from '../hooks/useCpl';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { ArrowRight } from 'lucide-react';

export function MenuSection({ onSelectMeal }) {
  const { menuItems, language, t } = useCpl();

  return (
    <section id="menu" className="py-16 sm:py-24 bg-[var(--cpl-white)] border-b border-[var(--cpl-border-muted)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 sm:mb-12">
          <Badge variant="default" className="mb-3">
            <span>{t('menuEyebrow')}</span>
          </Badge>
          <h2 className="font-display text-3xl sm:text-6xl font-extrabold uppercase tracking-tight text-[var(--cpl-dark)]">
            {t('menuTitle')}
          </h2>
          <p className="text-base sm:text-lg text-[var(--cpl-dark-muted)] font-light mt-2 max-w-xl">
            {t('menuSubtitle')}
          </p>
        </div>

        {/* Menu Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {menuItems.map((meal) => {
            const rawTags = language === 'ID' ? (meal.tags_ID || meal.tags) : (meal.tags_EN || meal.tags);
            const tags = Array.isArray(rawTags) ? rawTags : (rawTags ? [rawTags] : []);
            const description = language === 'ID' ? (meal.desc_ID || meal.desc || '') : (meal.desc_EN || meal.desc || '');

            return (
              <Card 
                key={meal.id}
                className="group grid h-full grid-rows-[auto_1fr] overflow-hidden rounded-lg border border-[var(--cpl-border-muted)] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-48 overflow-hidden bg-[var(--cpl-cream)] sm:h-56">
                  <img
                    src={meal.image}
                    alt={meal.name}
                    loading="lazy"
                    decoding="async"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";
                    }}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3 bg-[#1E1E1E] px-2.5 py-1 font-mono text-[10px] font-bold uppercase text-white">
                    {meal.code}
                  </div>
                  <Badge variant="solid" className="absolute right-3 top-3 bg-[#8A9C7A] px-3 py-1 text-xs font-extrabold text-white">
                    {meal.protein}g Protein
                  </Badge>
                </div>

                <div className="flex min-h-0 flex-col p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-xl font-extrabold uppercase text-[var(--cpl-dark)] sm:text-2xl">
                      {meal.name}
                    </h3>
                    <span className="shrink-0 bg-[var(--cpl-cream)] px-2.5 py-1 font-display text-[11px] font-bold text-[var(--cpl-dark-muted)] sm:text-xs">
                      {meal.kcal} KCAL
                    </span>
                  </div>

                  <p className="mt-4 text-xs leading-relaxed text-[var(--cpl-dark-muted)]">
                    {description}
                  </p>

                  <div className="mt-4 flex flex-wrap content-start gap-1.5">
                    {tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-[var(--cpl-sage-light)] px-2.5 py-1 font-mono text-[10px] font-bold text-[var(--cpl-sage-dark)]">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-4">
                    {/* Spacious 2-Row Nutrition Facts Box */}
                    <div className="rounded-xl border border-[#1E1E1E]/20 bg-[#F5F2EA]/70 p-3 text-xs space-y-2">
                      <div className="flex items-center justify-between border-b border-[#1E1E1E]/15 pb-1.5 font-mono text-[9px] font-black uppercase tracking-wider text-[#647554]">
                        <span>NUTRITION FACTS</span>
                        <span>LAB SPECS</span>
                      </div>

                      {/* Row 1: Primary Macros (3 Equal Columns) */}
                      <div className="grid grid-cols-3 gap-2 text-center font-display">
                        <div className="rounded-lg border border-gray-200/90 bg-white p-2 shadow-2xs">
                          <div className="text-[9px] font-bold uppercase text-gray-500 tracking-tight">{t('heroProtein')}</div>
                          <div className="text-xs sm:text-sm font-black text-[#647554] mt-0.5">{meal.protein}g</div>
                        </div>
                        <div className="rounded-lg border border-gray-200/90 bg-white p-2 shadow-2xs">
                          <div className="text-[9px] font-bold uppercase text-gray-500 tracking-tight">{t('heroCarbs')}</div>
                          <div className="text-xs sm:text-sm font-extrabold text-[#1E1E1E] mt-0.5">{meal.carbs}g</div>
                        </div>
                        <div className="rounded-lg border border-gray-200/90 bg-white p-2 shadow-2xs">
                          <div className="text-[9px] font-bold uppercase text-gray-500 tracking-tight">{t('heroFat')}</div>
                          <div className="text-xs sm:text-sm font-extrabold text-[#1E1E1E] mt-0.5">{meal.fat}g</div>
                        </div>
                      </div>

                      {/* Row 2: Micros (2 Wide Flex Cards) */}
                      <div className="grid grid-cols-2 gap-2 font-display text-xs">
                        <div className="rounded-lg border border-gray-200/90 bg-white px-2.5 py-1.5 shadow-2xs flex items-center justify-between">
                          <span className="text-[9px] font-bold uppercase text-gray-500">{t('heroSodium')}</span>
                          <span className="text-xs font-extrabold text-[#1E1E1E]">{meal.sodium || 1290} mg</span>
                        </div>
                        <div className="rounded-lg border border-gray-200/90 bg-white px-2.5 py-1.5 shadow-2xs flex items-center justify-between">
                          <span className="text-[9px] font-bold uppercase text-gray-500">{t('heroPotassium')}</span>
                          <span className="text-xs font-extrabold text-[#1E1E1E]">{meal.potassium || 365} mg</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="default"
                      onClick={onSelectMeal}
                      className="mt-4 min-h-11 w-full justify-between rounded-lg bg-[#8A9C7A] px-4 text-xs font-extrabold text-white hover:bg-[#647554]"
                    >
                      <span>{t('menuSelectCta')}</span>
                      <ArrowRight size={15} />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
}
