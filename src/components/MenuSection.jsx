import React, { useState } from 'react';
import { useCpl } from '../context/CplContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Plus, Check, Sparkles } from 'lucide-react';

export function MenuSection({ onSelectMeal }) {
  const { menuItems, language, t } = useCpl();
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedMeals, setSelectedMeals] = useState({});

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

  const toggleSelectMeal = (id) => {
    setSelectedMeals(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    if (onSelectMeal) onSelectMeal();
  };

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
            const isAdded = !!selectedMeals[meal.id];
            const rawTags = language === 'ID' ? (meal.tags_ID || meal.tags) : (meal.tags_EN || meal.tags);
            const tags = Array.isArray(rawTags) ? rawTags : (rawTags ? [rawTags] : []);
            const description = language === 'ID' ? (meal.desc_ID || meal.desc || '') : (meal.desc_EN || meal.desc || '');

            return (
              <Card 
                key={meal.id}
                className="flex flex-col justify-between overflow-hidden group rounded-3xl border border-[var(--cpl-border-muted)] bg-white shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div>
                  {/* Image Container with Badge */}
                  <div className="relative h-48 sm:h-56 overflow-hidden bg-[var(--cpl-cream)]">
                    <img 
                      src={meal.image} 
                      alt={meal.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#1E1E1E] text-white font-mono text-[10px] font-bold px-2.5 py-1 tracking-widest uppercase rounded-full">
                      {meal.code}
                    </div>

                    <Badge variant="solid" className="absolute top-3 right-3 bg-[#8A9C7A] text-white font-extrabold text-xs rounded-full px-3 py-1">
                      {meal.protein}g Protein
                    </Badge>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-display text-xl sm:text-2xl font-extrabold text-[var(--cpl-dark)] uppercase tracking-tight">
                        {meal.name}
                      </h3>
                      <span className="font-display font-bold text-[11px] sm:text-xs text-[var(--cpl-dark-muted)] bg-[var(--cpl-cream)] px-2.5 py-1 rounded-full shrink-0">
                        {meal.kcal} KCAL
                      </span>
                    </div>

                    <p className="text-xs text-[var(--cpl-dark-muted)] leading-relaxed">
                      {description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {tags.map((tag, i) => (
                        <span key={i} className="text-[10px] font-mono bg-[var(--cpl-sage-light)] text-[var(--cpl-sage-dark)] font-bold px-2.5 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Macro Breakdown Bar (Rounded Grid) */}
                    <div className="pt-3 pb-3 border border-[var(--cpl-border-light)] grid grid-cols-4 text-center font-display text-xs bg-[var(--cpl-cream)] rounded-2xl">
                      <div className="border-r border-[var(--cpl-border-light)] pr-1">
                        <div className="text-[9px] text-gray-500 font-bold uppercase">{t('heroProtein')}</div>
                        <div className="font-extrabold text-[var(--cpl-sage-dark)]">{meal.protein}g</div>
                      </div>
                      <div className="border-r border-[var(--cpl-border-light)] px-1">
                        <div className="text-[9px] text-gray-500 font-bold uppercase">{t('heroCarbs')}</div>
                        <div className="font-extrabold text-[var(--cpl-dark)]">{meal.carbs}g</div>
                      </div>
                      <div className="border-r border-[var(--cpl-border-light)] px-1">
                        <div className="text-[9px] text-gray-500 font-bold uppercase">{t('heroFat')}</div>
                        <div className="font-extrabold text-[var(--cpl-dark)]">{meal.fat}g</div>
                      </div>
                      <div className="pl-1">
                        <div className="text-[9px] text-gray-500 font-bold uppercase">KCAL</div>
                        <div className="font-extrabold text-[var(--cpl-dark)]">{meal.kcal}</div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Card Action */}
                <div className="p-5 sm:p-6 pt-0">
                  <Button
                    variant="default"
                    onClick={onSelectMeal}
                    className="w-full flex items-center justify-center gap-2 min-h-[44px] text-xs font-extrabold bg-[#8A9C7A] hover:bg-[#647554] text-white rounded-full"
                  >
                    <span>{t('menuSelectCta')}</span>
                  </Button>
                </div>

              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
}

