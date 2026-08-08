import React, { useState } from "react";
import { useCpl } from "../hooks/useCpl";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { ArrowRight, CalendarDays, RefreshCw } from "lucide-react";
import {
  formatMenuDate,
  getMenuNutritionForTier,
  PROTEIN_TIERS,
} from "../lib/menuService";
import { MenuGridSkeleton } from "./ui/loading";

export function ThisWeekMenuSection({ onSelectMeal, onOpenAdmin }) {
  const { menuItems, language, isAdminLoggedIn, fetchLatestMenus, loadingMenu } = useCpl();
  const [selectedTiers, setSelectedTiers] = useState({});

  return (
    <section
      id="this-week-menu"
      className="py-16 sm:py-24 bg-[#FEFDF9] border-b-2 border-[#1E1E1E] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[#1E1E1E]/20 pb-8">
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
          <MenuGridSkeleton className="lg:grid-cols-3" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
                `${nutrition.kcal} ${language === "ID" ? "Kkal" : "Kcal"}`,
              ];
              const description =
                language === "ID"
                  ? meal.desc_ID || meal.desc_EN || meal.desc || ""
                  : meal.desc_EN || meal.desc_ID || meal.desc || "";

              return (
                <Card
                  key={meal.id}
                  className="group grid h-full grid-rows-[auto_1fr] overflow-hidden rounded-none border-2 border-[#1E1E1E] bg-white shadow-[6px_6px_0_#1E1E1E] transition-all duration-200 hover:-translate-y-1 hover:shadow-[9px_9px_0_#8D9B7D]"
                >
                  {/* Image Container */}
                  <div className="relative h-52 overflow-hidden bg-[#1E1E1E] sm:h-60 border-b-2 border-[#1E1E1E]">
                    <img
                      src={meal.image}
                      alt={meal.name}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";
                      }}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Day / Code Badge */}
                    <div className="absolute left-3 top-3 bg-[#1E1E1E] text-white px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider shadow-[2px_2px_0_#8D9B7D] border border-white/20">
                      {meal.day ? meal.day.toUpperCase() : meal.code}
                    </div>
                    {meal.menuDate && (
                      <div className="absolute right-3 top-3 inline-flex items-center gap-1.5 border border-[#1E1E1E] bg-[#FEFDF9] px-2.5 py-1 font-mono text-[9px] font-black uppercase text-[#1E1E1E] shadow-[2px_2px_0_#8D9B7D]">
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
                        {nutrition.kcal} KCAL
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
                            <div className="text-xs font-black text-[#6B7860] mt-0.5">{nutrition.protein}g</div>
                          </div>
                          <div className="border border-[#1E1E1E] bg-white p-1">
                            <div className="text-[7.5px] font-mono font-bold uppercase text-gray-500">CARBS</div>
                            <div className="text-xs font-black text-[#1E1E1E] mt-0.5">{nutrition.carbs}g</div>
                          </div>
                          <div className="border border-[#1E1E1E] bg-white p-1">
                            <div className="text-[7.5px] font-mono font-bold uppercase text-gray-500">FAT</div>
                            <div className="text-xs font-black text-[#1E1E1E] mt-0.5">{nutrition.fat}g</div>
                          </div>
                          <div className="border border-[#1E1E1E] bg-white p-1">
                            <div className="text-[7.5px] font-mono font-bold uppercase text-gray-500">FIBER</div>
                            <div className="text-xs font-black text-[#1E1E1E] mt-0.5">{nutrition.fiber}g</div>
                          </div>
                        </div>

                        {/* Micros Grid */}
                        <div className="grid grid-cols-2 gap-1.5 font-mono text-[9px]">
                          <div className="border border-[#1E1E1E]/40 bg-white px-2 py-1 flex items-center justify-between">
                            <span className="text-gray-500 font-bold">SODIUM</span>
                            <span className="font-extrabold text-[#1E1E1E]">{nutrition.sodium}mg</span>
                          </div>
                          <div className="border border-[#1E1E1E]/40 bg-white px-2 py-1 flex items-center justify-between">
                            <span className="text-gray-500 font-bold">POTASSIUM</span>
                            <span className="font-extrabold text-[#1E1E1E]">{nutrition.potassium}mg</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button
                        onClick={() => onSelectMeal?.(selectedTier, meal)}
                        className="mt-4 min-h-11 w-full justify-between rounded-none border-2 border-[#1E1E1E] px-4 text-xs font-display font-extrabold uppercase shadow-[3px_3px_0_#1E1E1E] bg-[#8D9B7D] text-white hover:bg-[#6B7860]"
                      >
                        <span>
                          {language === "ID"
                            ? "PESAN MENU INI"
                            : "ORDER THIS MEAL"}
                        </span>
                        <ArrowRight size={15} />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
