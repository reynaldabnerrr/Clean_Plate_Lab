import React from "react";
import { MessageCircle } from "lucide-react";
import { useCpl } from "../hooks/useCpl";
import { trackEvent } from "../lib/analytics";
import { getWhatsAppInterestUrl } from "../lib/order";

export function WhatsAppFloatingCta({ hidden = false }) {
  const { language } = useCpl();
  const label = language === "ID" ? "Chat WhatsApp" : "WhatsApp chat";

  return (
    <a
      href={getWhatsAppInterestUrl(language)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={
        language === "ID"
          ? "Chat dengan tim Clean Plate Lab melalui WhatsApp"
          : "Chat with the Clean Plate Lab team on WhatsApp"
      }
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : undefined}
      onClick={() => trackEvent("whatsapp_lead_clicked", { source: "floating_cta" })}
      className={`group fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-[80] flex min-h-14 items-stretch border-2 border-[#1E1E1E] bg-[#8D9B7D] text-white shadow-[5px_5px_0_#1E1E1E] transition-[opacity,transform,background-color,box-shadow] duration-200 hover:bg-[#6B7860] hover:shadow-[2px_2px_0_#1E1E1E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D1954E] focus-visible:ring-offset-2 motion-reduce:transition-none sm:bottom-6 sm:right-6 ${
        hidden
          ? "pointer-events-none translate-y-3 opacity-0"
          : "translate-y-0 opacity-100"
      }`}
    >
      <span className="grid w-13 shrink-0 place-items-center" aria-hidden="true">
        <MessageCircle size={23} strokeWidth={2.3} />
      </span>

      <span className="flex items-center border-l border-white/35 pr-3 sm:min-w-40 sm:pr-4">
        <span className="pl-3 text-left">
          <span className="block font-display text-[10px] font-black uppercase tracking-[0.08em] sm:text-[11px]">
            <span className="sm:hidden">Chat WA</span>
            <span className="hidden sm:inline">{label}</span>
          </span>
          <span className="mt-0.5 hidden font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-white/75 sm:block">
            {language === "ID" ? "Tanya paket & menu" : "Plans, menu & delivery"}
          </span>
        </span>
      </span>
    </a>
  );
}
