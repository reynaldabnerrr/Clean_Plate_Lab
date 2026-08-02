import React, { useState } from 'react';
import { useCpl } from '../hooks/useCpl';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { ArrowRight } from 'lucide-react';

export function MenuSection({ onSelectMeal }) {
  const { menuItems, language, t } = useCpl();
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    { id: "All", label: t('menuFilterAll') },
    { id: "High Protein", label: t('menuFilterHighProtein') },
    { id: "Lean Muscle", label: t('menuFilterLean') },
    { id: "Plant Power", label: t('menuFilterPlant') },
    { id: "Keto / Low Carb", label: t('menuFilterKeto') },
  ];

  const filteredItems = activeCategory === "All" 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <section id="menu" className="py-16 sm:py-24 bg-[var(--cpl-white)] border-b border-[var(--cpl-border-muted)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div>
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

          {/* Category Filter Tabs with horizontal scroll on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none flex-nowrap sm:flex-wrap max-w-full">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                size="sm"
                variant={activeCategory === cat.id ? "default" : "outline"}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap shrink-0 ${activeCategory === cat.id ? "bg-[#8A9C7A] text-white font-extrabold" : ""}`}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Menu Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((meal) => {
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

                  <div className="mt-auto pt-5">
                    <div className="grid grid-cols-4 rounded-lg border border-[var(--cpl-border-muted)] bg-[var(--cpl-cream)] py-3 text-center font-display text-xs">
                      <div className="border-r border-[var(--cpl-border-muted)] px-1">
                        <div className="text-[9px] font-bold uppercase text-gray-500">{t('heroProtein')}</div>
                        <div className="font-extrabold text-[var(--cpl-sage-dark)]">{meal.protein}g</div>
                      </div>
                      <div className="border-r border-[var(--cpl-border-muted)] px-1">
                        <div className="text-[9px] font-bold uppercase text-gray-500">{t('heroCarbs')}</div>
                        <div className="font-extrabold text-[var(--cpl-dark)]">{meal.carbs}g</div>
                      </div>
                      <div className="border-r border-[var(--cpl-border-muted)] px-1">
                        <div className="text-[9px] font-bold uppercase text-gray-500">{t('heroFat')}</div>
                        <div className="font-extrabold text-[var(--cpl-dark)]">{meal.fat}g</div>
                      </div>
                      <div className="px-1">
                        <div className="text-[9px] font-bold uppercase text-gray-500">KCAL</div>
                        <div className="font-extrabold text-[var(--cpl-dark)]">{meal.kcal}</div>
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
