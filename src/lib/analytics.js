export function trackEvent(eventName, parameters = {}) {
  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, parameters);
  } else if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: eventName, ...parameters });
  }

  if (typeof window.fbq === "function") {
    window.fbq("trackCustom", eventName, parameters);
  }
}

export const analytics = {
  calculatorUsed: (result) => trackEvent("calculator_used", result),
  builderOpened: (source) => trackEvent("build_meal_clicked", { source }),
  whatsappClicked: (order) =>
    trackEvent("whatsapp_order_clicked", {
      protein_tier: order.proteinTier,
      period: order.cateringPeriod,
      days: order.totalDays,
      meals_per_day: order.mealsPerDay,
      quantity: order.totalBoxes,
      value: order.totalCost,
      has_referral: order.hasReferral,
    }),
  proteinTierSelected: (proteinTier) =>
    trackEvent("protein_tier_selected", { protein_tier: proteinTier }),
  mealSelected: (mealId) => trackEvent("meal_selected", { meal_id: mealId }),
};
