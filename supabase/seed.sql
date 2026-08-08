-- Seed 6 default weekly meals into public.this_week_menu table

INSERT INTO public.this_week_menu (
  code, name, day, category, protein, carbs, fat, sodium, potassium, kcal, image, tags_id, tags_en, desc_id, desc_en, available, batch
) VALUES 
(
  'CPL-MON',
  'Chicken Teriyaki',
  'Monday / Senin',
  'High Protein',
  82.4, 132.5, 26.8, 1380.5, 355, 1100.8,
  '/images/chicken_teriyaki.webp',
  '["Monday / Senin", "82.4g Protein", "1100.8 Kkal"]'::jsonb,
  '["Monday", "82.4g Protein", "1100.8 Kcal"]'::jsonb,
  'Dada ayam empuk berbalut saus teriyaki manis gurih, disajikan dengan spesifikasi nutrisi lengkap 82.4g protein, 132.5g karbo, 26.8g lemak, 1380.5mg natrium, dan 355mg kalium.',
  'Tender chicken glazed in a sweet & savory teriyaki sauce, served with full lab specs: 82.4g protein, 132.5g carbs, 26.8g fat, 1380.5mg sodium, and 355mg potassium.',
  true,
  'MON-01'
),
(
  'CPL-TUE',
  'Ayam Cabe Ijo',
  'Tuesday / Selasa',
  'Lean Muscle',
  79.8, 124.0, 29.5, 1290.0, 365, 1080.7,
  '/images/ayam_cabe_ijo.webp',
  '["Tuesday / Selasa", "79.8g Protein", "1080.7 Kkal"]'::jsonb,
  '["Tuesday", "79.8g Protein", "1080.7 Kcal"]'::jsonb,
  'Ayam empuk beraroma sambal cabai hijau segar, disajikan dengan spesifikasi nutrisi lengkap 79.8g protein, 124g karbo, 29.5g lemak, 1290mg natrium, dan 365mg kalium.',
  'Tender chicken tossed in aromatic green chili sauce, served with full lab specs: 79.8g protein, 124g carbs, 29.5g fat, 1290mg sodium, and 365mg potassium.',
  true,
  'TUE-02'
),
(
  'CPL-WED',
  'Chicken Mentai',
  'Wednesday / Rabu',
  'High Protein',
  83.2, 128.5, 31.2, 1420.0, 330, 1127.6,
  '/images/chicken_mentai.webp',
  '["Wednesday / Rabu", "83.2g Protein", "1127.6 Kkal"]'::jsonb,
  '["Wednesday", "83.2g Protein", "1127.6 Kcal"]'::jsonb,
  'Dada ayam juicy dengan lapisan saus mentai gurih creamy, disajikan dengan spesifikasi nutrisi lengkap 83.2g protein, 128.5g karbo, 31.2g lemak, 1420mg natrium, dan 330mg kalium.',
  'Juicy chicken topped with creamy, savory mentai sauce, served with full lab specs: 83.2g protein, 128.5g carbs, 31.2g fat, 1420mg sodium, and 330mg potassium.',
  true,
  'WED-03'
),
(
  'CPL-THU',
  'Sate Padang',
  'Thursday / Kamis',
  'Lean Muscle',
  81.0, 122.0, 27.5, 1360.0, 370, 1059.5,
  '/images/sate_padang.webp',
  '["Thursday / Kamis", "81.0g Protein", "1059.5 Kkal"]'::jsonb,
  '["Thursday", "81.0g Protein", "1059.5 Kcal"]'::jsonb,
  'Dada ayam empuk dengan kuah sate Padang kaya rempah khas, disajikan dengan spesifikasi nutrisi lengkap 81.0g protein, 122g karbo, 27.5g lemak, 1360mg natrium, dan 370mg kalium.',
  'Tender chicken coated in rich and aromatic Padang-style sauce, served with full lab specs: 81.0g protein, 122g carbs, 27.5g fat, 1360mg sodium, and 370mg potassium.',
  true,
  'THU-04'
),
(
  'CPL-FRI',
  'Oseng Ayam Kecombrang',
  'Friday / Jumat',
  'High Protein',
  78.5, 125.0, 25.0, 1240.0, 385, 1039.0,
  '/images/oseng_ayam_kecombrang.webp',
  '["Friday / Jumat", "78.5g Protein", "1039 Kkal"]'::jsonb,
  '["Friday", "78.5g Protein", "1039 Kcal"]'::jsonb,
  'Oseng ayam gurih bertabur irisan kecombrang harum, disajikan dengan spesifikasi nutrisi lengkap 78.5g protein, 125g karbo, 25g lemak, 1240mg natrium, dan 385mg kalium.',
  'Savory stir-fried chicken infused with fragrant kecombrang, served with full lab specs: 78.5g protein, 125g carbs, 25g fat, 1240mg sodium, and 385mg potassium.',
  true,
  'FRI-05'
),
(
  'CPL-SAT',
  'Sweet & Sour Crispy Chicken',
  'Saturday / Sabtu',
  'Lean Muscle',
  80.5, 135.0, 28.0, 1310.0, 345, 1114.0,
  '/images/sweet_sour_crispy_chicken.webp',
  '["Saturday / Sabtu", "80.5g Protein", "1114 Kkal"]'::jsonb,
  '["Saturday", "80.5g Protein", "1114 Kcal"]'::jsonb,
  'Ayam renyah berbalut saus asam manis buatan sendiri yang segar, disajikan dengan spesifikasi nutrisi lengkap 80.5g protein, 135g karbo, 28g lemak, 1310mg natrium, dan 345mg kalium.',
  'Crispy chicken tossed in a sweet and tangy homemade sauce, served with full lab specs: 80.5g protein, 135g carbs, 28g fat, 1310mg sodium, and 345mg potassium.',
  true,
  'SAT-06'
);
