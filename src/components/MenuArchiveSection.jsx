import React, { useState } from 'react';
import { SectionHeader } from './SectionHeader';
import { NutritionPanel } from './NutritionPanel';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { meals } from '../data/meals';
import { useCpl } from '../hooks/useCpl';
import { useSiteCopy } from '../hooks/useSiteCopy';

const weeks = [1, 2, 3, 4];

export function MenuArchiveSection() {
  const [activeWeek, setActiveWeek] = useState(1);
  const [selectedMobileMealId, setSelectedMobileMealId] = useState('');
  const [selectedTiers, setSelectedTiers] = useState({});
  const { language } = useCpl();
  const copy = useSiteCopy();
  const isIndonesian = language === 'ID';
  const weeklyMeals = meals.filter((meal) => meal.week === activeWeek);
  const activeMobileMealId = weeklyMeals.some((meal) => meal.id === selectedMobileMealId)
    ? selectedMobileMealId
    : weeklyMeals[0]?.id || '';

  return (
    <section id="menu" className="scroll-mt-20 border-b border-[var(--cpl-border)] bg-[var(--cpl-cream)] py-12 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <SectionHeader eyebrow={copy.menu.eyebrow} title={copy.menu.title} description={copy.menu.description} />
        </div>

        <div className="mt-6 grid grid-cols-4 border-2 border-[#1E1E1E] sm:mt-10" role="tablist" aria-label={copy.menu.weekFilter}>
          {weeks.map((week) => (
            <button key={week} type="button" role="tab" aria-selected={activeWeek === week} aria-controls="weekly-menu-panel" onClick={() => setActiveWeek(week)} className={`min-h-11 border-r border-[#1E1E1E] px-1 font-display text-[9px] font-extrabold uppercase tracking-wide transition-colors last:border-r-0 sm:min-h-14 sm:px-4 sm:text-xs sm:tracking-wider ${activeWeek === week ? 'bg-[#1E1E1E] text-white' : 'bg-[var(--cpl-cream)] hover:bg-[var(--cpl-sage-light)]'}`}>
              {copy.menu.week} {week}
            </button>
          ))}
        </div>

        <div id="weekly-menu-panel" role="tabpanel" className="mt-6 sm:mt-8">
          <div className="mb-4 flex flex-col gap-1.5 border-b-2 border-[#1E1E1E] pb-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-2 sm:pb-4">
            <div>
              <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight sm:text-4xl">{copy.menu.week} {activeWeek}</h3>
              <p className="mt-1 text-[10px] leading-4 text-[var(--cpl-dark-muted)] sm:text-xs sm:leading-5">{copy.menu.catalogNote}</p>
            </div>
            <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-black/50">{weeklyMeals.length} {copy.menu.menuCount}</span>
          </div>

          {weeklyMeals.length > 1 ? (
            <div className="mb-4 md:hidden">
              <p className="mb-1.5 font-mono text-[9px] font-bold uppercase tracking-wider text-[var(--cpl-sage-dark)]">
                {copy.menu.selectMenu}
              </p>
              <Select value={activeMobileMealId} onValueChange={setSelectedMobileMealId}>
                <SelectTrigger
                  aria-label={copy.menu.selectMenu}
                  className="group min-h-14 rounded-none border-2 border-[#1E1E1E] bg-[var(--cpl-cream)] px-3 font-display text-xs font-extrabold uppercase text-[#1E1E1E] shadow-[3px_3px_0_#8A9C7A]"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  {weeklyMeals.map((meal) => (
                    <SelectItem key={meal.id} value={meal.id} className="rounded-none font-display font-extrabold uppercase">
                      {(isIndonesian ? meal.dayID : meal.day)} · {meal.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}

          <div className="grid gap-3 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
            {weeklyMeals.map((meal) => {
              const mealDescription = isIndonesian ? meal.descriptionID : meal.description;
              const selectedTier = selectedTiers[meal.id] || meal.protein;

              return (
                <article key={meal.id} className={`${meal.id === activeMobileMealId ? 'grid' : 'hidden'} group h-full w-full grid-rows-[auto_1fr] overflow-hidden rounded-lg border border-[var(--cpl-border-muted)] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:grid`}>
                  <div className="relative h-40 overflow-hidden bg-[var(--cpl-cream)] sm:h-56">
                    <img src={meal.photo} alt={`${meal.name} plated meal`} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute left-3 top-3 bg-[#1E1E1E] px-2.5 py-1 font-mono text-[10px] font-bold uppercase text-white">W{meal.week} · {meal.id.toUpperCase()}</span>
                    <span className="absolute right-3 top-3 bg-[#8A9C7A] px-3 py-1 font-display text-[10px] font-extrabold uppercase text-white sm:text-xs">{isIndonesian ? meal.dayID : meal.day}</span>
                  </div>

                  <div className="flex flex-col p-4 sm:p-6">
                    <div className="min-h-0 sm:min-h-[3.75rem]">
                      <h4 className="line-clamp-2 font-display text-lg font-extrabold uppercase leading-tight text-[var(--cpl-dark)] sm:text-2xl">{meal.name}</h4>
                    </div>
                    <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-[var(--cpl-dark-muted)] sm:mt-3 sm:min-h-[4.5rem] sm:text-xs sm:leading-6">{mealDescription}</p>

                    <div className="mt-4 sm:mt-5">
                      <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-[var(--cpl-sage-dark)]">{copy.menu.chooseTier}</p>
                      <div className="mt-2 grid grid-cols-5 border-2 border-[#1E1E1E]" role="radiogroup" aria-label={`${copy.menu.chooseTier}: ${meal.name}`}>
                        {meal.availableProteinTiers.map((tier) => (
                          <button key={tier} type="button" role="radio" aria-checked={selectedTier === tier} onClick={() => setSelectedTiers((current) => ({ ...current, [meal.id]: tier }))} className={`min-h-10 border-r border-[#1E1E1E] px-1 font-mono text-[9px] font-bold last:border-r-0 sm:min-h-11 sm:text-[10px] ${selectedTier === tier ? 'bg-[#1E1E1E] text-white' : 'bg-[var(--cpl-cream)] hover:bg-[var(--cpl-sage-light)]'}`}>{tier}g</button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-5">
                      <NutritionPanel meal={meal} proteinTier={selectedTier} compact />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          {weeklyMeals.length === 0 ? <p className="border-2 border-dashed border-black/30 p-10 text-center text-sm text-black/50">{copy.menu.empty}</p> : null}
        </div>
      </div>
    </section>
  );
}
