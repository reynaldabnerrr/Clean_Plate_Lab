import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Slider } from './ui/slider';
import { Calculator, Target, ArrowRight } from 'lucide-react';
import { useCpl } from '../context/CplContext';

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

  const recommendedMealsPerDay = targetProteinGrams > 120 ? 3 : 2;
  const recommendedPlanName = goal === "muscle" 
    ? "CPL ATHLETE PRO FUEL" 
    : goal === "cut" 
      ? "CPL LEAN MUSCLE CUT" 
      : "CPL BALANCED WELLNESS";

  return (
    <section id="calculator" className="py-24 bg-[var(--cpl-cream)] border-b border-[var(--cpl-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="default">
            <span>{t('calcEyebrow')}</span>
          </Badge>
          <h2 className="font-display text-4xl sm:text-6xl font-extrabold uppercase tracking-tight text-[var(--cpl-dark)]">
            {t('calcTitle')}
          </h2>
          <p className="text-lg text-[var(--cpl-dark-muted)] font-light">
            {t('calcSubtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          
          {/* Inputs Column */}
          <Card className="lg:col-span-6 p-8 bg-[var(--cpl-white)] border-2 border-[var(--cpl-dark)] space-y-6 rounded-none">
            
            <div className="flex items-center gap-2 border-b border-[var(--cpl-border)] pb-4">
              <Calculator size={20} className="text-[var(--cpl-sage)]" />
              <h3 className="font-display font-extrabold text-lg uppercase tracking-wider text-[var(--cpl-dark)]">
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
                  className={gender === "male" ? "bg-[#8A9C7A] text-white font-extrabold" : ""}
                >
                  {t('calcMale')}
                </Button>
                <Button
                  type="button"
                  variant={gender === "female" ? "default" : "outline"}
                  onClick={() => setGender("female")}
                  className={gender === "female" ? "bg-[#8A9C7A] text-white font-extrabold" : ""}
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
                  <span className="font-extrabold text-sm">{age} yrs</span>
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
                className="w-full h-11 p-3 border border-[var(--cpl-dark)] text-xs font-display font-bold bg-[var(--cpl-cream)] text-[var(--cpl-dark)] focus:outline-none"
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
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={goal === "cut" ? "dark" : "outline"}
                  onClick={() => setGoal("cut")}
                  className={goal === "cut" ? "bg-[#1E1E1E] text-white font-extrabold" : ""}
                >
                  {t('calcGoalCut')}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={goal === "maintain" ? "dark" : "outline"}
                  onClick={() => setGoal("maintain")}
                  className={goal === "maintain" ? "bg-[#1E1E1E] text-white font-extrabold" : ""}
                >
                  {t('calcGoalMaintain')}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={goal === "muscle" ? "dark" : "outline"}
                  onClick={() => setGoal("muscle")}
                  className={goal === "muscle" ? "bg-[#1E1E1E] text-white font-extrabold" : ""}
                >
                  {t('calcGoalMuscle')}
                </Button>
              </div>
            </div>

          </Card>

          {/* Results Output Column */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Target Card */}
            <Card className="p-8 bg-[var(--cpl-dark)] text-white border-2 border-[var(--cpl-dark)] shadow-xl relative overflow-hidden rounded-none">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-xs font-display font-bold uppercase tracking-widest text-[var(--cpl-sage)]">
                    {t('calcEnergyNeeds')}
                  </div>
                  <h4 className="font-display text-3xl font-extrabold uppercase tracking-tight mt-1">
                    {t('calcResultTitle')}
                  </h4>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono text-gray-400 uppercase">TDEE</div>
                  <div className="text-2xl font-display font-extrabold text-[var(--cpl-sage)]">{targetCalories} KCAL</div>
                </div>
              </div>

              {/* Macro Bar Metrics */}
              <div className="grid grid-cols-3 gap-4 text-center border-t border-gray-700 pt-6 mb-6">
                <div className="p-3 bg-white/10">
                  <div className="text-[10px] font-display font-bold uppercase tracking-wider text-[var(--cpl-sage)]">{t('calcDailyProtein')}</div>
                  <div className="font-display text-3xl font-black text-white mt-1">{targetProteinGrams}g</div>
                  <div className="text-[9px] text-gray-400 font-mono">{(targetProteinGrams*4/targetCalories*100).toFixed(0)}% energy</div>
                </div>

                <div className="p-3 bg-white/10">
                  <div className="text-[10px] font-display font-bold uppercase tracking-wider text-gray-300">{t('calcDailyCarbs')}</div>
                  <div className="font-display text-3xl font-black text-white mt-1">{targetCarbGrams}g</div>
                  <div className="text-[9px] text-gray-400 font-mono">{(targetCarbGrams*4/targetCalories*100).toFixed(0)}% energy</div>
                </div>

                <div className="p-3 bg-white/10">
                  <div className="text-[10px] font-display font-bold uppercase tracking-wider text-gray-300">{t('calcDailyFat')}</div>
                  <div className="font-display text-3xl font-black text-white mt-1">{targetFatGrams}g</div>
                  <div className="text-[9px] text-gray-400 font-mono">{(targetFatGrams*9/targetCalories*100).toFixed(0)}% energy</div>
                </div>
              </div>

              <div className="text-xs text-gray-300 font-mono space-y-1">
                <p>• Protein target: <strong>{proteinRatio}g / kg body weight</strong>.</p>
                <p>• Estimated BMR: <strong>{Math.round(bmr)} Kcal</strong> | Activity Factor: <strong>{activity}x</strong></p>
              </div>
            </Card>

            {/* Tailored CPL Recommendation */}
            <Card className="p-6 bg-[var(--cpl-sage-light)] border-2 border-[var(--cpl-sage)] space-y-4 rounded-none">
              <div className="flex items-center gap-2 text-xs font-display font-bold uppercase tracking-widest text-[var(--cpl-sage-dark)]">
                <Target size={16} />
                <span>{t('calcRecommendationTitle')}</span>
              </div>

              <div className="flex justify-between items-center">
                <h4 className="font-display text-2xl font-extrabold uppercase text-[var(--cpl-dark)]">
                  {recommendedPlanName}
                </h4>
                <Badge variant="solid" className="bg-[#8A9C7A] text-white">
                  {recommendedMealsPerDay} Meals / Day
                </Badge>
              </div>

              <p className="text-xs text-[var(--cpl-dark-muted)] leading-relaxed">
                Target: <strong>{targetProteinGrams}g protein</strong>. Recommended: <strong>{recommendedPlanName}</strong> ({recommendedMealsPerDay} fresh meal boxes daily).
              </p>

              <Button
                variant="default"
                size="lg"
                onClick={onOpenOrder}
                className="w-full flex items-center justify-center gap-2 bg-[#8A9C7A] hover:bg-[#647554] text-white font-extrabold"
              >
                <span>Subscribe to {recommendedPlanName}</span>
                <ArrowRight size={16} />
              </Button>
            </Card>

          </div>

        </div>

      </div>
    </section>
  );
}
