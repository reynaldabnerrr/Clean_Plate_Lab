import React, { useState, useEffect } from 'react';
import { CplPrimaryLogo } from './CplLogo';
import { Button } from './ui/button';
import { Menu, X, ArrowRight, Globe, Sparkles } from 'lucide-react';
import { useCpl } from '../hooks/useCpl';

export function Navbar({ onOpenOrder, onOpenGuideline }) {
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

  // Close mobile menu on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

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
          mobileMenuOpen
            ? 'bg-[#F5F2EA] shadow-md border-b border-[#1E1E1E]/15 py-3'
            : scrolled
            ? 'bg-[#F5F2EA]/95 shadow-md border-b border-[#1E1E1E]/12 backdrop-blur-md py-3'
            : 'bg-[#F5F2EA]/90 border-b border-[#1E1E1E]/10 backdrop-blur-sm py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4 relative z-50">
          
          {/* Brand Logo */}
          <a 
            href="#" 
            className="flex items-center shrink-0 hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A9C7A] rounded-lg"
            aria-label="Clean Plate Lab Home"
          >
            <div className="transform scale-95 sm:scale-100 origin-left">
              <CplPrimaryLogo />
            </div>
          </a>

          {/* Desktop Navigation Links */}
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

          {/* Right Action Bar */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 shrink-0">
            
            {/* Desktop Language Switcher */}
            <div className="hidden sm:flex items-center bg-[#1E1E1E]/8 p-1 rounded-full border border-[#1E1E1E]/15 shadow-inner">
              <button
                type="button"
                onClick={() => setLanguage('ID')}
                className={`px-2.5 py-1 text-[11px] font-black rounded-full transition-all duration-200 ${
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
                className={`px-2.5 py-1 text-[11px] font-black rounded-full transition-all duration-200 ${
                  language === 'EN'
                    ? 'bg-[#8A9C7A] text-white shadow-sm scale-[1.02]'
                    : 'text-[#1E1E1E]/70 hover:text-[#1E1E1E]'
                }`}
                aria-label="English Language"
              >
                <span>EN</span>
              </button>
            </div>

            {/* Desktop / Tablet CTA Button */}
            <Button
              variant="default"
              size="default"
              onClick={onOpenOrder}
              className="hidden md:flex items-center gap-2 rounded-full bg-[#8A9C7A] hover:bg-[#647554] active:scale-[0.98] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] min-h-[40px] px-4.5 shrink-0 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#8A9C7A]"
            >
              <span>{t('orderMealPlan')}</span>
              <ArrowRight size={14} />
            </Button>

            {/* Mobile Menu Toggle Button (Touch Area 44x44px) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu-drawer"
              aria-label={mobileMenuOpen ? "Close Menu" : "Open Navigation Menu"}
              className="lg:hidden w-11 h-11 flex items-center justify-center rounded-xl bg-[#1E1E1E]/5 hover:bg-[#1E1E1E]/10 border border-[#1E1E1E]/15 text-[#1E1E1E] transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A9C7A]"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>

        {/* Mobile / Tablet Full-Featured Drawer */}
        {mobileMenuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            
            <div 
              id="mobile-menu-drawer"
              className="absolute top-full left-0 right-0 z-50 lg:hidden bg-[#F5F2EA] border-b-2 border-[#1E1E1E] px-5 py-6 space-y-5 font-display text-xs font-bold uppercase tracking-wider text-[#1E1E1E] shadow-2xl max-h-[calc(100vh-80px)] overflow-y-auto animate-in slide-in-from-top-2 duration-200"
            >
              {/* Language Switcher Row in Drawer */}
              <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white border border-[#1E1E1E]/15 shadow-sm">
                <span className="flex items-center gap-2 text-xs text-[#1E1E1E] font-extrabold">
                  <Globe size={16} className="text-[#8A9C7A]" />
                  <span>{t('switchLanguage')}</span>
                </span>

                <div className="flex items-center bg-[#1E1E1E]/8 p-1 rounded-full border border-[#1E1E1E]/15">
                  <button
                    type="button"
                    onClick={() => setLanguage('ID')}
                    className={`px-3 py-1 text-xs font-black rounded-full transition-all ${
                      language === 'ID'
                        ? 'bg-[#8A9C7A] text-white shadow-sm'
                        : 'text-[#1E1E1E]/70 hover:text-[#1E1E1E]'
                    }`}
                  >
                    ID
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('EN')}
                    className={`px-3 py-1 text-xs font-black rounded-full transition-all ${
                      language === 'EN'
                        ? 'bg-[#8A9C7A] text-white shadow-sm'
                        : 'text-[#1E1E1E]/70 hover:text-[#1E1E1E]'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>

              {/* Mobile Navigation Links */}
              <nav aria-label="Mobile Navigation" className="space-y-2">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/80 hover:bg-white border border-[#1E1E1E]/10 hover:border-[#8A9C7A]/40 text-[#1E1E1E] hover:text-[#647554] font-extrabold text-sm transition-all shadow-sm active:scale-[0.99]"
                  >
                    <span>{item.label}</span>
                    <ArrowRight size={16} className="text-[#8A9C7A]" />
                  </a>
                ))}
              </nav>
              
              {/* Drawer Action Buttons */}
              <div className="pt-3 border-t border-[#1E1E1E]/15 space-y-2.5">
                {onOpenGuideline && (
                  <Button 
                    variant="secondary"
                    onClick={() => { setMobileMenuOpen(false); onOpenGuideline(); }} 
                    className="w-full flex items-center justify-center gap-2 rounded-full border border-[#8A9C7A]/40 bg-[#EBF0E6] text-[#647554] font-extrabold text-xs py-3"
                  >
                    <Sparkles size={15} />
                    <span>Brand Specs</span>
                  </Button>
                )}

                <Button 
                  variant="default" 
                  onClick={() => { setMobileMenuOpen(false); onOpenOrder(); }} 
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-[#8A9C7A] hover:bg-[#647554] text-white font-extrabold text-xs py-3.5 shadow-md active:scale-[0.98] transition-transform"
                >
                  <span>{t('orderMealPlan')}</span>
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
}
