import React from 'react';
import { CplPrimaryLogo } from './CplLogo';
import { Mail, MapPin, Phone, ArrowUp, Globe, MessageSquare, ShieldCheck } from 'lucide-react';
import { useCpl } from '../context/CplContext';

export function Footer({ onOpenOrder, onOpenAdmin }) {
  const { t } = useCpl();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1E1E1E] text-white pt-16 pb-10 border-t-2 border-[#1E1E1E] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-gray-800">
          
          {/* Col 1: Brand Logo & Mission */}
          <div className="md:col-span-5 space-y-6">
            <CplPrimaryLogo size="large" />
            
            <p className="text-xs text-gray-400 font-light leading-relaxed max-w-md">
              {t('footerDesc')}
            </p>

            <div className="flex items-center gap-3 text-xs font-display uppercase tracking-widest text-[#8A9C7A]">
              <span>REAL FOOD</span>
              <span>•</span>
              <span>CLEAR DATA</span>
              <span>•</span>
              <span>BETTER YOU</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-display font-extrabold text-sm uppercase tracking-wider text-[#8A9C7A]">
              {t('footerQuickLinks')}
            </h4>
            <ul className="space-y-2.5 text-xs font-display uppercase tracking-wider text-gray-400">
              <li><a href="#pillars" className="hover:text-white transition-colors">{t('pillars')}</a></li>
              <li><a href="#label-generator" className="hover:text-white transition-colors">{t('labelInspector')}</a></li>
              <li><a href="#menu" className="hover:text-white transition-colors">{t('weeklyMenu')}</a></li>
              <li><a href="#calculator" className="hover:text-white transition-colors">{t('macroCalculator')}</a></li>
              <li><a href="#catering" className="hover:text-white transition-colors">{t('b2bCatering')}</a></li>
              <li>
                <button onClick={onOpenAdmin} className="text-[#8A9C7A] hover:underline text-left flex items-center gap-1 font-bold">
                  <ShieldCheck size={14} />
                  <span>{t('adminPortal')}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Kitchen Location */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-display font-extrabold text-sm uppercase tracking-wider text-[#8A9C7A]">
              Kitchen & Contact
            </h4>
            <div className="space-y-3 text-xs text-gray-400 font-sans">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-[#8A9C7A] flex-shrink-0 mt-0.5" />
                <span>Central Kitchen: Senopati Wellness Hub, Kebayoran Baru, Jakarta Selatan</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-[#8A9C7A] flex-shrink-0" />
                <span>WhatsApp: +62 812-CPL-FOOD (275-3663)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-[#8A9C7A] flex-shrink-0" />
                <span>hello@cleanplatelab.id</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-4">
              <a href="#" className="p-2 bg-white/10 hover:bg-[#8A9C7A] hover:text-white rounded transition-colors text-gray-300">
                <Globe size={16} />
              </a>
              <a href="#" className="p-2 bg-white/10 hover:bg-[#8A9C7A] hover:text-white rounded transition-colors text-gray-300">
                <MessageSquare size={16} />
              </a>
              <span className="text-xs font-mono text-gray-400">@cleanplatelab</span>
            </div>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
          <div>
            © 2026 CLEAN PLATE LAB. {t('footerLegal')} MADE FOR A BETTER TOMORROW.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-[#8A9C7A] hover:text-white text-gray-300 transition-colors"
          >
            <span>Back To Top</span>
            <ArrowUp size={12} />
          </button>
        </div>

      </div>
    </footer>
  );
}
