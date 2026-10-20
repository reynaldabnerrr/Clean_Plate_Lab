import { addons, proteinTiers } from "../data/site.js";
import { getMealById } from "../data/meals.js";
import { isServiceDate } from "./kitchen.js";
import { describeCustomization } from "./mealCustomization.js";

export const WHATSAPP_NUMBER = "6285111215704";
export const WHATSAPP_DISPLAY = "+62 851-1121-5704";
export const CONTACT_EMAIL = "cleanplatelab.id@gmail.com";
export const ORDER_TIME_ZONE = "Asia/Makassar";
export const CENTRAL_KITCHEN_MAPS_LINK =
  "https://maps.app.goo.gl/jdJGvQTAin6SwYgq7";

export const INDONESIA_MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export function formatServicePeriod(startDate, endDate) {
  if (!startDate) return "-";
  if (!endDate || startDate === endDate) {
    const [y, m, d] = startDate.split("-").map(Number);
    return `${d} ${INDONESIA_MONTHS[m - 1]} ${y}`;
  }

  const [sY, sM, sD] = startDate.split("-").map(Number);
  const [eY, eM, eD] = endDate.split("-").map(Number);

  if (sY === eY && sM === eM) {
    return `${sD}–${eD} ${INDONESIA_MONTHS[sM - 1]} ${sY}`;
  }

  if (sY === eY) {
    return `${sD} ${INDONESIA_MONTHS[sM - 1]} – ${eD} ${INDONESIA_MONTHS[eM - 1]} ${sY}`;
  }

  return `${sD} ${INDONESIA_MONTHS[sM - 1]} ${sY} – ${eD} ${INDONESIA_MONTHS[eM - 1]} ${eY}`;
}

function formatReadyTimeDisplay(value) {
  return (value || "12:00").replace(":", ".");
}

export function buildSimplifiedWhatsAppOrderMessage({
  customerName = "",
  phone = "",
  referralCode = "",
  proteinTier = 40,
  startDate = "",
  endDate = "",
  totalDays = 1,
  totalBoxes = 1,
  mealsPerDay = 1,
  singleMealReadyTime = "12:00",
  readyTimeMeal1 = "12:00",
  readyTimeMeal2 = "18:00",
  mealItems = [],
  selectedAddons = [],
  fulfillment = "Online-delivery",
  address = "",
  mapsUrl = "",
  selectedPrice = 40000,
  totalCost = 40000,
  centralKitchenAddress = "Jalan G. Bulusaraung no. 18AA, RW.01, Pisang Utara, Ujung Pandang, Makassar City, South Sulawesi 90115",
}) {
  const customerLines = [
    `Nama: ${customerName || "-"}`,
    `WhatsApp: ${phone || "-"}`,
  ];
  if (referralCode && referralCode.trim()) {
    customerLines.push(`Kode referral: ${referralCode.trim()}`);
  }

  const periodText = formatServicePeriod(startDate, endDate);

  const meal1Name =
    (singleMealReadyTime || readyTimeMeal1) === "18:00"
      ? "Makan malam"
      : "Makan siang";
  const scheduleText =
    mealsPerDay === 1
      ? `${meal1Name}, pukul ${formatReadyTimeDisplay(readyTimeMeal1 || singleMealReadyTime || "12:00")}`
      : `Makan siang, pukul ${formatReadyTimeDisplay(readyTimeMeal1 || "12:00")} & Makan malam, pukul ${formatReadyTimeDisplay(readyTimeMeal2 || "18:00")}`;

  let customizationText = "Meal lengkap";
  if (Array.isArray(mealItems) && mealItems.length > 0) {
    if (mealsPerDay === 1) {
      customizationText = describeCustomization(
        mealItems[0]?.customizationIds || [],
        "ID",
      );
    } else {
      const c1 = describeCustomization(
        mealItems[0]?.customizationIds || [],
        "ID",
      );
      const c2 = describeCustomization(
        mealItems[1]?.customizationIds || [],
        "ID",
      );
      if (c1 === c2) {
        customizationText = c1;
      } else {
        customizationText = `Makan siang (${c1}), Makan malam (${c2})`;
      }
    }
  }

  let addonText = "Tidak ada";
  if (selectedAddons && selectedAddons.length > 0) {
    addonText = selectedAddons
      .map(
        (addon) =>
          `${addon.nameID || addon.name} (+Rp${addon.price.toLocaleString("id-ID")}/box)`,
      )
      .join(", ");
  }

  const isOnlineDelivery = fulfillment === "Online-delivery";
  const deliveryLines = [];
  if (isOnlineDelivery) {
    deliveryLines.push("Metode: Online Delivery");
    deliveryLines.push(`Alamat: ${address || "-"}`);
    if (mapsUrl && mapsUrl.trim()) {
      deliveryLines.push(`Google Maps: ${mapsUrl.trim()}`);
    }
  } else {
    deliveryLines.push("Metode: Ambil Sendiri (Pickup di Clean Plate Lab)");
    if (centralKitchenAddress) {
      deliveryLines.push(`Lokasi pickup: ${centralKitchenAddress}`);
    }
    deliveryLines.push(`Google Maps: ${CENTRAL_KITCHEN_MAPS_LINK}`);
  }

  const costLines = [];
  if (!selectedAddons || selectedAddons.length === 0) {
    costLines.push(
      `Rp${selectedPrice.toLocaleString("id-ID")} × ${totalBoxes} box = Rp${totalCost.toLocaleString("id-ID")}`,
    );
  } else {
    costLines.push(
      `Paket: Rp${selectedPrice.toLocaleString("id-ID")} × ${totalBoxes} box = Rp${(selectedPrice * totalBoxes).toLocaleString("id-ID")}`,
    );
    selectedAddons.forEach((addon) => {
      costLines.push(
        `Add-on (${addon.nameID || addon.name}): Rp${addon.price.toLocaleString("id-ID")} × ${totalBoxes} box = Rp${(addon.price * totalBoxes).toLocaleString("id-ID")}`,
      );
    });
  }

  return `CLEAN PLATE LAB MAKASSAR
Good Food. Clear Data. Better You.

Halo Tim Clean Plate Lab, saya ingin memesan meal plan dengan detail berikut:

DATA PEMESAN
${customerLines.join("\n")}

DETAIL PESANAN
Target protein: ${proteinTier}g/porsi
Periode layanan: ${periodText}
Jumlah: ${totalBoxes} box (${totalDays} hari)
Jadwal makan: ${scheduleText}
Kustomisasi: ${customizationText}
Add-on: ${addonText}

PENGIRIMAN
${deliveryLines.join("\n")}

RINGKASAN BIAYA
${costLines.join("\n")}

TOTAL: Rp${totalCost.toLocaleString("id-ID")}

Mohon konfirmasi ketersediaan dan petunjuk pembayaran. Terima kasih.`;
}

