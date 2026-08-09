import React, { useState } from "react";
import { PROTEIN_TIERS } from "../lib/menuService";

const NUTRIENT_FIELDS = [
  { key: "protein", label: "Protein aktual", unit: "g" },
  { key: "carbs", label: "Karbohidrat", unit: "g" },
  { key: "fat", label: "Lemak", unit: "g" },
  { key: "fiber", label: "Serat", unit: "g" },
  { key: "kcal", label: "Kalori", unit: "kcal" },
  { key: "sodium", label: "Natrium", unit: "mg" },
  { key: "potassium", label: "Kalium", unit: "mg" },
];

const formatInputValue = (value) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue.toFixed(2) : "";
};

function NutritionNumberInput({ id, value, onValueChange, disabled }) {
  const [draftValue, setDraftValue] = useState(() => formatInputValue(value));

  const handleChange = (event) => {
    const nextValue = event.currentTarget.value;
    setDraftValue(nextValue);
    onValueChange(nextValue);
  };

  const handleBlur = () => {
    if (draftValue === "") return;

    const formattedValue = formatInputValue(draftValue);
    setDraftValue(formattedValue);
    onValueChange(formattedValue);
  };

  return (
    <input
      id={id}
      type="number"
      inputMode="decimal"
      min="0"
      step="0.01"
      required
      disabled={disabled}
      value={draftValue}
      onChange={handleChange}
      onBlur={handleBlur}
      className="mt-1.5 w-full rounded-md border border-[#1E1E1E] p-2 text-xs font-black text-[#1E1E1E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8D9B7D] disabled:bg-gray-100"
    />
  );
}

export function NutritionTierEditor({ value, onChange, disabled = false }) {
  const [selectedTier, setSelectedTier] = useState(40);
  const selectedNutrition = value?.[selectedTier] || {};

  const updateField = (field, rawValue) => {
    onChange({
      ...value,
      [selectedTier]: {
        ...selectedNutrition,
        [field]: rawValue,
      },
    });
  };

  return (
    <fieldset className="rounded-xl border-2 border-[#1E1E1E] bg-[#E1ECD3]/40 p-3.5 sm:p-4">
      <legend className="px-2 font-display text-sm font-black uppercase text-[#1E1E1E]">
        Varian Protein &amp; Nutrition Facts
      </legend>
      <p id="nutrition-tier-help" className="mb-3 text-[11px] font-medium leading-relaxed text-[#1E1E1E]/70">
        Pilih kategori protein, lalu isi nilai nutrisi per satu porsi menu tersebut.
      </p>

      <div
        className="grid grid-cols-5 border-2 border-[#1E1E1E] bg-white"
        role="radiogroup"
        aria-label="Kategori protein yang diedit"
        aria-describedby="nutrition-tier-help"
      >
        {PROTEIN_TIERS.map((tier) => {
          const isSelected = selectedTier === tier;
          return (
            <button
              key={tier}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setSelectedTier(tier)}
              disabled={disabled}
              className={`min-h-11 border-r border-[#1E1E1E] px-1 font-mono text-[10px] font-black last:border-r-0 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8D9B7D] focus-visible:ring-inset disabled:opacity-50 sm:text-xs ${isSelected ? "bg-[#1E1E1E] text-white" : "bg-white text-[#1E1E1E] hover:bg-[#E1ECD3]"}`}
            >
              {tier}g
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between border-b border-[#1E1E1E]/20 pb-2">
        <span className="font-mono text-[10px] font-black uppercase text-[#6B7860]">
          Nutrition Facts — kategori {selectedTier}g
        </span>
        <span className="rounded-full border border-[#1E1E1E] bg-white px-2 py-0.5 font-mono text-[9px] font-bold">
          PER PORSI
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {NUTRIENT_FIELDS.map((field) => {
          const inputId = `nutrition-${selectedTier}-${field.key}`;
          return (
            <div key={field.key} className="rounded-lg border border-[#1E1E1E] bg-white p-2.5">
              <label htmlFor={inputId} className="block font-mono text-[9px] font-bold uppercase text-[#6B7860]">
                {field.label} ({field.unit})
              </label>
              <NutritionNumberInput
                key={`${selectedTier}-${field.key}`}
                id={inputId}
                value={selectedNutrition[field.key] ?? 0}
                onValueChange={(rawValue) => updateField(field.key, rawValue)}
                disabled={disabled}
              />
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
