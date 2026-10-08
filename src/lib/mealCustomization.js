export const mealCustomizationOptions = [
  { id: "no-rice", ID: "Tanpa nasi", EN: "No rice" },
  { id: "no-vegetables", ID: "Tanpa sayur", EN: "No vegetables" },
  { id: "no-egg", ID: "Tanpa telur", EN: "No egg" },
];

export const customizationCopy = {
  ID: {
    title: "Sesuaikan Meal Kamu",
    help: "Pilih satu atau beberapa opsi tanpa biaya tambahan. Harga tetap sama, dan porsi protein akan disesuaikan agar target protein pilihanmu tetap terpenuhi. Biarkan semua opsi kosong untuk meal lengkap.",
    complete: "Meal lengkap",
    meal: "Meal",
    applies: "Pilihan setiap meal berlaku sepanjang periode katering.",
    target: "Target protein",
    free: "Tanpa biaya tambahan · Harga tetap",
  },
  EN: {
    title: "Customize Your Meal",
    help: "Select one or more options at no extra charge. The price stays the same, and we’ll adjust your protein portion to meet your selected protein target. Leave all boxes unchecked for the complete meal.",
    complete: "Complete meal",
    meal: "Meal",
    applies: "Each meal’s choices apply throughout your catering period.",
    target: "Protein target",
    free: "No extra charge · Price unchanged",
  },
};

export function normalizeMealCustomizations(value) {
  return [0, 1].map((index) => mealCustomizationOptions
    .filter((option) => Array.isArray(value?.[index]) && value[index].includes(option.id))
    .map((option) => option.id));
}

export function describeCustomization(ids, language = "ID") {
  return mealCustomizationOptions.filter((option) => ids.includes(option.id))
    .map((option) => option[language]).join(", ") || customizationCopy[language].complete;
}

export function formatKitchenMealItems(items) {
  return items.map((item) => `  • Meal ${item.mealNumber} (${item.readyTime}): ${describeCustomization(item.customizationIds, "ID")} · Target protein ${item.proteinTarget}g`).join("\n");
}

export function buildMealItems({ mealsPerDay, singleMealReadyTime, mealCustomizations, proteinTier, serviceDates }) {
  const selections = normalizeMealCustomizations(mealCustomizations);
  return Array.from({ length: mealsPerDay }, (_, index) => ({
    mealNumber: index + 1,
    readyTime: mealsPerDay === 1 ? singleMealReadyTime : index === 0 ? "12:00" : "18:00",
    customizationIds: selections[index],
    proteinTarget: proteinTier,
    quantity: serviceDates.length,
    serviceDates,
  }));
}
