import { proteinTiers } from "../data/site.js";

const GOAL_SETTINGS = {
  cut: { calorieMultiplier: 0.82, proteinPerKg: 2.2 },
  maintain: { calorieMultiplier: 1, proteinPerKg: 1.4 },
  muscle: { calorieMultiplier: 1.12, proteinPerKg: 2.4 },
};

function nearestProteinTier(target) {
  const numTarget = Number(target);
  if (!Number.isFinite(numTarget) || numTarget <= 0) {
    return proteinTiers[0]?.protein || 40;
  }
  return proteinTiers.reduce((nearest, tier) =>
    Math.abs(tier.protein - numTarget) < Math.abs(nearest.protein - numTarget)
      ? tier
      : nearest,
  ).protein;
}

export function calculateMacroTargets(params = {}) {
  const {
    weight = 70,
    height = 170,
    age = 25,
    gender = "male",
    activity = 1.375,
    goal = "maintain",
  } = params || {};

  const rawWeight = Number(weight);
  const safeWeight = Number.isFinite(rawWeight) && rawWeight > 0 ? rawWeight : 70;
  const rawHeight = Number(height);
  const safeHeight = Number.isFinite(rawHeight) && rawHeight > 0 ? rawHeight : 170;
  const rawAge = Number(age);
  const safeAge = Number.isFinite(rawAge) && rawAge > 0 ? rawAge : 25;
  const rawActivity = Number(activity);
  const safeActivity = Number.isFinite(rawActivity) && rawActivity > 0 ? rawActivity : 1.375;
  const safeGender = gender === "female" ? "female" : "male";
  const settings = GOAL_SETTINGS[goal] || GOAL_SETTINGS.maintain;

  const bmr =
    safeGender === "female"
      ? 447.593 + 9.247 * safeWeight + 3.098 * safeHeight - 4.33 * safeAge
      : 88.362 + 13.397 * safeWeight + 4.799 * safeHeight - 5.677 * safeAge;

  const estimatedCalories = Math.round(
    bmr * safeActivity * settings.calorieMultiplier,
  );
  const estimatedProtein = Math.round(safeWeight * settings.proteinPerKg);
  const estimatedFat = Math.round((estimatedCalories * 0.25) / 9);
  const estimatedCarbs = Math.max(
    0,
    Math.round(
      (estimatedCalories - estimatedProtein * 4 - estimatedFat * 9) / 4,
    ),
  );
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
