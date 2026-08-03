import { addons, proteinTiers } from '../data/site.js';
import { getMealById } from '../data/meals.js';

export const WHATSAPP_NUMBER = '6285111215704';
export const WHATSAPP_DISPLAY = '+62 851-1121-5704';
export const CONTACT_EMAIL = 'cleanplatelab.id@gmail.com';
export const ORDER_TIME_ZONE = 'Asia/Makassar';

export function getDateInputValueInTimeZone(date = new Date(), timeZone = ORDER_TIME_ZONE) {
  const dateParts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const values = Object.fromEntries(dateParts.map(({ type, value }) => [type, value]));

  return `${values.year}-${values.month}-${values.day}`;
}

export function addDaysToDateInputValue(value, days) {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));

  return date.toISOString().split('T')[0];
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function calculateOrderPricing({ proteinTier, addonIds, quantity, orderPeriod = 'daily' }) {
  const tier = proteinTiers.find((item) => item.protein === Number(proteinTier)) || proteinTiers[0];
  const selectedAddons = addons.filter((addon) => addonIds.includes(addon.id));
  const addonsPrice = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
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
  const meal = getMealById(order.mealId);
  const selectedAddons = addons.filter((addon) => order.addonIds.includes(addon.id));
  const pricing = calculateOrderPricing(order);

  return `*CLEAN PLATE LAB — MEAL ORDER*
_Good food. Clear data. Better you._

*CUSTOMER*
• Name: ${order.customerName || '-'}

*MEAL SPECIFICATION*
• Protein tier: ${order.proteinTier}g
• Meal: ${meal?.name || '-'}
• Ordering period: ${order.orderPeriod}
• Quantity: ${pricing.quantity} meal${pricing.quantity > 1 ? 's' : ''}
• Add-ons: ${selectedAddons.length ? selectedAddons.map((addon) => addon.name).join(', ') : 'None'}

*DELIVERY*
• Method: ${order.deliveryMethod}
• Address: ${order.deliveryAddress || '-'}
• Preferred time: ${order.deliveryTime || '-'}

*ESTIMATED TOTAL*
${formatCurrency(pricing.total)}

Please confirm menu availability, delivery fee if applicable, final total, and payment instructions. Thank you.`;
}

export function getWhatsAppUrl(order) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage(order))}`;
}
