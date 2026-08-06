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
      meal_id: order.mealId,
      period: order.orderPeriod,
      quantity: order.quantity,
    }),
  proteinTierSelected: (proteinTier) =>
    trackEvent("protein_tier_selected", { protein_tier: proteinTier }),
  mealSelected: (mealId) => trackEvent("meal_selected", { meal_id: mealId }),
};
