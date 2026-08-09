import { supabase } from "./supabase";

export const MENU_IMAGE_BUCKET = "menu-images";
export const MENU_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const MENU_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const PROTEIN_TIERS = [25, 40, 60, 80, 100];

const padDatePart = (value) => String(value).padStart(2, "0");

/** Return the local calendar date for a Monday-Saturday slot in the current week. */
export function getWeeklyMenuDate(menuSlot, referenceDate = new Date()) {
  const slot = Number(menuSlot);
  if (!Number.isInteger(slot) || slot < 1 || slot > 6) return "";

  const date = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  );
  const isoDay = date.getDay() === 0 ? 7 : date.getDay();
  date.setDate(date.getDate() + slot - isoDay);

  return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`;
}

/** Check that a YYYY-MM-DD value belongs to the selected Monday-Saturday slot. */
export function getMenuSlotFromDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ""));
  if (!match) return null;

  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  if (
    date.getFullYear() !== Number(match[1])
    || date.getMonth() !== Number(match[2]) - 1
    || date.getDate() !== Number(match[3])
  ) {
    return null;
  }

  return date.getDay() === 0 ? 7 : date.getDay();
}

export function isMenuDateForSlot(value, menuSlot) {
  return getMenuSlotFromDate(value) === Number(menuSlot);
}

/** Format a database DATE without allowing UTC conversion to shift the day. */
export function formatMenuDate(value, locale = "id-ID") {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ""));
  if (!match) return "";

  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

const nutritionFormatters = new Map();

/** Format nutrition data consistently with two decimal places. */
export function formatNutritionValue(value, locale = "id-ID") {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return "—";

  if (!nutritionFormatters.has(locale)) {
    nutritionFormatters.set(
      locale,
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: false,
      }),
    );
  }

  return nutritionFormatters.get(locale).format(numericValue);
}

const NUTRITION_FIELDS = [
  "protein",
  "carbs",
  "fat",
  "fiber",
  "sodium",
  "potassium",
  "kcal",
];

const roundNutrition = (value) => Math.round(Number(value || 0) * 100) / 100;

/** Build editable estimates for all tiers from one existing nutrition snapshot. */
export function buildNutritionByTier(snapshot = {}) {
  const baseProtein = Math.max(Number(snapshot.protein) || 40, 1);

  return Object.fromEntries(
    PROTEIN_TIERS.map((tier) => {
      const ratio = tier / baseProtein;
      return [
        tier,
        {
          protein: tier,
          carbs: roundNutrition(Number(snapshot.carbs ?? 50) * ratio),
          fat: roundNutrition(Number(snapshot.fat ?? 15) * ratio),
          fiber: roundNutrition(Number(snapshot.fiber ?? 0.14) * ratio),
          sodium: roundNutrition(Number(snapshot.sodium ?? 500) * ratio),
          potassium: roundNutrition(Number(snapshot.potassium ?? 350) * ratio),
          kcal: roundNutrition(Number(snapshot.kcal ?? 500) * ratio),
        },
      ];
    }),
  );
}

/** Ensure every tier and nutrient is present and numeric before persisting. */
export function normalizeNutritionByTier(rawNutrition, fallbackSnapshot = {}) {
  const fallback = buildNutritionByTier(fallbackSnapshot);

  return Object.fromEntries(
    PROTEIN_TIERS.map((tier) => {
      const rawTier = rawNutrition?.[tier] || rawNutrition?.[String(tier)] || {};
      const normalizedTier = Object.fromEntries(
        NUTRITION_FIELDS.map((field) => {
          const rawValue = Number(rawTier[field]);
          return [
            field,
            Number.isFinite(rawValue) && rawValue >= 0
              ? roundNutrition(rawValue)
              : fallback[tier][field],
          ];
        }),
      );
      return [tier, normalizedTier];
    }),
  );
}

export function getMenuNutritionForTier(menu, tier = 40) {
  const normalizedTier = PROTEIN_TIERS.includes(Number(tier)) ? Number(tier) : 40;
  const nutrition = menu?.nutritionByTier?.[normalizedTier]
    || menu?.nutrition_by_tier?.[normalizedTier];
  return nutrition || buildNutritionByTier(menu)[normalizedTier];
}

export const DEFAULT_WEEKLY_MENUS = [
  {
    id: "m1",
    code: "CPL-MON",
    name: "Chicken Teriyaki",
    day: "Monday / Senin",
    category: "High Protein",
    protein: 82.4,
    carbs: 132.5,
    fat: 26.8,
    sodium: 1380.5,
    potassium: 355,
    kcal: 1100.8,
    image: "/images/chicken_teriyaki.webp",
    tags_ID: ["Monday / Senin", "82.4g Protein", "1100.8 Kkal"],
    tags_EN: ["Monday", "82.4g Protein", "1100.8 Kcal"],
    desc_ID:
      "Dada ayam empuk berbalut saus teriyaki manis gurih.",
    desc_EN:
      "Tender chicken glazed in a sweet and savory teriyaki sauce.",
    available: true,
    batch: "MON-01",
  },
  {
    id: "m2",
    code: "CPL-TUE",
    name: "Ayam Cabe Ijo",
    day: "Tuesday / Selasa",
    category: "Lean Muscle",
    protein: 79.8,
    carbs: 124.0,
    fat: 29.5,
    sodium: 1290.0,
    potassium: 365,
    kcal: 1080.7,
    image: "/images/ayam_cabe_ijo.webp",
    tags_ID: ["Tuesday / Selasa", "79.8g Protein", "1080.7 Kkal"],
    tags_EN: ["Tuesday", "79.8g Protein", "1080.7 Kcal"],
    desc_ID:
      "Ayam empuk beraroma sambal cabai hijau segar.",
    desc_EN:
      "Tender chicken tossed in an aromatic green chili sauce.",
    available: true,
    batch: "TUE-02",
  },
  {
    id: "m3",
    code: "CPL-WED",
    name: "Chicken Mentai",
    day: "Wednesday / Rabu",
    category: "High Protein",
    protein: 83.2,
    carbs: 128.5,
    fat: 31.2,
    sodium: 1420.0,
    potassium: 330,
    kcal: 1127.6,
    image: "/images/chicken_mentai.webp",
    tags_ID: ["Wednesday / Rabu", "83.2g Protein", "1127.6 Kkal"],
    tags_EN: ["Wednesday", "83.2g Protein", "1127.6 Kcal"],
    desc_ID:
      "Dada ayam juicy dengan lapisan saus mentai gurih creamy.",
    desc_EN:
      "Juicy chicken topped with a creamy, savory mentai sauce.",
    available: true,
    batch: "WED-03",
  },
  {
    id: "m4",
    code: "CPL-THU",
    name: "Sate Padang",
    day: "Thursday / Kamis",
    category: "Lean Muscle",
    protein: 81.0,
    carbs: 122.0,
    fat: 27.5,
    sodium: 1360.0,
    potassium: 370,
    kcal: 1059.5,
    image: "/images/sate_padang.webp",
    tags_ID: ["Thursday / Kamis", "81.0g Protein", "1059.5 Kkal"],
    tags_EN: ["Thursday", "81.0g Protein", "1059.5 Kcal"],
    desc_ID:
      "Dada ayam empuk dengan kuah sate Padang kaya rempah khas.",
    desc_EN:
      "Tender chicken coated in a rich and aromatic Padang-style sauce.",
    available: true,
    batch: "THU-04",
  },
  {
    id: "m5",
    code: "CPL-FRI",
    name: "Oseng Ayam Kecombrang",
    day: "Friday / Jumat",
    category: "High Protein",
    protein: 78.5,
    carbs: 125.0,
    fat: 25.0,
    sodium: 1240.0,
    potassium: 385,
    kcal: 1039.0,
    image: "/images/oseng_ayam_kecombrang.webp",
    tags_ID: ["Friday / Jumat", "78.5g Protein", "1039 Kkal"],
    tags_EN: ["Friday", "78.5g Protein", "1039 Kcal"],
    desc_ID:
      "Oseng ayam gurih bertabur irisan kecombrang harum.",
    desc_EN:
      "Savory stir-fried chicken infused with fragrant kecombrang.",
    available: true,
    batch: "FRI-05",
  },
  {
    id: "m6",
    code: "CPL-SAT",
    name: "Sweet & Sour Crispy Chicken",
    day: "Saturday / Sabtu",
    category: "Lean Muscle",
    protein: 80.5,
    carbs: 135.0,
    fat: 28.0,
    sodium: 1310.0,
    potassium: 345,
    kcal: 1114.0,
    image: "/images/sweet_sour_crispy_chicken.webp",
    tags_ID: ["Saturday / Sabtu", "80.5g Protein", "1114 Kkal"],
    tags_EN: ["Saturday", "80.5g Protein", "1114 Kcal"],
    desc_ID:
      "Ayam renyah berbalut saus asam manis buatan sendiri yang segar.",
    desc_EN:
      "Crispy chicken tossed in a sweet and tangy homemade sauce.",
    available: true,
    batch: "SAT-06",
  },
];

/** Normalize DB row to frontend camelCase item */
export function normalizeMenuItem(row) {
  const nutritionByTier = normalizeNutritionByTier(
    row.nutrition_by_tier || row.nutritionByTier,
    row,
  );
  const defaultNutrition = nutritionByTier[40];

  return {
    id: row.id,
    code: row.code || "CPL-MENU",
    name: row.name || "Menu",
    day: row.day || "",
    menuSlot: Number(row.menu_slot ?? getMenuSlot(row)),
    menuDate:
      row.menu_date
      || row.menuDate
      || getWeeklyMenuDate(Number(row.menu_slot ?? getMenuSlot(row))),
    category: "High Protein",
    protein: defaultNutrition.protein,
    carbs: defaultNutrition.carbs,
    fat: defaultNutrition.fat,
    fiber: defaultNutrition.fiber,
    sodium: defaultNutrition.sodium,
    potassium: defaultNutrition.potassium,
    kcal: defaultNutrition.kcal,
    availableProteinTiers: PROTEIN_TIERS,
    nutritionByTier,
    image: row.image || "/images/chicken_teriyaki.webp",
    tags_ID: Array.isArray(row.tags_id)
      ? row.tags_id
      : typeof row.tags_id === "string"
        ? JSON.parse(row.tags_id || "[]")
        : row.tags_ID || [row.day || "Today"],
    tags_EN: Array.isArray(row.tags_en)
      ? row.tags_en
      : typeof row.tags_en === "string"
        ? JSON.parse(row.tags_en || "[]")
        : row.tags_EN || [row.day || "Today"],
    desc_ID: row.desc_id || row.desc_ID || "",
    desc_EN: row.desc_en || row.desc_EN || "",
    batch: row.batch || "CPL-BATCH",
    created_at: row.created_at,
  };
}

/** Convert frontend item to DB format */
export function toDatabaseFormat(item) {
  const nutritionByTier = normalizeNutritionByTier(
    item.nutritionByTier || item.nutrition_by_tier,
    item,
  );
  const defaultNutrition = nutritionByTier[40];

  return {
    code: item.code,
    name: item.name,
    day: item.day,
    menu_slot: getMenuSlot(item),
    menu_date:
      item.menuDate
      || item.menu_date
      || getWeeklyMenuDate(getMenuSlot(item)),
    protein: defaultNutrition.protein,
    carbs: defaultNutrition.carbs,
    fat: defaultNutrition.fat,
    fiber: defaultNutrition.fiber,
    sodium: defaultNutrition.sodium,
    potassium: defaultNutrition.potassium,
    kcal: defaultNutrition.kcal,
    nutrition_by_tier: nutritionByTier,
    image: item.image,
    tags_id: Array.isArray(item.tags_ID) ? item.tags_ID : [],
    tags_en: Array.isArray(item.tags_EN) ? item.tags_EN : [],
    desc_id: item.desc_ID || "",
    desc_en: item.desc_EN || "",
    batch: item.batch || "BATCH-01",
  };
}

const DAY_ORDER_MAP = {
  mon: 1, senin: 1, monday: 1,
  tue: 2, selasa: 2, tuesday: 2,
  wed: 3, rabu: 3, wednesday: 3,
  thu: 4, kamis: 4, thursday: 4,
  fri: 5, jumat: 5, friday: 5,
  sat: 6, sabtu: 6, saturday: 6,
  sun: 7, minggu: 7, sunday: 7,
};

/** Resolve a menu to its fixed Monday-Saturday database slot. */
export function getMenuSlot(item = {}) {
  const explicitSlot = Number(item.menuSlot ?? item.menu_slot);
  if (Number.isInteger(explicitSlot) && explicitSlot >= 1 && explicitSlot <= 6) {
    return explicitSlot;
  }

  const text = `${item.day || ""} ${item.code || ""}`.toLowerCase();
  for (const [keyword, slot] of Object.entries(DAY_ORDER_MAP)) {
    if (slot <= 6 && text.includes(keyword)) return slot;
  }

  throw new Error("Hari menu harus berada pada slot Senin sampai Sabtu.");
}

/** Sort and deduplicate meals strictly from Monday (1) to Saturday (6) */
export function sortMealsByDay(meals = []) {
  const sorted = [...meals].sort((a, b) => {
    const textA = ((a.day || "") + " " + (a.code || "")).toLowerCase();
    const textB = ((b.day || "") + " " + (b.code || "")).toLowerCase();

    let rankA = 99;
    let rankB = 99;

    for (const [key, rank] of Object.entries(DAY_ORDER_MAP)) {
      if (textA.includes(key)) {
        rankA = Math.min(rankA, rank);
      }
      if (textB.includes(key)) {
        rankB = Math.min(rankB, rank);
      }
    }

    if (rankA !== rankB) {
      return rankA - rankB;
    }

    return (a.code || "").localeCompare(b.code || "");
  });

  // Deduplicate by day slot (keep first meal per day slot: Senin-Sabtu)
  const seenRanks = new Set();
  const result = [];

  for (const meal of sorted) {
    const text = ((meal.day || "") + " " + (meal.code || "")).toLowerCase();
    let rank = 99;
    for (const [key, r] of Object.entries(DAY_ORDER_MAP)) {
      if (text.includes(key)) {
        rank = Math.min(rank, r);
      }
    }

    if (rank <= 6) {
      if (!seenRanks.has(rank)) {
        seenRanks.add(rank);
        result.push(meal);
      }
    } else {
      result.push(meal);
    }
  }

  return result;
}

const getDefaultWeeklyMenus = () =>
  DEFAULT_WEEKLY_MENUS.map((item) =>
    normalizeMenuItem({
      ...item,
      nutrition_by_tier: buildNutritionByTier(item),
    }),
  );

/** Fetch all weekly menus from Supabase */
export async function fetchWeeklyMenusFromSupabase() {
  try {
    const { data, error } = await supabase
      .from("this_week_menu")
      .select("*");

    if (error) {
      console.warn("Supabase fetch error (using fallback):", error.message);
      return { data: sortMealsByDay(getDefaultWeeklyMenus()), isFromDb: false, error };
    }

    if (!data || data.length === 0) {
      return { data: sortMealsByDay(getDefaultWeeklyMenus()), isFromDb: false, error: null };
    }

    return {
      data: sortMealsByDay(data.map(normalizeMenuItem)),
      isFromDb: true,
      error: null,
    };
  } catch (err) {
    console.warn("Error calling Supabase API (using fallback):", err);
    return { data: sortMealsByDay(getDefaultWeeklyMenus()), isFromDb: false, error: err };
  }
}

/** Update or create the six fixed default slots without adding duplicates. */
export async function seedDefaultWeeklyMenus() {
  try {
    const dbPayloads = DEFAULT_WEEKLY_MENUS.map((item) => toDatabaseFormat(item));
    const { data, error } = await supabase
      .from("this_week_menu")
      .upsert(dbPayloads, { onConflict: "menu_slot" })
      .select();

    if (error) throw error;
    return { success: true, data: data.map(normalizeMenuItem) };
  } catch (error) {
    console.error("Failed to seed default weekly menus:", error);
    return { success: false, error: error.message };
  }
}

/** Validate an image before sending it to Supabase Storage. */
export function validateMenuImage(file) {
  if (typeof File === "undefined" || !(file instanceof File)) {
    return "Pilih file gambar terlebih dahulu.";
  }
  if (!MENU_IMAGE_TYPES.includes(file.type)) {
    return "Format gambar harus JPG, PNG, atau WebP.";
  }
  if (file.size > MENU_IMAGE_MAX_BYTES) {
    return "Ukuran gambar maksimal 5 MB.";
  }
  return null;
}

/**
 * Upload a menu image.
 *
 * Replacements overwrite the currently managed object so an old image cannot
 * be left behind as an orphan. New menu images still receive a unique path.
 */
export async function uploadMenuImage(file, menuCode = "menu", currentImage = "") {
  const validationError = validateMenuImage(file);
  if (validationError) return { success: false, error: validationError };

  const extensionByType = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  const safeCode = String(menuCode || "menu")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "menu";
  const uniqueId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const currentPath = getManagedMenuImagePath(currentImage);
  const createsNewObject = !currentPath;
  const objectPath = currentPath
    || `weekly/${safeCode}-${uniqueId}.${extensionByType[file.type]}`;

  try {
    const { error } = await supabase.storage
      .from(MENU_IMAGE_BUCKET)
      .upload(objectPath, file, {
        cacheControl: "31536000",
        contentType: file.type,
        upsert: !createsNewObject,
      });

    if (error) throw error;
    const { data } = supabase.storage.from(MENU_IMAGE_BUCKET).getPublicUrl(objectPath);
    const publicUrl = new URL(data.publicUrl);
    publicUrl.searchParams.set("v", uniqueId);

    return {
      success: true,
      publicUrl: publicUrl.toString(),
      path: objectPath,
      createsNewObject,
    };
  } catch (error) {
    console.error("Failed to upload menu image:", error);
    return { success: false, error: error.message || "Upload gambar gagal." };
  }
}

/** Return the object path only for URLs managed by this app's menu bucket. */
export function getManagedMenuImagePath(imageUrl) {
  if (!imageUrl) return null;
  const marker = `/storage/v1/object/public/${MENU_IMAGE_BUCKET}/`;
  try {
    const url = new URL(imageUrl);
    const markerIndex = url.pathname.indexOf(marker);
    if (markerIndex === -1) return null;
    return decodeURIComponent(url.pathname.slice(markerIndex + marker.length));
  } catch {
    return null;
  }
}

/** Best-effort cleanup for replaced or failed uploads. */
export async function removeMenuImage(imageOrPath) {
  const path = imageOrPath?.includes?.("/storage/v1/object/")
    ? getManagedMenuImagePath(imageOrPath)
    : imageOrPath;
  if (!path) return { success: true };

  const { error } = await supabase.storage.from(MENU_IMAGE_BUCKET).remove([path]);
  if (error) {
    console.warn("Failed to remove old menu image:", error.message);
    return { success: false, error: error.message };
  }
  return { success: true };
}

/** Create a new menu item in Supabase */
export async function createWeeklyMenuItem(item) {
  try {
    const payload = toDatabaseFormat(item);
    const { data, error } = await supabase
      .from("this_week_menu")
      .insert([payload])
      .select();

    if (error) throw error;
    return { success: true, data: normalizeMenuItem(data[0]) };
  } catch (error) {
    console.error("Failed to create menu item in Supabase:", error);
    return { success: false, error: error.message };
  }
}

/** Update an existing menu item in Supabase */
export async function updateWeeklyMenuItem(id, item) {
  try {
    const payload = toDatabaseFormat(item);
    const { data, error } = await supabase
      .from("this_week_menu")
      .update(payload)
      .eq("id", id)
      .select();

    if (error) throw error;
    return { success: true, data: normalizeMenuItem(data[0]) };
  } catch (error) {
    console.error("Failed to update menu item in Supabase:", error);
    return { success: false, error: error.message };
  }
}

/** Delete a menu item in Supabase */
export async function deleteWeeklyMenuItem(id) {
  try {
    const { error } = await supabase
      .from("this_week_menu")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Failed to delete menu item in Supabase:", error);
    return { success: false, error: error.message };
  }
}

/** Toggle availability of a menu item */
export async function toggleWeeklyMenuItemAvailability(id, currentAvailableState) {
  try {
    const { data, error } = await supabase
      .from("this_week_menu")
      .update({ available: !currentAvailableState })
      .eq("id", id)
      .select();

    if (error) throw error;
    return { success: true, data: normalizeMenuItem(data[0]) };
  } catch (error) {
    console.error("Failed to toggle availability in Supabase:", error);
    return { success: false, error: error.message };
  }
}
