import React from 'react';
import { CplPrimaryLogo } from './CplLogo';
import { Mail, MapPin, Phone, ArrowUp } from 'lucide-react';
import { useCpl } from '../hooks/useCpl';
import { useSiteCopy } from '../hooks/useSiteCopy';
import { CONTACT_EMAIL, WHATSAPP_DISPLAY, WHATSAPP_NUMBER, CENTRAL_KITCHEN_MAPS_LINK } from '../lib/order';

const InstagramIcon = ({ size = 18, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export function Footer() {
  const { t } = useCpl();
  const copy = useSiteCopy();

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
            <CplPrimaryLogo size="large" inverted />
            
            <p className="text-xs text-gray-400 font-light leading-relaxed max-w-md">
              {t('footerDesc')}
            </p>

            <div className="flex items-center gap-3 text-xs font-display uppercase tracking-widest text-[#8D9B7D]">
              <span>REAL FOOD</span>
              <span>•</span>
              <span>CLEAR DATA</span>
              <span>•</span>
              <span>BETTER YOU</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-display font-extrabold text-sm uppercase tracking-wider text-[#8D9B7D]">
              {t('footerQuickLinks')}
            </h4>
            <ul className="space-y-2.5 text-xs font-sans uppercase tracking-wider text-gray-400">
              <li><a href="#protein-tiers" className="hover:text-white transition-colors">{copy.nav.protein}</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">{copy.nav.how}</a></li>
              <li><a href="#menu" className="hover:text-white transition-colors">{copy.nav.menu}</a></li>
              <li><a href="#calculator" className="hover:text-white transition-colors">{copy.nav.calculator}</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">{copy.nav.faq}</a></li>
            </ul>
          </div>

          {/* Col 3: Contact & Kitchen Location */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-display font-extrabold text-sm uppercase tracking-wider text-[#8D9B7D]">
              {t('footerKitchenContact')}
            </h4>
            <div className="space-y-3 text-xs text-gray-300 font-sans">
                <div className="flex items-start gap-2.5">
                  <MapPin size={18} className="text-[#8D9B7D] flex-shrink-0 mt-0.5" />
                  <a
                    href={CENTRAL_KITCHEN_MAPS_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="leading-relaxed hover:text-[#8D9B7D] hover:underline"
                  >
                    {t('footerCentralKitchen')}
                  </a>
                </div>
              
              <div className="flex items-center gap-2.5">
                <Phone size={18} className="text-[#8D9B7D] flex-shrink-0" />
                <a 
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-[#8D9B7D] transition-colors font-medium"
                >
                  WhatsApp: {WHATSAPP_DISPLAY}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <InstagramIcon size={18} className="text-[#8D9B7D] flex-shrink-0" />
                <a 
                  href="https://www.instagram.com/cleanplatelab.id/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-[#8D9B7D] transition-colors font-medium font-mono text-[11px]"
                >
                  Instagram: @cleanplatelab.id
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail size={18} className="text-[#8D9B7D] flex-shrink-0" />
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="break-all font-medium transition-colors hover:text-[#8D9B7D]"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
          <div>
            © 2026 CLEAN PLATE LAB. {t('footerLegal')} {t('footerMadeForTomorrow')}
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-[#8D9B7D] hover:text-white text-gray-300 transition-colors"
          >
            <span>{t('footerBackToTop')}</span>
            <ArrowUp size={12} />
          </button>
        </div>

      </div>
    </footer>
  );
}
