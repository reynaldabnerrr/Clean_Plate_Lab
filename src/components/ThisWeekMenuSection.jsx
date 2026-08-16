import React, { useRef, useState } from "react";
import { useCpl } from "../hooks/useCpl";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import {
  formatMenuDate,
  formatNutritionValue,
  getMenuNutritionForTier,
  PROTEIN_TIERS,
} from "../lib/menuService";
import { MenuGridSkeleton } from "./ui/loading";

export function ThisWeekMenuSection({ onOpenAdmin }) {
  const { menuItems, language, isAdminLoggedIn, fetchLatestMenus, loadingMenu } = useCpl();
  const [selectedTiers, setSelectedTiers] = useState({});
  const [activeMenuIndex, setActiveMenuIndex] = useState(0);
  const menuTrackRef = useRef(null);
  const nutritionLocale = language === "ID" ? "id-ID" : "en-US";

  const scrollToMenu = (index) => {
    const track = menuTrackRef.current;
    const target = track?.children[index];

    if (!track || !target) return;

    const firstCardOffset = track.firstElementChild?.offsetLeft || 0;

    track.scrollTo({
      left: target.offsetLeft - firstCardOffset,
      behavior: "smooth",
    });
    setActiveMenuIndex(index);
  };

  const handleMenuScroll = (event) => {
    const track = event.currentTarget;
    const cards = Array.from(track.children);

    if (cards.length === 0) return;

    const firstCardOffset = cards[0].offsetLeft;

    const closestIndex = cards.reduce((closest, card, index) => {
      const currentDistance = Math.abs(card.offsetLeft - firstCardOffset - track.scrollLeft);
      const closestCard = cards[closest];
      const closestDistance = Math.abs(
        closestCard.offsetLeft - firstCardOffset - track.scrollLeft,
      );

      return currentDistance < closestDistance ? index : closest;
    }, 0);

    setActiveMenuIndex(closestIndex);
  };

  return (
    <section
      id="this-week-menu"
      className="relative scroll-mt-[74px] overflow-hidden border-b-2 border-[#1E1E1E] bg-[#FEFDF9] py-16 sm:scroll-mt-[78px] sm:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 flex flex-col justify-between gap-6 border-b border-[#1E1E1E]/20 pb-6 sm:mb-12 sm:pb-8 md:flex-row md:items-end">
          <div>
            <Badge variant="default" className="mb-3">
              {language === "ID" ? "MENU MINGGU INI" : "THIS WEEK'S MENU"}
            </Badge>

            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#1E1E1E]">
              {language === "ID" ? "MENU MINGGU INI" : "THIS WEEK'S MENU"}
            </h2>
            <p className="text-sm sm:text-base text-[#1E1E1E]/70 max-w-2xl mt-3 leading-relaxed">
              {language === "ID"
                ? "Pilihan menu tinggi protein yang dimasak segar setiap hari untuk mendukung kebutuhan nutrisi dan gaya hidup sehat Anda."
                : "Freshly prepared high-protein meals cooked daily to fuel your health and performance."}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={fetchLatestMenus}
              disabled={loadingMenu}
              className="inline-flex items-center gap-2 px-3 py-2 border-2 border-[#1E1E1E] bg-white text-xs font-mono font-bold uppercase shadow-[3px_3px_0_#1E1E1E] hover:bg-[#E1ECD3] active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50"
              title="Refresh Menu"
            >
              <RefreshCw size={14} className={loadingMenu ? "animate-spin text-[#6B7860]" : "text-[#6B7860]"} />
              <span>{loadingMenu ? "Syncing..." : "Refresh"}</span>
            </button>
          </div>
        </div>

        {/* Menu Cards Grid */}
        {loadingMenu ? (
          <MenuGridSkeleton className="lg:grid-cols-3" mobileCarousel hideImage />
        ) : menuItems.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-[#1E1E1E]/30 bg-white p-8">
            <p className="font-mono text-xs font-bold uppercase text-[#6B7860]">No Menus Found</p>
            <p className="text-sm text-gray-500 mt-2">Belum ada menu yang ditambahkan.</p>
            {isAdminLoggedIn && (
              <Button onClick={onOpenAdmin} className="mt-4 bg-[#8D9B7D]">
                Buka Admin CMS untuk Tambah Menu
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between gap-4 md:hidden">
              <div>
                <p className="font-mono text-[10px] font-black uppercase tracking-wider text-[#1E1E1E]">
                  {language === "ID" ? "Geser untuk pilih menu" : "Swipe to choose a meal"}
                </p>
                <p className="mt-0.5 font-mono text-[9px] font-bold uppercase text-[#6B7860]">
                  {String(activeMenuIndex + 1).padStart(2, "0")} / {String(menuItems.length).padStart(2, "0")}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollToMenu(activeMenuIndex - 1)}
                  disabled={activeMenuIndex === 0}
                  aria-label={language === "ID" ? "Menu sebelumnya" : "Previous meal"}
                  className="grid size-11 place-items-center border-2 border-[#1E1E1E] bg-white shadow-[2px_2px_0_#1E1E1E] transition-colors hover:bg-[#E1ECD3] disabled:cursor-not-allowed disabled:opacity-35 disabled:shadow-none"
                >
                  <ChevronLeft size={18} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToMenu(activeMenuIndex + 1)}
                  disabled={activeMenuIndex === menuItems.length - 1}
                  aria-label={language === "ID" ? "Menu berikutnya" : "Next meal"}
                  className="grid size-11 place-items-center border-2 border-[#1E1E1E] bg-[#1E1E1E] text-white shadow-[2px_2px_0_#8D9B7D] transition-colors hover:bg-[#6B7860] disabled:cursor-not-allowed disabled:opacity-35 disabled:shadow-none"
                >
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
              </div>
            </div>

            <div
              ref={menuTrackRef}
              onScroll={handleMenuScroll}
              aria-label={language === "ID" ? "Daftar menu minggu ini" : "This week's meal list"}
              className="relative -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3 lg:gap-8"
            >
              {menuItems.map((meal) => {
              const availableTiers = meal.availableProteinTiers || PROTEIN_TIERS;
              const selectedTier = availableTiers.includes(selectedTiers[meal.id])
                ? selectedTiers[meal.id]
                : 40;
              const nutrition = getMenuNutritionForTier(meal, selectedTier);
              const rawTags =
                language === "ID"
                  ? meal.tags_ID || meal.tags
                  : meal.tags_EN || meal.tags;
              const staticTags = Array.isArray(rawTags)
                ? rawTags
                : rawTags
                  ? [rawTags]
                  : [];
              const tags = [
                ...staticTags.filter((tag) => !/(protein|kcal|kkal)/i.test(String(tag))),
                `${selectedTier}g Protein`,
                `${formatNutritionValue(nutrition.kcal, nutritionLocale)} ${language === "ID" ? "Kkal" : "Kcal"}`,
              ];
              const description =
                language === "ID"
                  ? meal.desc_ID || meal.desc_EN || meal.desc || ""
                  : meal.desc_EN || meal.desc_ID || meal.desc || "";

              return (
                <Card
                  key={meal.id}
                  className="group grid h-full min-w-0 flex-[0_0_calc(100%-2rem)] snap-start scroll-ml-4 grid-rows-[auto_1fr] overflow-hidden rounded-none border-2 border-[#1E1E1E] bg-white shadow-[6px_6px_0_#1E1E1E] transition-all duration-200 hover:-translate-y-1 hover:shadow-[9px_9px_0_#8D9B7D] md:flex-auto md:scroll-ml-0"
                >
                  {/* Schedule header */}
                  <div className="flex min-h-14 items-center justify-between gap-3 border-b-2 border-[#1E1E1E] bg-[#1E1E1E] px-4 py-3 sm:px-5">
                    <div className="border border-white/25 bg-white px-3 py-1 font-mono text-[10px] font-black uppercase tracking-wider text-[#1E1E1E] shadow-[2px_2px_0_#8D9B7D]">
                      {meal.day ? meal.day.toUpperCase() : meal.code}
                    </div>
                    {meal.menuDate && (
                      <div className="inline-flex items-center gap-1.5 font-mono text-[9px] font-black uppercase tracking-wide text-white/80">
                        <CalendarDays size={11} aria-hidden="true" />
                        {formatMenuDate(
                          meal.menuDate,
                          language === "ID" ? "id-ID" : "en-GB",
                        )}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="flex min-h-0 flex-1 flex-col p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#6B7860] block mb-1">
                          {meal.code || "CPL-MENU"} • {meal.batch || "BATCH 01"}
                        </span>
                        <h3 className="font-display text-xl sm:text-2xl font-black uppercase tracking-tight text-[#1E1E1E] line-clamp-2 min-h-[3.25rem] flex items-center">
                          {meal.name}
                        </h3>
                      </div>
                      <span className="shrink-0 bg-[#E1ECD3] border border-[#1E1E1E] px-2.5 py-1 font-mono text-[10px] font-extrabold text-[#1E1E1E] mt-4">
                        {formatNutritionValue(nutrition.kcal, nutritionLocale)} KCAL
                      </span>
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-[#1E1E1E]/80">
                      {description || "Dibuat dengan spesifikasi nutrisi lengkap tinggi protein."}
                    </p>

                    <fieldset className="mt-4">
                      <legend className="font-mono text-[9px] font-black uppercase tracking-wider text-[#6B7860]">
                        {language === "ID" ? "Pilih kategori protein" : "Choose protein tier"}
                      </legend>
                      <div
                        className="mt-2 grid grid-cols-5 border-2 border-[#1E1E1E]"
                        role="radiogroup"
                        aria-label={`${language === "ID" ? "Kategori protein" : "Protein tier"}: ${meal.name}`}
                      >
                        {availableTiers.map((tier) => {
                          const isSelected = selectedTier === tier;
                          return (
                            <button
                              key={tier}
                              type="button"
                              role="radio"
                              aria-checked={isSelected}
                              onClick={() =>
                                setSelectedTiers((current) => ({
                                  ...current,
                                  [meal.id]: tier,
                                }))
                              }
                              className={`min-h-11 border-r border-[#1E1E1E] px-1 font-mono text-[9px] font-black last:border-r-0 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8D9B7D] focus-visible:ring-inset sm:text-[10px] ${isSelected ? "bg-[#1E1E1E] text-white" : "bg-white hover:bg-[#E1ECD3]"}`}
                            >
                              {tier}g
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>

                    {/* Tags */}
                    {tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5 min-h-[1.75rem] items-center">
                        {tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-[#FEFDF9] border border-[#1E1E1E]/30 px-2 py-0.5 font-mono text-[9px] font-bold text-[#1E1E1E]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Nutrition Facts Specs Box */}
                    <div className="mt-auto pt-4 border-t border-[#1E1E1E]/15">
                      <div className="border-2 border-[#1E1E1E] bg-[#FEFDF9] p-3 space-y-2">
                        <div className="border-b border-[#1E1E1E]/20 pb-1.5 font-mono text-[9px] font-black uppercase tracking-wider text-[#6B7860]">
                          <span>LAB NUTRITION SPECS</span>
                        </div>

                        {/* Macros Grid */}
                        <div className="grid grid-cols-4 gap-1 text-center font-display">
                          <div className="border border-[#1E1E1E] bg-white p-1">
                            <div className="text-[7.5px] font-mono font-bold uppercase text-gray-500">PROTEIN</div>
                            <div className="text-xs font-black text-[#6B7860] mt-0.5">{formatNutritionValue(nutrition.protein, nutritionLocale)}g</div>
                          </div>
                          <div className="border border-[#1E1E1E] bg-white p-1">
                            <div className="text-[7.5px] font-mono font-bold uppercase text-gray-500">CARBS</div>
                            <div className="text-xs font-black text-[#1E1E1E] mt-0.5">{formatNutritionValue(nutrition.carbs, nutritionLocale)}g</div>
                          </div>
                          <div className="border border-[#1E1E1E] bg-white p-1">
                            <div className="text-[7.5px] font-mono font-bold uppercase text-gray-500">FAT</div>
                            <div className="text-xs font-black text-[#1E1E1E] mt-0.5">{formatNutritionValue(nutrition.fat, nutritionLocale)}g</div>
                          </div>
                          <div className="border border-[#1E1E1E] bg-white p-1">
                            <div className="text-[7.5px] font-mono font-bold uppercase text-gray-500">FIBER</div>
                            <div className="text-xs font-black text-[#1E1E1E] mt-0.5">{formatNutritionValue(nutrition.fiber, nutritionLocale)}g</div>
                          </div>
                        </div>

                        {/* Micros Grid */}
                        <div className="grid grid-cols-2 gap-1.5 font-mono text-[9px]">
                          <div className="border border-[#1E1E1E]/40 bg-white px-2 py-1 flex items-center justify-between">
                            <span className="text-gray-500 font-bold">SODIUM</span>
                            <span className="font-extrabold text-[#1E1E1E]">{formatNutritionValue(nutrition.sodium, nutritionLocale)}mg</span>
                          </div>
                          <div className="border border-[#1E1E1E]/40 bg-white px-2 py-1 flex items-center justify-between">
                            <span className="text-gray-500 font-bold">POTASSIUM</span>
                            <span className="font-extrabold text-[#1E1E1E]">{formatNutritionValue(nutrition.potassium, nutritionLocale)}mg</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </Card>
              );
              })}
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 md:hidden">
              {menuItems.map((meal, index) => (
                <button
                  key={meal.id}
                  type="button"
                  onClick={() => scrollToMenu(index)}
                  aria-label={`${language === "ID" ? "Tampilkan menu" : "Show meal"} ${index + 1}`}
                  aria-current={index === activeMenuIndex ? "true" : undefined}
                  className="grid min-h-8 min-w-8 place-items-center"
                >
                  <span
                    aria-hidden="true"
                    className={`h-1.5 transition-all ${index === activeMenuIndex ? "w-8 bg-[#1E1E1E]" : "w-3 bg-[#1E1E1E]/20"}`}
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
