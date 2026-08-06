import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Slider } from "./ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { Calculator, Target, ArrowRight } from "lucide-react";
import { useCpl } from "../hooks/useCpl";
import { calculateMacroTargets } from "../lib/calculations";
import { analytics } from "../lib/analytics";
import { useSiteCopy } from "../hooks/useSiteCopy";
import { proteinTiers } from "../data/site";
import { formatCurrency } from "../lib/order";
import { readStoredState, writeStoredState } from "../lib/storage";

const isMacroInputs = (value) =>
  value &&
  Number.isInteger(value.weight) &&
  value.weight >= 40 &&
  value.weight <= 130 &&
  Number.isInteger(value.height) &&
  value.height >= 140 &&
  value.height <= 210 &&
  Number.isInteger(value.age) &&
  value.age >= 16 &&
  value.age <= 70 &&
  ["male", "female"].includes(value.gender) &&
  [1.2, 1.375, 1.55, 1.725, 1.9].includes(value.activity) &&
  ["cut", "maintain", "muscle"].includes(value.goal);

export function MacroCalculator({ onOpenOrder }) {
  const { t, language } = useCpl();
  const copy = useSiteCopy();
  const [storedInputs] = useState(() =>
    readStoredState("macro-calculator", isMacroInputs),
  );
  const [weight, setWeight] = useState(storedInputs?.weight ?? 70);
  const [height, setHeight] = useState(storedInputs?.height ?? 175);
  const [age, setAge] = useState(storedInputs?.age ?? 28);
  const [gender, setGender] = useState(storedInputs?.gender ?? "male");
  const [activity, setActivity] = useState(storedInputs?.activity ?? 1.55);
  const [goal, setGoal] = useState(storedInputs?.goal ?? "muscle");

  useEffect(() => {
    writeStoredState("macro-calculator", {
      weight,
      height,
      age,
      gender,
      activity,
      goal,
    });
  }, [activity, age, gender, goal, height, weight]);

  const result = calculateMacroTargets({
    weight,
    height,
    age,
    gender,
    activity,
    goal,
  });
  const {
    bmr,
    estimatedCalories: targetCalories,
    estimatedProtein: targetProteinGrams,
    estimatedCarbs: targetCarbGrams,
    estimatedFat: targetFatGrams,
    proteinPerKg: proteinRatio,
    recommendedProteinTier,
  } = result;

  const recommendedMealsPerDay = 2;
  const recommendedTierData =
    proteinTiers.find((tier) => tier.protein === recommendedProteinTier) ||
    proteinTiers[0];
  const recommendedPlanName = `${recommendedProteinTier}g ${language === "ID" ? "Protein" : "Protein Plan"}`;
  const upToLabel = language === "ID" ? "Hingga" : "Up to";
  const activityOptions = [
    { value: 1.2, label: t("calcActivitySedentary") },
    { value: 1.375, label: t("calcActivityLight") },
    { value: 1.55, label: t("calcActivityModerate") },
    { value: 1.725, label: t("calcActivityHeavy") },
    { value: 1.9, label: t("calcActivityAthlete") },
  ];
  const activeActivity =
    activityOptions.find((option) => option.value === activity) ||
    activityOptions[2];

  return (
    <section
      id="calculator"
      className="overflow-x-clip border-b border-[var(--cpl-border)] bg-[var(--cpl-white)] py-12 sm:py-24"
    >
      <div className="mx-auto min-w-0 max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-8 max-w-3xl space-y-3 text-center sm:mb-16 sm:space-y-4">
          <Badge variant="default">
            <span>{t("calcEyebrow")}</span>
          </Badge>
          <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-[var(--cpl-dark)] sm:text-6xl">
            {t("calcTitle")}
          </h2>
          <p className="text-xs leading-5 text-[var(--cpl-dark-muted)] sm:text-lg sm:leading-normal">
            {t("calcSubtitle")}
          </p>
        </div>

        <div className="grid min-w-0 items-stretch gap-5 sm:gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Inputs Column (Equal Height) */}
          <Card className="flex h-full min-w-0 w-full flex-col justify-between space-y-4 rounded-2xl border-2 border-[var(--cpl-dark)] bg-[var(--cpl-cream)] p-4 shadow-sm sm:space-y-6 sm:rounded-3xl sm:p-8 lg:col-span-6">
            <div className="flex items-center gap-2 border-b border-[var(--cpl-border)] pb-3 sm:pb-4">
              <Calculator
                size={20}
                className="text-[var(--cpl-sage)] shrink-0"
              />
              <h3 className="font-display font-extrabold text-base sm:text-lg uppercase tracking-wider text-[var(--cpl-dark)]">
                {t("calcInputSection")}
              </h3>
            </div>

            {/* Gender Toggle */}
            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-widest text-[var(--cpl-dark-muted)] mb-2">
                {t("calcGender")}:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={gender === "male" ? "default" : "outline"}
                  onClick={() => setGender("male")}
                  className={`min-h-11 min-w-0 rounded-xl px-2 ${gender === "male" ? "bg-[#8D9B7D] text-white font-extrabold" : ""}`}
                >
                  {t("calcMale")}
                </Button>
                <Button
                  type="button"
                  variant={gender === "female" ? "default" : "outline"}
                  onClick={() => setGender("female")}
                  className={`min-h-11 min-w-0 rounded-xl px-2 ${gender === "female" ? "bg-[#8D9B7D] text-white font-extrabold" : ""}`}
                >
                  {t("calcFemale")}
                </Button>
              </div>
            </div>

            {/* Body Metric Sliders */}
            <div className="space-y-4 sm:space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-display font-bold text-[var(--cpl-dark)]">
                  <span>{t("calcWeightLabel")}</span>
                  <span className="text-[var(--cpl-sage-dark)] font-extrabold text-sm">
                    {weight} kg
                  </span>
                </div>
                <Slider
                  min={40}
                  max={130}
                  step={1}
                  value={[weight]}
                  onValueChange={(val) => setWeight(val[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-display font-bold text-[var(--cpl-dark)]">
                  <span>{t("calcHeightLabel")}</span>
                  <span className="font-extrabold text-sm">{height} cm</span>
                </div>
                <Slider
                  min={140}
                  max={210}
                  step={1}
                  value={[height]}
                  onValueChange={(val) => setHeight(val[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-display font-bold text-[var(--cpl-dark)]">
                  <span>{t("calcAgeLabel")}</span>
                  <span className="font-extrabold text-sm">
                    {age} {t("calcYears")}
                  </span>
                </div>
                <Slider
                  min={16}
                  max={70}
                  step={1}
                  value={[age]}
                  onValueChange={(val) => setAge(val[0])}
                />
              </div>
            </div>

            {/* Activity Level Selector */}
            <div>
              <label
                id="activity-level-label"
                className="mb-2 block font-sans text-xs font-bold uppercase tracking-widest text-[var(--cpl-dark-muted)]"
              >
                {t("calcActivity")}
              </label>
              <Select
                value={String(activity)}
                onValueChange={(value) => setActivity(Number(value))}
              >
                <SelectTrigger
                  aria-labelledby="activity-level-label"
                  className="group min-h-14 rounded-xl border-2 border-[#1E1E1E] bg-[var(--cpl-cream)] px-3 py-2 text-left hover:bg-[#E1ECD3] sm:min-h-16 sm:rounded-2xl sm:py-2.5"
                >
                  <span className="min-w-0 flex-1">
                    <strong className="block truncate font-display text-[11px] font-extrabold uppercase text-[#1E1E1E]">
                      {activeActivity.label}
                    </strong>
                    <span className="mt-0.5 block font-mono text-[9px] font-bold uppercase tracking-wider text-[#6B7860]">
                      Activity factor · {activity}×
                    </span>
                  </span>
                </SelectTrigger>
                <SelectContent aria-label={t("calcActivity")}>
                  {activityOptions.map((option) => (
                    <SelectItem key={option.value} value={String(option.value)}>
                      <span className="flex w-full items-center justify-between gap-3">
                        <span className="min-w-0 font-display text-[10px] font-extrabold uppercase leading-4">
                          {option.label}
                        </span>
                        <span className="shrink-0 rounded-full border border-current/20 px-2 py-1 font-mono text-[8px] font-bold">
                          {option.value}×
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fitness Goal */}
            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-widest text-[var(--cpl-dark-muted)] mb-2">
                {t("calcGoal")}
              </label>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={goal === "cut" ? "dark" : "outline"}
                  onClick={() => setGoal("cut")}
                  className={`min-h-12 min-w-0 flex-col gap-0.5 rounded-lg px-1 text-[9px] sm:min-h-[52px] sm:rounded-xl sm:px-3 sm:text-[11px] ${goal === "cut" ? "bg-[#1E1E1E] text-white font-extrabold" : ""}`}
                >
                  <span>{t("calcGoalCut")}</span>
                  <span className="text-[8px] font-medium opacity-65">
                    {upToLabel} 2.2g/kg
                  </span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={goal === "maintain" ? "dark" : "outline"}
                  onClick={() => setGoal("maintain")}
                  className={`min-h-12 min-w-0 flex-col gap-0.5 rounded-lg px-1 text-[9px] sm:min-h-[52px] sm:rounded-xl sm:px-3 sm:text-[11px] ${goal === "maintain" ? "bg-[#1E1E1E] text-white font-extrabold" : ""}`}
                >
                  <span>{t("calcGoalMaintain")}</span>
                  <span className="text-[8px] font-medium opacity-65">
                    {upToLabel} 1.4g/kg
                  </span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={goal === "muscle" ? "dark" : "outline"}
                  onClick={() => setGoal("muscle")}
                  className={`min-h-12 min-w-0 flex-col gap-0.5 rounded-lg px-1 text-[9px] sm:min-h-[52px] sm:rounded-xl sm:px-3 sm:text-[11px] ${goal === "muscle" ? "bg-[#1E1E1E] text-white font-extrabold" : ""}`}
                >
                  <span>{t("calcGoalMuscle")}</span>
                  <span className="text-[8px] font-medium opacity-65">
                    {upToLabel} 2.4g/kg
                  </span>
                </Button>
              </div>
            </div>
          </Card>

          {/* Results Output Column (Equal Height) */}
          <div className="flex h-full min-w-0 w-full flex-col justify-between gap-4 sm:gap-6 lg:col-span-6">
            {/* Target Card (Rounded) */}
            <Card className="relative flex min-w-0 w-full flex-1 flex-col justify-between overflow-hidden rounded-2xl border-2 border-[var(--cpl-dark)] bg-[var(--cpl-dark)] p-4 text-white shadow-xl sm:rounded-3xl sm:p-8">
              <div className="mb-4 flex items-start justify-between gap-3 sm:mb-6">
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-xs font-display font-bold uppercase tracking-widest text-[var(--cpl-sage)]">
                    {t("calcEnergyNeeds")}
                  </div>
                  <h4 className="mt-1 font-display text-xl font-extrabold uppercase tracking-tight sm:text-3xl">
                    {t("calcResultTitle")}
                  </h4>
                </div>

                <div className="shrink-0 text-right">
                  <div className="text-[10px] sm:text-xs font-mono text-gray-400 uppercase">
                    TDEE
                  </div>
                  <div className="text-xl sm:text-2xl font-display font-extrabold text-[var(--cpl-sage)]">
                    {targetCalories} KCAL
                  </div>
                </div>
              </div>

              {/* Macro Bar Metrics (Rounded) */}
              <div className="mb-4 grid grid-cols-3 gap-1.5 border-t border-gray-700 pt-4 text-center sm:mb-6 sm:gap-4 sm:pt-6">
                <div className="rounded-xl bg-white/10 p-1.5 sm:rounded-2xl sm:p-3">
                  <div className="text-[10px] font-display font-bold uppercase tracking-wider text-[var(--cpl-sage)]">
                    {t("calcDailyProtein")}
                  </div>
                  <div className="mt-1 font-display text-xl font-black text-white sm:text-3xl">
                    {targetProteinGrams}g
                  </div>
                  <div className="text-[9px] text-gray-400 font-mono">
                    {(
                      ((targetProteinGrams * 4) / targetCalories) *
                      100
                    ).toFixed(0)}
                    % energy
                  </div>
                </div>

                <div className="rounded-xl bg-white/10 p-1.5 sm:rounded-2xl sm:p-3">
                  <div className="text-[10px] font-display font-bold uppercase tracking-wider text-gray-300">
                    {t("calcDailyCarbs")}
                  </div>
                  <div className="mt-1 font-display text-xl font-black text-white sm:text-3xl">
                    {targetCarbGrams}g
                  </div>
                  <div className="text-[9px] text-gray-400 font-mono">
                    {(((targetCarbGrams * 4) / targetCalories) * 100).toFixed(
                      0,
                    )}
                    % energy
                  </div>
                </div>

                <div className="rounded-xl bg-white/10 p-1.5 sm:rounded-2xl sm:p-3">
                  <div className="text-[10px] font-display font-bold uppercase tracking-wider text-gray-300">
                    {t("calcDailyFat")}
                  </div>
                  <div className="mt-1 font-display text-xl font-black text-white sm:text-3xl">
                    {targetFatGrams}g
                  </div>
                  <div className="text-[9px] text-gray-400 font-mono">
                    {(((targetFatGrams * 9) / targetCalories) * 100).toFixed(0)}
                    % energy
                  </div>
                </div>
              </div>

              <div className="space-y-1 font-mono text-[10px] leading-4 text-gray-300 sm:text-xs sm:leading-normal">
                <p>
                  {t("calcProteinTargetDesc").replace("{ratio}", proteinRatio)}
                </p>
                <p>
                  {t("calcBmrEstimate")} <strong>{Math.round(bmr)} Kcal</strong>{" "}
                  | {t("calcFactor")} <strong>{activity}x</strong>
                </p>
              </div>
            </Card>

            {/* Tailored CPL Recommendation (Rounded) */}
            <Card className="min-w-0 w-full space-y-3 rounded-2xl border-2 border-[var(--cpl-sage)] bg-[var(--cpl-sage-light)] p-4 shadow-sm sm:space-y-4 sm:rounded-3xl sm:p-6">
              <div className="flex items-center gap-2 text-xs font-display font-bold uppercase tracking-widest text-[var(--cpl-sage-dark)]">
                <Target size={16} className="shrink-0" />
                <span>{t("calcRecommendationTitle")}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="min-w-0 wrap-break-word font-display text-lg font-extrabold uppercase text-[var(--cpl-dark)] sm:text-2xl">
                  {recommendedPlanName}
                </h4>
                <Badge
                  variant="solid"
                  className="bg-[#8D9B7D] text-white w-fit"
                >
                  {recommendedProteinTier}g tier
                </Badge>
              </div>

              <p className="text-xs text-[var(--cpl-dark-muted)] leading-relaxed">
                {t("calcRecSummary")
                  .replace("{protein}", targetProteinGrams)
                  .replace("{plan}", recommendedPlanName)
                  .replace("{meals}", recommendedMealsPerDay)}
              </p>

              <p className="rounded-lg border border-[var(--cpl-sage)]/35 bg-white/70 p-2.5 text-[10px] leading-4 text-[var(--cpl-dark-muted)] sm:rounded-xl sm:p-3 sm:text-[11px] sm:leading-relaxed">
                {copy.calculatorDisclaimer}
              </p>

              <Button
                variant="default"
                size="lg"
                onClick={() => {
                  analytics.calculatorUsed({
                    estimated_calories: targetCalories,
                    estimated_protein: targetProteinGrams,
                    recommended_protein_tier: recommendedProteinTier,
                    goal,
                  });
                  onOpenOrder(recommendedProteinTier);
                }}
                className="flex h-auto min-h-12 w-full items-center justify-center gap-2 whitespace-normal bg-[#8D9B7D] px-4 py-3 text-center text-xs font-extrabold leading-tight text-white hover:bg-[#6B7860]"
              >
                <span>
                  {copy.calculatorCta.replace("{tier}", recommendedProteinTier)}
                </span>
                <ArrowRight size={16} />
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
