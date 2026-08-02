import React, { createContext, useContext, useState } from 'react';

const INITIAL_MENU_ITEMS = [
  {
    id: "m1",
    code: "CPL-014",
    name: "Chicken Nanban",
    category: "High Protein",
    protein: 43,
    carbs: 46,
    fat: 18,
    kcal: 582,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    tags_ID: ["Ayam Sous-Vide", "Tartar Greek Yogurt", "Nasi Ungu"],
    tags_EN: ["Sous-Vide Chicken", "Greek Yogurt Tartar", "Purple Rice"],
    desc_ID: "Dada ayam empuk renyah dengan saus tartar greek yogurt buatan sendiri, edamame kukus, dan nasi ungu kaya antioksidan.",
    desc_EN: "Crispy tender chicken breast with house greek yogurt tartar, steamed edamame, and antioxidant-rich purple rice.",
    available: true,
    batch: "014"
  },
  {
    id: "m2",
    code: "CPL-013",
    name: "Salmon Teriyaki",
    category: "High Protein",
    protein: 46,
    carbs: 38,
    fat: 20,
    kcal: 612,
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80",
    tags_ID: ["Salmon Atlantik", "Kinoa Organik", "Brokoli Kukus"],
    tags_EN: ["Atlantic Salmon", "Organic Quinoa", "Steamed Broccoli"],
    desc_ID: "Fillet salmon Atlantik panggang dengan glazuur teriyaki khas di atas kinoa organik tiga warna dan brokoli segar.",
    desc_EN: "Pan-seared Atlantic salmon glazed in artisanal teriyaki over tri-color organic quinoa and fresh broccoli.",
    available: true,
    batch: "013"
  },
  {
    id: "m3",
    code: "CPL-015",
    name: "Beef Bulgogi Bowl",
    category: "Lean Muscle",
    protein: 41,
    carbs: 42,
    fat: 22,
    kcal: 598,
    image: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80",
    tags_ID: ["Tenderloin Sapi Segar", "Kimchi Probiotik", "Nasi Merah"],
    tags_EN: ["Grass-fed Tenderloin", "Probiotic Kimchi", "Brown Rice"],
    desc_ID: "Daging sapi tenderloin tanpa lemak yang dimarinasi saus bulgogi pir Korea, disajikan dengan kimchi fermentasi dan nasi merah.",
    desc_EN: "Lean grass-fed beef tenderloin marinated in Korean pear bulgogi sauce, served with aged kimchi and brown rice.",
    available: true,
    batch: "015"
  },
  {
    id: "m4",
    code: "CPL-016",
    name: "Chickpea Tikka Masala",
    category: "Plant Power",
    protein: 36,
    carbs: 52,
    fat: 14,
    kcal: 526,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
    tags_ID: ["Kacang Arab Organik", "Kembang Kol Panggang", "Nasi Melati"],
    tags_EN: ["Organic Chickpeas", "Roasted Cauliflower", "Jasmine Rice"],
    desc_ID: "Bowl protein nabati lezat berisi kacang arab organik dalam kari tikka tomat santan kaya rempah disajikan dengan kembang kol.",
    desc_EN: "A rich, plant-based protein bowl featuring organic chickpeas in spiced coconut tomato tikka curry.",
    available: true,
    batch: "016"
  },
  {
    id: "m5",
    code: "CPL-017",
    name: "Pesto Chicken Chickpea Pasta",
    category: "High Protein",
    protein: 52,
    carbs: 30,
    fat: 16,
    kcal: 560,
    image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281270?auto=format&fit=crop&w=800&q=80",
    tags_ID: ["Pasta Tinggi Protein", "Pesto Biji Labu Kemangi", "Ayam Panggang"],
    tags_EN: ["High Protein Pasta", "Basil Pumpkin Seed Pesto", "Grilled Chicken"],
    desc_ID: "Dada ayam panggang di atas pasta polong-polongan dengan pesto biji labu kemangi buatan sendiri dan tomat panggang.",
    desc_EN: "Char-grilled chicken breast over legume pasta tossed in house basil-pumpkin seed pesto with roasted tomatoes.",
    available: true,
    batch: "017"
  },
  {
    id: "m6",
    code: "CPL-018",
    name: "Seared Tuna Poke Bowl",
    category: "Keto / Low Carb",
    protein: 48,
    carbs: 18,
    fat: 16,
    kcal: 408,
    image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80",
    tags_ID: ["Tuna Sirip Kuning", "Alpukat Segar", "Nasi Kembang Kol"],
    tags_EN: ["Yellowfin Tuna", "Avocado", "Cauliflower Rice"],
    desc_ID: "Tuna sirip kuning segar dengan irisan alpukat, dressing wijen kedelai, dan nasi kembang kol ringan rendah karbohidrat.",
    desc_EN: "Sustainably caught yellowfin tuna with sliced avocado, sesame soy dressing, and light cauliflower rice.",
    available: true,
    batch: "018"
  }
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
    amount: 350000
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
    amount: 1850000
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
    amount: 6800000
  }
];

