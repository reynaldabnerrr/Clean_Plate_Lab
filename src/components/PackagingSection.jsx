import React from 'react';
import { CplBadgeLogo, CplPrimaryLogo } from './CplLogo';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Thermometer, Recycle, CheckCircle2 } from 'lucide-react';
import { useCpl } from '../context/CplContext';

export function PackagingSection() {
  const { t } = useCpl();

  return (
    <section className="py-24 bg-[var(--cpl-cream)] border-b border-[var(--cpl-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="default">
            <span>{t('packEyebrow')}</span>
          </Badge>
          <h2 className="font-display text-4xl sm:text-6xl font-extrabold uppercase tracking-tight text-[var(--cpl-dark)]">
            {t('packTitle')}
          </h2>
          <p className="text-lg text-[var(--cpl-dark-muted)] font-light">
            {t('packSubtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-center">
          
          {/* Packaging Box Visual Mockup */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md bg-[#D6C7B0]/30 border-4 border-[#1E1E1E] p-8 relative shadow-2xl space-y-6">
              
              {/* Top Badge */}
              <div className="flex justify-between items-center border-b-2 border-[#1E1E1E] pb-4">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#1E1E1E]">
                  BOX REF: CPL-KRAFT-2026
                </span>
                <span className="bg-[#8A9C7A] text-white text-[10px] font-bold px-2 py-1 uppercase">
                  100% Biodegradable
                </span>
              </div>

              {/* Main Typography Print */}
              <div className="py-4 space-y-2 text-center">
                <CplPrimaryLogo size="large" color="#647554" className="items-center justify-center" />
                <div className="text-xs font-display font-extrabold uppercase tracking-widest text-[#1E1E1E] pt-2">
                  MEALS THAT DO MORE THAN FILL.
                </div>
              </div>

              {/* Box Details Strip */}
              <div className="p-4 bg-[#F5F2EA] border-2 border-[#1E1E1E] text-xs font-mono space-y-1 text-gray-800">
                <div className="flex justify-between">
                  <span>THERMAL SEAL:</span>
                  <span className="font-bold text-[#8A9C7A]">ACTIVE FRESH</span>
                </div>
                <div className="flex justify-between">
                  <span>MATERIAL:</span>
                  <span className="font-bold">UNBLEACHED KRAFT PULP</span>
                </div>
                <div className="flex justify-between">
                  <span>MICROWAVE SAFE:</span>
                  <span className="font-bold">YES (30-45 SECS)</span>
                </div>
              </div>

              {/* Slogan & Circular Badge */}
              <div className="flex items-center justify-between pt-2 border-t-2 border-[#1E1E1E]">
                <div className="text-[10px] font-bold tracking-wider text-[#1E1E1E] uppercase leading-tight">
                  <div>GOOD FOOD.</div>
                  <div>CLEAR DATA.</div>
                  <div>BETTER YOU.</div>
                </div>

                <CplBadgeLogo size={80} color="#8A9C7A" className="bg-white/80" />
              </div>

            </div>
          </div>

          {/* Right Features */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="space-y-3">
              <h3 className="font-display text-3xl font-extrabold uppercase text-[var(--cpl-dark)]">
                {t('packItem1Title')}
              </h3>
              <p className="text-sm text-[var(--cpl-dark-muted)] leading-relaxed font-normal">
                {t('packItem1Desc')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="p-5 bg-[var(--cpl-white)] border border-[var(--cpl-border)] rounded-none space-y-2">
                <Thermometer size={24} className="text-[var(--cpl-sage)]" />
                <h4 className="font-display font-extrabold text-sm uppercase text-[var(--cpl-dark)]">{t('packItem3Title')}</h4>
                <p className="text-xs text-[var(--cpl-dark-muted)]">{t('packItem3Desc')}</p>
              </Card>

              <Card className="p-5 bg-[var(--cpl-white)] border border-[var(--cpl-border)] rounded-none space-y-2">
                <Recycle size={24} className="text-[var(--cpl-sage)]" />
                <h4 className="font-display font-extrabold text-sm uppercase text-[var(--cpl-dark)]">{t('packItem2Title')}</h4>
                <p className="text-xs text-[var(--cpl-dark-muted)]">{t('packItem2Desc')}</p>
              </Card>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs font-display font-bold uppercase text-[var(--cpl-dark)]">
                <CheckCircle2 size={16} className="text-[var(--cpl-sage)]" />
                <span>Hermetically sealed meal sleeves prevent air oxidation</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-display font-bold uppercase text-[var(--cpl-dark)]">
                <CheckCircle2 size={16} className="text-[var(--cpl-sage)]" />
                <span>Easy reheatable design for microwave or oven warming</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-display font-bold uppercase text-[var(--cpl-dark)]">
                <CheckCircle2 size={16} className="text-[var(--cpl-sage)]" />
                <span>Custom batch code printed directly on sleeve for audit trail</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
