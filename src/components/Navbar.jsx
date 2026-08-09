import React, { useState, useEffect } from "react";
import { CplPrimaryLogo } from "./CplLogo";
import { Button } from "./ui/button";
import { ArrowRight, Menu, X } from "lucide-react";
import { useCpl } from "../hooks/useCpl";
import { useSiteCopy } from "../hooks/useSiteCopy";

const NAV_SECTION_HREFS = [
  "#how-it-works",
  "#protein-tiers",
  "#this-week-menu",
  "#menu",
  "#calculator",
  "#why-cpl",
  "#founder",
  "#faq",
];

export function Navbar({ onOpenOrder, hidden = false }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState("");
  const { language, setLanguage, t } = useCpl();
  const copy = useSiteCopy();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let animationFrame;

    const updateActiveSection = () => {
      animationFrame = undefined;
      const marker = window.scrollY + Math.min(180, window.innerHeight * 0.3);
      let nextActiveHref = "";

      NAV_SECTION_HREFS.forEach((href) => {
        const section = document.querySelector(href);
        if (section && section.offsetTop <= marker) nextActiveHref = href;
      });

      setActiveHref(nextActiveHref);
    };

    const scheduleUpdate = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  // Close mobile menu on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close mobile menu when OrderModal opens (dispatched from App.jsx)
  useEffect(() => {
    const handler = () => {
      if (mobileMenuOpen) {
        document.body.style.overflow = "";
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("cpl:closeMobileMenu", handler);
    return () => window.removeEventListener("cpl:closeMobileMenu", handler);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { label: copy.nav.how, href: "#how-it-works" },
    { label: copy.nav.protein, href: "#protein-tiers" },
    {
      label: language === "ID" ? "Menu Minggu Ini" : "This Week's Menu",
      href: "#this-week-menu",
      featured: true,
    },
    { label: copy.nav.menu, href: "#menu" },
    { label: copy.nav.calculator, href: "#calculator" },
    { label: copy.nav.standard, href: "#why-cpl" },
    { label: copy.nav.founder, href: "#founder" },
    { label: copy.nav.faq, href: "#faq" },
  ];

  const handleMobileNavigation = (event, href) => {
    event.preventDefault();
    document.body.style.overflow = "";
    setActiveHref(href);
    setMobileMenuOpen(false);

    window.requestAnimationFrame(() => {
      const target = document.querySelector(href);
      if (!target) return;
      window.history.pushState(null, "", href);
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only z-[200] bg-[#1E1E1E] px-4 py-3 font-mono text-xs font-bold uppercase text-white outline-none ring-2 ring-[#EABB85] focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {t("skipContent")}
      </a>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[90] bg-[#1E1E1E]/70 backdrop-blur-[2px] xl:hidden animate-cpl-fade-in"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        aria-hidden="true"
        className={`h-[72px] transition-opacity duration-200 sm:h-[78px] xl:h-[112px] ${hidden ? "opacity-0" : "opacity-100"}`}
      />
      <header
        className={`fixed inset-x-0 top-0 z-[100] border-b-2 border-[#1E1E1E] bg-[#FEFDF9] transition-[opacity,box-shadow] duration-200 ${
          mobileMenuOpen || scrolled
            ? "shadow-[0_10px_30px_rgba(30,30,30,0.12)]"
            : "shadow-none"
        } ${hidden ? "pointer-events-none opacity-0" : "opacity-100"}`}
      >
        <div className="relative z-50 border-b border-[#1E1E1E] xl:border-b-0">
          <div className="mx-auto flex h-[70px] max-w-[90rem] items-center justify-between gap-3 px-4 sm:h-[76px] sm:px-6 xl:px-8">
            <a
              href="#main-content"
              className="group flex min-w-0 shrink-0 items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8D9B7D] focus-visible:ring-offset-4"
              aria-label="Clean Plate Lab Home"
            >
              <div className="origin-left scale-[0.88] transition-opacity group-hover:opacity-80 min-[380px]:scale-95 sm:scale-100 xl:scale-[0.92] 2xl:scale-100">
                <CplPrimaryLogo />
              </div>
            </a>

            <div className="hidden min-w-0 flex-1 items-stretch justify-end xl:flex">
              <div className="mr-6 flex min-w-[300px] items-center border-r border-[#1E1E1E] px-4 2xl:mr-10 2xl:min-w-[340px]">
                <div className="flex flex-col justify-center">
                  <span className="font-display text-[11px] font-black uppercase tracking-[0.08em] text-[#1E1E1E]">
                    {language === "ID" ? "Dimasak segar Senin–Sabtu" : "Fresh cooked Monday–Saturday"}
                  </span>
                  <span className="mt-0.5 font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-[#6B7860]">
                    Makassar · High-protein meal system
                  </span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3">
              <div className="hidden h-10 items-stretch border border-[#1E1E1E] bg-white sm:flex">
              <button
                type="button"
                onClick={() => setLanguage("ID")}
                  className={`min-w-10 px-2 font-mono text-[10px] font-black transition-colors focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#8D9B7D] ${
                  language === "ID"
                      ? "bg-[#1E1E1E] text-white"
                      : "bg-white text-[#6B7860] hover:bg-[#E1ECD3] hover:text-[#1E1E1E]"
                }`}
                aria-label="Bahasa Indonesia"
              >
                  ID
              </button>
              <button
                type="button"
                onClick={() => setLanguage("EN")}
                  className={`min-w-10 border-l border-[#1E1E1E] px-2 font-mono text-[10px] font-black transition-colors focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#8D9B7D] ${
                  language === "EN"
                      ? "bg-[#1E1E1E] text-white"
                      : "bg-white text-[#6B7860] hover:bg-[#E1ECD3] hover:text-[#1E1E1E]"
                }`}
                aria-label="English Language"
              >
                  EN
              </button>
            </div>

            <Button
              variant="default"
              size="default"
              onClick={onOpenOrder}
                className="hidden min-h-10 items-center gap-3 rounded-none border border-[#1E1E1E] bg-[#8D9B7D] px-4 font-display text-[11px] font-black uppercase tracking-[0.06em] text-white shadow-[3px_3px_0_#1E1E1E] transition-[background-color,box-shadow] hover:bg-[#6B7860] hover:shadow-[1px_1px_0_#1E1E1E] focus-visible:ring-2 focus-visible:ring-[#6B7860] md:flex xl:min-h-11 xl:px-5"
            >
              <span>{copy.nav.build}</span>
                <ArrowRight size={15} strokeWidth={2.4} aria-hidden="true" />
            </Button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((current) => !current)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu-drawer"
              aria-label={
                  mobileMenuOpen
                    ? language === "ID" ? "Tutup menu" : "Close menu"
                    : language === "ID" ? "Buka menu navigasi" : "Open navigation menu"
              }
                className={`flex h-11 shrink-0 items-center justify-center gap-2 border-2 border-[#1E1E1E] px-3 font-mono text-[9px] font-black uppercase tracking-[0.14em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8D9B7D] focus-visible:ring-offset-2 xl:hidden ${
                  mobileMenuOpen
                    ? "bg-[#1E1E1E] text-white"
                    : "bg-[#E1ECD3] text-[#1E1E1E] hover:bg-[#D1954E]"
                }`}
            >
                <span className="hidden min-[420px]:inline">
                  {mobileMenuOpen ? (language === "ID" ? "Tutup" : "Close") : "Menu"}
                </span>
                {mobileMenuOpen
                  ? <X size={19} strokeWidth={2.4} aria-hidden="true" />
                  : <Menu size={19} strokeWidth={2.4} aria-hidden="true" />}
            </button>
            </div>
          </div>
        </div>

        <div className="hidden border-t border-[#1E1E1E] bg-white xl:block">
          <div className="mx-auto flex h-[34px] max-w-[90rem] items-stretch px-8">
            <a
              href="#main-content"
              aria-current={activeHref ? undefined : "location"}
              onClick={() => setActiveHref("")}
              className="flex w-36 shrink-0 items-center justify-center border-x border-[#1E1E1E] bg-white px-3 font-display text-[9px] font-black uppercase tracking-[0.035em] text-[#1E1E1E] transition-colors hover:bg-[#E1ECD3] focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#8D9B7D] 2xl:w-40 2xl:text-[10px]"
            >
              <span>Home</span>
            </a>
            <nav aria-label="Main Navigation" className="flex min-w-0 flex-1 border-r border-[#1E1E1E]">
              {navItems.map((item) => {
                const isActive = activeHref === item.href;

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "location" : undefined}
                    onClick={() => setActiveHref(item.href)}
                    className={`group relative flex min-w-0 flex-1 items-center justify-center border-l border-[#1E1E1E] px-2 font-display text-[9px] font-black uppercase tracking-[0.035em] transition-colors focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#8D9B7D] 2xl:text-[10px] ${
                      isActive
                        ? "bg-[#1E1E1E] text-white"
                        : item.featured
                          ? "bg-[#E1ECD3] text-[#1E1E1E] hover:bg-[#8D9B7D]"
                          : "bg-white text-[#1E1E1E] hover:bg-[#E1ECD3]"
                    }`}
                  >
                    {item.featured && (
                      <span
                        aria-hidden="true"
                        className={`mr-1.5 h-1.5 w-1.5 shrink-0 rounded-full border border-[#1E1E1E] ${isActive ? "bg-[#D1954E]" : "bg-[#8D9B7D]"}`}
                      />
                    )}
                    <span className="truncate">{item.label}</span>
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-2 bottom-0 h-0.5 origin-left bg-[#D1954E] transition-transform duration-200 motion-reduce:transition-none ${
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </a>
                );
              })}
            </nav>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            id="mobile-menu-drawer"
            className="absolute left-0 right-0 top-full z-50 max-h-[calc(100dvh-72px)] origin-top overflow-y-auto border-b-2 border-[#1E1E1E] bg-[#FEFDF9] shadow-[0_24px_45px_rgba(30,30,30,0.24)] animate-cpl-slide-down sm:max-h-[calc(100dvh-78px)] xl:hidden"
          >
            <div className="mx-auto grid max-w-6xl md:grid-cols-[minmax(0,1fr)_18rem]">
              <div className="min-w-0 p-4 sm:p-6 md:border-r md:border-[#1E1E1E]">
                <div className="mb-4 flex items-center justify-between gap-4 border-b-2 border-[#1E1E1E] pb-3 sm:hidden">
                  <span className="font-mono text-[9px] font-black uppercase tracking-[0.16em] text-[#6B7860]">
                    {t("switchLanguage")}
                  </span>
                  <div className="flex h-9 items-stretch border border-[#1E1E1E] bg-white">
                <button
                  type="button"
                  onClick={() => setLanguage("ID")}
                        className={`min-w-11 px-2 font-mono text-[10px] font-black ${language === "ID" ? "bg-[#1E1E1E] text-white" : "text-[#6B7860]"}`}
                  aria-label="Bahasa Indonesia"
                >
                  ID
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("EN")}
                        className={`min-w-11 border-l border-[#1E1E1E] px-2 font-mono text-[10px] font-black ${language === "EN" ? "bg-[#1E1E1E] text-white" : "text-[#6B7860]"}`}
                  aria-label="English Language"
                >
                  EN
                </button>
                  </div>
              </div>

                <div className="mb-4 flex items-end justify-between gap-4">
                  <div>
                    <span className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-[#8D9B7D]">
                      CPL / Navigation
                    </span>
                    <p className="mt-1 font-display text-xl font-black uppercase leading-none text-[#1E1E1E] sm:text-2xl">
                      {language === "ID" ? "Temukan yang kamu butuhkan." : "Find what you need."}
                    </p>
                  </div>
                  <span className="hidden border border-[#1E1E1E] bg-[#E1ECD3] px-2 py-1 font-mono text-[8px] font-black uppercase tracking-[0.12em] sm:block">
                    08 sections
                  </span>
                </div>

                <nav aria-label="Mobile Navigation" className="grid border-l-2 border-t-2 border-[#1E1E1E] sm:grid-cols-2">
              {navItems.map((item) => {
                const isActive = activeHref === item.href;

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "location" : undefined}
                    onClick={(event) =>
                      handleMobileNavigation(event, item.href)
                    }
                        className={`group flex min-h-14 items-center justify-between gap-3 border-b-2 border-r-2 border-[#1E1E1E] px-3 py-3 font-display text-xs font-black uppercase tracking-[0.04em] transition-colors focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#8D9B7D] sm:min-h-16 sm:px-4 sm:text-sm ${
                      isActive
                            ? "bg-[#1E1E1E] text-white"
                            : item.featured
                              ? "bg-[#E1ECD3] text-[#1E1E1E] hover:bg-[#8D9B7D]"
                              : "bg-white text-[#1E1E1E] hover:bg-[#E1ECD3]"
                    }`}
                  >
                        <span className="flex min-w-0 items-center gap-2">
                          {item.featured && (
                            <span className={`h-2 w-2 shrink-0 rounded-full border ${isActive ? "border-white bg-[#D1954E]" : "border-[#1E1E1E] bg-[#8D9B7D]"}`} />
                          )}
                          <span>{item.label}</span>
                        </span>
                    <ArrowRight
                          size={15}
                          strokeWidth={2.4}
                          aria-hidden="true"
                          className={`shrink-0 ${isActive ? "text-[#D1954E]" : "text-[#6B7860]"}`}
                    />
                  </a>
                );
              })}
            </nav>
              </div>

              <aside className="border-t-2 border-[#1E1E1E] bg-[#E1ECD3] p-4 sm:p-6 md:border-t-0">
                <h2 className="font-display text-2xl font-black uppercase leading-[0.95] text-[#1E1E1E]">
                  {language === "ID" ? "Siap atur paket makanmu?" : "Ready to build your meals?"}
                </h2>
                <p className="mt-3 text-[11px] font-medium leading-5 text-[#1E1E1E]/70">
                  {language === "ID"
                    ? "Pilih target protein, periode katering, dan jadwal yang paling cocok."
                    : "Choose your protein target, catering period, and preferred schedule."}
                </p>
              <Button
                variant="default"
                onClick={() => {
                  setMobileMenuOpen(false);
                    onOpenOrder?.();
                }}
                  className="mt-5 flex min-h-12 w-full items-center justify-between gap-2 rounded-none border-2 border-[#1E1E1E] bg-[#8D9B7D] px-4 font-display text-xs font-black uppercase tracking-[0.06em] text-white shadow-[4px_4px_0_#1E1E1E] transition-[background-color,box-shadow] hover:bg-[#6B7860] hover:shadow-[2px_2px_0_#1E1E1E]"
              >
                <span>{copy.nav.build}</span>
                  <ArrowRight size={16} strokeWidth={2.4} aria-hidden="true" />
              </Button>
                <div className="mt-6 border-t border-[#1E1E1E]/30 pt-3 font-mono text-[8px] font-bold uppercase leading-4 tracking-[0.14em] text-[#6B7860]">
                  Makassar · Monday–Saturday<br />
                  Good food · Clear data
                </div>
              </aside>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
