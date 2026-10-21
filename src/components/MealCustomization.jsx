import React from "react";
import { Check, Egg, Leaf, Sparkles, UtensilsCrossed, Wheat } from "lucide-react";
import { mealCustomizationOptions } from "../lib/mealCustomization";

const OPTION_ICONS = {
  "no-rice": Wheat,
  "no-vegetables": Leaf,
  "no-egg": Egg,
};

export function MealCustomization({ items, language, onChange }) {
  const isIndonesian = language === "ID";

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isComplete = item.customizationIds.length === 0;

        // Build list of active excluded names for dynamic feedback
        const excludedNames = item.customizationIds
          .map((id) => {
            const opt = mealCustomizationOptions.find((o) => o.id === id);
            return opt ? opt[language] : id;
          })
          .join(", ");

        return (
          <div
            key={item.mealNumber}
            className="rounded-2xl border-2 border-[#1E1E1E]/15 bg-white p-3 shadow-xs transition-colors hover:border-[#1E1E1E]/30 sm:p-3.5"
          >
            {/* Header: Always show Meal Number & Target Protein for clarity */}
            <div className="mb-2.5 flex items-center justify-between border-b border-[#1E1E1E]/10 pb-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="inline-flex items-center justify-center rounded-md bg-[#1E1E1E] px-2 py-0.5 font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white">
                  Meal {item.mealNumber}
                </span>
                <span className="font-mono text-[10px] sm:text-[11px] font-semibold text-[#4D4D4D]">
                  · {item.readyTime}
                </span>
              </div>
              <span className="inline-flex items-center rounded-md bg-[#E1ECD3] px-2 py-0.5 font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#3A4A30]">
                {item.proteinTarget}g Protein
              </span>
            </div>

            {/* Instruction bar */}
            <div className="mb-2 flex items-center justify-between">
              <span className="font-display text-[10px] font-extrabold uppercase tracking-wider text-[#4D4D4D]">
                {isIndonesian
                  ? "Pilih Bahan Yang Dihilangkan:"
                  : "Tap to Exclude Ingredients:"}
              </span>
              <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-[#6B7860]">
                {isIndonesian ? "Gratis · Harga Tetap" : "Free · Price Unchanged"}
              </span>
            </div>

            {/* 3 Interactive Option Tiles */}
            <div
              className="grid grid-cols-3 gap-1.5 sm:gap-2"
              role="group"
              aria-label={
                isIndonesian
                  ? `Kustomisasi Meal ${item.mealNumber}`
                  : `Customize Meal ${item.mealNumber}`
              }
            >
              {mealCustomizationOptions.map((opt) => {
                const isSelected = item.customizationIds.includes(opt.id);
                const IconComponent = OPTION_ICONS[opt.id] || Sparkles;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="checkbox"
                    aria-checked={isSelected}
                    onClick={() => onChange(index, opt.id)}
                    className={`group relative flex min-h-[5rem] flex-col justify-between rounded-xl border-2 p-2 text-left transition-all duration-150 active:scale-95 sm:min-h-[5.5rem] sm:p-2.5 ${
                      isSelected
                        ? "-translate-y-0.5 border-[#1E1E1E] bg-[#1E1E1E] text-white shadow-[0_2px_0_#8D9B7D]"
                        : "border-[#1E1E1E]/15 bg-[#FEFDF9] text-[#1E1E1E] hover:-translate-y-0.5 hover:border-[#8D9B7D] hover:bg-[#F9FAF6]"
                    }`}
                  >
                    {/* Top Row: Icon + Checkbox Badge */}
                    <div className="flex w-full items-center justify-between">
                      <span
                        className={`flex size-6 items-center justify-center rounded-lg transition-colors sm:size-7 ${
                          isSelected
                            ? "bg-white/15 text-[#C8D8B8]"
                            : "bg-[#E1ECD3] text-[#3A4A30]"
                        }`}
                      >
                        <IconComponent size={13} />
                      </span>

                      <span
                        className={`flex size-4 items-center justify-center rounded-full transition-colors ${
                          isSelected
                            ? "bg-[#C8D8B8] text-[#1E1E1E]"
                            : "border border-[#1E1E1E]/20 text-[10px] font-bold text-[#6B7860]"
                        }`}
                        aria-hidden="true"
                      >
                        {isSelected ? (
                          <Check size={10} strokeWidth={3} />
                        ) : (
                          "+"
                        )}
                      </span>
                    </div>

                    {/* Bottom Row: Option Name + State */}
                    <div className="mt-1.5 min-w-0">
                      <strong className="block min-w-0 font-display text-[10px] font-black uppercase leading-tight sm:text-[11px]">
                        {opt[language]}
                      </strong>
                      <span
                        className={`mt-0.5 block font-mono text-[8px] font-bold uppercase tracking-wider sm:text-[9px] ${
                          isSelected ? "text-[#C8D8B8]" : "text-[#6B7860]"
                        }`}
                      >
                        {isSelected
                          ? isIndonesian
                            ? "Dihapus"
                            : "Excluded"
                          : isIndonesian
                            ? "Standar"
                            : "Standard"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Status Feedback Note */}
            <div className="mt-2.5">
              {isComplete ? (
                <div className="flex items-center justify-between rounded-xl border border-[#8D9B7D]/30 bg-[#E1ECD3]/50 px-3 py-2 text-[10px]">
                  <span className="flex items-center gap-1.5 font-display font-extrabold uppercase text-[#3A4A30]">
                    <Sparkles size={12} className="text-[#6B7860]" />
                    <span>
                      {isIndonesian
                        ? "Meal Lengkap (Semua Bahan Termasuk)"
                        : "Complete Meal (All Ingredients Included)"}
                    </span>
                  </span>
                  <span className="font-mono text-[9px] font-bold uppercase text-[#6B7860]">
                    {isIndonesian ? "Porsi Standar" : "Standard Portion"}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5 rounded-xl border-2 border-[#1E1E1E] bg-[#1E1E1E] px-3 py-2 text-white shadow-xs sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Check size={12} strokeWidth={3} className="shrink-0 text-[#C8D8B8]" />
                    <span className="font-display text-[10px] sm:text-[11px] font-black uppercase tracking-tight text-[#C8D8B8] truncate sm:whitespace-normal">
                      {isIndonesian ? "Kustomisasi: " : "Customized: "}
                      <span className="text-white font-extrabold">{excludedNames}</span>
                    </span>
                  </div>
                  <span className="inline-flex shrink-0 self-start sm:self-auto rounded bg-white/15 px-2 py-0.5 font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-[#C8D8B8]">
                    {isIndonesian
                      ? "Protein Dialihkan Ekstra"
                      : "Adjusted Extra Protein"}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      <p className="font-sans text-[10px] leading-relaxed text-[#6B7860]">
        {isIndonesian
          ? "Porsi protein dada ayam otomatis disesuaikan agar target protein harianmu tetap terpenuhi 100%."
          : "Chicken breast protein portion is automatically adjusted to meet 100% of your daily protein target."}
      </p>
    </div>
  );
}

export function MealCustomizationSummary({ items, language }) {
  const isIndonesian = language === "ID";

  return (
    <div className="rounded-xl border border-[#8D9B7D]/25 bg-white p-3 sm:p-3.5 sm:col-span-2">
      {/* Top Header */}
      <div className="mb-2.5 flex items-center justify-between border-b border-[#1E1E1E]/10 pb-2">
        <div className="flex items-center gap-1.5">
          <UtensilsCrossed size={12} className="text-[#6B7860]" />
          <span className="font-display text-[10px] font-black uppercase tracking-wider text-[#1E1E1E]">
            {isIndonesian ? "Kustomisasi Meal" : "Meal Customization"}
          </span>
        </div>
        <span className="rounded bg-[#E1ECD3] px-2 py-0.5 font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-[#3A4A30]">
          {isIndonesian ? "Gratis" : "Free"}
        </span>
      </div>

      {/* Meal Items */}
      <div className="space-y-3">
        {items.map((item) => {
          const isComplete = item.customizationIds.length === 0;

          return (
            <div
              key={item.mealNumber}
              className="space-y-2 border-b border-[#1E1E1E]/5 pb-2.5 last:border-0 last:pb-0"
            >
              {/* Row 1: Meal Title & Ready Time on left, Target Protein on right */}
              <div className="flex items-center justify-between gap-2">
                <span className="font-display text-[10px] sm:text-[11px] font-black uppercase text-[#1E1E1E]">
                  Meal {item.mealNumber} ({item.readyTime}):
                </span>
                <span className="inline-flex shrink-0 items-center rounded bg-[#1E1E1E] px-2 py-0.5 font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white">
                  {item.proteinTarget}g Protein
                </span>
              </div>

              {/* Row 2: Badges — wraps gracefully without ANY clipping */}
              <div className="flex flex-wrap items-center gap-1.5">
                {isComplete ? (
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-[#E1ECD3] px-2.5 py-1 font-display text-[9px] sm:text-[10px] font-bold uppercase text-[#3A4A30]">
                    <Check size={11} strokeWidth={2.5} />
                    <span>
                      {isIndonesian
                        ? "Meal Lengkap (Semua Bahan)"
                        : "Complete Meal (Standard)"}
                    </span>
                  </span>
                ) : (
                  item.customizationIds.map((optId) => {
                    const opt = mealCustomizationOptions.find(
                      (o) => o.id === optId,
                    );
                    const label = opt ? opt[language] : optId;

                    return (
                      <span
                        key={optId}
                        className="inline-flex items-center gap-1 rounded-md border border-[#C93B2B]/30 bg-[#FFF5F4] px-2.5 py-1 font-display text-[9px] sm:text-[10px] font-bold uppercase text-[#C93B2B]"
                      >
                        <span className="text-[10px] font-black leading-none">✕</span>
                        <span>{label}</span>
                      </span>
                    );
                  })
                )}
              </div>

              {/* Row 3: Subtext reassurance if customized */}
              {!isComplete && (
                <p className="font-mono text-[8px] sm:text-[9px] text-[#6B7860] mt-0.5">
                  {isIndonesian
                    ? `• Porsi protein dada ayam dimaksimalkan untuk ${item.proteinTarget}g protein`
                    : `• Extra chicken portion adjusted to fulfill ${item.proteinTarget}g protein target`}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
