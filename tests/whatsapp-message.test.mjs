import test from "node:test";
import assert from "node:assert/strict";
import {
  formatServicePeriod,
  buildSimplifiedWhatsAppOrderMessage,
} from "../src/lib/order.js";

test("formatServicePeriod formats single date, same month, multi-month and multi-year ranges", () => {
  assert.equal(
    formatServicePeriod("2026-10-20", "2026-10-20"),
    "20 Oktober 2026",
  );
  assert.equal(
    formatServicePeriod("2026-10-20", "2026-10-21"),
    "20–21 Oktober 2026",
  );
  assert.equal(
    formatServicePeriod("2026-10-28", "2026-11-05"),
    "28 Oktober – 5 November 2026",
  );
  assert.equal(
    formatServicePeriod("2026-12-28", "2027-01-03"),
    "28 Desember 2026 – 3 Januari 2027",
  );
});

test("buildSimplifiedWhatsAppOrderMessage exactly matches the example in the brief", () => {
  const message = buildSimplifiedWhatsAppOrderMessage({
    customerName: "Della Foss",
    phone: "081355552257",
    referralCode: "PTMAKASSAR01",
    proteinTier: 40,
    startDate: "2026-10-20",
    endDate: "2026-10-21",
    totalDays: 2,
    totalBoxes: 2,
    mealsPerDay: 1,
    singleMealReadyTime: "12:00",
    readyTimeMeal1: "12:00",
    mealItems: [{ mealNumber: 1, customizationIds: [] }],
    selectedAddons: [],
    cutlery: "yes",
    fulfillment: "Online-delivery",
    address: "Kantor Notaris Widartiningsih, Jalan Gunung Bawakaraeng No. 75 B",
    mapsUrl: "https://maps.app.goo.gl/fgnmuE5B8scMuwdB6?g_st=ic",
    selectedPrice: 40000,
    totalCost: 80000,
  });

  const expected = `CLEAN PLATE LAB MAKASSAR
Good Food. Clear Data. Better You.

Halo Tim Clean Plate Lab, saya ingin memesan meal plan dengan detail berikut:

DATA PEMESAN
Nama: Della Foss
WhatsApp: 081355552257
Kode referral: PTMAKASSAR01

DETAIL PESANAN
Target protein: 40g/porsi
Periode layanan: 20–21 Oktober 2026
Jumlah: 2 box (2 hari)
Jadwal makan: Makan siang, pukul 12.00
Kustomisasi: Meal lengkap
Add-on: Tidak ada
Alat makan (cutlery): Ya, perlu alat makan

PENGIRIMAN
Metode: Online Delivery
Alamat: Kantor Notaris Widartiningsih, Jalan Gunung Bawakaraeng No. 75 B
Google Maps: https://maps.app.goo.gl/fgnmuE5B8scMuwdB6?g_st=ic

RINGKASAN BIAYA
Rp40.000 × 2 box = Rp80.000

TOTAL: Rp80.000

Mohon konfirmasi ketersediaan dan petunjuk pembayaran. Terima kasih.`;

  assert.equal(message, expected);
});

test("omits referral line when referral code is empty or whitespace", () => {
  const message = buildSimplifiedWhatsAppOrderMessage({
    customerName: "Budi Santoso",
    phone: "081234567890",
    referralCode: "   ",
    proteinTier: 60,
    startDate: "2026-10-20",
    endDate: "2026-10-20",
    totalDays: 1,
    totalBoxes: 1,
    mealsPerDay: 1,
    singleMealReadyTime: "12:00",
    readyTimeMeal1: "12:00",
    mealItems: [{ mealNumber: 1, customizationIds: [] }],
    selectedAddons: [],
    cutlery: "no",
    fulfillment: "Online-delivery",
    address: "Jl. Veteran No. 10",
    selectedPrice: 50000,
    totalCost: 50000,
  });

  assert.ok(!message.includes("Kode referral:"));
  assert.ok(message.includes("Nama: Budi Santoso"));
  assert.ok(message.includes("WhatsApp: 081234567890"));
  assert.ok(message.includes("Alat makan (cutlery): Tidak perlu alat makan"));
});

test("handles addons, two meals per day, and pickup method dynamically", () => {
  const message = buildSimplifiedWhatsAppOrderMessage({
    customerName: "Siti Rahma",
    phone: "081987654321",
    referralCode: "PARTNER123",
    proteinTier: 80,
    startDate: "2026-10-20",
    endDate: "2026-10-22",
    totalDays: 3,
    totalBoxes: 6,
    mealsPerDay: 2,
    readyTimeMeal1: "12:00",
    readyTimeMeal2: "18:00",
    mealItems: [
      { mealNumber: 1, customizationIds: ["no-rice"] },
      { mealNumber: 2, customizationIds: ["no-vegetables"] },
    ],
    selectedAddons: [
      {
        id: "potato-corn",
        nameID: "Ganti Karbo: Baby Potato + Jagung",
        price: 5000,
      },
    ],
    cutlery: "yes",
    fulfillment: "Self-arranged",
    selectedPrice: 65000,
    totalCost: 420000,
    centralKitchenAddress: "Jalan G. Bulusaraung no. 18AA, Makassar",
  });

  assert.ok(message.includes("Kode referral: PARTNER123"));
  assert.ok(message.includes("Jumlah: 6 box (3 hari)"));
  assert.ok(
    message.includes(
      "Jadwal makan: Makan siang, pukul 12.00 & Makan malam, pukul 18.00",
    ),
  );
  assert.ok(
    message.includes(
      "Kustomisasi: Makan siang (Tanpa nasi), Makan malam (Tanpa sayur)",
    ),
  );
  assert.ok(
    message.includes(
      "Add-on: Ganti Karbo: Baby Potato + Jagung (+Rp5.000 per meal)",
    ),
  );
  assert.ok(
    message.includes("Metode: Ambil Sendiri (Pickup di Clean Plate Lab)"),
  );
  assert.ok(
    message.includes("Lokasi pickup: Jalan G. Bulusaraung no. 18AA, Makassar"),
  );
  assert.ok(!message.includes("Alamat:"));
  assert.ok(message.includes("Paket: Rp65.000 × 6 box = Rp390.000"));
  assert.ok(
    message.includes(
      "Add-on (Ganti Karbo: Baby Potato + Jagung): Rp5.000 per meal × 6 meal = Rp30.000",
    ),
  );
  assert.ok(message.includes("TOTAL: Rp420.000"));
});
