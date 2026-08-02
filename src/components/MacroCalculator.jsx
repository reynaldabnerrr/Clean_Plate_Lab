import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Slider } from './ui/slider';
import { Calculator, Target, ArrowRight } from 'lucide-react';
import { useCpl } from '../hooks/useCpl';

export function MacroCalculator({ onOpenOrder }) {
  const { t } = useCpl();
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [age, setAge] = useState(28);
  const [gender, setGender] = useState("male");
  const [activity, setActivity] = useState(1.55);
  const [goal, setGoal] = useState("muscle");

  // Revised Harris-Benedict BMR formula calculation
  const bmr = gender === "male"
    ? 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    : 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);

  const tdee = Math.round(bmr * activity);

  let targetCalories = tdee;
  let proteinRatio = 2.2;
  if (goal === "cut") {
    targetCalories = Math.round(tdee * 0.82);
    proteinRatio = 2.4;
  } else if (goal === "muscle") {
    targetCalories = Math.round(tdee * 1.12);
    proteinRatio = 2.2;
  }

  const targetProteinGrams = Math.round(weight * proteinRatio);
  const proteinKcal = targetProteinGrams * 4;
  const fatKcal = Math.round(targetCalories * 0.25);
  const targetFatGrams = Math.round(fatKcal / 9);
  const carbKcal = Math.max(0, targetCalories - proteinKcal - fatKcal);
  const targetCarbGrams = Math.round(carbKcal / 4);

  const recommendedMealsPerDay = 1;
  const recommendedPlanName = goal === "muscle" 
    ? t('calcPlanAthlete') 
    : goal === "cut" 
      ? t('calcPlanCut') 
      : t('calcPlanWellness');

  return (
    <section id="calculator" className="overflow-x-clip border-b border-[var(--cpl-border)] bg-(--cpl-cream) py-16 sm:py-24">
      <div className="mx-auto min-w-0 max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-4">
          <Badge variant="default">
            <span>{t('calcEyebrow')}</span>
          </Badge>
          <h2 className="font-display text-3xl sm:text-6xl font-extrabold uppercase tracking-tight text-[var(--cpl-dark)]">
            {t('calcTitle')}
          </h2>
          <p className="text-base sm:text-lg text-[var(--cpl-dark-muted)] font-light">
            {t('calcSubtitle')}
          </p>
        </div>

        <div className="grid min-w-0 items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
          
          {/* Inputs Column (Equal Height) */}
          <Card className="flex h-full min-w-0 w-full flex-col justify-between space-y-6 rounded-3xl border-2 border-[var(--cpl-dark)] bg-[var(--cpl-white)] p-5 shadow-sm sm:p-8 lg:col-span-6">
            
            <div className="flex items-center gap-2 border-b border-[var(--cpl-border)] pb-4">
              <Calculator size={20} className="text-[var(--cpl-sage)] shrink-0" />
              <h3 className="font-display font-extrabold text-base sm:text-lg uppercase tracking-wider text-[var(--cpl-dark)]">
                {t('calcInputSection')}
              </h3>
            </div>

            {/* Gender Toggle */}
            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-widest text-[var(--cpl-dark-muted)] mb-2">
                {t('calcGender')}:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={gender === "male" ? "default" : "outline"}
                  onClick={() => setGender("male")}
                  className={`min-h-11 min-w-0 rounded-xl px-2 ${gender === "male" ? "bg-[#8A9C7A] text-white font-extrabold" : ""}`}
                >
                  {t('calcMale')}
                </Button>
                <Button
                  type="button"
                  variant={gender === "female" ? "default" : "outline"}
                  onClick={() => setGender("female")}
                  className={`min-h-11 min-w-0 rounded-xl px-2 ${gender === "female" ? "bg-[#8A9C7A] text-white font-extrabold" : ""}`}
                >
                  {t('calcFemale')}
                </Button>
              </div>
            </div>

            {/* Body Metric Sliders */}
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-display font-bold text-[var(--cpl-dark)]">
                  <span>{t('calcWeightLabel')}</span>
                  <span className="text-[var(--cpl-sage-dark)] font-extrabold text-sm">{weight} kg</span>
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
                  <span>{t('calcHeightLabel')}</span>
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
                  <span>{t('calcAgeLabel')}</span>
                  <span className="font-extrabold text-sm">{age} {t('calcYears')}</span>
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
              <label className="block text-xs font-display font-bold uppercase tracking-widest text-[var(--cpl-dark-muted)] mb-2">
                {t('calcActivity')}
              </label>
              <select
                value={activity}
                onChange={(e) => setActivity(Number(e.target.value))}
                className="h-11 w-full min-w-0 max-w-full truncate rounded-xl border border-[var(--cpl-dark)] bg-[var(--cpl-cream)] p-3 font-display text-xs font-bold text-[var(--cpl-dark)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cpl-sage)]"
              >
                <option value={1.2}>{t('calcActivitySedentary')}</option>
                <option value={1.375}>{t('calcActivityLight')}</option>
                <option value={1.55}>{t('calcActivityModerate')}</option>
                <option value={1.725}>{t('calcActivityHeavy')}</option>
                <option value={1.9}>{t('calcActivityAthlete')}</option>
              </select>
            </div>

            {/* Fitness Goal */}
            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-widest text-[var(--cpl-dark-muted)] mb-2">
                {t('calcGoal')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={goal === "cut" ? "dark" : "outline"}
                  onClick={() => setGoal("cut")}
                  className={`min-h-[40px] rounded-xl ${goal === "cut" ? "bg-[#1E1E1E] text-white font-extrabold" : ""}`}
                >
                  {t('calcGoalCut')}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={goal === "maintain" ? "dark" : "outline"}
                  onClick={() => setGoal("maintain")}
                  className={`min-h-[40px] rounded-xl ${goal === "maintain" ? "bg-[#1E1E1E] text-white font-extrabold" : ""}`}
                >
                  {t('calcGoalMaintain')}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={goal === "muscle" ? "dark" : "outline"}
                  onClick={() => setGoal("muscle")}
                  className={`min-h-[40px] rounded-xl ${goal === "muscle" ? "bg-[#1E1E1E] text-white font-extrabold" : ""}`}
                >
                  {t('calcGoalMuscle')}
                </Button>
              </div>
            </div>

          </Card>

          {/* Results Output Column (Equal Height) */}
          <div className="flex h-full min-w-0 w-full flex-col justify-between gap-6 lg:col-span-6">
            
            {/* Target Card (Rounded) */}
            <Card className="relative flex min-w-0 w-full flex-1 flex-col justify-between overflow-hidden rounded-3xl border-2 border-[var(--cpl-dark)] bg-[var(--cpl-dark)] p-5 text-white shadow-xl sm:p-8">
              <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row">
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-xs font-display font-bold uppercase tracking-widest text-[var(--cpl-sage)]">
                    {t('calcEnergyNeeds')}
                  </div>
                  <h4 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight mt-1">
                    {t('calcResultTitle')}
                  </h4>
                </div>

                <div className="shrink-0 text-left sm:text-right">
                  <div className="text-[10px] sm:text-xs font-mono text-gray-400 uppercase">TDEE</div>
                  <div className="text-xl sm:text-2xl font-display font-extrabold text-[var(--cpl-sage)]">{targetCalories} KCAL</div>
                </div>
              </div>

              {/* Macro Bar Metrics (Rounded) */}
              <div className="mb-6 grid grid-cols-3 gap-2 border-t border-gray-700 pt-6 text-center sm:gap-4">
                <div className="rounded-2xl bg-white/10 p-2 sm:p-3">
                  <div className="text-[10px] font-display font-bold uppercase tracking-wider text-[var(--cpl-sage)]">{t('calcDailyProtein')}</div>
                  <div className="mt-1 font-display text-xl font-black text-white sm:text-3xl">{targetProteinGrams}g</div>
                  <div className="text-[9px] text-gray-400 font-mono">{(targetProteinGrams*4/targetCalories*100).toFixed(0)}% energy</div>
                </div>

                <div className="rounded-2xl bg-white/10 p-2 sm:p-3">
                  <div className="text-[10px] font-display font-bold uppercase tracking-wider text-gray-300">{t('calcDailyCarbs')}</div>
                  <div className="mt-1 font-display text-xl font-black text-white sm:text-3xl">{targetCarbGrams}g</div>
                  <div className="text-[9px] text-gray-400 font-mono">{(targetCarbGrams*4/targetCalories*100).toFixed(0)}% energy</div>
                </div>

                <div className="rounded-2xl bg-white/10 p-2 sm:p-3">
                  <div className="text-[10px] font-display font-bold uppercase tracking-wider text-gray-300">{t('calcDailyFat')}</div>
                  <div className="mt-1 font-display text-xl font-black text-white sm:text-3xl">{targetFatGrams}g</div>
                  <div className="text-[9px] text-gray-400 font-mono">{(targetFatGrams*9/targetCalories*100).toFixed(0)}% energy</div>
                </div>
              </div>

              <div className="text-xs text-gray-300 font-mono space-y-1">
                <p>{t('calcProteinTargetDesc').replace('{ratio}', proteinRatio)}</p>
                <p>{t('calcBmrEstimate')} <strong>{Math.round(bmr)} Kcal</strong> | {t('calcFactor')} <strong>{activity}x</strong></p>
              </div>
            </Card>

            {/* Tailored CPL Recommendation (Rounded) */}
            <Card className="min-w-0 w-full space-y-4 rounded-3xl border-2 border-[var(--cpl-sage)] bg-[var(--cpl-sage-light)] p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-2 text-xs font-display font-bold uppercase tracking-widest text-[var(--cpl-sage-dark)]">
                <Target size={16} className="shrink-0" />
                <span>{t('calcRecommendationTitle')}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="min-w-0 wrap-break-word font-display text-xl font-extrabold uppercase text-[var(--cpl-dark)] sm:text-2xl">
                  {recommendedPlanName}
                </h4>
                <Badge variant="solid" className="bg-[#8A9C7A] text-white w-fit">
                  {recommendedMealsPerDay} {t('calcMealsPerDay')}
                </Badge>
              </div>

              <p className="text-xs text-[var(--cpl-dark-muted)] leading-relaxed">
                {t('calcRecSummary').replace('{protein}', targetProteinGrams).replace('{plan}', recommendedPlanName).replace('{meals}', recommendedMealsPerDay)}
              </p>

              <Button
                variant="default"
                size="lg"
                onClick={onOpenOrder}
                className="flex h-auto min-h-12 w-full items-center justify-center gap-2 whitespace-normal bg-[#8A9C7A] px-4 py-3 text-center text-xs font-extrabold leading-tight text-white hover:bg-[#647554]"
              >
                <span>{t('calcSubscribeBtn').replace('{plan}', recommendedPlanName)}</span>
                <ArrowRight size={16} />
              </Button>
            </Card>

          </div>

        </div>

      </div>
    </section>
  );
}
