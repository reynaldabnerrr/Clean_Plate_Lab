import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useCpl } from '../hooks/useCpl';
import { trackEvent } from '../lib/analytics';
import { CplLogoImage } from './CplLogo';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from './ui/dialog';

const languageOptions = [
  {
    id: 'ID',
    shortLabel: 'ID',
    name: 'Bahasa Indonesia',
    action: 'Lanjut dalam Bahasa Indonesia',
  },
  {
    id: 'EN',
    shortLabel: 'EN',
    name: 'English',
    action: 'Continue in English',
  },
];

export function LanguageWelcomeModal() {
  const { hasSelectedLanguage, setLanguage } = useCpl();

  const selectLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    trackEvent('language_selected', { language: nextLanguage, source: 'welcome_modal' });
  };

  return (
    <Dialog open={!hasSelectedLanguage}>
      <DialogContent
        showClose={false}
        aria-describedby="language-welcome-description"
        onEscapeKeyDown={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
        className="w-[calc(100%-2rem)] max-w-[31rem] gap-0 overflow-hidden rounded-[1.75rem] border-2 border-[#1E1E1E] bg-[#F5F2EA] p-0 shadow-[10px_10px_0_rgba(30,30,30,0.95)] sm:w-[calc(100%-3rem)]"
      >
        <div className="border-b-2 border-[#1E1E1E] bg-[#1E1E1E] px-5 py-4 text-white sm:px-7">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#F5F2EA]">
                <CplLogoImage size={42} />
              </span>
              <div className="min-w-0">
                <p className="font-display text-sm font-black uppercase tracking-tight sm:text-base">Clean Plate Lab</p>
                <p className="mt-0.5 font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-[#B8C8AA] sm:text-[9px]">Good food · Clear data · Better you</p>
              </div>
            </div>
            <span className="shrink-0 rounded-full border border-white/25 px-2.5 py-1 font-mono text-[8px] font-bold uppercase tracking-widest text-[#B8C8AA]">CPL / LANG</span>
          </div>
        </div>

        <div className="px-5 py-6 sm:px-7 sm:py-7">
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#647554]">Welcome · Selamat datang</p>
          <DialogTitle className="mt-2 max-w-sm text-[1.7rem] leading-[0.98] sm:text-[2.15rem]">
            Choose your language.
            <span className="mt-1 block text-[#647554]">Pilih bahasamu.</span>
          </DialogTitle>
          <DialogDescription id="language-welcome-description" className="mt-3 max-w-md font-sans text-[11px] leading-5 text-[#526049] sm:text-xs">
            Select the language for this website. Pilihan ini akan tersimpan dan dapat diubah kembali melalui menu navigasi.
          </DialogDescription>

          <div className="mt-6 grid gap-2.5 sm:grid-cols-2" aria-label="Choose website language">
            {languageOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                autoFocus={option.id === 'ID'}
                onClick={() => selectLanguage(option.id)}
                className="group flex min-h-[5.75rem] items-center gap-3 rounded-2xl border-2 border-[#1E1E1E] bg-white p-3.5 text-left transition-[transform,background-color,color,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-[#1E1E1E] hover:text-white hover:shadow-[4px_4px_0_#8A9C7A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A9C7A] focus-visible:ring-offset-2 active:translate-y-0 sm:min-h-[7.25rem] sm:flex-col sm:items-start sm:justify-between"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E7EEE1] font-mono text-[10px] font-black text-[#526049] transition-colors group-hover:bg-[#8A9C7A] group-hover:text-white">
                  {option.shortLabel}
                </span>
                <span className="min-w-0 flex-1 sm:flex-none">
                  <strong className="block font-display text-sm font-black uppercase leading-tight">{option.name}</strong>
                  <span className="mt-1 flex items-center gap-1 font-sans text-[9px] font-semibold leading-tight text-[#647554] transition-colors group-hover:text-[#B8C8AA]">
                    {option.action}<ArrowRight size={11} aria-hidden="true" />
                  </span>
                </span>
                <Check size={16} className="shrink-0 text-[#8A9C7A] opacity-0 transition-opacity group-hover:opacity-100 sm:self-end" aria-hidden="true" />
              </button>
            ))}
          </div>

          <p className="mt-4 text-center font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-[#647554]">
            You can change this later · Dapat diubah kapan saja
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
