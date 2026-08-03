import React from 'react';
import { useSiteCopy } from '../hooks/useSiteCopy';
import { getNutritionForTier } from '../data/meals';

export function NutritionPanel({ meal, proteinTier = meal.protein, compact = false }) {
  const copy = useSiteCopy();
  const nutrition = getNutritionForTier(meal, proteinTier);
  const nutrients = [
    [copy.nutrition.calories, nutrition ? `${nutrition.calories} ${copy.nutrition.calories}` : '—'],
    [copy.nutrition.carbs, nutrition ? `${nutrition.carbs}g` : '—'],
    [copy.nutrition.fat, nutrition ? `${nutrition.fat}g` : '—'],
    [copy.nutrition.fiber, nutrition ? `${nutrition.fiber}g` : '—'],
    [copy.nutrition.sodium, nutrition ? `${nutrition.sodium}mg` : '—'],
    [copy.nutrition.potassium, nutrition ? `${nutrition.potassium}mg` : '—'],
  ];

  return (
    <div className={`nutrition-panel ${compact ? 'nutrition-panel-compact' : ''}`} aria-label={`${copy.nutrition.eyebrow}: ${meal.name}, ${proteinTier}g`}>
      <div className={`flex items-end justify-between gap-3 border-b-2 border-black ${compact ? 'pb-2 sm:pb-3' : 'pb-4'}`}>
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--cpl-sage-dark)]">{copy.nutrition.eyebrow}</p>
          <p className="mt-1 font-mono text-[9px] font-bold uppercase tracking-wider text-black/45">{copy.nutrition.perMeal}</p>
        </div>
        <div className="text-right">
          <span className="block font-mono text-[8px] font-bold uppercase tracking-wider text-black/45">{copy.nutrition.protein}</span>
          <strong className="font-display text-lg font-black text-[var(--cpl-dark)] sm:text-xl">{nutrition?.protein ?? proteinTier}g</strong>
        </div>
      </div>
      <dl className={`${compact ? 'mt-3 sm:mt-4' : 'mt-4'} grid ${compact ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-3'} gap-px overflow-hidden border-2 border-black bg-black`}>
        {nutrients.map(([label, value]) => (
          <div key={label} className={`bg-white ${compact ? 'px-2 py-2 sm:px-3 sm:py-3' : 'px-3 py-3'}`}>
            <dt className="font-mono text-[9px] uppercase tracking-wider text-black/50">{label}</dt>
            <dd className={`mt-1 font-display font-extrabold text-[var(--cpl-dark)] ${compact ? 'text-sm sm:text-base' : 'text-base'}`}>{value}</dd>
          </div>
        ))}
      </dl>
      <p className={`${compact ? 'mt-2 text-[9px] leading-3 sm:mt-3 sm:min-h-8 sm:text-[10px] sm:leading-4' : 'mt-3 min-h-8 text-[10px] leading-4'} ${nutrition ? 'text-black/50' : 'font-bold text-[var(--cpl-sage-dark)]'}`}>{nutrition ? copy.nutrition.note : copy.nutrition.pending}</p>
    </div>
  );
}
