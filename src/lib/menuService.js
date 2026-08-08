import { supabase } from "./supabase";

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
      "Dada ayam empuk berbalut saus teriyaki manis gurih, disajikan dengan spesifikasi nutrisi lengkap 82.4g protein, 132.5g karbo, 26.8g lemak, 1380.5mg natrium, dan 355mg kalium.",
    desc_EN:
      "Tender chicken glazed in a sweet & savory teriyaki sauce, served with full lab specs: 82.4g protein, 132.5g carbs, 26.8g fat, 1380.5mg sodium, and 355mg potassium.",
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
      "Ayam empuk beraroma sambal cabai hijau segar, disajikan dengan spesifikasi nutrisi lengkap 79.8g protein, 124g karbo, 29.5g lemak, 1290mg natrium, dan 365mg kalium.",
    desc_EN:
      "Tender chicken tossed in aromatic green chili sauce, served with full lab specs: 79.8g protein, 124g carbs, 29.5g fat, 1290mg sodium, and 365mg potassium.",
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
      "Dada ayam juicy dengan lapisan saus mentai gurih creamy, disajikan dengan spesifikasi nutrisi lengkap 83.2g protein, 128.5g karbo, 31.2g lemak, 1420mg natrium, dan 330mg kalium.",
    desc_EN:
      "Juicy chicken topped with creamy, savory mentai sauce, served with full lab specs: 83.2g protein, 128.5g carbs, 31.2g fat, 1420mg sodium, and 330mg potassium.",
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
      "Dada ayam empuk dengan kuah sate Padang kaya rempah khas, disajikan dengan spesifikasi nutrisi lengkap 81.0g protein, 122g karbo, 27.5g lemak, 1360mg natrium, dan 370mg kalium.",
    desc_EN:
      "Tender chicken coated in rich and aromatic Padang-style sauce, served with full lab specs: 81.0g protein, 122g carbs, 27.5g fat, 1360mg sodium, and 370mg potassium.",
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
      "Oseng ayam gurih bertabur irisan kecombrang harum, disajikan dengan spesifikasi nutrisi lengkap 78.5g protein, 125g karbo, 25g lemak, 1240mg natrium, dan 385mg kalium.",
    desc_EN:
      "Savory stir-fried chicken infused with fragrant kecombrang, served with full lab specs: 78.5g protein, 125g carbs, 25g fat, 1240mg sodium, and 385mg potassium.",
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
      "Ayam renyah berbalut saus asam manis buatan sendiri yang segar, disajikan dengan spesifikasi nutrisi lengkap 80.5g protein, 135g karbo, 28g lemak, 1310mg natrium, dan 345mg kalium.",
    desc_EN:
      "Crispy chicken tossed in a sweet and tangy homemade sauce, served with full lab specs: 80.5g protein, 135g carbs, 28g fat, 1310mg sodium, and 345mg potassium.",
    available: true,
    batch: "SAT-06",
  },
];

/** Normalize DB row to frontend camelCase item */
export function normalizeMenuItem(row) {
  return {
    id: row.id,
    code: row.code || "CPL-MENU",
    name: row.name || "Menu",
    day: row.day || "",
    category: "High Protein",
    protein: Number(row.protein ?? 40),
    carbs: Number(row.carbs ?? 50),
    fat: Number(row.fat ?? 15),
    fiber: Number(row.fiber ?? 0.14),
    sodium: Number(row.sodium ?? 500),
    potassium: Number(row.potassium ?? 350),
    kcal: Number(row.kcal ?? 500),
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
  return {
    code: item.code,
    name: item.name,
    day: item.day,
    protein: Number(item.protein),
    carbs: Number(item.carbs),
    fat: Number(item.fat),
    fiber: Number(item.fiber ?? 0.14),
    sodium: Number(item.sodium),
    potassium: Number(item.potassium),
    kcal: Number(item.kcal),
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

/** Fetch all weekly menus from Supabase */
export async function fetchWeeklyMenusFromSupabase() {
  try {
    const { data, error } = await supabase
      .from("this_week_menu")
      .select("*");

    if (error) {
      console.warn("Supabase fetch error (using fallback):", error.message);
      return { data: sortMealsByDay(DEFAULT_WEEKLY_MENUS), isFromDb: false, error };
    }

    if (!data || data.length === 0) {
      return { data: sortMealsByDay(DEFAULT_WEEKLY_MENUS), isFromDb: false, error: null };
    }

    return {
      data: sortMealsByDay(data.map(normalizeMenuItem)),
      isFromDb: true,
      error: null,
    };
  } catch (err) {
    console.warn("Error calling Supabase API (using fallback):", err);
    return { data: sortMealsByDay(DEFAULT_WEEKLY_MENUS), isFromDb: false, error: err };
  }
}

/** Seed default menus into Supabase */
export async function seedDefaultWeeklyMenus() {
  try {
    const dbPayloads = DEFAULT_WEEKLY_MENUS.map((item) => toDatabaseFormat(item));
    const { data, error } = await supabase
      .from("this_week_menu")
      .insert(dbPayloads)
      .select();

    if (error) throw error;
    return { success: true, data: data.map(normalizeMenuItem) };
  } catch (error) {
    console.error("Failed to seed default weekly menus:", error);
    return { success: false, error: error.message };
  }
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
