import { useEffect, useState } from "react";
import { CalendarDays, X } from "lucide-react";
import { useCpl } from "../hooks/useCpl";
import { isKitchenNoticeActive, KITCHEN_NOTICE_END, kitchenCopy } from "../lib/kitchen";
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from "./ui/dialog";

export function KitchenBreakNotice({ context = "home", onOrder, enabled = true }) {
  const { language, hasSelectedLanguage } = useCpl();
  const [dismissed, setDismissed] = useState(false);
  const [active, setActive] = useState(isKitchenNoticeActive);
  const copy = kitchenCopy[language] || kitchenCopy.EN;

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
    <Dialog open={enabled && active && hasSelectedLanguage && !dismissed} onOpenChange={(open) => { if (!open) setDismissed(true); }}>
      <DialogContent showClose={false} className="w-[calc(100%-2rem)] max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl border border-[#1E1E1E]/15 bg-[#FEFDF9] p-6 sm:p-8" onCloseAutoFocus={(event) => event.preventDefault()}>
        <DialogClose aria-label={language === "ID" ? "Tutup pemberitahuan" : "Close notice"} className="absolute right-2 top-2 grid size-11 place-items-center rounded-full hover:bg-[#E1ECD3] focus-visible:outline-2 focus-visible:outline-[#6B7860]"><X size={20} /></DialogClose>
        <span className="grid size-12 place-items-center rounded-full bg-[#E1ECD3] text-[#6B7860]"><CalendarDays size={24} /></span>
        <DialogTitle className="pr-2 text-xl normal-case leading-snug">{copy.title}</DialogTitle>
        <DialogDescription className="font-sans text-sm leading-6">{copy.body}<span className="mt-3 block font-semibold text-[#1E1E1E]">{copy.orders}</span></DialogDescription>
        <button type="button" className="mt-2 min-h-12 rounded-xl bg-[#1E1E1E] px-4 py-3 text-sm font-bold leading-5 text-white hover:bg-[#3A4A30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6B7860]" onClick={() => { setDismissed(true); if (context === "home") onOrder(); }}>
          {context === "home" ? copy.homeAction : copy.formAction}
        </button>
      </DialogContent>
    </Dialog>
  );
}
