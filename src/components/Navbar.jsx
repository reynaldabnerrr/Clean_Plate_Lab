import React, { useState, useEffect } from 'react';
import { CplPrimaryLogo } from './CplLogo';
import { Button } from './ui/button';
import { Menu, X, ArrowRight, Globe } from 'lucide-react';
import { useCpl } from '../context/CplContext';

export function Navbar({ onOpenOrder }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useCpl();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: t('pillars'), href: "#pillars" },
    { label: t('labelInspector'), href: "#label-generator" },
    { label: t('weeklyMenu'), href: "#menu" },
    { label: t('macroCalculator'), href: "#calculator" },
    { label: t('b2bCatering'), href: "#catering" },
  ];

  return (
    <>
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[100] px-4 py-2 bg-[#8A9C7A] text-white font-bold text-xs rounded-md shadow-lg outline-none ring-2 ring-white"
      >
        {t('skipContent')}
      </a>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#F5F2EA]/95 shadow-md border-b border-[#1E1E1E]/12 backdrop-blur-md py-3'
            : 'bg-[#F5F2EA]/85 border-b border-[#1E1E1E]/8 backdrop-blur-sm py-4.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Left: Brand Logo */}
          <div className="flex items-center shrink-0">
            <a 
              href="#" 
              className="flex items-center hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A9C7A] rounded-lg p-1"
              aria-label="Clean Plate Lab Home"
            >
              <CplPrimaryLogo />
            </a>
          </div>

          {/* Center: Desktop Nav Items */}
          <nav 
            aria-label="Main Navigation"
            className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 text-xs font-display font-bold uppercase tracking-wider text-[#1E1E1E]"
          >
            {navItems.map((item) => (
              <a 
                key={item.href} 
                href={item.href}
                className="group relative py-1.5 hover:text-[#8A9C7A] transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A9C7A] rounded"
              >
                <span>{item.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#8A9C7A] group-hover:w-full transition-all duration-200" />
              </a>
            ))}
          </nav>

          {/* Right: Actions (Language Segmented Switch + CTA) */}
          <div className="flex items-center justify-end gap-3 shrink-0">
            
            {/* Ultra-Clean Segmented Language Switcher */}
            <div className="flex items-center bg-[#1E1E1E]/8 p-1 rounded-full border border-[#1E1E1E]/15 shadow-inner">
              <button
                type="button"
                onClick={() => setLanguage('ID')}
                className={`flex items-center gap-1 px-3 py-1 text-xs font-black rounded-full transition-all duration-200 ${
                  language === 'ID'
                    ? 'bg-[#8A9C7A] text-white shadow-sm scale-[1.02]'
                    : 'text-[#1E1E1E]/70 hover:text-[#1E1E1E]'
                }`}
                aria-label="Bahasa Indonesia"
              >
                <span>ID</span>
              </button>
              <button
                type="button"
                onClick={() => setLanguage('EN')}
                className={`flex items-center gap-1 px-3 py-1 text-xs font-black rounded-full transition-all duration-200 ${
                  language === 'EN'
                    ? 'bg-[#8A9C7A] text-white shadow-sm scale-[1.02]'
                    : 'text-[#1E1E1E]/70 hover:text-[#1E1E1E]'
                }`}
                aria-label="English Language"
              >
                <span>EN</span>
              </button>
            </div>

            {/* Order Meal Plan Primary CTA */}
            <Button
              variant="default"
              size="default"
              onClick={onOpenOrder}
              className="flex items-center gap-2 rounded-full bg-[#8A9C7A] hover:bg-[#647554] active:scale-[0.98] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] min-h-[40px] px-5 shrink-0 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#8A9C7A]"
            >
              <span>{t('orderMealPlan')}</span>
              <ArrowRight size={14} />
            </Button>

            {/* Mobile / Tablet Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu-drawer"
              aria-label={mobileMenuOpen ? "Close Menu" : "Open Navigation Menu"}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-[#1E1E1E] hover:bg-[#1E1E1E]/5 border border-[#1E1E1E]/20 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A9C7A]"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>

        {/* Mobile / Tablet Drawer */}
        {mobileMenuOpen && (
          <>
            <div 
              className="fixed inset-0 top-[72px] bg-black/40 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            
            <div 
              id="mobile-menu-drawer"
              className="relative z-50 lg:hidden bg-[#F5F2EA] border-b border-[#1E1E1E]/20 px-6 py-6 space-y-4 font-display text-xs font-bold uppercase tracking-wider text-[#1E1E1E] shadow-2xl animate-in slide-in-from-top-3 duration-200"
            >
              {/* Mobile Language Switcher Row */}
              <div className="flex items-center justify-between py-2.5 px-3 rounded-2xl bg-[#1E1E1E]/5 border border-[#1E1E1E]/10 mb-3">
                <span className="flex items-center gap-2 text-xs text-[#1E1E1E]/80 font-bold">
                  <Globe size={16} className="text-[#8A9C7A]" />
                  <span>{t('switchLanguage')}</span>
                </span>

                <div className="flex items-center bg-[#1E1E1E]/10 p-1 rounded-full border border-[#1E1E1E]/15">
                  <button
                    type="button"
                    onClick={() => setLanguage('ID')}
                    className={`px-3 py-1 text-xs font-black rounded-full transition-all ${
                      language === 'ID'
                        ? 'bg-[#8A9C7A] text-white shadow-sm'
                        : 'text-[#1E1E1E]/70'
                    }`}
                  >
                    <span>ID</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('EN')}
                    className={`px-3 py-1 text-xs font-black rounded-full transition-all ${
                      language === 'EN'
                        ? 'bg-[#8A9C7A] text-white shadow-sm'
                        : 'text-[#1E1E1E]/70'
                    }`}
                  >
                    <span>EN</span>
                  </button>
                </div>
              </div>

              <nav aria-label="Mobile Navigation" className="space-y-1">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 px-2 rounded-lg text-[#1E1E1E] hover:text-[#8A9C7A] hover:bg-[#1E1E1E]/5 transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              
              <div className="pt-4 border-t border-[#1E1E1E]/15">
                <Button 
                  variant="default" 
                  onClick={() => { setMobileMenuOpen(false); onOpenOrder(); }} 
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-[#8A9C7A] hover:bg-[#647554] text-white font-extrabold text-xs min-h-[44px] shadow-md"
                >
                  <span>{t('orderMealPlan')}</span>
                  <ArrowRight size={15} />
                </Button>
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
}
