import React from 'react';
import { useSiteCopy } from '../hooks/useSiteCopy';
import { getNutritionForTier } from '../data/meals';

export function NutritionPanel({ meal, proteinTier = meal.protein, compact = false }) {
  const copy = useSiteCopy();
  const nutrition = getNutritionForTier(meal, proteinTier);
  const nutrients = [
    [copy.nutrition.protein, `${nutrition?.protein ?? proteinTier}g`],
    [copy.nutrition.carbs, nutrition ? `${nutrition.carbs}g` : '—'],
    [copy.nutrition.fat, nutrition ? `${nutrition.fat}g` : '—'],
    [copy.nutrition.fiber, nutrition ? `${nutrition.fiber}g` : '—'],
    [copy.nutrition.sodium, nutrition ? `${nutrition.sodium}mg` : '—'],
    [copy.nutrition.potassium, nutrition ? `${nutrition.potassium}mg` : '—'],
  ];

  return (
    <div className="nutrition-panel" aria-label={`${copy.nutrition.eyebrow}: ${meal.name}, ${proteinTier}g`}>
      <div className="flex items-end justify-between gap-4 border-b-2 border-black pb-4">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--cpl-sage-dark)]">{copy.nutrition.eyebrow}</p>
          <p className="mt-1 font-display text-lg font-extrabold uppercase">{copy.nutrition.perMeal} · {proteinTier}g</p>
        </div>
        <div className="text-right">
          <strong className="font-display text-3xl font-black">{nutrition?.calories ?? '—'}</strong>
          <span className="ml-1 font-mono text-[10px] font-bold uppercase">{copy.nutrition.calories}</span>
        </div>
      </div>
      <dl className={`mt-4 grid ${compact ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-3'} gap-px overflow-hidden border-2 border-black bg-black`}>
        {nutrients.map(([label, value]) => (
          <div key={label} className="bg-white px-3 py-3">
            <dt className="font-mono text-[9px] uppercase tracking-wider text-black/50">{label}</dt>
            <dd className="mt-1 font-display text-base font-extrabold text-[var(--cpl-dark)]">{value}</dd>
          </div>
        ))}
      </dl>
      <p className={`mt-3 min-h-8 text-[10px] leading-4 ${nutrition ? 'text-black/50' : 'font-bold text-[var(--cpl-sage-dark)]'}`}>{nutrition ? copy.nutrition.note : copy.nutrition.pending}</p>
    </div>
  );
}
