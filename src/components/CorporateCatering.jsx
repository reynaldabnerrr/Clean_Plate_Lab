import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Slider } from './ui/slider';
import { Building2, Users, Send, CheckCircle2 } from 'lucide-react';
import { useCpl } from '../hooks/useCpl';

export function CorporateCatering({ onOpenOrder }) {
  const { t } = useCpl();
  const [headcount, setHeadcount] = useState(25);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [proteinTier, setProteinTier] = useState(25); // 25 | 60 | 80 | 100

  const getTierPrice = (tier) => {
    if (tier === 100) return 60000;
    if (tier === 80) return 50000;
    if (tier === 60) return 40000;
    return 25000;
  };

  const costPerMeal = getTierPrice(proteinTier);
  const totalMealsPerWeek = headcount * daysPerWeek;
  const estimatedWeeklyCost = totalMealsPerWeek * costPerMeal;

  return (
    <section id="catering" className="overflow-x-clip border-b border-[var(--cpl-border)] bg-[var(--cpl-white)] py-16 sm:py-24">
      <div className="mx-auto min-w-0 max-w-7xl px-4 sm:px-6 lg:px-8">
        
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

        <div className="grid min-w-0 items-center gap-10 lg:grid-cols-12">
          
          {/* Left Info & Benefits */}
          <div className="min-w-0 space-y-8 lg:col-span-6">
            <div className="space-y-4">
              <h3 className="wrap-break-word font-display text-2xl font-extrabold uppercase text-[var(--cpl-dark)] sm:text-3xl">
                {t('b2bHeadline')}
              </h3>
              <p className="text-sm text-[var(--cpl-dark-muted)] leading-relaxed">
                {t('b2bDesc')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="min-w-0 rounded-2xl border border-[var(--cpl-border)] bg-[var(--cpl-cream)] p-4 shadow-sm">
                <Building2 size={24} className="text-[var(--cpl-sage)] mb-2" />
                <h4 className="font-display font-extrabold text-sm uppercase text-[var(--cpl-dark)]">{t('b2bCard1Title')}</h4>
                <p className="text-xs text-[var(--cpl-dark-muted)] mt-1">{t('b2bCard1Desc')}</p>
              </Card>

              <Card className="min-w-0 rounded-2xl border border-[var(--cpl-border)] bg-[var(--cpl-cream)] p-4 shadow-sm">
                <Users size={24} className="text-[var(--cpl-sage)] mb-2" />
                <h4 className="font-display font-extrabold text-sm uppercase text-[var(--cpl-dark)]">{t('b2bCard2Title')}</h4>
                <p className="text-xs text-[var(--cpl-dark-muted)] mt-1">{t('b2bCard2Desc')}</p>
              </Card>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 font-display text-xs font-bold uppercase leading-relaxed text-[var(--cpl-dark)]">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[var(--cpl-sage)]" />
                <span className="min-w-0 wrap-break-word">{t('b2bFeature1')}</span>
              </div>
              <div className="flex items-start gap-3 font-display text-xs font-bold uppercase leading-relaxed text-[var(--cpl-dark)]">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[var(--cpl-sage)]" />
                <span className="min-w-0 wrap-break-word">{t('b2bFeature2')}</span>
              </div>
              <div className="flex items-start gap-3 font-display text-xs font-bold uppercase leading-relaxed text-[var(--cpl-dark)]">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[var(--cpl-sage)]" />
                <span className="min-w-0 wrap-break-word">{t('b2bFeature3')}</span>
              </div>
            </div>
          </div>

          {/* Right Interactive Estimator (Rounded) */}
          <Card className="min-w-0 w-full space-y-6 rounded-3xl border-2 border-[var(--cpl-dark)] bg-[var(--cpl-cream)] p-5 shadow-md sm:p-8 lg:col-span-6">
            <div className="flex flex-col items-start justify-between gap-3 border-b border-[var(--cpl-border)] pb-4 sm:flex-row sm:items-center">
              <h3 className="font-display text-xl font-extrabold uppercase text-[var(--cpl-dark)]">
                {t('b2bEstimatorTitle')}
              </h3>
              <Badge variant="solid" className="bg-[#8A9C7A] text-white rounded-full px-3 py-1">
                {t('b2bTierPricing')}
              </Badge>
            </div>

            {/* Headcount Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-display font-bold text-[var(--cpl-dark)]">
                <span>{t('b2bTeamSize')}</span>
                <span className="text-[var(--cpl-sage-dark)] font-extrabold text-sm">{headcount} {t('b2bPeopleUnit')}</span>
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
                <span className="font-extrabold text-sm">{daysPerWeek} {t('b2bDaysUnit')}</span>
              </div>
              <Slider
                min={1}
                max={7}
                step={1}
                value={[daysPerWeek]}
                onValueChange={(val) => setDaysPerWeek(val[0])}
              />
            </div>

            {/* Protein Tier Selection Buttons */}
            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-widest text-[var(--cpl-dark-muted)] mb-2">
                Pilih Porsi Protein Katering:
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { tier: 25, label: "25g Protein", price: "Rp 25.000" },
                  { tier: 60, label: "60g Protein", price: "Rp 40.000" },
                  { tier: 80, label: "80g Protein", price: "Rp 50.000" },
                  { tier: 100, label: "100g Protein", price: "Rp 60.000" },
                ].map((item) => (
                  <Button
                    key={item.tier}
                    type="button"
                    variant={proteinTier === item.tier ? "dark" : "outline"}
                    onClick={() => setProteinTier(item.tier)}
                    className={`flex h-auto min-h-11.5 min-w-0 flex-col items-center justify-center rounded-xl border-2 p-3 transition-all ${
                      proteinTier === item.tier 
                        ? "bg-[#1E1E1E] text-white font-extrabold border-[#1E1E1E]" 
                        : "bg-white text-[#1E1E1E] font-bold border-gray-300 hover:border-[#8A9C7A]"
                    }`}
                  >
                    <span className="text-xs">{item.label}</span>
                    <span className={`text-[10px] ${proteinTier === item.tier ? "text-[#8A9C7A]" : "text-gray-500"}`}>{item.price}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Estimated Total Bar */}
            <div className="p-4 bg-[var(--cpl-white)] border border-[var(--cpl-dark)] space-y-2 rounded-2xl shadow-sm">
              <div className="flex justify-between text-xs font-display font-bold text-[var(--cpl-dark-muted)]">
                <span>{t('b2bWeeklyMeals')}</span>
                <span className="font-mono text-[var(--cpl-dark)]">{totalMealsPerWeek} {t('b2bBoxesPerWk')}</span>
              </div>

              <div className="flex flex-col items-start justify-between gap-1 border-t border-[var(--cpl-border-light)] pt-2 sm:flex-row sm:items-baseline">
                <span className="font-display font-extrabold text-sm text-[var(--cpl-dark)]">{t('b2bWeeklyBudget')}</span>
                <span className="font-display font-extrabold text-2xl text-[var(--cpl-sage-dark)]">
                  Rp {estimatedWeeklyCost.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="text-[10px] text-right font-mono text-gray-500">
                Tarif: Rp {costPerMeal.toLocaleString('id-ID')} / box makan
              </div>
            </div>

            <Button
              variant="default"
              size="lg"
              onClick={onOpenOrder}
                className="flex h-auto min-h-12 w-full items-center justify-center gap-2 whitespace-normal bg-[#8A9C7A] px-4 py-3 text-center text-xs font-extrabold leading-tight text-white hover:bg-[#647554]"
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
