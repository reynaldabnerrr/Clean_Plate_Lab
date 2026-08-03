import React from 'react';
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
  },
  {
    id: 'EN',
    shortLabel: 'EN',
    name: 'English',
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
        className="w-[calc(100%-2rem)] max-w-[25rem] gap-0 rounded-3xl border border-[#1E1E1E]/15 bg-[#F5F2EA] p-6 text-center shadow-[0_24px_70px_rgba(30,30,30,0.22)] sm:w-[calc(100%-3rem)] sm:p-8"
      >
        <CplLogoImage size={62} className="mx-auto" />
        <DialogTitle className="mt-4 text-2xl leading-none sm:text-[1.7rem]">
          Pilih bahasa
          <span className="mt-1 block text-[#647554]">Choose language</span>
        </DialogTitle>
        <DialogDescription id="language-welcome-description" className="mx-auto mt-3 max-w-xs font-sans text-[11px] leading-5 text-[#526049]">
          Pilih bahasa untuk melanjutkan.
        </DialogDescription>

        <div className="mt-6 grid gap-2" aria-label="Choose website language">
          {languageOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              autoFocus={option.id === 'ID'}
              onClick={() => selectLanguage(option.id)}
              className="flex min-h-13 items-center gap-3 rounded-xl border border-[#1E1E1E]/20 bg-white px-4 py-3 text-left transition-colors hover:border-[#8A9C7A] hover:bg-[#E7EEE1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A9C7A] focus-visible:ring-offset-2"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E7EEE1] font-mono text-[9px] font-black text-[#526049]">
                {option.shortLabel}
              </span>
              <strong className="font-display text-xs font-black uppercase">{option.name}</strong>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
