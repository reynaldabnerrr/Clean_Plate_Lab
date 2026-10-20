import React from "react";
import { Check, UtensilsCrossed } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  customizationCopy,
  describeCustomization,
  mealCustomizationOptions,
} from "../lib/mealCustomization";

const CUSTOMIZATION_PRESETS = [
  {
    value: "complete",
    ids: [],
    labelID: "Meal Lengkap (Standar)",
    labelEN: "Complete Meal (Standard)",
    descID: "Semua bahan lengkap disajikan",
    descEN: "All ingredients included",
  },
  {
    value: "no-rice",
    ids: ["no-rice"],
    labelID: "Tanpa Nasi (No Rice)",
    labelEN: "No Rice",
    descID: "Porsi protein disesuaikan tetap tinggi",
    descEN: "Protein portion adjusted to target",
  },
  {
    value: "no-vegetables",
    ids: ["no-vegetables"],
    labelID: "Tanpa Sayur (No Vegetables)",
    labelEN: "No Vegetables",
    descID: "Hanya protein & karbohidrat",
    descEN: "Protein and carbs only",
  },
  {
    value: "no-egg",
    ids: ["no-egg"],
    labelID: "Tanpa Telur (No Egg)",
    labelEN: "No Egg",
    descID: "Bebas olahan telur",
    descEN: "Free from egg preparations",
  },
  {
    value: "no-rice,no-vegetables",
    ids: ["no-rice", "no-vegetables"],
    labelID: "Tanpa Nasi & Sayur",
    labelEN: "No Rice & Veggies",
    descID: "Fokus protein ayam saja",
    descEN: "Pure chicken protein focus",
  },
  {
    value: "no-rice,no-egg",
    ids: ["no-rice", "no-egg"],
    labelID: "Tanpa Nasi & Telur",
    labelEN: "No Rice & Egg",
    descID: "Tanpa nasi dan bebas telur",
    descEN: "No rice, egg-free",
  },
  {
    value: "no-vegetables,no-egg",
    ids: ["no-vegetables", "no-egg"],
    labelID: "Tanpa Sayur & Telur",
    labelEN: "No Veggies & Egg",
    descID: "Hanya ayam & nasi",
    descEN: "Chicken and rice only",
  },
  {
    value: "no-rice,no-vegetables,no-egg",
    ids: ["no-rice", "no-vegetables", "no-egg"],
    labelID: "Tanpa Nasi, Sayur & Telur",
    labelEN: "No Rice, Veggies & Egg",
    descID: "Hanya protein ayam murni",
    descEN: "Pure chicken protein only",
  },
];

function idsToSelectValue(ids = []) {
  const sorted = [...ids].sort().join(",");
  const match = CUSTOMIZATION_PRESETS.find(
    (p) => [...p.ids].sort().join(",") === sorted,
  );
  return match ? match.value : sorted || "complete";
}

function selectValueToIds(val) {
  const match = CUSTOMIZATION_PRESETS.find((p) => p.value === val);
  if (match) return match.ids;
  if (val === "complete") return [];
  return val.split(",").filter(Boolean);
}

