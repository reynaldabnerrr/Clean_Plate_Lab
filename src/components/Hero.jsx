import React, { useState } from 'react';
import { CplBadgeLogo, CplFlaskIcon } from './CplLogo';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowRight, BadgeDollarSign, Zap, Truck } from 'lucide-react';
import { useCpl } from '../hooks/useCpl';

export function Hero({ onOpenOrder, onScrollToLabel }) {
  const { t } = useCpl();
  const [heroTilt, setHeroTilt] = useState({ x: 0, y: 0 });
  const [isHeroHovered, setIsHeroHovered] = useState(false);

  const handleHeroMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -16;
    const rotateY = ((x - centerX) / centerX) * 16;
    setHeroTilt({ x: rotateX, y: rotateY });
  };

  const handleHeroMouseLeave = () => {
    setIsHeroHovered(false);
    setHeroTilt({ x: 0, y: 0 });
  };

  const handleHeroMouseEnter = () => {
    setIsHeroHovered(true);
  };

  const metrics = [
    {
      value: '25g-100g',
      title: t('heroAvgProtein'),
      description: t('heroAvgProteinDesc'),
      icon: Zap,
    },
    {
      value: 'Rp25.000',
      title: t('heroWholeFood'),
      description: t('heroWholeFoodDesc'),
      icon: BadgeDollarSign,
    },
    {
      value: t('heroDeliveryValue'),
      title: t('heroMacroAcc'),
      description: t('heroMacroAccDesc'),
      icon: Truck,
    },
  ];

  return (
    <section className="relative overflow-hidden pt-8 sm:pt-12 pb-16 sm:pb-20 border-b border-[var(--cpl-border-muted)] bg-[var(--cpl-cream)]">
      {/* Background Subtle Grid Accent */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#1E1E1E_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Hero Grid */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Main Title & Copy */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
            <h1 className="cpl-title text-4xl sm:text-6xl lg:text-7xl xl:text-8xl text-[var(--cpl-dark)] leading-[1.05]">
              {t('heroTitle1')}<br />
              <span className="text-[var(--cpl-sage)]">{t('heroTitle2')}</span><br />
              {t('heroTitle3')}
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-[var(--cpl-dark-muted)] font-normal leading-relaxed">
              {t('heroSubtitle')}
            </p>

            {/* Compact three-column summary on mobile, full specification from tablet upward */}
            <div className="grid grid-cols-3 gap-2 pt-1 sm:gap-3">
              {metrics.map((metric) => {
                const MetricIcon = metric.icon;

                return (
                  <div
                    key={metric.title}
                    className="group flex min-h-[118px] min-w-0 flex-col items-start border-2 border-[#1E1E1E] bg-white p-2.5 shadow-[2px_2px_0px_0px_#1E1E1E] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#8D9B7D] sm:min-h-[168px] sm:p-4"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#8D9B7D]/40 bg-[#E1ECD3] text-[#6B7860] transition-colors group-hover:bg-[#8D9B7D] group-hover:text-white sm:h-8 sm:w-8">
                      <MetricIcon size={14} />
                    </div>

                    <div className="mt-3 whitespace-nowrap font-display text-[15px] font-black leading-none tracking-tight text-[#1E1E1E] sm:text-2xl">
                      {metric.value}
                    </div>

                    <div className="mt-2 min-w-0 w-full">
                      <p className="line-clamp-2 font-display text-[8px] font-extrabold uppercase leading-tight text-[#1E1E1E] sm:text-[11px]">
                        {metric.title}
                      </p>
                      <p className="mt-2 hidden line-clamp-3 text-[10px] leading-snug text-gray-500 sm:block">
                        {metric.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Button
                variant="default"
                size="lg"
                onClick={onOpenOrder}
                className="bg-[#8A9C7A] hover:bg-[#647554] text-white font-extrabold rounded-full flex items-center justify-center gap-2 min-h-[44px]"
              >
                <span>{t('heroCtaPrimary')}</span>
                <ArrowRight size={18} />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={onScrollToLabel}
                className="rounded-full w-full sm:w-auto min-h-[44px]"
              >
                {t('heroCtaSecondary')}
              </Button>
            </div>

          </div>

          {/* Hero Visual CPL Label Box with 3D Motion & Zero Overlap */}
          <div className="lg:col-span-5 relative flex justify-center mt-6 lg:mt-0">
            <div 
              onMouseMove={handleHeroMouseMove}
              onMouseEnter={handleHeroMouseEnter}
              onMouseLeave={handleHeroMouseLeave}
              className="relative w-full max-w-md mx-auto cursor-pointer group"
              style={{ perspective: '1000px' }}
            >

              {/* Floating Badge (Positioned safely outside top-right to NEVER cover text) */}
              <div className="absolute -top-7 -right-5 sm:-top-9 sm:-right-7 z-30 pointer-events-none transition-transform duration-300 group-hover:scale-110">
                <CplBadgeLogo className="bg-[var(--cpl-cream)] shadow-xl border-2 border-[#1E1E1E] rounded-full w-[75px] h-[75px] sm:w-[85px] sm:h-[85px]" />
              </div>

              {/* CPL Product Label Paper with Continuous 3D Motion & Gloss Sheen */}
              <div 
                style={{
                  transform: isHeroHovered 
                    ? `rotateX(${heroTilt.x}deg) rotateY(${heroTilt.y}deg) scale3d(1.03, 1.03, 1.03)` 
                    : undefined,
                  transition: isHeroHovered ? 'transform 0.1s ease-out, box-shadow 0.3s ease' : 'transform 0.5s ease-out, box-shadow 0.5s ease',
                  boxShadow: isHeroHovered ? '0 25px 50px -12px rgba(0, 0, 0, 0.3)' : '0 10px 25px -5px rgba(0, 0, 0, 0.12)'
                }}
                className={`cpl-label-paper p-5 sm:p-6 rounded-none relative z-10 border-2 border-[#1E1E1E] bg-white transition-all duration-300 ${!isHeroHovered ? 'cpl-3d-idle-float' : ''}`}
              >
                {/* Glossy Sheen Reflection Pass */}
                <div className="cpl-gloss-sheen" />

                <div className="flex justify-between items-center border-b-2 border-[#1E1E1E] pb-3 mb-4 pr-12">
                  <span className="font-sans font-semibold text-xs sm:text-sm tracking-wider">Clean Plate Lab</span>
                  <Badge variant="solid" className="px-2 py-0.5 text-[10px] sm:text-xs font-sans font-semibold uppercase tracking-widest bg-[#8D9B7D] text-white">
                    MEAL PREP
                  </Badge>
                </div>

                <h3 className="font-display font-normal text-2xl sm:text-3xl tracking-tight text-[#1E1E1E] uppercase leading-none mb-1">
                  {t('heroLabelTitle')}
                </h3>
                <p className="text-[9px] sm:text-[10px] font-sans font-medium text-[#6B7860] tracking-widest uppercase mb-4">
                  {t('heroLabelSub')}
                </p>

                {/* Macro Table Grid */}
                <div className="border border-[#1E1E1E] mb-4 text-xs font-sans bg-white/80">
                  <div className="grid grid-cols-2 border-b border-[#1E1E1E] p-1.5 sm:p-2">
                    <span className="text-gray-600 font-medium">{t('heroProtein')}</span>
                    <span className="text-right text-[#8D9B7D] font-bold text-sm">81.6g</span>
                  </div>
                  <div className="grid grid-cols-2 border-b border-[#1E1E1E] p-1.5 sm:p-2 bg-white/60">
                    <span className="text-gray-600 font-medium">{t('heroCarbs')}</span>
                    <span className="text-right font-semibold">127.7g</span>
                  </div>
                  <div className="grid grid-cols-2 border-b border-[#1E1E1E] p-1.5 sm:p-2">
                    <span className="text-gray-600 font-medium">{t('heroFat')}</span>
                    <span className="text-right font-semibold">28.2g</span>
                  </div>
                  <div className="grid grid-cols-2 border-b border-[#1E1E1E] p-1.5 sm:p-2 bg-white/60">
                    <span className="text-gray-600 font-medium">{t('heroSodium')}</span>
                    <span className="text-right font-semibold">1344.1 mg</span>
                  </div>
                  <div className="grid grid-cols-2 border-b border-[#1E1E1E] p-1.5 sm:p-2">
                    <span className="text-gray-600 font-medium">{t('heroPotassium')}</span>
                    <span className="text-right font-semibold">340 mg</span>
                  </div>
                  <div className="grid grid-cols-2 p-1.5 sm:p-2 bg-[#8D9B7D]/20">
                    <span className="text-[#1E1E1E] font-bold">{t('heroCalories')}</span>
                    <span className="text-right font-bold text-sm text-[#1E1E1E]">1111.3 KCAL</span>
                  </div>
                </div>

                {/* Neat Label Info Badges */}
                <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-[#1E1E1E] pb-3 mb-3 text-[9px] sm:text-[10px] font-sans font-medium text-gray-700 uppercase tracking-tight">
                  <span className="bg-white/90 border border-[#1E1E1E]/30 px-2 py-1 rounded shadow-xs">100% FRESH HOMEMADE</span>
                  <span className="bg-white/90 border border-[#1E1E1E]/30 px-2 py-1 rounded shadow-xs">FOOD-GRADE SAFE</span>
                  <span className="bg-white/90 border border-[#1E1E1E]/30 px-2 py-1 rounded shadow-xs">REHEAT 30-45S</span>
                </div>

                {/* Stamp & Barcode */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-sans font-medium tracking-wider text-[#1E1E1E]/70">
                    <CplFlaskIcon size={18} color="#8D9B7D" />
                    <div>
                      <div>{t('heroTitle1')}</div>
                      <div>{t('heroTitle2')}</div>
                      <div>{t('heroTitle3')}</div>
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
