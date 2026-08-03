/**
 * @typedef {Object} Meal
 * @property {string} id
 * @property {number} week
 * @property {string} name
 * @property {string} description
 * @property {string} photo
 * @property {number} protein
 * @property {number} calories
 * @property {number} carbs
 * @property {number} fat
 * @property {number} fiber
 * @property {number} sodium
 * @property {number} potassium
 * @property {number[]} availableProteinTiers
 * @property {Record<number, {protein: number, calories: number, carbs: number, fat: number, fiber: number, sodium: number, potassium: number}>} nutritionByTier
 * @property {number} price
 * @property {string[]} addons
 * @property {boolean} featured
 */

const mealCatalog = [
  {
    id: 'chicken-teriyaki',
    week: 1,
    name: 'Chicken Teriyaki',
    description: 'Tender chicken with a glossy house teriyaki, steamed rice, and crisp seasonal vegetables.',
    descriptionID: 'Ayam empuk dengan saus teriyaki racikan kami, nasi hangat, dan sayuran musiman yang renyah.',
    photo: '/images/chicken_teriyaki.webp',
    protein: 40,
    calories: 548,
    carbs: 58,
    fat: 14,
    fiber: 6,
    sodium: 720,
    potassium: 610,
    availableProteinTiers: [25, 40, 60, 80, 100],
    price: 25000,
    addons: ['vegetables', 'potato-corn'],
    featured: true,
  },
  {
    id: 'ayam-cabe-ijo',
    week: 1,
    name: 'Ayam Cabe Ijo',
    description: 'Lean chicken with bright green chilli sambal, rice, and vegetables for a fresh, savoury finish.',
    descriptionID: 'Ayam rendah lemak dengan sambal cabai hijau segar, nasi, dan sayuran dengan cita rasa gurih yang ringan.',
    photo: '/images/ayam_cabe_ijo.webp',
    protein: 40,
    calories: 521,
    carbs: 52,
    fat: 15,
    fiber: 7,
    sodium: 690,
    potassium: 645,
    availableProteinTiers: [25, 40, 60, 80, 100],
    price: 25000,
    addons: ['vegetables', 'potato-corn'],
    featured: true,
  },
  {
    id: 'chicken-mentai',
    week: 2,
    name: 'Chicken Mentai',
    description: 'Juicy chicken with a balanced creamy mentai sauce, rice, and a clean vegetable side.',
    descriptionID: 'Ayam juicy dengan saus mentai creamy yang seimbang, nasi, dan pendamping sayuran segar.',
    photo: '/images/chicken_mentai.webp',
    protein: 40,
    calories: 584,
    carbs: 55,
    fat: 19,
    fiber: 5,
    sodium: 760,
    potassium: 590,
    availableProteinTiers: [25, 40, 60, 80, 100],
    price: 25000,
    addons: ['vegetables', 'potato-corn'],
    featured: true,
  },
  {
    id: 'sate-padang',
    week: 2,
    name: 'Sate Padang',
    description: 'Aromatic Padang-spiced chicken with a lighter house sauce, rice, and seasonal vegetables.',
    descriptionID: 'Ayam berbumbu Padang aromatik dengan saus racikan yang lebih ringan, nasi, dan sayuran musiman.',
    photo: '/images/sate_padang.webp',
    protein: 40,
    calories: 536,
    carbs: 57,
    fat: 13,
    fiber: 6,
    sodium: 735,
    potassium: 625,
    availableProteinTiers: [25, 40, 60, 80, 100],
    price: 25000,
    addons: ['vegetables', 'potato-corn'],
    featured: false,
  },
  {
    id: 'oseng-ayam-kecombrang',
    week: 3,
    name: 'Oseng Ayam Kecombrang',
    description: 'Fragrant torch-ginger chicken stir-fry with rice and vegetables, prepared fresh for each service.',
    descriptionID: 'Tumis ayam kecombrang yang harum dengan nasi dan sayuran, dimasak segar untuk setiap layanan.',
    photo: '/images/oseng_ayam_kecombrang.webp',
    protein: 40,
    calories: 506,
    carbs: 51,
    fat: 13,
    fiber: 7,
    sodium: 665,
    potassium: 680,
    availableProteinTiers: [25, 40, 60, 80, 100],
    price: 25000,
    addons: ['vegetables', 'potato-corn'],
    featured: false,
  },
  {
    id: 'sweet-sour-crispy-chicken',
    week: 4,
    name: 'Sweet & Sour Crispy Chicken',
    description: 'Crisp chicken finished in a house sweet-and-sour glaze with rice and a fresh vegetable side.',
    descriptionID: 'Ayam renyah dengan saus asam manis racikan kami, nasi, dan sayuran segar sebagai pendamping.',
    photo: '/images/sweet_sour_crispy_chicken.webp',
    protein: 40,
    calories: 612,
    carbs: 67,
    fat: 18,
    fiber: 5,
    sodium: 780,
    potassium: 570,
    availableProteinTiers: [25, 40, 60, 80, 100],
    price: 25000,
    addons: ['vegetables', 'potato-corn'],
    featured: false,
  },
];

/**
 * The current catalog contains verified example data for the 40g variants.
 * Add future tier-specific values to `nutritionByTier` on each meal object;
 * the generated 40g fallback below keeps existing data backward compatible.
 * @type {Meal[]}
 */
export const meals = mealCatalog.map((meal) => ({
  ...meal,
  nutritionByTier: meal.nutritionByTier || {
    [meal.protein]: {
      protein: meal.protein,
      calories: meal.calories,
      carbs: meal.carbs,
      fat: meal.fat,
      fiber: meal.fiber,
      sodium: meal.sodium,
      potassium: meal.potassium,
    },
  },
}));

export const featuredMeals = meals.filter((meal) => meal.featured);

export function getMealById(id) {
  return meals.find((meal) => meal.id === id);
}

export function getMealsByWeek(week) {
  return meals.filter((meal) => meal.week === week);
}

export function getNutritionForTier(meal, proteinTier) {
  return meal?.nutritionByTier?.[Number(proteinTier)] || null;
}
