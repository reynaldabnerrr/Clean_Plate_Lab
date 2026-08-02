import React from 'react';
import { CplBadgeLogo, CplFlaskIcon } from './CplLogo';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ShieldCheck, Award, ArrowDownRight, CheckCircle2, Zap, Leaf, Scale } from 'lucide-react';

export function Hero({ onOpenOrder, onScrollToLabel }) {
  return (
    <section className="relative overflow-hidden pt-8 sm:pt-12 pb-16 sm:pb-20 border-b border-(--cpl-border-muted)">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Top Status Eyebrow */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 sm:mb-8">
          <Badge variant="default" className="flex items-center gap-2 text-xs py-1 px-3">
            <span className="w-2 h-2 rounded-full bg-[var(--cpl-sage)] animate-pulse shrink-0" />
            <span>High Protein Clinical Nutrition</span>
          </Badge>

          <div className="flex flex-wrap items-center gap-4 text-[11px] sm:text-xs font-display font-semibold uppercase tracking-wider text-[var(--cpl-dark-muted)]">
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-[var(--cpl-sage)] shrink-0" /> 100% Lab Macro Verified</span>
            <span className="hidden md:flex items-center gap-1.5"><Award size={14} className="text-[var(--cpl-sage)] shrink-0" /> Zero Preservatives</span>
          </div>
        </div>

        {/* Hero Grid */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Main Title & Copy */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <h1 className="cpl-title text-4xl sm:text-6xl lg:text-7xl xl:text-8xl text-[var(--cpl-dark)] leading-[1.05]">
              GOOD FOOD.<br />
              <span className="text-[var(--cpl-sage)]">CLEAR DATA.</span><br />
              BETTER YOU.
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-[var(--cpl-dark-muted)] max-w-xl font-normal leading-relaxed">
              Clean Plate Lab is Indonesia’s premier high-protein catering service. Formulated with laboratory-grade macro precision, whole food ingredients, and transparent nutritional data on every label.
            </p>

            {/* Redesigned Premium Key Metric Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              {/* Stat 1: 45g+ Avg Protein */}
              <div className="relative p-4 sm:p-5 bg-white border-2 border-[#1E1E1E] shadow-[4px_4px_0px_0px_#1E1E1E] hover:shadow-[6px_6px_0px_0px_#8A9C7A] hover:-translate-y-0.5 transition-all duration-200 group">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#EBF0E6] flex items-center justify-center text-[#647554] border border-[#8A9C7A]/40 group-hover:bg-[#8A9C7A] group-hover:text-white transition-colors shrink-0">
                    <Zap size={16} />
                  </div>
                  <span className="text-[9px] font-mono font-extrabold uppercase px-2 py-0.5 rounded bg-[#8A9C7A]/15 text-[#647554] tracking-widest">
                    TARGET
                  </span>
                </div>
                <div className="font-display text-3xl sm:text-4xl font-black text-[#1E1E1E] tracking-tight group-hover:text-[#8A9C7A] transition-colors">
                  45g<span className="text-[#8A9C7A]">+</span>
                </div>
                <div className="text-[11px] font-display font-extrabold uppercase tracking-wider text-[#1E1E1E] mt-1">
                  Avg Protein / Meal
                </div>
                <div className="text-[10px] text-gray-500 font-sans mt-0.5">
                  Clinical high-density target
                </div>
              </div>

              {/* Stat 2: 100% Whole Food Prep */}
              <div className="relative p-4 sm:p-5 bg-white border-2 border-[#1E1E1E] shadow-[4px_4px_0px_0px_#1E1E1E] hover:shadow-[6px_6px_0px_0px_#8A9C7A] hover:-translate-y-0.5 transition-all duration-200 group">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#EBF0E6] flex items-center justify-center text-[#647554] border border-[#8A9C7A]/40 group-hover:bg-[#8A9C7A] group-hover:text-white transition-colors shrink-0">
                    <Leaf size={16} />
                  </div>
                  <span className="text-[9px] font-mono font-extrabold uppercase px-2 py-0.5 rounded bg-[#8A9C7A]/15 text-[#647554] tracking-widest">
                    NATURAL
                  </span>
                </div>
                <div className="font-display text-3xl sm:text-4xl font-black text-[#1E1E1E] tracking-tight group-hover:text-[#8A9C7A] transition-colors">
                  100<span className="text-[#8A9C7A]">%</span>
                </div>
                <div className="text-[11px] font-display font-extrabold uppercase tracking-wider text-[#1E1E1E] mt-1">
                  Whole Food Prep
                </div>
                <div className="text-[10px] text-gray-500 font-sans mt-0.5">
                  Zero MSG or preservatives
                </div>
              </div>

              {/* Stat 3: 0.1g Macro Accuracy */}
              <div className="relative p-4 sm:p-5 bg-white border-2 border-[#1E1E1E] shadow-[4px_4px_0px_0px_#1E1E1E] hover:shadow-[6px_6px_0px_0px_#8A9C7A] hover:-translate-y-0.5 transition-all duration-200 group">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#EBF0E6] flex items-center justify-center text-[#647554] border border-[#8A9C7A]/40 group-hover:bg-[#8A9C7A] group-hover:text-white transition-colors shrink-0">
                    <Scale size={16} />
                  </div>
                  <span className="text-[9px] font-mono font-extrabold uppercase px-2 py-0.5 rounded bg-[#8A9C7A]/15 text-[#647554] tracking-widest">
                    LAB DATA
                  </span>
                </div>
                <div className="font-display text-3xl sm:text-4xl font-black text-[#1E1E1E] tracking-tight group-hover:text-[#8A9C7A] transition-colors">
                  0.1<span className="text-[#8A9C7A]">g</span>
                </div>
                <div className="text-[11px] font-display font-extrabold uppercase tracking-wider text-[#1E1E1E] mt-1">
                  Macro Accuracy
                </div>
                <div className="text-[10px] text-gray-500 font-sans mt-0.5">
                  Lab verified nutrition
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Button
                variant="default"
                size="lg"
                onClick={onOpenOrder}
                className="flex items-center justify-center gap-3 rounded-full w-full sm:w-auto min-h-[44px]"
              >
                <span>Start Your Meal Plan</span>
                <ArrowDownRight size={18} />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={onScrollToLabel}
                className="rounded-full w-full sm:w-auto min-h-[44px]"
              >
                Inspect Product Labels
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 text-[11px] sm:text-xs text-[var(--cpl-dark-muted)] font-display uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[var(--cpl-sage)] shrink-0" /> Fresh Daily Prep</span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[var(--cpl-sage)] shrink-0" /> Compostable Box</span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[var(--cpl-sage)] shrink-0" /> Clinical Nutrition</span>
            </div>
          </div>

          {/* Hero Visual CPL Label Box */}
          <div className="lg:col-span-5 relative flex justify-center mt-6 lg:mt-0">
            <div className="relative w-full max-w-md mx-auto">

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-2 sm:-top-5 sm:-right-4 z-20">
                <CplBadgeLogo size={80} color="#8A9C7A" className="bg-[var(--cpl-cream)] shadow-lg sm:w-[100px] sm:h-[100px]" />
              </div>

              {/* Exact CPL Label Paper from Guideline */}
              <div className="cpl-label-paper p-5 sm:p-6 rounded-none relative z-10 border-2 border-[#1E1E1E]">

                <div className="flex justify-between items-center border-b-2 border-[#1E1E1E] pb-3 mb-4">
                  <span className="font-bold text-xs sm:text-sm tracking-wider">CPL-014</span>
                  <Badge variant="solid" className="px-2 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                    MEAL PREP
                  </Badge>
                </div>

                <h3 className="font-extrabold text-2xl sm:text-3xl tracking-tight text-[#1E1E1E] uppercase leading-none mb-1">
                  CHICKEN NANBAN
                </h3>
                <p className="text-[9px] sm:text-[10px] font-bold text-[#647554] tracking-widest uppercase mb-4">
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
                <div className="grid grid-cols-3 text-[9px] sm:text-[10px] font-mono border-b border-[#1E1E1E] pb-3 mb-3 text-gray-700 uppercase">
                  <div>PREP: <span className="font-bold">TODAY</span></div>
                  <div>USE BY: <span className="font-bold">+3 DAYS</span></div>
                  <div>BATCH: <span className="font-bold">014</span></div>
                </div>

                {/* Stamp */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-bold tracking-wider text-[#1E1E1E]">
                    <CplFlaskIcon size={18} color="#8A9C7A" />
                    <div>
                      <div>REAL FOOD.</div>
                      <div>CLEAR DATA.</div>
                      <div>BETTER YOU.</div>
                    </div>
                  </div>
                  <div className="w-20 sm:w-24">
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

