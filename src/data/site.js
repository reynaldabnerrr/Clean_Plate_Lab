export const proteinTiers = [
  { protein: 25, price: 30000, prices: { daily: 30000, weekly: 28000, monthly: 25000 }, description: 'A light daily portion for balanced routines.', descriptionID: 'Porsi harian ringan untuk rutinitas yang seimbang.' },
  { protein: 40, price: 40000, prices: { daily: 40000, weekly: 38000, monthly: 35000 }, description: 'Everyday high-protein support without excess.', descriptionID: 'Dukungan tinggi protein sehari-hari tanpa berlebihan.' },
  { protein: 60, price: 50000, prices: { daily: 50000, weekly: 48000, monthly: 45000 }, description: 'A substantial tier for active schedules.', descriptionID: 'Porsi lebih besar untuk jadwal yang aktif.' },
  { protein: 80, price: 60000, prices: { daily: 60000, weekly: 58000, monthly: 55000 }, description: 'Higher intake for demanding training days.', descriptionID: 'Asupan lebih tinggi untuk hari latihan yang berat.' },
  { protein: 100, price: 70000, prices: { daily: 70000, weekly: 68000, monthly: 65000 }, description: 'Our maximum tier for specific protein targets.', descriptionID: 'Pilihan maksimum kami untuk target protein yang spesifik.' },
];

export const addons = [
  { id: 'vegetables', type: 'addon', name: 'Extra Vegetables', nameID: 'Sayuran Ekstra', price: 5000 },
  { id: 'potato-corn', type: 'carb-swap', name: 'Carb Swap: Baby Potato + Corn', nameID: 'Ganti Karbo: Baby Potato + Jagung', price: 5000 },
];

export const orderPeriods = [
  { id: 'daily', label: 'Daily', labelID: 'Harian', defaultQuantity: 1 },
  { id: 'weekly', label: 'Weekly', labelID: 'Mingguan', defaultQuantity: 6 },
  { id: 'monthly', label: 'Monthly', labelID: 'Bulanan', defaultQuantity: 24 },
];

export const deliveryMethods = ['Self-pickup / Arrange courier', 'Online Delivery'];

