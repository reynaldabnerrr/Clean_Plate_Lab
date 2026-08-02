import React, { useState } from 'react';
import { useCpl } from '../context/CplContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Plus, Check } from 'lucide-react';

export function MenuSection({ onSelectMeal }) {
  const { menuItems, language, t } = useCpl();
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedMeals, setSelectedMeals] = useState({});

  const categories = ["All", "High Protein", "Lean Muscle", "Plant Power", "Keto / Low Carb"];

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
    <section id="menu" className="py-24 bg-[var(--cpl-white)] border-b border-[var(--cpl-border-muted)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <Badge variant="default" className="mb-3">
              <span>{t('menuEyebrow')}</span>
            </Badge>
            <h2 className="font-display text-4xl sm:text-6xl font-extrabold uppercase tracking-tight text-[var(--cpl-dark)]">
              {t('menuTitle')}
            </h2>
            <p className="text-lg text-[var(--cpl-dark-muted)] font-light mt-2 max-w-xl">
              {t('menuSubtitle')}
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                size="sm"
                variant={activeCategory === cat ? "default" : "outline"}
                onClick={() => setActiveCategory(cat)}
                className={activeCategory === cat ? "bg-[#8A9C7A] text-white" : ""}
              >
                {cat === "All" ? t('menuFilterAll') : cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Menu Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((meal) => {
            const isAdded = !!selectedMeals[meal.id];
            const rawTags = language === 'ID' ? (meal.tags_ID || meal.tags) : (meal.tags_EN || meal.tags);
            const tags = Array.isArray(rawTags) ? rawTags : [rawTags];
            const description = language === 'ID' ? (meal.desc_ID || meal.desc) : (meal.desc_EN || meal.desc);

            return (
              <Card 
                key={meal.id}
                className="flex flex-col justify-between overflow-hidden group rounded-none"
              >
                <div>
                  {/* Image Container with Badge */}
                  <div className="relative h-56 overflow-hidden bg-[var(--cpl-cream)]">
                    <img 
                      src={meal.image} 
                      alt={meal.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#1E1E1E] text-white font-mono text-[10px] font-bold px-2 py-1 tracking-widest uppercase">
                      {meal.code}
                    </div>

                    <Badge variant="solid" className="absolute top-3 right-3 bg-[#8A9C7A] text-white font-extrabold">
                      {meal.protein}g Protein
                    </Badge>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-display text-2xl font-extrabold text-[var(--cpl-dark)] uppercase tracking-tight">
                        {meal.name}
                      </h3>
                      <span className="font-display font-bold text-xs text-[var(--cpl-dark-muted)] bg-[var(--cpl-cream)] px-2 py-1 rounded">
                        {meal.kcal} KCAL
                      </span>
                    </div>

                    <p className="text-xs text-[var(--cpl-dark-muted)] leading-relaxed">
                      {description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {tags.map((tag, i) => (
                        <span key={i} className="text-[10px] font-mono bg-[var(--cpl-sage-light)] text-[var(--cpl-sage-dark)] font-bold px-2 py-0.5">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Macro Breakdown Bar */}
                    <div className="pt-4 border-t border-[var(--cpl-border-light)] grid grid-cols-4 text-center font-display text-xs">
                      <div className="border-r border-[var(--cpl-border-light)] pr-1">
                        <div className="text-[9px] text-gray-500 font-bold uppercase">PROT</div>
                        <div className="font-extrabold text-[var(--cpl-sage-dark)]">{meal.protein}g</div>
                      </div>
                      <div className="border-r border-[var(--cpl-border-light)] px-1">
                        <div className="text-[9px] text-gray-500 font-bold uppercase">CARBS</div>
                        <div className="font-extrabold text-[var(--cpl-dark)]">{meal.carbs}g</div>
                      </div>
                      <div className="border-r border-[var(--cpl-border-light)] px-1">
                        <div className="text-[9px] text-gray-500 font-bold uppercase">FAT</div>
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
                <div className="p-6 pt-0">
                  <Button
                    variant={isAdded ? "dark" : "secondary"}
                    onClick={() => toggleSelectMeal(meal.id)}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    {isAdded ? (
                      <>
                        <Check size={16} className="text-green-400" />
                        <span>Added to Selection</span>
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        <span>{t('menuSelectCta')}</span>
                      </>
                    )}
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