export function buildWhatsAppInterestMessage(language = "ID") {
  if (language === "EN") {
    return `Hello Clean Plate Lab team,

I'm interested in Clean Plate Lab's high-protein catering service and would like some help choosing a plan that fits my protein target and daily routine.

Could you share more information about your available plans, this week's menu, pricing, and delivery schedule?

Thank you.`;
  }

  return `Halo Tim Clean Plate Lab,

Saya tertarik dengan layanan katering tinggi protein Clean Plate Lab dan ingin berkonsultasi mengenai paket yang sesuai dengan target protein serta kebutuhan harian saya.

Boleh dibantu informasi mengenai pilihan paket, menu minggu ini, harga, dan jadwal pengirimannya?

Terima kasih.`;
}

export function getWhatsAppInterestUrl(language = "ID") {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppInterestMessage(language))}`;
}

export function getDateInputValueInTimeZone(
  date = new Date(),
  timeZone = ORDER_TIME_ZONE,
) {
  const dateParts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(
    dateParts.map(({ type, value }) => [type, value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

export function addDaysToDateInputValue(value, days) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));

  return date.toISOString().split("T")[0];
}

export function isSundayDate(dateInputValue) {
  if (!dateInputValue) return false;
  return new Date(`${dateInputValue}T00:00:00Z`).getUTCDay() === 0;
}

export function getDefaultOrderStartDate(today = getDateInputValueInTimeZone()) {
  let next = today;
  while (!isServiceDate(next)) next = addDaysToDateInputValue(next, 1);
  return next;
}

export function getDefaultOrderEndDate(startDate) {
  const candidate = addDaysToDateInputValue(startDate, 4);
  return getDefaultOrderStartDate(isSundayDate(candidate) ? addDaysToDateInputValue(candidate, -1) : candidate);
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function calculateOrderPricing({
  proteinTier,
  addonIds,
  quantity,
  orderPeriod = "daily",
}) {
  const tier =
    proteinTiers.find((item) => item.protein === Number(proteinTier)) ||
    proteinTiers[0];
  const selectedAddons = addons.filter((addon) => addonIds.includes(addon.id));
  const addonsPrice = selectedAddons.reduce(
    (sum, addon) => sum + addon.price,
    0,
  );
  const safeQuantity = Math.max(1, Number(quantity) || 1);
  const basePrice = tier.prices?.[orderPeriod] || tier.price;
  const subtotalPerMeal = basePrice + addonsPrice;

  return {
    basePrice,
    addonsPrice,
    subtotalPerMeal,
    quantity: safeQuantity,
    total: subtotalPerMeal * safeQuantity,
  };
}

export function buildWhatsAppMessage(order) {
  const selectedAddons = addons.filter((addon) =>
    (order.addonIds || []).includes(addon.id),
  );
  const pricing = calculateOrderPricing(order);
  const totalDays = order.totalDays || order.serviceDates?.length || 1;
  const totalBoxes = order.totalBoxes || pricing.quantity;

  return buildSimplifiedWhatsAppOrderMessage({
    customerName: order.customerName,
    phone: order.phone,
    referralCode: order.referralCode,
    proteinTier: order.proteinTier,
    startDate: order.startDate,
    endDate: order.endDate,
    totalDays,
    totalBoxes,
    mealsPerDay: order.mealsPerDay || 1,
    singleMealReadyTime: order.singleMealReadyTime || "12:00",
    readyTimeMeal1: order.readyTimeMeal1 || "12:00",
    readyTimeMeal2: order.readyTimeMeal2 || "18:00",
    mealItems: order.items || [],
    selectedAddons,
    fulfillment: order.fulfillment || order.deliveryMethod || "Online-delivery",
    address: order.address || order.deliveryAddress,
    mapsUrl: order.mapsUrl,
    selectedPrice: pricing.basePrice,
    totalCost: pricing.total,
    centralKitchenAddress: order.centralKitchenAddress,
  });
}

export function getWhatsAppUrl(order) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage(order))}`;
}

