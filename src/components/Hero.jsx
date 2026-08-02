import React from 'react';
import { CplBadgeLogo, CplFlaskIcon } from './CplLogo';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { ShieldCheck, Award, ArrowDownRight, CheckCircle2 } from 'lucide-react';

export function Hero({ onOpenOrder, onScrollToLabel }) {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 border-b border-(--cpl-border-muted)">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Top Status Eyebrow */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <Badge variant="default" className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-(--cpl-sage) animate-pulse" />
            <span>High Protein Clinical Nutrition</span>
          </Badge>

          <div className="hidden sm:flex items-center gap-6 text-xs font-display font-semibold uppercase tracking-wider text-(--cpl-dark-muted)">
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-(--cpl-sage)" /> 100% Lab Macro Verified</span>
            <span className="flex items-center gap-1.5"><Award size={14} className="text-[var(--cpl-sage)]" /> Zero Artificial Preservatives</span>
          </div>
        </div>

        {/* Hero Grid */}
        <div className="grid lg:grid-cols-12 gap-12 items-center">

          {/* Main Title & Copy */}
          <div className="lg:col-span-7 space-y-8">
            <h1 className="cpl-title text-5xl sm:text-7xl lg:text-8xl text-[var(--cpl-dark)]">
              GOOD FOOD.<br />
              <span className="text-[var(--cpl-sage)]">CLEAR DATA.</span><br />
              BETTER YOU.
            </h1>

            <p className="text-base sm:text-lg text-[var(--cpl-dark-muted)] max-w-xl font-normal leading-relaxed">
              Clean Plate Lab is Indonesia’s premier high-protein catering service. Formulated with laboratory-grade macro precision, whole food ingredients, and transparent nutritional data on every label.
            </p>

            {/* Key Value Cards */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="p-4 rounded-none bg-[var(--cpl-white)] text-center">
                <div className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--cpl-sage)]">45g+</div>
                <div className="text-[10px] sm:text-xs font-display font-bold uppercase tracking-wider text-[var(--cpl-dark-muted)] mt-1">Avg Protein / Meal</div>
              </Card>

              <Card className="p-4 rounded-none bg-[var(--cpl-white)] text-center">
                <div className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--cpl-dark)]">100%</div>
                <div className="text-[10px] sm:text-xs font-display font-bold uppercase tracking-wider text-[var(--cpl-dark-muted)] mt-1">Whole Food Prep</div>
              </Card>

              <Card className="p-4 rounded-none bg-[var(--cpl-white)] text-center">
                <div className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--cpl-sage)]">0.1g</div>
                <div className="text-[10px] sm:text-xs font-display font-bold uppercase tracking-wider text-[var(--cpl-dark-muted)] mt-1">Macro Accuracy</div>
              </Card>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                variant="default"
                size="lg"
                onClick={onOpenOrder}
                className="flex items-center gap-3 rounded-full"
              >
                <span>Start Your Meal Plan</span>
                <ArrowDownRight size={18} />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={onScrollToLabel}
                className="rounded-full"
              >
                Inspect Product Labels
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[var(--cpl-dark-muted)] font-display uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[var(--cpl-sage)]" /> Fresh Daily Prep</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[var(--cpl-sage)]" /> Compostable Packaging</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[var(--cpl-sage)]" /> Clinical Nutrition</span>
            </div>
          </div>

          {/* Hero Visual CPL Label Box */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md mx-auto">

              {/* Floating Badge */}
              <div className="absolute -top-5 -right-3 sm:-right-4 z-20">
                <CplBadgeLogo size={100} color="#8A9C7A" className="bg-[var(--cpl-cream)] shadow-lg" />
              </div>

              {/* Exact CPL Label Paper from Guideline */}
              <div className="cpl-label-paper p-6 rounded-none relative z-10 border-2 border-[#1E1E1E]">

                <div className="flex justify-between items-center border-b-2 border-[#1E1E1E] pb-3 mb-4">
                  <span className="font-bold text-sm tracking-wider">CPL-014</span>
                  <Badge variant="solid" className="px-2 py-0.5 text-xs font-bold uppercase tracking-widest">
                    MEAL PREP
                  </Badge>
                </div>

                <h3 className="font-extrabold text-3xl tracking-tight text-[#1E1E1E] uppercase leading-none mb-1">
                  CHICKEN NANBAN
                </h3>
                <p className="text-[10px] font-bold text-[#647554] tracking-widest uppercase mb-4">
                  MEAL PREP FOR A BETTER TOMORROW
                </p>

                {/* Macro Table Grid */}
                <div className="border border-[#1E1E1E] mb-4 text-xs font-bold bg-white/60">
                  <div className="grid grid-cols-2 border-b border-[#1E1E1E] p-2">
                    <span className="text-gray-600">PROTEIN</span>
                    <span className="text-right text-[#8A9C7A] font-extrabold text-sm">43g</span>
                  </div>
                  <div className="grid grid-cols-2 border-b border-[#1E1E1E] p-2">
                    <span className="text-gray-600">CARBS</span>
                    <span className="text-right font-extrabold">46g</span>
                  </div>
                  <div className="grid grid-cols-2 border-b border-[#1E1E1E] p-2">
                    <span className="text-gray-600">FAT</span>
                    <span className="text-right font-extrabold">18g</span>
                  </div>
                  <div className="grid grid-cols-2 p-2 bg-[#8A9C7A]/20">
                    <span className="text-[#1E1E1E] font-black">CALORIES</span>
                    <span className="text-right font-black text-sm text-[#1E1E1E]">582 KCAL</span>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-3 text-[10px] font-mono border-b border-[#1E1E1E] pb-3 mb-3 text-gray-700 uppercase">
                  <div>PREPARED: <span className="font-bold">TODAY</span></div>
                  <div>USE BY: <span className="font-bold">+3 DAYS</span></div>
                  <div>BATCH: <span className="font-bold">014</span></div>
                </div>

                {/* Stamp */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-[#1E1E1E]">
                    <CplFlaskIcon size={18} color="#8A9C7A" />
                    <div>
                      <div>REAL FOOD.</div>
                      <div>CLEAR DATA.</div>
                      <div>BETTER YOU.</div>
                    </div>
                  </div>
                  <div className="w-24">
                    <div className="barcode-strip" />
                    <div className="text-[8px] text-center font-mono mt-0.5 tracking-widest">CPL-014-2026</div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
