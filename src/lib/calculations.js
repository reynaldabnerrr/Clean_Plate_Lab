import { proteinTiers } from '../data/site.js';

const GOAL_SETTINGS = {
  cut: { calorieMultiplier: 0.82, proteinPerKg: 2.2 },
  maintain: { calorieMultiplier: 1, proteinPerKg: 1.4 },
  muscle: { calorieMultiplier: 1.12, proteinPerKg: 2.4 },
};

function nearestProteinTier(target) {
  return proteinTiers.reduce((nearest, tier) => (
    Math.abs(tier.protein - target) < Math.abs(nearest.protein - target) ? tier : nearest
  )).protein;
}

export function calculateMacroTargets({ weight, height, age, gender, activity, goal }) {
  const safeWeight = Number(weight);
  const safeHeight = Number(height);
  const safeAge = Number(age);
  const safeActivity = Number(activity);
  const settings = GOAL_SETTINGS[goal] || GOAL_SETTINGS.maintain;

  const bmr = gender === 'female'
    ? 447.593 + (9.247 * safeWeight) + (3.098 * safeHeight) - (4.33 * safeAge)
    : 88.362 + (13.397 * safeWeight) + (4.799 * safeHeight) - (5.677 * safeAge);

  const estimatedCalories = Math.round(bmr * safeActivity * settings.calorieMultiplier);
  const estimatedProtein = Math.round(safeWeight * settings.proteinPerKg);
  const estimatedFat = Math.round((estimatedCalories * 0.25) / 9);
  const estimatedCarbs = Math.max(0, Math.round((estimatedCalories - (estimatedProtein * 4) - (estimatedFat * 9)) / 4));
  const mealProteinTarget = estimatedProtein / 2;

  return {
    bmr: Math.round(bmr),
    estimatedCalories,
    estimatedProtein,
    estimatedCarbs,
    estimatedFat,
    proteinPerKg: settings.proteinPerKg,
    recommendedProteinTier: nearestProteinTier(mealProteinTarget),
  };
}
