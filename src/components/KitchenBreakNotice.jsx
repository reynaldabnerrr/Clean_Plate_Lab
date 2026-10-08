import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, Check, X } from "lucide-react";
import { CplLogoImage } from "./CplLogo";
import { useCpl } from "../hooks/useCpl";
import { isKitchenNoticeActive, KITCHEN_NOTICE_END, kitchenCopy } from "../lib/kitchen";
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from "./ui/dialog";

export function KitchenBreakNotice({ context = "home", onOrder, enabled = true }) {
  const { language, hasSelectedLanguage } = useCpl();
  const [dismissed, setDismissed] = useState(false);
  const [active, setActive] = useState(isKitchenNoticeActive);
  const copy = kitchenCopy[language] || kitchenCopy.EN;
  const isIndonesian = language === "ID";
  const [title, dates] = copy.title.split(" · ");

  useEffect(() => {
    const sync = () => setActive(isKitchenNoticeActive());
    const timeout = window.setTimeout(sync, Math.min(Math.max(0, KITCHEN_NOTICE_END - Date.now()), 2_147_483_647));
    window.addEventListener("focus", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("focus", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <Dialog
      open={enabled && active && hasSelectedLanguage && !dismissed}
      onOpenChange={(open) => { if (!open) setDismissed(true); }}
    >
      <DialogContent
        showClose={false}
        className="w-[calc(100%_-_2rem)] max-w-[500px] max-h-[calc(100dvh_-_2rem)] gap-0 overflow-y-auto rounded-[26px] border border-white/30 bg-[#FEFDF9] p-0 shadow-[0_28px_100px_rgba(0,0,0,0.3)] sm:p-0"
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        <div className="relative overflow-hidden bg-[#E1ECD3] px-6 pb-6 pt-5 sm:px-8 sm:pb-7 sm:pt-6">
          <DialogClose
            aria-label={isIndonesian ? "Tutup pemberitahuan" : "Close notice"}
            className="absolute right-3 top-3 z-10 grid size-11 place-items-center rounded-full border border-[#1E1E1E]/10 bg-white/40 text-[#1E1E1E] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3A4A30]"
          >
            <X size={19} />
          </DialogClose>
          <div className="mb-6 flex items-center gap-2.5 pr-10">
            <CplLogoImage size={38} />
            <div className="font-display text-[10px] font-bold uppercase leading-4 tracking-[0.12em] text-[#3A4A30]">
              Clean Plate Lab
              <span className="block font-mono text-[9px] font-normal tracking-[0.08em]">Makassar · {isIndonesian ? "Info kitchen" : "Kitchen update"}</span>
            </div>
          </div>
          <DialogTitle className="text-[38px] font-bold normal-case leading-[1.05] tracking-[-0.055em] text-[#243326] sm:text-[48px]">
            {title}<span className="text-[#6B7860]">.</span>
            <span className="mt-3 block font-mono text-[11px] font-medium uppercase leading-5 tracking-[0.09em] text-[#3A4A30] sm:text-xs">{dates}</span>
          </DialogTitle>
        </div>

        <div className="px-6 pb-6 pt-5 sm:px-8 sm:pb-7 sm:pt-6">
          <div className="mb-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-2xl border border-[#1E1E1E]/10 bg-white px-4 py-4" aria-label={isIndonesian ? "Jadwal kitchen" : "Kitchen schedule"}>
            <div>
              <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.1em] text-[#666]">{isIndonesian ? "Libur sementara" : "Kitchen closed"}</p>
              <p className="font-display text-xl font-bold tracking-tight text-[#1E1E1E]">8–13 <span className="text-xs font-medium">{isIndonesian ? "Okt" : "Oct"}</span></p>
            </div>
            <ArrowRight size={18} className="text-[#8D9B7D]" aria-hidden="true" />
            <div className="border-l border-dashed border-[#8D9B7D]/50 pl-4">
              <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.1em] text-[#526344]">{isIndonesian ? "Buka kembali" : "Back in the kitchen"}</p>
              <p className="font-display text-xl font-bold tracking-tight text-[#3A4A30]">14 <span className="text-xs font-medium">{isIndonesian ? "Oktober" : "October"}</span></p>
            </div>
          </div>

          <DialogDescription className="font-sans text-[13px] leading-[1.8] text-[#555]">
            {copy.body}
            <span className="mt-4 block border-t border-dashed border-[#1E1E1E]/15 pt-4 text-[#1E1E1E]">{copy.orders}</span>
          </DialogDescription>

          <div className="mb-3 mt-5 flex items-center gap-1.5 text-[10px] font-semibold text-[#526344]">
            <span className="grid size-4 place-items-center rounded-full bg-[#E1ECD3]"><Check size={10} strokeWidth={3} aria-hidden="true" /></span>
            {isIndonesian ? "Pemesanan tetap dibuka" : "Still taking orders"}
          </div>
          <button
            type="button"
            className="group flex min-h-14 w-full items-center justify-between gap-3 rounded-xl bg-[#243326] px-4 py-3.5 text-left font-display text-[13px] font-semibold leading-5 text-white transition-colors hover:bg-[#3A4A30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6B7860] sm:px-5 sm:text-sm"
            onClick={() => { setDismissed(true); if (context === "home") onOrder(); }}
          >
            <span>{context === "home" ? copy.homeAction : copy.formAction}</span>
            <ArrowUpRight size={20} className="shrink-0 text-[#C8D8B8] transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
