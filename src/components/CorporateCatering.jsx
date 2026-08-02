import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Slider } from './ui/slider';
import { Building2, Users, Send, CheckCircle2 } from 'lucide-react';
import { useCpl } from '../context/CplContext';

export function CorporateCatering({ onOpenOrder }) {
  const { t } = useCpl();
  const [headcount, setHeadcount] = useState(25);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [mealType, setMealType] = useState("lunch");

  const costPerMeal = headcount > 50 ? 55000 : 65000;
  const totalMealsPerWeek = headcount * daysPerWeek * (mealType === "full" ? 2 : 1);
  const estimatedWeeklyCost = totalMealsPerWeek * costPerMeal;

  return (
    <section id="catering" className="py-24 bg-[var(--cpl-white)] border-b border-[var(--cpl-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="default">
            <span>{t('b2bEyebrow')}</span>
          </Badge>
          <h2 className="font-display text-4xl sm:text-6xl font-extrabold uppercase tracking-tight text-[var(--cpl-dark)]">
            {t('b2bTitle')}
          </h2>
          <p className="text-lg text-[var(--cpl-dark-muted)] font-light">
            {t('b2bSubtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Info & Benefits */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <h3 className="font-display text-3xl font-extrabold uppercase text-[var(--cpl-dark)]">
                {t('b2bHeadline')}
              </h3>
              <p className="text-sm text-[var(--cpl-dark-muted)] leading-relaxed">
                {t('b2bDesc')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="p-4 bg-[var(--cpl-cream)] border border-[var(--cpl-border)] rounded-none">
                <Building2 size={24} className="text-[var(--cpl-sage)] mb-2" />
                <h4 className="font-display font-extrabold text-sm uppercase text-[var(--cpl-dark)]">{t('b2bCard1Title')}</h4>
                <p className="text-xs text-[var(--cpl-dark-muted)] mt-1">{t('b2bCard1Desc')}</p>
              </Card>

              <Card className="p-4 bg-[var(--cpl-cream)] border border-[var(--cpl-border)] rounded-none">
                <Users size={24} className="text-[var(--cpl-sage)] mb-2" />
                <h4 className="font-display font-extrabold text-sm uppercase text-[var(--cpl-dark)]">{t('b2bCard2Title')}</h4>
                <p className="text-xs text-[var(--cpl-dark-muted)] mt-1">{t('b2bCard2Desc')}</p>
              </Card>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs font-display font-bold uppercase text-[var(--cpl-dark)]">
                <CheckCircle2 size={16} className="text-[var(--cpl-sage)]" />
                <span>{t('b2bFeature1')}</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-display font-bold uppercase text-[var(--cpl-dark)]">
                <CheckCircle2 size={16} className="text-[var(--cpl-sage)]" />
                <span>{t('b2bFeature2')}</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-display font-bold uppercase text-[var(--cpl-dark)]">
                <CheckCircle2 size={16} className="text-[var(--cpl-sage)]" />
                <span>{t('b2bFeature3')}</span>
              </div>
            </div>
          </div>

          {/* Right Interactive Estimator */}
          <Card className="lg:col-span-6 bg-[var(--cpl-cream)] p-8 border-2 border-[var(--cpl-dark)] space-y-6 rounded-none">
            <div className="flex justify-between items-center border-b border-[var(--cpl-border)] pb-4">
              <h3 className="font-display text-xl font-extrabold uppercase text-[var(--cpl-dark)]">
                {t('b2bEstimatorTitle')}
              </h3>
              <Badge variant="solid" className="bg-[#8A9C7A] text-white">
                B2B Tier Pricing
              </Badge>
            </div>

            {/* Headcount Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-display font-bold text-[var(--cpl-dark)]">
                <span>{t('b2bTeamSize')}</span>
                <span className="text-[var(--cpl-sage-dark)] font-extrabold text-sm">{headcount} People</span>
              </div>
              <Slider
                min={10}
                max={200}
                step={5}
                value={[headcount]}
                onValueChange={(val) => setHeadcount(val[0])}
              />
            </div>

            {/* Days per Week Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-display font-bold text-[var(--cpl-dark)]">
                <span>{t('b2bDeliveryDays')}</span>
                <span className="font-extrabold text-sm">{daysPerWeek} Days</span>
              </div>
              <Slider
                min={1}
                max={7}
                step={1}
                value={[daysPerWeek]}
                onValueChange={(val) => setDaysPerWeek(val[0])}
              />
            </div>

            {/* Meal Type Buttons */}
            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-widest text-[var(--cpl-dark-muted)] mb-2">
                {t('b2bServiceOption')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={mealType === "lunch" ? "dark" : "outline"}
                  onClick={() => setMealType("lunch")}
                  className={mealType === "lunch" ? "bg-[#1E1E1E] text-white font-bold" : ""}
                >
                  {t('b2bLunchOnly')}
                </Button>
                <Button
                  type="button"
                  variant={mealType === "full" ? "dark" : "outline"}
                  onClick={() => setMealType("full")}
                  className={mealType === "full" ? "bg-[#1E1E1E] text-white font-bold" : ""}
                >
                  {t('b2bFullDay')}
                </Button>
              </div>
            </div>

            {/* Estimated Total Bar */}
            <div className="p-4 bg-[var(--cpl-white)] border border-[var(--cpl-dark)] space-y-2">
              <div className="flex justify-between text-xs font-display font-bold text-[var(--cpl-dark-muted)]">
                <span>{t('b2bWeeklyMeals')}</span>
                <span className="font-mono text-[var(--cpl-dark)]">{totalMealsPerWeek} boxes / wk</span>
              </div>

              <div className="flex justify-between items-baseline pt-2 border-t border-[var(--cpl-border-light)]">
                <span className="font-display font-extrabold text-sm text-[var(--cpl-dark)]">{t('b2bWeeklyBudget')}</span>
                <span className="font-display font-extrabold text-2xl text-[var(--cpl-sage-dark)]">
                  Rp {estimatedWeeklyCost.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="text-[10px] text-right font-mono text-gray-500">
                Rate: Rp {costPerMeal.toLocaleString('id-ID')} / meal box
              </div>
            </div>

            <Button
              variant="default"
              size="lg"
              onClick={onOpenOrder}
              className="w-full flex items-center justify-center gap-2 bg-[#8A9C7A] hover:bg-[#647554] text-white font-extrabold"
            >
              <Send size={16} />
              <span>{t('b2bCta')}</span>
            </Button>

          </Card>

        </div>

      </div>
    </section>
  );
}
