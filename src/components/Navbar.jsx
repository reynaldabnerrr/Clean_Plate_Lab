import React, { useState, useEffect } from "react";
import { CplPrimaryLogo } from "./CplLogo";
import { Button } from "./ui/button";
import { Menu, X, ArrowRight, ShieldCheck } from "lucide-react";
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

export function Navbar({ onOpenOrder, onOpenAdmin, hidden = false }) {
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
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[100] px-4 py-2 bg-[#8D9B7D] text-white font-bold text-xs rounded-md shadow-lg outline-none ring-2 ring-white"
      >
        {t("skipContent")}
      </a>

      {/* Mobile Backdrop Overlay (Layered behind z-50 header & drawer) */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 xl:hidden animate-cpl-fade-in"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <div aria-hidden="true" className={`h-[74px] sm:h-[78px] transition-opacity duration-200 ${hidden ? "opacity-0" : "opacity-100"}`} />
      <header
        className={`fixed inset-x-0 top-0 z-[100] transition-all duration-200 ${
          mobileMenuOpen || scrolled
            ? "bg-[#FEFDF9] shadow-md border-b-2 border-[#1E1E1E] py-3"
            : "bg-[#FEFDF9]/95 border-b border-[#1E1E1E]/20 py-4"
        } ${hidden ? "pointer-events-none opacity-0" : "opacity-100"}`}
      >
        <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6 xl:gap-3 xl:px-5 2xl:gap-5 2xl:px-8 relative z-50">
          {/* Brand Logo */}
          <a
            href="#main-content"
            className="flex items-center shrink-0 hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8D9B7D] rounded-lg"
            aria-label="Clean Plate Lab Home"
          >
            <div className="origin-left scale-95 transform sm:scale-100 xl:scale-[0.88] 2xl:scale-100">
              <CplPrimaryLogo />
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden items-center justify-center gap-3 font-display text-[11px] font-extrabold uppercase tracking-[0.04em] text-[#1E1E1E] xl:flex 2xl:gap-6 2xl:text-xs 2xl:tracking-wider"
          >
            {navItems.map((item) => {
              const isActive = activeHref === item.href;

              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "location" : undefined}
                  onClick={() => setActiveHref(item.href)}
                  className={`group relative whitespace-nowrap rounded py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8D9B7D] ${
                    isActive ? "text-[#6B7860]" : "hover:text-[#6B7860]"
                  }`}
                >
                  <span>{item.label}</span>
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-0 left-0 h-[2px] bg-[#6B7860] transition-all duration-200 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 shrink-0">
            {/* Desktop Language Switcher */}
            <div className="hidden items-center rounded-full border border-[#1E1E1E]/15 bg-[#1E1E1E]/8 p-1 shadow-inner sm:flex">
              <button
                type="button"
                onClick={() => setLanguage("ID")}
                className={`rounded-full px-2.5 py-1 text-[11px] font-black transition-all duration-200 ${
                  language === "ID"
                    ? "bg-[#8D9B7D] text-white shadow-sm scale-[1.02]"
                    : "text-[#1E1E1E]/70 hover:text-[#1E1E1E]"
                }`}
                aria-label="Bahasa Indonesia"
              >
                <span>ID</span>
              </button>
              <button
                type="button"
                onClick={() => setLanguage("EN")}
                className={`rounded-full px-2.5 py-1 text-[11px] font-black transition-all duration-200 ${
                  language === "EN"
                    ? "bg-[#8D9B7D] text-white shadow-sm scale-[1.02]"
                    : "text-[#1E1E1E]/70 hover:text-[#1E1E1E]"
                }`}
                aria-label="English Language"
              >
                <span>EN</span>
              </button>
            </div>

            {/* Desktop / Tablet CTA Button */}
            <Button
              variant="default"
              size="default"
              onClick={onOpenOrder}
              className="hidden md:flex items-center gap-2 rounded-full bg-[#8A9C7A] hover:bg-[#647554] active:scale-[0.98] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] min-h-[40px] px-4.5 shrink-0 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#8A9C7A]"
            >
              <span>{copy.nav.build}</span>
              <ArrowRight size={14} />
            </Button>

            {/* Mobile / Tablet Menu Toggle Button (Touch Area 44x44px) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((current) => !current)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu-drawer"
              aria-label={
                mobileMenuOpen ? "Close Menu" : "Open Navigation Menu"
              }
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#1E1E1E]/15 bg-[#1E1E1E]/5 text-[#1E1E1E] transition-colors hover:bg-[#1E1E1E]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8D9B7D] xl:hidden"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Full-Featured Drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu-drawer"
            className="absolute left-0 right-0 top-full z-50 max-h-[calc(100vh-80px)] origin-top space-y-4 overflow-y-auto border-b-2 border-[#1E1E1E] bg-[#FEFDF9] px-4 py-4 font-display text-xs font-bold uppercase tracking-wider text-[#1E1E1E] shadow-[0_18px_35px_rgba(30,30,30,0.16)] animate-cpl-slide-down sm:px-6 sm:py-5 xl:hidden"
          >
            <div className="flex items-center justify-between gap-4 border-b border-[#1E1E1E]/20 pb-4 sm:hidden">
              <span className="font-display text-[10px] font-extrabold uppercase tracking-wider text-[#1E1E1E]/65">
                {t("switchLanguage")}
              </span>
              <div className="flex items-center rounded-full border border-[#1E1E1E]/15 bg-[#1E1E1E]/8 p-1 shadow-inner">
                <button
                  type="button"
                  onClick={() => setLanguage("ID")}
                  className={`rounded-full px-3 py-1 text-[10px] font-black transition-all ${language === "ID" ? "bg-[#8D9B7D] text-white shadow-sm" : "text-[#1E1E1E]/70 hover:text-[#1E1E1E]"}`}
                  aria-label="Bahasa Indonesia"
                >
                  ID
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("EN")}
                  className={`rounded-full px-3 py-1 text-[10px] font-black transition-all ${language === "EN" ? "bg-[#8D9B7D] text-white shadow-sm" : "text-[#1E1E1E]/70 hover:text-[#1E1E1E]"}`}
                  aria-label="English Language"
                >
                  EN
                </button>
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <nav
              aria-label="Mobile Navigation"
              className="grid border-t-2 border-[#1E1E1E]"
            >
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
                    className={`group flex min-h-12 items-center justify-between gap-3 border-b border-[#1E1E1E]/20 py-3 text-xs font-extrabold transition-all focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#8D9B7D] sm:min-h-14 sm:text-sm ${
                      isActive
                        ? "border-l-4 border-l-[#6B7860] bg-[#E1ECD3] px-3 text-[#3A4A30]"
                        : "border-l-4 border-l-transparent px-2 text-[#1E1E1E] hover:bg-white/50 hover:px-3 hover:text-[#6B7860]"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ArrowRight
                      size={14}
                      className={`shrink-0 transition-transform group-hover:translate-x-0.5 ${isActive ? "text-[#6B7860]" : "text-[#8D9B7D]"}`}
                    />
                  </a>
                );
              })}
            </nav>

            {/* Drawer Action Buttons */}
            <div className="border-t border-[#1E1E1E]/15 pt-4">
              <Button
                variant="default"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenOrder();
                }}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#8A9C7A] px-5 text-xs font-extrabold text-white shadow-md transition-transform hover:bg-[#647554] active:scale-[0.98]"
              >
                <span>{copy.nav.build}</span>
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