export function MealCustomization({
  items,
  language,
  onChange,
  onSetCustomization,
}) {
  const copy = customizationCopy[language] || customizationCopy.ID;
  const isIndonesian = language === "ID";

  const handlePresetSelect = (mealIndex, selectVal) => {
    const newIds = selectValueToIds(selectVal);
    if (typeof onSetCustomization === "function") {
      onSetCustomization(mealIndex, newIds);
    } else {
      // Diff fallback for onChange
      const currentIds = items[mealIndex]?.customizationIds || [];
      const allIds = ["no-rice", "no-vegetables", "no-egg"];
      for (const optId of allIds) {
        const inCurrent = currentIds.includes(optId);
        const inNew = newIds.includes(optId);
        if (inCurrent !== inNew) {
          onChange(mealIndex, optId);
        }
      }
    }
  };

  const handlePillClick = (mealIndex, optionId) => {
    onChange(mealIndex, optionId);
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const currentSelectVal = idsToSelectValue(item.customizationIds);

        return (
          <div
            key={item.mealNumber}
            className="rounded-xl border border-[#1E1E1E]/15 bg-white p-3 shadow-xs sm:p-3.5"
          >
            {/* Meal Header (only shows when 2 meals or highlights meal label) */}
            {items.length > 1 ? (
              <div className="mb-2.5 flex items-center justify-between border-b border-[#1E1E1E]/10 pb-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center rounded-md bg-[#1E1E1E] px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-white">
                    {copy.meal} {item.mealNumber}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-[#6B7860]">
                    · {item.readyTime}
                  </span>
                </div>
                <span className="font-mono text-[9px] font-bold text-[#6B7860]">
                  Target: {item.proteinTarget}g Protein
                </span>
              </div>
            ) : null}

            {/* Radix UI Select Dropdown */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor={`meal-customization-select-${item.mealNumber}`}
                  className="block font-display text-[10px] font-bold uppercase text-[#4D4D4D]"
                >
                  {isIndonesian
                    ? "Pilihan Kustomisasi Porsi & Bahan:"
                    : "Meal & Ingredient Preference:"}
                </label>
                <span className="font-mono text-[8px] font-bold uppercase text-[#6B7860]">
                  {copy.free}
                </span>
              </div>

              <Select
                value={currentSelectVal}
                onValueChange={(val) => handlePresetSelect(index, val)}
              >
                <SelectTrigger
                  id={`meal-customization-select-${item.mealNumber}`}
                  className="group min-h-12 w-full rounded-xl border-2 border-[#1E1E1E] bg-[#FEFDF9] px-3.5 py-2 text-left shadow-[3px_3px_0_#1E1E1E] transition-all hover:bg-white focus-visible:ring-2 focus-visible:ring-[#8D9B7D]"
                >
                  <SelectValue
                    placeholder={
                      isIndonesian
                        ? "Pilih Kustomisasi (Default: Lengkap)"
                        : "Select Customization"
                    }
                  >
                    <span className="flex items-center gap-2 font-display text-xs font-black uppercase text-[#1E1E1E]">
                      <UtensilsCrossed size={13} className="text-[#8D9B7D]" />
                      <span>
                        {describeCustomization(
                          item.customizationIds,
                          language,
                        )}
                      </span>
                    </span>
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  {CUSTOMIZATION_PRESETS.map((preset) => (
                    <SelectItem key={preset.value} value={preset.value}>
                      <div className="flex flex-col py-0.5 text-left">
                        <strong className="font-display text-[11px] font-extrabold uppercase leading-tight">
                          {isIndonesian ? preset.labelID : preset.labelEN}
                        </strong>
                        <span className="mt-0.5 font-mono text-[8px] text-[#6B7860]">
                          {isIndonesian ? preset.descID : preset.descEN}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quick Toggle Chips (No rice, No vegetables, No egg) */}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5 pt-1">
              <span className="mr-0.5 font-mono text-[8px] font-bold uppercase tracking-wider text-[#6B7860]">
                {isIndonesian ? "Atau klik tombol:" : "Or quick tap:"}
              </span>
              {mealCustomizationOptions.map((opt) => {
                const isSelected = item.customizationIds.includes(opt.id);

                return (
                  <button
                    key={opt.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => handlePillClick(index, opt.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-display text-[10px] font-extrabold uppercase tracking-tight transition-all active:scale-95 ${
                      isSelected
                        ? "border-2 border-[#1E1E1E] bg-[#1E1E1E] text-white shadow-[2px_2px_0_#8D9B7D]"
                        : "border border-[#1E1E1E]/20 bg-[#FEFDF9] text-[#1E1E1E] hover:border-[#8D9B7D] hover:bg-[#F7FAF3]"
                    }`}
                  >
                    {isSelected ? (
                      <span className="flex size-3.5 items-center justify-center rounded-full bg-[#C8D8B8] text-[#1E1E1E]">
                        <Check size={9} strokeWidth={3} />
                      </span>
                    ) : (
                      <span className="font-mono text-xs font-bold text-[#6B7860]">
                        +
                      </span>
                    )}
                    <span>{opt[language]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <p className="text-[10px] leading-relaxed text-[#6B7860]">
        {copy.applies}
      </p>
    </div>
  );
}

export function MealCustomizationSummary({ items, language }) {
  const copy = customizationCopy[language] || customizationCopy.ID;

  return (
    <div className="my-3 space-y-2 rounded-xl border border-[#8D9B7D]/40 bg-[#FEFDF9] p-3 text-xs sm:col-span-2 sm:p-3.5">
      <div className="flex items-center justify-between">
        <p className="font-display text-[11px] font-black uppercase text-[#1E1E1E]">
          {copy.title}
        </p>
        <span className="rounded bg-[#E1ECD3] px-2 py-0.5 font-mono text-[8px] font-bold uppercase text-[#3A4A30]">
          {copy.free}
        </span>
      </div>

      <div className="space-y-1.5 border-t border-[#1E1E1E]/10 pt-2">
        {items.map((item) => {
          const isComplete = item.customizationIds.length === 0;

          return (
            <div
              key={item.mealNumber}
              className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[9px] font-bold uppercase text-[#1E1E1E]">
                  {copy.meal} {item.mealNumber} ({item.readyTime}):
                </span>
                <span
                  className={`font-semibold ${
                    isComplete ? "text-[#3A4A30]" : "text-[#C93B2B]"
                  }`}
                >
                  {describeCustomization(item.customizationIds, language)}
                </span>
              </div>
              <span className="font-mono text-[9px] font-bold text-[#6B7860]">
                {copy.target}: {item.proteinTarget}g
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
