import { customizationCopy, describeCustomization, mealCustomizationOptions } from "../lib/mealCustomization";

export function MealCustomization({ items, language, onChange }) {
  const copy = customizationCopy[language];
  return <section className="mb-5 space-y-3" aria-label={copy.title}>
    <div className="flex items-center gap-2.5">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1E1E1E] font-mono text-[10px] font-bold text-white">03</span>
      <h3 className="font-display text-xs font-extrabold uppercase">{copy.title}</h3>
    </div>
    <p className="text-xs leading-5 text-[#555]">{copy.help}</p>
    {items.map((item, index) => <fieldset key={item.mealNumber} className="rounded-xl border border-[#8D9B7D]/40 bg-[#FEFDF9] p-3">
      <legend className="px-1 text-xs font-bold">{copy.meal} {item.mealNumber} · {item.readyTime}</legend>
      <div className="grid gap-1 sm:grid-cols-3">
        {mealCustomizationOptions.map((option) => <label key={option.id} className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-2 text-xs hover:bg-[#E1ECD3]">
          <input type="checkbox" checked={item.customizationIds.includes(option.id)} onChange={() => onChange(index, option.id)} className="size-4 accent-[#6B7860]" />
          {option[language]}
        </label>)}
      </div>
    </fieldset>)}
    <p className="text-xs text-[#6B7860]">{copy.applies}</p>
  </section>;
}

export function MealCustomizationSummary({ items, language }) {
  const copy = customizationCopy[language];
  return <div className="my-3 space-y-2 rounded-xl border border-[#8D9B7D]/30 bg-[#FEFDF9] p-3 text-xs sm:col-span-2">
    <p className="font-bold">{copy.title}</p>
    {items.map((item) => <p key={item.mealNumber} className="leading-5">
      <strong>{copy.meal} {item.mealNumber} · {item.readyTime}: </strong>
      {describeCustomization(item.customizationIds, language)}
      <span className="block text-[#6B7860]">{copy.target}: {item.proteinTarget}g</span>
    </p>)}
    <p className="text-[#6B7860]">{copy.free}</p>
  </div>;
}
