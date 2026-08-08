import React, { useCallback, useEffect, useState } from "react";
import { CplContext } from "./cpl-context";
import { getDateInputValueInTimeZone } from "../lib/order";
import { migrateStoredLanguage, writeStoredState } from "../lib/storage";
import { supabase } from "../lib/supabase";
import {
  fetchWeeklyMenusFromSupabase,
  createWeeklyMenuItem,
  updateWeeklyMenuItem,
  deleteWeeklyMenuItem,
  toggleWeeklyMenuItemAvailability,
  seedDefaultWeeklyMenus,
} from "../lib/menuService";
import {
  loginAdminUser,
  changeUserPassword,
  createAdminAccount,
  fetchAdminUsers,
  deleteAdminUser,
  getAdminProfile,
} from "../lib/adminAuthService";

const INITIAL_MENU_ITEMS = [
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

const INITIAL_ORDERS = [
  {
    id: "ord-101",
    refCode: "CPL-SUB-2026-88",
    customerName: "Alex Pratama",
    phone: "+62 812-3456-7890",
    plan: "5-Day Lunch Plan (5 Meal Boxes)",
    address: "Senopati Suites Tower 2, Jakarta Selatan",
    date: "2026-08-02",
    status: "Approved",
    amount: 350000,
  },
  {
    id: "ord-102",
    refCode: "CPL-SUB-2026-92",
    customerName: "Siti Rahmawati",
    phone: "+62 811-9876-5432",
    plan: "14-Day Pro Athlete High Protein",
    address: "Pacific Place Residences Lt. 12, SCBD",
    date: "2026-08-02",
    status: "Pending",
    amount: 1850000,
  },
  {
    id: "ord-103",
    refCode: "CPL-SUB-2026-95",
    customerName: "Budi Santoso (TechCorp)",
    phone: "+62 813-1122-3344",
    plan: "Corporate B2B Custom Catering (25 Pax)",
    address: "Gopay Tower, Jl. HR Rasuna Said, Jakarta",
    date: "2026-08-01",
    status: "Delivered",
    amount: 6800000,
  },
];

export function CplProvider({ children }) {
  const [menuItems, setMenuItems] = useState(INITIAL_MENU_ITEMS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [supabaseUser, setSupabaseUser] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("admin");
  const [isFromDb, setIsFromDb] = useState(false);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [announcementText, setAnnouncementText] = useState(
    "100% Lab Verified High Protein Meal Prep • Free Delivery Jabodetabek",
  );
  const [storedLanguage] = useState(migrateStoredLanguage);
  const [language, setLanguageState] = useState(storedLanguage || "EN");
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(
    Boolean(storedLanguage),
  );

  // Restore only real Supabase sessions that have an admin_users profile.
  useEffect(() => {
    if (!supabase) return undefined;

    let isActive = true;
    localStorage.removeItem("cpl_admin_session");

    const clearAdminState = () => {
      setSupabaseUser(null);
      setIsAdminLoggedIn(false);
      setUserRole("admin");
    };

    const syncAdminSession = async (session) => {
      const user = session?.user ?? null;
      if (!user) {
        if (isActive) clearAdminState();
        return;
      }

      const { data: profile } = await getAdminProfile(user.id);
      if (!isActive) return;

      if (!profile) {
        clearAdminState();
        return;
      }

      setSupabaseUser(user);
      setIsAdminLoggedIn(true);
      setUserRole(profile.role);
    };

    void supabase.auth
      .getSession()
      .then(({ data: { session } }) => syncAdminSession(session));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Run outside the auth callback to avoid blocking other auth operations.
      setTimeout(() => void syncAdminSession(session), 0);
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, []);

  // Fetch menu items from Supabase (with fallback)
  const fetchLatestMenus = useCallback(async () => {
    setLoadingMenu(true);
    const res = await fetchWeeklyMenusFromSupabase();
    if (res.data && res.data.length > 0) {
      setMenuItems(res.data);
      setIsFromDb(res.isFromDb);
    }
    setLoadingMenu(false);
  }, []);

  useEffect(() => {
    fetchLatestMenus();
  }, [fetchLatestMenus]);

  const setLanguage = useCallback((nextLanguage) => {
    if (nextLanguage !== "ID" && nextLanguage !== "EN") return;
    setLanguageState(nextLanguage);
    setHasSelectedLanguage(true);
    writeStoredState("language", nextLanguage);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "ID" ? "id" : "en";
  }, [language]);

  // Comprehensive i18n Translation dictionary
  const translations = {
    ID: {
      // Navbar & General
      skipContent: "Lompati ke konten utama",
      pillars: "Pilar Utama",
      labelInspector: "Inspektor Label",
      weeklyMenu: "Menu Mingguan",
      macroCalculator: "Kalkulator Makro",
      b2bCatering: "Katering B2B",
      orderMealPlan: "Pesan Catering",
      switchLanguage: "Pilih Bahasa",
      indonesian: "Indonesia",
      english: "English",

      // Announcement
      announcement:
        "🔥 KATERING TINGGI PROTEIN & PILIHAN PROTEIN FLEKSIBEL • 100% Homemade Fresh Makassar • WA +62 851-1121-5704",

      // Hero Section
      heroEyebrow: "Katering Harian Tinggi Protein Makassar",
      heroBadge1: "100% Homemade Fresh Prep",
      heroBadge2: "Bebas Pengawet & Rendah Kalori",
      heroTitle1: "GOOD FOOD.",
      heroTitle2: "CLEAR DATA.",
      heroTitle3: "BETTER YOU.",
      heroSubtitle:
        "Makanan tinggi protein yang dibuat dengan ilmu pangan, data nutrisi yang jelas, dan rasa yang benar-benar ingin kamu nikmati.",
      heroAvgProtein: "Pilihan Protein Fleksibel",
      heroAvgProteinDesc: "Bebas Pilih 25g, 40g, 60g, 80g & 100g",
      heroWholeFood: "Harga Mulai Dari",
      heroWholeFoodDesc: "Menu tinggi protein terjangkau",
      heroDeliveryBadge: "TERJADWAL",
      heroDeliveryValue: "1–2x/Hari",
      heroMacroAcc: "Jadwal Makanan Harian",
      heroMacroAccDesc: "Jadwal makan yang menyesuaikan rutinitas harianmu",
      heroCtaPrimary: "Pilih Paket Katering",
      heroCtaSecondary: "Jelajahi Menu",
      heroFeature1: "Tinggi Protein Harian",
      heroFeature2: "Custom Porsi 25g - 100g",
      heroFeature3: "100% Homemade Fresh",
      heroLabelTitle: "CHICKEN NANBAN",
      heroLabelSub: "KATERING HARIAN TINGGI PROTEIN & CUSTOMIZABLE",
      heroLabelPrepared: "OLAHAN: 100% HOMEMADE",
      heroLabelUseBy: "KEMASAN: FOOD-GRADE SAFE",
      heroLabelBatch: "PETUNJUK: HANGATKAN 30-45S",
      heroPrepToday: "100% HOMEMADE",
      heroUseByDays: "FOOD-GRADE SAFE",
      heroPrepared: "OLAHAN",
      heroUseBy: "KEMASAN",
      heroBatch: "PETUNJUK",
      heroInstructionVal: "HANGATKAN 30-45S",
      heroProtein: "PROTEIN",
      heroCarbs: "KARBOHIDRAT",
      heroFat: "LEMAK",
      heroFiber: "SERAT",
      heroSodium: "NATRIUM",
      heroPotassium: "KALIUM",
      heroCalories: "KALORI",

      // Brand Pillars
      pillarsEyebrow: "Standar Utama Katering CPL",
      pillarsTitle: "MENGAPA CLEAN PLATE LAB",
      pillarsSubtitle:
        "Bagaimana kami merevolusi katering sehat harian di Makassar dengan formulasi tinggi protein, custom porsi 25g - 100g, olahan rumahan (homemade), dan kemasan food-grade.",
      pillar1Title: "Formulasi Tinggi Protein",
      pillar1Desc:
        "Setiap porsi katering didesain khusus tinggi protein (hingga 100g per porsi) untuk mendukung pembentukan otot kering dan metabolisme harian.",
      pillar2Title: "Pilihan Protein Fleksibel",
      pillar2Desc:
        "Pilih tingkat protein harianmu secara bebas: 25g, 40g, 60g, 80g, atau 100g protein sesuai target energi dan fitness unik Anda.",
      pillar3Title: "100% Olahan Rumahan (Homemade)",
      pillar3Desc:
        "Setiap hidangan dikemas dalam wadah food-grade khusus yang terjamin kebersihan, higiene, dan aman dipanaskan.",
      pillar1H1: "Pilihan 25g, 40g, 60g, 80g & 100g Protein",
      pillar1H2: "Formulasi Tinggi Protein & Rendah Kalori",
      pillar1H3: "Dimasak Segar secara Rumahan Setiap Hari",
      pillar2H1: "Bebas Pengawet Buatan & Bebas Minyak Berlebih",
      pillar2H2: "Formulasi Rendah Kalori untuk Fat Loss & Fitness",
      pillar2H3: "Dimasak & Dikirim Segar Setiap Hari",
      pillar3H1: "Wadah Food-Grade Bebas Racun & BPA-Free",
      pillar3H2: "Higienis & Praktis Aman Dipanaskan",
      pillar3H3: "Diformulasikan Oleh Ahli Gizi Klinis",

      // Label Inspector / Generator
      labelEyebrow: "Inspektor Label Interaktif",
      labelTitle: "TRANSPARANSI MAKRO TANPA RAHASIA",
      labelSubtitle:
        "Pilih porsi protein untuk melihat spesifikasi nutrisi lengkap laboratorium, komposisi bahan, dan estimasi harga.",
      labelSelectMeal: "Pilih Menu Produk:",
      labelCustomBuilder: "Pilihan Tingkat Protein",
      labelIngredients: "Komposisi Bahan:",
      labelInspectCta: "Pesan Menu Ini Sekarang",
      labelCopySpec: "Salin Spesifikasi Makro",
      labelCopiedSpec: "Spesifikasi Tersalin!",
      labelMealTitle: "Judul Makanan:",
      labelMealPlaceholder: "misal: ULTRA LEAN BISON BOWL",
      labelProteinTarget: "TARGET PROTEIN",
      labelComplexCarbs: "KARBOHIDRAT KOMPLEKS",
      labelHealthyFats: "LEMAK SEHAT",
      labelCustomDesc:
        "Formulasi lab kustom menggunakan protein grass-fed terverifikasi CPL, biji-bijian kompleks organik, dan lemak cold-pressed.",
      labelSpecTitle: "SPESIFIKASI PRODUK CLEAN PLATE LAB",
      labelStandardStr: "Standard: GOOD FOOD. CLEAR DATA. BETTER YOU.",
      labelRecommended: "Rekomendasi Utama",
      labelMainTierBadge: "Porsi Utama: 60g Protein",

      // Menu Section
      menuEyebrow: "MENU MINGGUAN",
      menuTitle: "KATALOG MENU MINGGUAN",
      menuSubtitle: "Tinggi Protein • Dimasak Segar • Ramah Makro",
      menuFilterAll: "Semua Variasi",
      menuFilterHighProtein: "Tinggi Protein",
      menuFilterLean: "Otot Kering",
      menuFilterPlant: "Nabati",
      menuFilterKeto: "Rendah Karbo",
      menuSelectCta: "Pesan Katering Harian",
      menuAddedCta: "Menu Rotasi Harian",
      menuSampleBadge: "Menu Rotasi Harian",

      // Packaging Section
      packEyebrow: "Standar Kebersihan & Kualitas",
      packTitle: "STANDAR KEMASAN FOOD-GRADE HYGIENIC",
      packSubtitle:
        "Setiap hidangan Clean Plate Lab dikirim dalam kemasan food-grade terisolasi yang terjamin higienis untuk menjaga kualitas nutrisi.",
      packItem1Title: "Jaminan Kesegaran & Higiene",
      packItem1Desc:
        "Wadah khusus menjaga keutuhan bahan. Bebas racun, BPA-free, serta dirancang rapat agar makanan tetap segar dan bersih.",
      packItem2Title: "Pengiriman Segar & Hangat",
      packItem2Desc:
        "Pengiriman terisolasi dalam tas khusus untuk menjaga hidangan tetap hangat, segar, dan siap langsung disantap saat tiba di pintu rumah Anda di Makassar.",
      packItem3Title: "Kemasan Food-Grade Safe",
      packItem3Desc:
        "Bebas dari racun berbahaya & BPA-free untuk menjamin keamanan konsumsi harian Anda.",
      packBoxRef: "REF BOX: CPL-FOODGRADE-2026",
      pack100Biodegradable: "100% Food-Grade Safe",
      packBoxSlogan: "MAKANAN YANG MEMBERIKAN LEBIH DARI SEJADINYA KENYANG.",
      packThermalSeal: "SEGEL TERMAL:",
      packThermalSealVal: "AKTIF SEGAR",
      packMaterial: "BAHAN:",
      packMaterialVal: "PLASTIK FOOD-GRADE HYGIENIC",
      packMicrowave: "AMAN MICROWAVE:",
      packMicrowaveVal: "YA (30-45 DETIK)",
      packFeature1: "Lengan makanan tersegel kedap udara mencegah oksidasi air",
      packFeature2:
        "Desain praktis dapat dipanaskan ulang via microwave atau oven",
      packFeature3: "Kode batch cetak langsung di kemasan untuk riwayat audit",

      // Macro Calculator
      calcEyebrow: "Perhitungan Berbasis Sains",
      calcTitle: "KALKULATOR MAKRO HARIAN",
      calcSubtitle:
        "Hitung kebutuhan kalori dan target nutrisi harianmu secara akurat dengan kontrol interaktif.",
      calcInputSection: "Input Metrik Tubuh",
      calcGender: "Jenis Kelamin",
      calcMale: "Pria",
      calcFemale: "Wanita",
      calcWeightLabel: "BERAT BADAN (KG)",
      calcHeightLabel: "TINGGI BADAN (CM)",
      calcAgeLabel: "USIA (TAHUN)",
      calcYears: "tahun",
      calcActivity: "Tingkat Aktivitas Harian:",
      calcActivitySedentary: "Sedentari (Kerja kantoran, jarang olahraga)",
      calcActivityLight: "Ringan (Olahraga 1-3 hari/minggu)",
      calcActivityModerate: "Moderat (Olahraga 3-5 hari/minggu)",
      calcActivityHeavy: "Aktif Berat (Latihan intensif 6-7 hari/minggu)",
      calcActivityAthlete: "Atlet Profesional / Kerja Fisik Berat",
      calcGoal: "Target Fitness Utama:",
      calcGoalCut: "Turun Lemak",
      calcGoalMaintain: "Jaga Berat",
      calcGoalMuscle: "Bentuk Otot",
      calcResultTitle: "TARGET MAKRO HARIAN",
      calcEnergyNeeds: "Kebutuhan Energi Terhitung",
      calcDailyProtein: "PROTEIN HARIAN",
      calcDailyCarbs: "KARBOHIDRAT HARIAN",
      calcDailyFat: "LEMAK SEHAT",
      calcRecommendationTitle: "Paket Katering CPL Direkomendasikan",
      calcPlanAthlete: "Paket 100g Protein",
      calcPlanCut: "Paket 60g Protein",
      calcPlanWellness: "Paket 25g Protein",
      calcMealsPerDay: "Makan / Hari",
      calcRecSummary:
        "Target: {protein}g protein. Direkomendasikan: {plan} ({meals} box makanan segar harian).",
      calcSubscribeBtn: "Pesan {plan}",
      calcProteinTargetDesc: "• Hingga {ratio}g protein / kg berat badan.",
      calcBmrEstimate: "• Estimasi BMR:",
      calcFactor: "Faktor:",

      // B2B Corporate Catering
      b2bEyebrow: "Solusi Perusahaan & Acara",
      b2bTitle: "KATERING B2B & SEHAT KANTOR",
      b2bSubtitle:
        "Tingkatkan produktivitas tim kantor atau pusat kebugaran Anda dengan box katering tinggi protein terverifikasi di Makassar.",
      b2bHeadline: "NUTRISI YANG MEMBERIKAN ENERGI LEBIH UNTUK TIM",
      b2bDesc:
        "Rasa kantuk setelah makan siang mengurangi produktivitas. Clean Plate Lab menggantikan katering berminyak dengan nutrisi tinggi protein yang menjaga fokus mental sepanjang hari.",
      b2bCard1Title: "Makan Siang Kantor Tech",
      b2bCard1Desc:
        "Box ramah lingkungan harian berlabel nama karyawan dan makro lengkap.",
      b2bCard2Title: "Pusat Gym & Kebugaran",
      b2bCard2Desc: "Kulkas kemitraan untuk gym CrossFit dan studio kebugaran.",
      b2bFeature1: "Dashboard makro perusahaan & portal preferensi karyawan",
      b2bFeature2: "Pengiriman terkontrol suhu tepat sesuai jam yang diminta",
      b2bFeature3: "Layanan concierge nutrisi khusus perusahaan",
      b2bEstimatorTitle: "ESTIMASI BIAYA PERUSAHAAN",
      b2bTierPricing: "Harga Tier B2B",
      b2bTeamSize: "JUMLAH TIM / KARYAWAN",
      b2bPeopleUnit: "Orang",
      b2bDeliveryDays: "HARI PENGIRIMAN PER MINGGU",
      b2bDaysUnit: "Hari",
      b2bServiceOption: "Opsi Layanan:",
      b2bLunchOnly: "Box Makan Siang",
      b2bFullDay: "Makan Siang + Malam",
      b2bWeeklyMeals: "ESTIMASI BOX PER MINGGU:",
      b2bBoxesPerWk: "box / minggu",
      b2bWeeklyBudget: "ESTIMASI ANGGARAN MINGGUAN:",
      b2bRatePerBox: "Tarif: Rp {rate} / box makan",
      b2bCta: "Minta Proposal Katering B2B",

      // Order Modal
      orderInquiryBadge: "Pemesanan Catering CPL Makassar",
      orderModalTitle: "Formulir Pemesanan Meal Plan CPL",
      orderModalSub:
        "Pilih tingkat protein dan lengkapi data untuk memesan via WhatsApp.",
      orderCustomerDetails: "Data pemesan",
      orderProteinTier: "Pilih porsi protein",
      orderDeliveryHighlight: "1–2 box segar, setiap hari",
      orderDeliveryDetail:
        "Pilih 1 atau 2 porsi per hari. Pesanan disiapkan setiap Senin-Sabtu dan hari Minggu tidak dihitung.",
      orderDeliverySchedule: "Periode & jadwal katering",
      orderSummary: "Ringkasan pesanan",
      orderSelectedPlan: "Paket terpilih",
      orderEstimatedTotal: "Total biaya",
      orderServingUnit: "porsi",
      orderDayUnit: "hari",
      orderSundayExcluded: "Hari Minggu tidak dihitung",
      orderContinue: "Lanjut",
      orderBack: "Kembali",
      orderName: "Nama Lengkap",
      orderPhone: "Nomor WhatsApp",
      orderPhonePlaceholder: "0812 3456 7890",
      orderNameReqError: "Nama lengkap wajib diisi",
      orderPhoneReqError: "Nomor WhatsApp wajib diisi",
      orderPhoneMinError:
        "Nomor WhatsApp minimal 10 digit (contoh: 081234567890)",
      orderAddressReqError: "Alamat pengiriman lengkap wajib diisi",
      orderMapsInvalidError: "Masukkan tautan Google Maps yang valid",
      orderStartDateError: "Tanggal mulai wajib dipilih",
      orderEndDateError: "Tanggal selesai wajib dipilih",
      orderPastDateError: "Tanggal mulai tidak boleh sebelum hari ini (WITA)",
      orderDateRangeError:
        "Tanggal selesai harus sama atau setelah tanggal mulai",
      orderFormErrorNotice: "Mohon lengkapi data pemesanan yang bertanda merah",
      orderPlan: "Pilih Porsi Protein",
      orderSelectProteinLabel: "Pilih Porsi Protein Katering:",
      orderDailyDeliveryNote:
        "💡 Pilih 1 atau 2 box per hari sesuai kebutuhan katering Anda",
      orderDeliveryPeriodLabel: "Periode Katering",
      orderDateRangeLabel: "Rentang Tanggal:",
      orderEstimatedTotalCostLabel: "Total Biaya",
      orderPortionUnit: "/ porsi",
      orderPlanOpt1: "25g Protein Plan - mulai Rp 25.000 / porsi",
      orderPlanOpt2: "40g Protein Plan - mulai Rp 35.000 / porsi",
      orderPlanOpt3: "60g Protein Plan - mulai Rp 45.000 / porsi",
      orderPlanOpt4: "80g Protein Plan - mulai Rp 55.000 / porsi",
      orderPlanOpt5: "100g Protein Plan - mulai Rp 65.000 / porsi",
      orderPlanOpt6: "Inquiry Katering Perusahaan / B2B Makassar",
      orderAddress: "Alamat Pengiriman Lengkap (Makassar)",
      orderAddressPlaceholder:
        "Jl. G. Bulusaraung, nama gedung, atau alamat lengkap Anda...",
      orderMapsLink: "Titik Google Maps (Opsional)",
      orderMapsPlaceholder: "Tempel link lokasi dari Google Maps...",
      orderMapsHelp:
        "Buka Google Maps, pilih Bagikan, lalu tempel tautan lokasi di sini.",
      orderMapsSummary: "Titik Google Maps",
      orderStartDate: "Tanggal Mulai Katering",
      orderEndDate: "Tanggal Selesai Katering",
      orderTotalDays: "Total Hari Katering",
      orderTotalCost: "Total Biaya (Total Hari × Harga)",
      orderDaysUnit: "Hari",
      orderSubmit: "Kirim Pemesanan via WhatsApp",
      orderGuaranteeNote:
        "Jaminan Kesegaran Lab • Langsung Terhubung ke WhatsApp CPL",
      orderSuccessMsg: "Pemesanan Berhasil Terkirim!",
      orderSuccessBadge: "Pemesanan Catering Terhubung",
      orderSuccessDetail:
        "Terima kasih, {name}! Permintaan pesanan {plan} Anda telah diteruskan ke Concierge WhatsApp Clean Plate Lab.",
      orderOpenWaCta: "Buka Chat WhatsApp",
      orderTicketTitle: "Ringkasan Pesanan Meal Plan",
      orderBackBtn: "Kembali ke Beranda",

      // Footer
      footerDesc:
        "Clean Plate Lab — Layanan katering tinggi protein terverifikasi laboratorium pertama di Kota Makassar.",
      footerQuickLinks: "Navigasi Cepat",
      footerKitchenContact: "Dapur & Kontak",
      footerCentralKitchen:
        "Jalan G. Bulusaraung no. 18AA, RW.01, Pisang Utara, Kec. Ujung Pandang, Kota Makassar, Sulawesi Selatan 90115",
      footerKitchenMapsLink: "Buka di Google Maps",
      footerLegal: "Hak Cipta Dilindungi Undang-Undang.",
      footerMadeForTomorrow: "DIBUAT UNTUK HARI ESOK YANG LEBIH BAIK.",
      footerBackToTop: "Kembali Ke Atas",
      adminPortal: "Portal Admin CMS",
    },
    EN: {
      // Navbar & General
      skipContent: "Skip to main content",
      pillars: "Core Pillars",
      labelInspector: "Label Inspector",
      weeklyMenu: "Weekly Menu",
      macroCalculator: "Macro Calculator",
      b2bCatering: "B2B Catering",
      orderMealPlan: "Order Meal Plan",
      switchLanguage: "Select Language",
      indonesian: "Indonesia",
      english: "English",
      announcement:
        "🔥 HIGH PROTEIN & CUSTOMIZABLE PROTEIN CATERING • 100% Homemade Fresh Makassar • WA +62 851-1121-5704",

      // Hero Section
      heroEyebrow: "Daily High Protein Catering Makassar",
      heroBadge1: "100% Fresh Homemade Prep",
      heroBadge2: "Preservative Free & Low Calorie",
      heroTitle1: "GOOD FOOD.",
      heroTitle2: "CLEAR DATA.",
      heroTitle3: "BETTER YOU.",
      heroSubtitle:
        "High-protein meals made with food science, clear nutrition data, and food you actually want to eat.",
      heroAvgProtein: "Customizable Protein",
      heroAvgProteinDesc: "Select 25g, 40g, 60g, 80g & 100g",
      heroWholeFood: "Starting Price",
      heroWholeFoodDesc: "Affordable high-protein meals",
      heroDeliveryBadge: "SCHEDULED",
      heroDeliveryValue: "1–2x/Day",
      heroMacroAcc: "Scheduled Daily Meals",
      heroMacroAccDesc: "Meal timing designed around your daily routine",
      heroCtaPrimary: "Build Your Meal",
      heroCtaSecondary: "Explore Menu",
      heroFeature1: "High Daily Protein",
      heroFeature2: "Custom 25g - 100g Tiers",
      heroFeature3: "100% Fresh Homemade",
      heroLabelTitle: "CHICKEN NANBAN",
      heroLabelSub: "DAILY HIGH PROTEIN & CUSTOMIZABLE CATERING",
      heroLabelPrepared: "PREP: 100% HOMEMADE",
      heroLabelUseBy: "PACKAGING: FOOD-GRADE SAFE",
      heroLabelBatch: "HEATING: REHEAT 30-45S",
      heroPrepToday: "100% HOMEMADE",
      heroUseByDays: "FOOD-GRADE SAFE",
      heroPrepared: "PREP",
      heroUseBy: "PACKAGING",
      heroBatch: "HEATING",
      heroInstructionVal: "REHEAT 30-45S",
      heroProtein: "PROTEIN",
      heroCarbs: "CARBS",
      heroFat: "FAT",
      heroFiber: "FIBER",
      heroSodium: "SODIUM",
      heroPotassium: "POTASSIUM",
      heroCalories: "CALORIES",

      // Brand Pillars
      pillarsEyebrow: "The CPL Difference",
      pillarsTitle: "WHY CLEAN PLATE LAB",
      pillarsSubtitle:
        "How we revolutionize daily healthy catering in Makassar with high protein formulations, custom 25g - 100g protein tiers, fresh homemade cooking, and food-grade packaging.",
      pillar1Title: "High Protein Formulations",
      pillar1Desc:
        "Every meal portion is specially engineered to deliver high protein density (up to 100g per meal) for lean muscle growth and metabolic support.",
      pillar2Title: "Customizable Protein Tiers",
      pillar2Desc:
        "Tailor your daily protein intake: select 25g, 40g, 60g, 80g, or 100g protein to match your specific energy and fitness goals.",
      pillar3Title: "100% Fresh Homemade Prep",
      pillar3Desc:
        "Every meal is packed in food-grade safe containers ensuring cleanliness, safety, and reheating convenience.",
      pillar1H1: "Choose 25g, 40g, 60g, 80g & 100g Protein",
      pillar1H2: "High Protein & Low Calorie Balance",
      pillar1H3: "Fresh Homemade Batch Cooking Daily",
      pillar2H1: "Zero artificial preservatives or excess oil",
      pillar2H2: "Low calorie formulation for fat loss & fitness",
      pillar2H3: "Cooked & delivered fresh every day",
      pillar3H1: "Custom 25g, 40g, 60g, 80g & 100g Protein options",
      pillar3H2: "Low calorie balanced glycemic load",
      pillar3H3: "Formulated by clinical dietitians",

      // Label Inspector / Generator
      labelEyebrow: "Interactive Label Inspector",
      labelTitle: "NO SECRETS. FULL MACRO TRANSPARENCY",
      labelSubtitle:
        "Select protein tier to inspect complete lab nutrition specs, ingredients list, and price estimates.",
      labelSelectMeal: "Select Meal Product:",
      labelCustomBuilder: "Protein Tier Selection",
      labelIngredients: "Ingredient Composition:",
      labelInspectCta: "Order This Meal Now",
      labelCopySpec: "Copy Macro Specs",
      labelCopiedSpec: "Specs Copied!",
      labelMealTitle: "Meal Title:",
      labelMealPlaceholder: "e.g. ULTRA LEAN BISON BOWL",
      labelProteinTarget: "PROTEIN TARGET",
      labelComplexCarbs: "COMPLEX CARBS",
      labelHealthyFats: "HEALTHY FATS",
      labelCustomDesc:
        "Custom lab formulation using CPL certified grass-fed proteins, organic complex grains, and cold-pressed fats.",
      labelSpecTitle: "CLEAN PLATE LAB PRODUCT SPEC",
      labelStandardStr: "Standard: Good Food. Clear Data. Better You.",
      labelRecommended: "Main Recommendation",
      labelMainTierBadge: "Main Tier: 60g Protein",

      // Menu Section
      menuEyebrow: "WEEKLY MENU",
      menuTitle: "WEEKLY MENU CATALOG",
      menuSubtitle: "High Protein • Freshly Cooked • Macro Friendly",
      menuFilterAll: "All Variations",
      menuFilterHighProtein: "High Protein",
      menuFilterLean: "Lean Muscle",
      menuFilterPlant: "Plant Power",
      menuFilterKeto: "Low Carb",
      menuSelectCta: "Order Daily Catering",
      menuAddedCta: "Daily Rotation Dish",
      menuSampleBadge: "Daily Rotation Dish",

      // Packaging Section
      packEyebrow: "Hygiene & Quality Standards",
      packTitle: "FOOD-GRADE HYGIENIC PACKAGING STANDARD",
      packSubtitle:
        "Every Clean Plate Lab meal is delivered in food-grade insulated containers designed to preserve peak nutritional freshness and cleanliness.",
      packItem1Title: "Freshness & Hygiene Guarantee",
      packItem1Desc:
        "Custom containers protect ingredient integrity. Non-toxic, BPA-free, and sealed so food stays pristine.",
      packItem2Title: "Fresh & Warm Daily Transit",
      packItem2Desc:
        "Insulated thermal delivery keeping your meal warm, fresh, and ready to enjoy immediately upon arrival at your doorstep in Makassar.",
      packItem3Title: "Food-Grade Safe Packaging",
      packItem3Desc:
        "BPA-free non-toxic materials for maximum daily meal consumption safety.",
      packBoxRef: "BOX REF: CPL-FOODGRADE-2026",
      pack100Biodegradable: "100% Food-Grade Safe",
      packBoxSlogan: "MEALS THAT DO MORE THAN FILL.",
      packThermalSeal: "THERMAL SEAL:",
      packThermalSealVal: "ACTIVE FRESH",
      packMaterial: "MATERIAL:",
      packMaterialVal: "HYGIENIC FOOD-GRADE",
      packMicrowave: "MICROWAVE SAFE:",
      packMicrowaveVal: "YES (30-45 SECS)",
      packFeature1: "Hermetically sealed meal sleeves prevent air oxidation",
      packFeature2: "Easy reheatable design for microwave or oven warming",
      packFeature3:
        "Custom batch code printed directly on sleeve for audit trail",

      // Macro Calculator
      calcEyebrow: "Science-Backed Calculation",
      calcTitle: "DAILY MACRO CALCULATOR",
      calcSubtitle:
        "Calculate your daily caloric expenditure and target macros using interactive controls.",
      calcInputSection: "Input Body Metrics",
      calcGender: "Gender",
      calcMale: "Male",
      calcFemale: "Female",
      calcWeightLabel: "BODY WEIGHT (KG)",
      calcHeightLabel: "HEIGHT (CM)",
      calcAgeLabel: "AGE (YEARS)",
      calcYears: "yrs",
      calcActivity: "Daily Activity Level:",
      calcActivitySedentary: "Sedentary (Office job, little exercise)",
      calcActivityLight: "Lightly Active (Workout 1-3 days/week)",
      calcActivityModerate: "Moderately Active (Workout 3-5 days/week)",
      calcActivityHeavy: "Very Active (Intense training 6-7 days/week)",
      calcActivityAthlete: "Professional Athlete / Heavy Labor",
      calcGoal: "Primary Fitness Objective:",
      calcGoalCut: "Fat Loss",
      calcGoalMaintain: "Maintain Weight",
      calcGoalMuscle: "Muscle Build",
      calcResultTitle: "DAILY TARGET MACROS",
      calcEnergyNeeds: "Calculated Energy Needs",
      calcDailyProtein: "DAILY PROTEIN",
      calcDailyCarbs: "DAILY CARBS",
      calcDailyFat: "HEALTHY FAT",
      calcRecommendationTitle: "Recommended CPL Catering Package",
      calcPlanAthlete: "100g Protein Plan",
      calcPlanCut: "60g Protein Plan",
      calcPlanWellness: "25g Protein Plan",
      calcMealsPerDay: "Meals / Day",
      calcRecSummary:
        "Target: {protein}g protein. Recommended: {plan} ({meals} fresh meal boxes daily).",
      calcSubscribeBtn: "Order {plan}",
      calcProteinTargetDesc: "• Up to {ratio}g protein / kg body weight.",
      calcBmrEstimate: "• Estimated BMR:",
      calcFactor: "Factor:",

      // B2B Corporate Catering
      b2bEyebrow: "Corporate & Events Solution",
      b2bTitle: "B2B & OFFICE WELLNESS CATERING",
      b2bSubtitle:
        "Fuel your tech team, fitness center, or corporate event with high-protein, laboratory-verified meal boxes delivered fresh in Makassar.",
      b2bHeadline: "MEALS THAT DO MORE THAN FILL YOUR TEAM",
      b2bDesc:
        "Post-lunch brain fog costs companies hours of productivity. Clean Plate Lab replaces heavy, oily traditional catering with balanced, high-protein nutrition that sustains mental focus.",
      b2bCard1Title: "Tech Office Lunch",
      b2bCard1Desc:
        "Daily individual eco-boxes labeled with employee names & macros.",
      b2bCard2Title: "Gym & Fitness Hubs",
      b2bCard2Desc:
        "Partner fridge placement for CrossFit boxes and boutique gyms.",
      b2bFeature1:
        "Custom company macro dashboard & employee preference portal",
      b2bFeature2:
        "Temperature-controlled thermal delivery at your exact requested hour",
      b2bFeature3: "Dedicated corporate nutrition concierge",
      b2bEstimatorTitle: "CORPORATE COST ESTIMATOR",
      b2bTierPricing: "B2B Tier Pricing",
      b2bTeamSize: "TEAM SIZE / HEADCOUNT",
      b2bPeopleUnit: "People",
      b2bDeliveryDays: "DELIVERY DAYS PER WEEK",
      b2bDaysUnit: "Days",
      b2bServiceOption: "Service Option:",
      b2bLunchOnly: "Lunch Meal Box",
      b2bFullDay: "Lunch + Dinner",
      b2bWeeklyMeals: "ESTIMATED WEEKLY MEALS:",
      b2bBoxesPerWk: "boxes / wk",
      b2bWeeklyBudget: "ESTIMATED WEEKLY BUDGET:",
      b2bRatePerBox: "Rate: Rp {rate} / meal box",
      b2bCta: "Request B2B Corporate Proposal",

      // Order Modal
      orderInquiryBadge: "CPL Order Inquiry Makassar",
      orderModalTitle: "CPL Meal Plan Inquiry Form",
      orderModalSub:
        "Choose your protein tier and fill details to order via WhatsApp.",
      orderCustomerDetails: "Customer details",
      orderProteinTier: "Choose protein portion",
      orderDeliveryHighlight: "1–2 fresh boxes, every day",
      orderDeliveryDetail:
        "Choose one or two servings per day. Meals are prepared Monday-Saturday; Sundays are excluded.",
      orderDeliverySchedule: "Catering period & schedule",
      orderSummary: "Order summary",
      orderSelectedPlan: "Selected plan",
      orderEstimatedTotal: "Total cost",
      orderServingUnit: "serving",
      orderDayUnit: "day",
      orderSundayExcluded: "Sundays are excluded",
      orderContinue: "Continue",
      orderBack: "Back",
      orderName: "Full Name",
      orderPhone: "WhatsApp Phone Number",
      orderPhonePlaceholder: "0812 3456 7890",
      orderNameReqError: "Full name is required",
      orderPhoneReqError: "WhatsApp phone number is required",
      orderPhoneMinError:
        "WhatsApp number must be at least 10 digits (e.g. 081234567890)",
      orderAddressReqError: "Full delivery address is required",
      orderMapsInvalidError: "Enter a valid Google Maps link",
      orderStartDateError: "Catering start date is required",
      orderEndDateError: "Catering end date is required",
      orderPastDateError: "Start date cannot be before today in WITA",
      orderDateRangeError: "End date must be on or after start date",
      orderFormErrorNotice: "Please complete all highlighted fields correctly",
      orderPlan: "Select Protein Tier",
      orderSelectProteinLabel: "Select Catering Protein Portion:",
      orderDailyDeliveryNote:
        "💡 Choose one or two boxes per day for your catering plan",
      orderDeliveryPeriodLabel: "Catering Period",
      orderDateRangeLabel: "Date Range:",
      orderEstimatedTotalCostLabel: "Total Cost",
      orderPortionUnit: "/ portion",
      orderPlanOpt1: "25g Protein Plan - from Rp 25,000 / portion",
      orderPlanOpt2: "40g Protein Plan - from Rp 35,000 / portion",
      orderPlanOpt3: "60g Protein Plan - from Rp 45,000 / portion",
      orderPlanOpt4: "80g Protein Plan - from Rp 55,000 / portion",
      orderPlanOpt5: "100g Protein Plan - from Rp 65,000 / portion",
      orderPlanOpt6: "Corporate / B2B Catering Inquiry Makassar",
      orderAddress: "Full Delivery Address (Makassar)",
      orderAddressPlaceholder:
        "Street address, building name, unit number in Makassar...",
      orderMapsLink: "Google Maps Pin (Optional)",
      orderMapsPlaceholder: "Paste the Google Maps location link...",
      orderMapsHelp:
        "Open Google Maps, choose Share, then paste the location link here.",
      orderMapsSummary: "Google Maps pin",
      orderStartDate: "Catering Start Date",
      orderEndDate: "Catering End Date",
      orderTotalDays: "Total Catering Days",
      orderTotalCost: "Total Cost (Total Days × Price)",
      orderDaysUnit: "Days",
      orderSubmit: "Submit Order via WhatsApp",
      orderGuaranteeNote:
        "Lab Fresh Guarantee • Direct Connect to CPL WhatsApp",
      orderSuccessMsg: "Order Request Sent Successfully!",
      orderSuccessBadge: "Catering Order Connected",
      orderSuccessDetail:
        "Thank you, {name}! Your order request for {plan} has been forwarded to WhatsApp Clean Plate Lab Concierge.",
      orderOpenWaCta: "Open WhatsApp Chat",
      orderTicketTitle: "Meal Plan Order Summary",
      orderBackBtn: "Back to Overview",

      // Footer
      footerDesc:
        "Clean Plate Lab — Indonesia’s premier laboratory-verified high protein meal prep service based in Makassar City.",
      footerQuickLinks: "Quick Navigation",
      footerKitchenContact: "Kitchen & Contact",
      footerCentralKitchen:
        "Jalan G. Bulusaraung no. 18AA, RW.01, Pisang Utara, Ujung Pandang, Makassar City, South Sulawesi 90115",
      footerKitchenMapsLink: "Open in Google Maps",
      footerLegal: "All rights reserved.",
      footerMadeForTomorrow: "MADE FOR A BETTER TOMORROW.",
      footerBackToTop: "Back To Top",
      adminPortal: "CMS Admin Portal",
    },
  };

  const t = (key) => {
    return translations[language]?.[key] || translations["EN"]?.[key] || key;
  };

  // Supabase Auth & Role Management Methods
  const loginSupabase = async (email, password) => {
    const res = await loginAdminUser(email, password);
    if (res.success) {
      setSupabaseUser(res.user);
      setIsAdminLoggedIn(true);
      setUserRole(res.role);
    }
    return res;
  };

  const logoutSupabase = async () => {
    try {
      if (supabase) await supabase.auth.signOut();
    } catch {
      // Ignore
    }
    setSupabaseUser(null);
    setIsAdminLoggedIn(false);
    setUserRole("admin");
  };

  const changePassword = async (newPassword) => {
    return await changeUserPassword(newPassword);
  };

  const createAdminUserAccount = async (accountData) => {
    return await createAdminAccount(accountData);
  };

  const getAdminUsers = async () => {
    return await fetchAdminUsers();
  };

  const deleteAdminUserAccount = async (id, email) => {
    return await deleteAdminUser(id, email);
  };

  // Supabase Menu CRUD Methods
  const createMenuItem = async (itemData) => {
    const res = await createWeeklyMenuItem(itemData);
    if (res.success) {
      setMenuItems((prev) => [...prev, res.data]);
      setIsFromDb(true);
      return { success: true, data: res.data };
    } else {
      // Local fallback if DB is not created yet
      const fallbackItem = {
        ...itemData,
        id: `m-${Date.now()}`,
        available: itemData.available ?? true,
      };
      setMenuItems((prev) => [...prev, fallbackItem]);
      return { success: true, data: fallbackItem, error: res.error };
    }
  };

  const updateMenuItem = async (id, updatedFields) => {
    const res = await updateWeeklyMenuItem(id, updatedFields);
    if (res.success) {
      setMenuItems((prev) =>
        prev.map((item) => (item.id === id ? res.data : item)),
      );
      return { success: true, data: res.data };
    } else {
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, ...updatedFields } : item,
        ),
      );
      return { success: true, error: res.error };
    }
  };

  const deleteMenuItem = async (id) => {
    const res = await deleteWeeklyMenuItem(id);
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
    return { success: true, error: res.error };
  };

  const toggleAvailability = async (id, currentStatus) => {
    const res = await toggleWeeklyMenuItemAvailability(id, currentStatus);
    if (res.success) {
      setMenuItems((prev) =>
        prev.map((item) => (item.id === id ? res.data : item)),
      );
      return { success: true };
    } else {
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, available: !currentStatus } : item,
        ),
      );
      return { success: true, error: res.error };
    }
  };

  const seedDefaultMenus = async () => {
    const res = await seedDefaultWeeklyMenus();
    if (res.success) {
      await fetchLatestMenus();
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  // Add new order
  const addOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: `ord-${Date.now()}`,
      refCode: `CPL-SUB-2026-${Math.floor(10 + Math.random() * 90)}`,
      date: getDateInputValueInTimeZone(),
      status: "Pending",
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  // Update order status
  const updateOrderStatus = (id, status) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === id ? { ...ord, status } : ord)),
    );
  };

  return (
    <CplContext.Provider
      value={{
        menuItems,
        supabaseUser,
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        userRole,
        loginSupabase,
        logoutSupabase,
        changePassword,
        createAdminUserAccount,
        getAdminUsers,
        deleteAdminUserAccount,
        isFromDb,
        loadingMenu,
        fetchLatestMenus,
        createMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleAvailability,
        seedDefaultMenus,
        orders,
        addOrder,
        updateOrderStatus,
        announcementText,
        setAnnouncementText,
        language,
        setLanguage,
        hasSelectedLanguage,
        t,
      }}
    >
      {children}
    </CplContext.Provider>
  );
}