export const faqs = [
  { category: 'Ordering', categoryID: 'Pemesanan', question: 'How do I place an order?', questionID: 'Bagaimana cara memesan?', answer: 'Build your meal on the website, review the live summary, then send the prepared order message through WhatsApp. Our team confirms availability and payment details there.', answerID: 'Pilih paket katering di website, periksa ringkasan pesanan, lalu kirim pesan yang sudah disiapkan melalui WhatsApp. Tim kami akan mengonfirmasi ketersediaan dan detail pembayaran di sana.' },
  { category: 'Ordering', categoryID: 'Pemesanan', question: 'Can I order only one meal?', questionID: 'Apakah saya bisa memesan satu porsi saja?', answer: 'Yes. Select the same start and end date in the catering form. The daily rate will apply.', answerID: 'Bisa. Pilih tanggal mulai dan selesai yang sama pada formulir katering. Tarif harian akan diterapkan.' },
  { category: 'Ordering', categoryID: 'Pemesanan', question: 'Can I order two meals per day?', questionID: 'Apakah saya bisa memesan dua porsi per hari?', answer: 'Yes. Select two servings per day in the catering form. Both servings use the same daily menu. Lunch is ready at 12:00 and dinner at 18:00.', answerID: 'Bisa. Pilih dua porsi per hari pada formulir katering. Kedua porsi menggunakan menu harian yang sama. Makan siang siap pukul 12.00 dan makan malam pukul 18.00.' },
  { category: 'Delivery', categoryID: 'Pengiriman', question: 'Where do you deliver?', questionID: 'Area mana saja yang dijangkau?', answer: 'Current delivery coverage is focused on Makassar. Enter your complete address in the builder and our team will confirm courier availability and fees through WhatsApp.', answerID: 'Cakupan pengiriman saat ini berfokus di Makassar. Masukkan alamat lengkap pada builder dan tim kami akan mengonfirmasi ketersediaan kurir serta biayanya melalui WhatsApp.' },
  { category: 'Delivery', categoryID: 'Pengiriman', question: 'Can I arrange my own courier?', questionID: 'Bisakah saya mengatur kurir sendiri?', answer: 'Yes. Choose Self-pickup / Arrange courier in the catering form. You can also choose Online Delivery.', answerID: 'Bisa. Pilih Ambil Sendiri / Atur Kurir pada formulir katering. Anda juga dapat memilih Online Delivery.' },
  { category: 'Nutrition', categoryID: 'Nutrisi', question: 'How is nutrition information calculated?', questionID: 'Bagaimana informasi nutrisi dihitung?', answer: 'Recipes are portioned from standardized ingredient weights and preparation methods. Values are working estimates and may vary slightly between batches.', answerID: 'Resep diporsikan berdasarkan berat bahan dan metode persiapan yang terstandar. Nilainya merupakan estimasi kerja dan dapat sedikit berbeda pada setiap batch.' },
  { category: 'Nutrition', categoryID: 'Nutrisi', question: 'Can I select a specific protein amount?', questionID: 'Bisakah saya memilih jumlah protein tertentu?', answer: 'Yes. Available tiers are 25g, 40g, 60g, 80g, and 100g. Availability may differ by menu.', answerID: 'Bisa. Pilihan yang tersedia adalah 25g, 40g, 60g, 80g, dan 100g. Ketersediaannya dapat berbeda untuk setiap menu.' },
  { category: 'Storage', categoryID: 'Penyimpanan', question: 'How should I store my meal?', questionID: 'Bagaimana cara menyimpan makanan?', answer: 'Refrigerate the meal promptly after receiving it and follow the handling instructions on the package. Ask our team for the current recommended consumption window.', answerID: 'Simpan makanan di lemari pendingin segera setelah diterima dan ikuti petunjuk pada kemasan. Tanyakan kepada tim kami mengenai batas konsumsi yang direkomendasikan.' },
  { category: 'Customization', categoryID: 'Kustomisasi', question: 'Can ingredients be customized?', questionID: 'Apakah bahan makanan bisa dikustomisasi?', answer: 'You can select available add-ons in the builder. For allergies or ingredient exclusions, add the details in your WhatsApp conversation before the order is confirmed.', answerID: 'Kamu dapat memilih add-on yang tersedia di builder. Untuk alergi atau bahan yang perlu dikecualikan, sampaikan detailnya melalui WhatsApp sebelum pesanan dikonfirmasi.' },
  { category: 'Payment', categoryID: 'Pembayaran', question: 'How do I pay?', questionID: 'Bagaimana cara pembayarannya?', answer: 'Payment instructions and the final confirmed total are shared by the Clean Plate Lab team through WhatsApp.', answerID: 'Petunjuk pembayaran dan total akhir yang telah dikonfirmasi akan disampaikan oleh tim Clean Plate Lab melalui WhatsApp.' },
];

export const standards = [
  { title: 'Food Quality', titleID: 'Kualitas Makanan', description: 'Ingredients are selected for freshness, flavour, and suitability for consistent daily preparation.', descriptionID: 'Bahan dipilih berdasarkan kesegaran, rasa, dan kesesuaiannya untuk persiapan harian yang konsisten.' },
  { title: 'Ingredients', titleID: 'Bahan Makanan', description: 'Recipes prioritise familiar whole-food ingredients with clear portions and purposeful seasoning.', descriptionID: 'Resep memprioritaskan bahan makanan utuh yang familiar, porsi yang jelas, dan bumbu yang digunakan secara tepat.' },
  { title: 'Cooking Process', titleID: 'Proses Memasak', description: 'Meals are prepared in controlled batches using repeatable methods designed for quality and food safety.', descriptionID: 'Makanan disiapkan dalam batch terkendali dengan metode yang dapat diulang untuk menjaga kualitas dan keamanan pangan.' },
  { title: 'Nutrition Calculation', titleID: 'Perhitungan Nutrisi', description: 'Ingredient weights and recipe yields are documented so nutrition estimates can be calculated consistently.', descriptionID: 'Berat bahan dan hasil resep didokumentasikan agar estimasi nutrisi dapat dihitung secara konsisten.' },
  { title: 'Consistency', titleID: 'Konsistensi', description: 'Portion guides, preparation notes, and batch checks help each menu stay recognisable from order to order.', descriptionID: 'Panduan porsi, catatan persiapan, dan pemeriksaan batch membantu setiap menu tetap konsisten dari satu pesanan ke pesanan berikutnya.' },
  { title: 'Transparency', titleID: 'Transparansi', description: 'Calories and key nutrition values are presented as specifications, with honest context about natural variation.', descriptionID: 'Kalori dan nilai nutrisi utama ditampilkan sebagai spesifikasi, disertai konteks yang jujur mengenai variasi alami.' },
];