const CplContext = createContext();

export function CplProvider({ children }) {
  const [menuItems, setMenuItems] = useState(INITIAL_MENU_ITEMS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [announcementText, setAnnouncementText] = useState("100% Lab Verified High Protein Meal Prep • Free Delivery Jabodetabek");
  const [language, setLanguage] = useState("ID"); // 'ID' | 'EN'

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
      announcement: "100% Terverifikasi Lab • Katering Tinggi Protein • Gratis Ongkir Jabodetabek",

      // Hero Section
      heroEyebrow: "Nutrisi Klinis Tinggi Protein",
      heroBadge1: "100% Terverifikasi Makro Lab",
      heroBadge2: "Bebas Pengawet Buatan",
      heroTitle1: "MAKANAN ENAK.",
      heroTitle2: "DATA JELAS.",
      heroTitle3: "DIRIMU LEBIH BAIK.",
      heroSubtitle: "Clean Plate Lab adalah layanan katering tinggi protein terkemuka di Indonesia. Diformulasikan dengan presisi makro standar laboratorium, bahan makanan utuh, dan data nutrisi transparan di setiap label.",
      heroAvgProtein: "Rata-rata Protein / Porsi",
      heroWholeFood: "Bahan Utuh 100%",
      heroMacroAcc: "Akurasi Makro",
      heroCtaPrimary: "Mulai Langsung Meal Plan",
      heroCtaSecondary: "Inspeksi Label Produk",
      heroFeature1: "Persiapan Segar Setiap Hari",
      heroFeature2: "Kemasan Ramah Lingkungan",
      heroFeature3: "Nutrisi Klinis Standar Lab",
      heroLabelTitle: "CHICKEN NANBAN",
      heroLabelSub: "MEAL PREP UNTUK HARI ESOK YANG LEBIH BAIK",
      heroLabelPrepared: "DIBUAT: HARI INI",
      heroLabelUseBy: "GUNAKAN: +3 HARI",
      heroLabelBatch: "BATCH: 014",

      // Brand Pillars
      pillarsEyebrow: "Standar Utama CPL",
      pillarsTitle: "3 PILAR UTAMA KAMI",
      pillarsSubtitle: "Bagaimana kami merevolusi katering sehat dengan standar sains dan transparansi tanpa kompromi.",
      pillar1Title: "100% Presisi Makro Teruji Lab",
      pillar1Desc: "Setiap resep diuji secara klinis di laboratorium untuk memastikan kadar protein, karbohidrat, dan lemak tepat hingga 0.1 gram.",
      pillar2Title: "Bahan Utuh Bebas Pengawet",
      pillar2Desc: "Hanya menggunakan daging segar pilihan, minyak sehat, serta bahan alami tanpa MSG buatan atau bahan kimia pengawet.",
      pillar3Title: "Kemasan Ramah Lingkungan",
      pillar3Desc: "Semua wadah makanan menggunakan material compostable yang aman dipanaskan dan ramah terhadap kelestarian lingkungan.",
      pillarBadge1: "Tanpa Pengawet Buatan / MSG",
      pillarBadge2: "Minyak Zaitun Cold-Pressed & Rempah Alami",
      pillarBadge3: "Memasak Segar Setiap Hari",

      // Label Inspector / Generator
      labelEyebrow: "Inspektor Label Interaktif",
      labelTitle: "TRANSPARANSI MAKRO TANPA RAHASIA",
      labelSubtitle: "Pilih menu untuk melihat spesifikasi nutrisi lengkap laboratorium, komposisi bahan, dan informasi batch pembuatan.",
      labelSelectMeal: "Pilih Menu Produk:",
      labelCustomBuilder: "Pembuat Makro Custom",
      labelIngredients: "Komposisi Bahan:",
      labelInspectCta: "Pesan Menu Ini Sekarang",
      labelCopySpec: "Salin Spesifikasi Makro",
      labelCopiedSpec: "Spesifikasi Tersalin!",

      // Menu Section
      menuEyebrow: "Katalog Menu Mingguan",
      menuTitle: "KATERING TINGGI PROTEIN",
      menuSubtitle: "Dimasak segar setiap pagi oleh chef profesional bersama ahli gizi klinis.",
      menuFilterAll: "Semua Menu",
      menuFilterHighProtein: "Tinggi Protein",
      menuFilterLean: "Otot Kering",
      menuFilterPlant: "Nabati",
      menuFilterKeto: "Rendah Karbo",
      menuSelectCta: "Pilih Untuk Meal Plan",
      menuAddedCta: "Telah Dipilih",

      // Packaging Section
      packEyebrow: "Standar Rekayasa Berkelanjutan",
      packTitle: "STANDAR KEMASAN & WADAH MAKANAN",
      packSubtitle: "Setiap hidangan Clean Plate Lab dikirim dalam kemasan terisolasi dan ramah lingkungan untuk menjaga kesegaran nutrisi.",
      packItem1Title: "Jaminan Kesegaran Klinis",
      packItem1Desc: "Wadah khusus menjaga keutuhan bahan. Bebas racun, BPA-free, serta dilengkapi lubang uap mikro agar makanan tidak melembek.",
      packItem2Title: "Pengiriman Rantai Dingin",
      packItem2Desc: "Pengiriman terisolasi menjaga suhu di bawah 4°C hingga tiba di pintu rumah Anda.",
      packItem3Title: "Ramah Lingkungan",
      packItem3Desc: "Bebas plastik sekali pakai. 100% serat tumbuhan yang terurai alami dalam 90 hari.",

      // Macro Calculator
      calcEyebrow: "Perhitungan Berbasis Sains",
      calcTitle: "KALKULATOR MAKRO KLINIS",
      calcSubtitle: "Hitung kebutuhan kalori dan target nutrisi harianmu secara akurat dengan kontrol interaktif.",
      calcInputSection: "Input Metrik Tubuh",
      calcGender: "Jenis Kelamin",
      calcMale: "Pria",
      calcFemale: "Wanita",
      calcWeightLabel: "BERAT BADAN (KG)",
      calcHeightLabel: "TINGGI BADAN (CM)",
      calcAgeLabel: "USIA (TAHUN)",
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

      // B2B Corporate Catering
      b2bEyebrow: "Solusi Perusahaan & Acara",
      b2bTitle: "KATERING B2B & SEHAT KANTOR",
      b2bSubtitle: "Tingkatkan produktivitas tim kantor atau pusat kebugaran Anda dengan box katering tinggi protein terverifikasi.",
      b2bHeadline: "NUTRISI YANG MEMBERIKAN ENERGI LEBIH UNTUK TIM",
      b2bDesc: "Rasa kantuk setelah makan siang mengurangi produktivitas. Clean Plate Lab menggantikan katering berminyak dengan nutrisi tinggi protein yang menjaga fokus mental sepanjang hari.",
      b2bCard1Title: "Makan Siang Kantor Tech",
      b2bCard1Desc: "Box ramah lingkungan harian berlabel nama karyawan dan makro lengkap.",
      b2bCard2Title: "Pusat Gym & Kebugaran",
      b2bCard2Desc: "Kulkas kemitraan untuk gym CrossFit dan studio kebugaran.",
      b2bFeature1: "Dashboard makro perusahaan & portal preferensi karyawan",
      b2bFeature2: "Pengiriman terkontrol suhu tepat sesuai jam yang diminta",
      b2bFeature3: "Layanan concierge nutrisi khusus perusahaan",
      b2bEstimatorTitle: "ESTIMASI BIAYA PERUSAHAAN",
      b2bTeamSize: "JUMLAH TIM / KARYAWAN",
      b2bDeliveryDays: "HARI PENGIRIMAN PER MINGGU",
      b2bServiceOption: "Opsi Layanan:",
      b2bLunchOnly: "Box Makan Siang",
      b2bFullDay: "Makan Siang + Malam",
      b2bWeeklyMeals: "ESTIMASI BOX PER MINGGU:",
      b2bWeeklyBudget: "ESTIMASI ANGGARAN MINGGUAN:",
      b2bCta: "Minta Proposal Katering B2B",

      // Order Modal
      orderModalTitle: "Formulir Pemesanan Meal Plan CPL",
      orderModalSub: "Lengkapi data untuk memulai langganan katering tinggi protein terverifikasi.",
      orderName: "Nama Lengkap",
      orderPhone: "Nomor WhatsApp",
      orderPlan: "Pilih Paket Katering",
      orderAddress: "Alamat Pengiriman Lengkap",
      orderSubmit: "Kirim Pemesanan via WhatsApp",
      orderSuccessMsg: "Pemesanan berhasil dikirim!",

      // Footer
      footerDesc: "Clean Plate Lab — Layanan katering tinggi protein terverifikasi laboratorium pertama di Indonesia.",
      footerQuickLinks: "Navigasi Cepat",
      footerLegal: "Hak Cipta Dilindungi Undang-Undang.",
      adminPortal: "Portal Admin CMS"
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
      announcement: "100% Lab Verified • High Protein Catering • Free Delivery Jabodetabek",

      // Hero Section
      heroEyebrow: "High Protein Clinical Nutrition",
      heroBadge1: "100% Lab Macro Verified",
      heroBadge2: "Zero Artificial Preservatives",
      heroTitle1: "GOOD FOOD.",
      heroTitle2: "CLEAR DATA.",
      heroTitle3: "BETTER YOU.",
      heroSubtitle: "Clean Plate Lab is Indonesia’s premier high-protein catering service. Formulated with laboratory-grade macro precision, whole food ingredients, and transparent nutritional data on every label.",
      heroAvgProtein: "Avg Protein / Meal",
      heroWholeFood: "100% Whole Food Prep",
      heroMacroAcc: "Macro Accuracy",
      heroCtaPrimary: "Start Your Meal Plan",
      heroCtaSecondary: "Inspect Product Labels",
      heroFeature1: "Fresh Daily Prep",
      heroFeature2: "Compostable Packaging",
      heroFeature3: "Clinical Nutrition",
      heroLabelTitle: "CHICKEN NANBAN",
      heroLabelSub: "MEAL PREP FOR A BETTER TOMORROW",
      heroLabelPrepared: "PREPARED: TODAY",
      heroLabelUseBy: "USE BY: +3 DAYS",
      heroLabelBatch: "BATCH: 014",

      // Brand Pillars
      pillarsEyebrow: "CPL Core Standards",
      pillarsTitle: "OUR 3 CORE PILLARS",
      pillarsSubtitle: "How we revolutionize healthy catering with uncompromising science and transparency.",
      pillar1Title: "100% Lab-Verified Macro Precision",
      pillar1Desc: "Every recipe is clinically tested in laboratories to ensure exact protein, carb, and fat measurements down to 0.1 grams.",
      pillar2Title: "Whole Food & Preservative-Free",
      pillar2Desc: "Using only premium fresh meats, healthy oils, and whole natural ingredients without artificial MSG or chemical preservatives.",
      pillar3Title: "Eco-Friendly Compostable Packaging",
      pillar3Desc: "All meal containers utilize food-grade compostable materials that are microwave-safe and environmentally responsible.",
      pillarBadge1: "Zero Artificial Preservatives / MSG",
      pillarBadge2: "Cold-Pressed Olive Oil & Herbs",
      pillarBadge3: "Fresh Daily Cooking Batch",

      // Label Inspector / Generator
      labelEyebrow: "Interactive Label Inspector",
      labelTitle: "NO SECRETS. FULL MACRO TRANSPARENCY",
      labelSubtitle: "Select any meal to inspect complete lab nutrition specs, ingredients list, and batch manufacturing info.",
      labelSelectMeal: "Select Meal Product:",
      labelCustomBuilder: "Custom Macro Builder",
      labelIngredients: "Ingredient Composition:",
      labelInspectCta: "Order This Meal Now",
      labelCopySpec: "Copy Macro Specs",
      labelCopiedSpec: "Specs Copied!",

      // Menu Section
      menuEyebrow: "Weekly Menu Catalog",
      menuTitle: "HIGH PROTEIN CATERING MENU",
      menuSubtitle: "Prepared fresh every morning by executive chefs alongside clinical nutritionists.",
      menuFilterAll: "All Meals",
      menuFilterHighProtein: "High Protein",
      menuFilterLean: "Lean Muscle",
      menuFilterPlant: "Plant Power",
      menuFilterKeto: "Low Carb",
      menuSelectCta: "Select for Meal Plan",
      menuAddedCta: "Added to Selection",

      // Packaging Section
      packEyebrow: "Sustainable Engineering Standard",
      packTitle: "MEAL BOX & PACKAGING STANDARD",
      packSubtitle: "Every Clean Plate Lab meal is delivered in compostable, food-grade thermal containers designed to preserve peak macro freshness and flavor.",
      packItem1Title: "Clinical Freshness Guarantee",
      packItem1Desc: "Custom containers protect ingredient integrity. Non-toxic, BPA-free, with micro-steam vents so food stays crisp.",
      packItem2Title: "Cold Chain Transit",
      packItem2Desc: "Insulated thermal delivery maintaining chilled temperatures under 4°C until it reaches your doorstep.",
      packItem3Title: "Planet Conscious",
      packItem3Desc: "Zero single-use plastics. 100% plant fiber pulp composts naturally within 90 days.",

      // Macro Calculator
      calcEyebrow: "Science-Backed Formulation",
      calcTitle: "CLINICAL MACRO CALCULATOR",
      calcSubtitle: "Calculate your daily caloric expenditure and target macros using interactive controls.",
      calcInputSection: "Input Body Metrics",
      calcGender: "Gender",
      calcMale: "Male",
      calcFemale: "Female",
      calcWeightLabel: "BODY WEIGHT (KG)",
      calcHeightLabel: "HEIGHT (CM)",
      calcAgeLabel: "AGE (YEARS)",
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

      // B2B Corporate Catering
      b2bEyebrow: "Corporate & Events Solution",
      b2bTitle: "B2B & OFFICE WELLNESS CATERING",
      b2bSubtitle: "Fuel your tech team, fitness center, or corporate event with high-protein, laboratory-verified meal boxes delivered fresh.",
      b2bHeadline: "MEALS THAT DO MORE THAN FILL YOUR TEAM",
      b2bDesc: "Post-lunch brain fog costs companies hours of productivity. Clean Plate Lab replaces heavy, oily traditional catering with balanced, high-protein nutrition that sustains mental focus.",
      b2bCard1Title: "Tech Office Lunch",
      b2bCard1Desc: "Daily individual eco-boxes labeled with employee names & macros.",
      b2bCard2Title: "Gym & Fitness Hubs",
      b2bCard2Desc: "Partner fridge placement for CrossFit boxes and boutique gyms.",
      b2bFeature1: "Custom company macro dashboard & employee preference portal",
      b2bFeature2: "Temperature-controlled thermal delivery at your exact requested hour",
      b2bFeature3: "Dedicated corporate nutrition concierge",
      b2bEstimatorTitle: "CORPORATE COST ESTIMATOR",
      b2bTeamSize: "TEAM SIZE / HEADCOUNT",
      b2bDeliveryDays: "DELIVERY DAYS PER WEEK",
      b2bServiceOption: "Service Option:",
      b2bLunchOnly: "Lunch Meal Box",
      b2bFullDay: "Lunch + Dinner",
      b2bWeeklyMeals: "ESTIMATED WEEKLY MEALS:",
      b2bWeeklyBudget: "ESTIMATED WEEKLY BUDGET:",
      b2bCta: "Request B2B Corporate Proposal",

      // Order Modal
      orderModalTitle: "CPL Meal Plan Inquiry Form",
      orderModalSub: "Complete details below to start your verified high-protein catering subscription.",
      orderName: "Full Name",
      orderPhone: "WhatsApp Phone Number",
      orderPlan: "Select Catering Plan",
      orderAddress: "Full Delivery Address",
      orderSubmit: "Submit Order via WhatsApp",
      orderSuccessMsg: "Order request sent successfully!",

      // Footer
      footerDesc: "Clean Plate Lab — Indonesia’s premier laboratory-verified high protein meal prep service.",
      footerQuickLinks: "Quick Navigation",
      footerLegal: "All rights reserved.",
      adminPortal: "CMS Admin Portal"
    }
  };

  const t = (key) => {
    return translations[language]?.[key] || translations['ID']?.[key] || key;
  };

  // Add new meal item
  const addMenuItem = (item) => {
    const newItem = {
      ...item,
      id: `m${Date.now()}`,
      code: item.code || `CPL-0${menuItems.length + 14}`,
      available: true
    };
    setMenuItems(prev => [newItem, ...prev]);
  };

  // Update existing meal item
  const updateMenuItem = (id, updatedFields) => {
    setMenuItems(prev => prev.map(item => item.id === id ? { ...item, ...updatedFields } : item));
  };

  // Delete meal item
  const deleteMenuItem = (id) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  // Add new order
  const addOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: `ord-${Date.now()}`,
      refCode: `CPL-SUB-2026-${Math.floor(10 + Math.random() * 90)}`,
      date: new Date().toISOString().split('T')[0],
      status: "Pending"
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  // Update order status
  const updateOrderStatus = (id, status) => {
    setOrders(prev => prev.map(ord => ord.id === id ? { ...ord, status } : ord));
  };

  return (
    <CplContext.Provider value={{
      menuItems,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      orders,
      addOrder,
      updateOrderStatus,
      isAdminLoggedIn,
      setIsAdminLoggedIn,
      announcementText,
      setAnnouncementText,
      language,
      setLanguage,
      t
    }}>
      {children}
    </CplContext.Provider>
  );
}

export function useCpl() {
  return useContext(CplContext);
}
