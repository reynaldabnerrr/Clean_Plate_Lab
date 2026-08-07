import React, { useState } from "react";
import { CplFlaskIcon } from "./CplLogo";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Copy, Check, Info } from "lucide-react";
import { useCpl } from "../hooks/useCpl";

const PROTEIN_TIERS = [
  {
    g: 25,
    price: "Rp 25.000",
    label: "25g Protein Plan",
    carbs: 35,
    fat: 10,
    fiber: 0.1,
    sodium: 400,
    potassium: 120,
    kcal: 330,
  },
  {
    g: 60,
    price: "Rp 40.000",
    label: "60g Protein Plan",
    carbs: 85,
    fat: 20,
    fiber: 0.2,
    sodium: 780,
    potassium: 160,
    kcal: 760,
  },
  {
    g: 80,
    price: "Rp 50.000",
    label: "80g Protein Plan",
    carbs: 104.58,
    fat: 25.39,
    fiber: 0.25,
    sodium: 983.86,
    potassium: 193.01,
    kcal: 992.33,
    recommended: true,
  },
  {
    g: 100,
    price: "Rp 60.000",
    label: "100g Protein Plan",
    carbs: 160,
    fat: 32,
    fiber: 0.4,
    sodium: 1650,
    potassium: 420,
    kcal: 1328,
  },
];

export function LabelGenerator({ onOpenOrder }) {
  const { t } = useCpl();
  const [protein, setProtein] = useState(80.67);
  const [carbs, setCarbs] = useState(104.58);
  const [fat, setFat] = useState(25.39);
  const [fiber, setFiber] = useState(0.25);
  const [sodium, setSodium] = useState(983.86);
  const [potassium, setPotassium] = useState(193.01);
  const [customName, setCustomName] = useState("80g Protein Meal Box");
  const [copied, setCopied] = useState(false);

  const [labelTilt, setLabelTilt] = useState({ x: 0, y: 0 });
  const [isLabelHovered, setIsLabelHovered] = useState(false);

  const handleLabelMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -16;
    const rotateY = ((x - centerX) / centerX) * 16;
    setLabelTilt({ x: rotateX, y: rotateY });
  };

  const handleLabelMouseLeave = () => {
    setIsLabelHovered(false);
    setLabelTilt({ x: 0, y: 0 });
  };

  const handleLabelMouseEnter = () => {
    setIsLabelHovered(true);
  };

  const calculatedKcal =
    (protein === 80.67 || protein === 80) && carbs === 104.58
      ? 992.33
      : Math.round(protein * 4 + carbs * 4 + fat * 9);
  const currentCode = `CPL-${Math.round(protein)}G`;
  const currentTitle = customName.toUpperCase() || "CUSTOM HIGH-PROTEIN MEAL";

  const handleSelectTier = (tier) => {
    setProtein(tier.g);
    setCarbs(tier.carbs);
    setFat(tier.fat);
    setFiber(tier.fiber || 0);
    setSodium(tier.sodium);
    setPotassium(tier.potassium);
    setCustomName(`${tier.g}g Protein Meal Box`);
  };

  const handleCopySpec = () => {
    const text = `${t("labelSpecTitle")}\nItem: ${currentTitle} (${currentCode})\nProtein: ${protein}g | Carbs: ${carbs}g | Fat: ${fat}g | ${t("heroSodium")}: ${sodium}mg | ${t("heroPotassium")}: ${potassium}mg | Calories: ${calculatedKcal} Kcal\n${t("labelStandardStr")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="label-generator"
      className="py-16 sm:py-20 bg-[var(--cpl-cream)] border-b border-[var(--cpl-border-muted)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-3">
          <Badge variant="default">
            <span>{t("labelEyebrow")}</span>
          </Badge>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-[var(--cpl-dark)]">
            {t("labelTitle")}
          </h2>
          <p className="text-sm sm:text-base text-[var(--cpl-dark-muted)] font-normal">
            {t("labelSubtitle")}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Controls */}
          <div className="lg:col-span-6 space-y-6">
            <Card className="p-4 sm:p-5 bg-[var(--cpl-white)] border border-[var(--cpl-border-muted)] space-y-4 rounded-2xl shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-xs font-display font-extrabold uppercase text-[var(--cpl-dark)]">
                  {t("labelCustomBuilder")}
                </span>
                <Badge
                  variant="solid"
                  className="bg-[#8D9B7D] text-white rounded-full px-3 py-1"
                >
                  {t("labelMainTierBadge")}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {PROTEIN_TIERS.map((tier) => (
                  <Card
                    key={tier.g}
                    onClick={() => handleSelectTier(tier)}
                    className={`p-3.5 cursor-pointer transition-all border-2 text-center rounded-xl relative ${
                      protein === tier.g
                        ? "border-[#1E1E1E] bg-[#E1ECD3] shadow-[2px_2px_0px_0px_#1E1E1E]"
                        : "border-gray-200 bg-white hover:border-[#8D9B7D]"
                    }`}
                  >
                    {tier.recommended && (
                      <span className="absolute -top-2.5 right-2 bg-[#8D9B7D] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
                        {t("labelRecommended")}
                      </span>
                    )}
                    <div className="text-sm font-display font-black text-[#1E1E1E]">
                      {tier.g}g Protein
                    </div>
                    <div className="text-xs font-extrabold text-[#6B7860] mt-0.5">
                      {tier.price}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            <Card className="p-4 sm:p-5 bg-[var(--cpl-white)] border border-[var(--cpl-border-muted)] space-y-2 rounded-2xl text-xs shadow-sm">
              <div className="font-display font-bold uppercase tracking-wider text-[var(--cpl-dark)] flex items-center gap-1.5">
                <Info size={14} className="text-[var(--cpl-sage)] shrink-0" />
                <span>{t("labelIngredients")}</span>
              </div>
              <p className="text-[var(--cpl-dark-muted)] leading-relaxed font-normal">
                {t("labelCustomDesc")}
              </p>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={handleCopySpec}
                className="flex-1 flex items-center justify-center gap-2 rounded-full min-h-[44px]"
              >
                {copied ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <Copy size={16} />
                )}
                <span>
                  {copied ? t("labelCopiedSpec") : t("labelCopySpec")}
                </span>
              </Button>

              <Button
                variant="default"
                onClick={onOpenOrder}
                className="flex-1 flex items-center justify-center gap-2 rounded-full bg-[#8D9B7D] hover:bg-[#6B7860] text-white min-h-[44px]"
              >
                <span>{t("labelInspectCta")}</span>
              </Button>
            </div>
          </div>

          {/* Right Live Label Display with 3D Motion */}
          <div className="lg:col-span-6 flex justify-center lg:sticky lg:top-28">
            <div
              onMouseMove={handleLabelMouseMove}
              onMouseEnter={handleLabelMouseEnter}
              onMouseLeave={handleLabelMouseLeave}
              className="w-full max-w-md cursor-pointer group"
              style={{ perspective: "1000px" }}
            >
              {/* CPL Guideline Label Card with Continuous 3D Motion & Gloss Sheen */}
              <div
                style={{
                  transform: isLabelHovered
                    ? `rotateX(${labelTilt.x}deg) rotateY(${labelTilt.y}deg) scale3d(1.03, 1.03, 1.03)`
                    : undefined,
                  transition: isLabelHovered
                    ? "transform 0.1s ease-out, box-shadow 0.3s ease"
                    : "transform 0.5s ease-out, box-shadow 0.5s ease",
                  boxShadow: isLabelHovered
                    ? "0 25px 50px -12px rgba(0, 0, 0, 0.3)"
                    : "0 10px 25px -5px rgba(0, 0, 0, 0.12)",
                }}
                className={`cpl-label-paper p-5 sm:p-8 rounded-none border-2 border-[#1E1E1E] bg-[#FEFDF9] relative transition-all duration-300 ${!isLabelHovered ? "cpl-3d-idle-float" : ""}`}
              >
                {/* Glossy Sheen Reflection Pass */}
                <div className="cpl-gloss-sheen" />

                <div className="flex justify-between items-center border-b-2 border-[#1E1E1E] pb-3 mb-5 sm:mb-6">
                  <span className="font-extrabold text-sm sm:text-base tracking-wider">
                    {currentCode}
                  </span>
                  <Badge
                    variant="solid"
                    className="px-2.5 py-1 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest bg-[#8D9B7D] text-white"
                  >
                    MEAL PREP
                  </Badge>
                </div>

                <h3 className="font-black text-2xl sm:text-4xl tracking-tight text-[#1E1E1E] uppercase leading-tight sm:leading-none mb-1 break-words">
                  {currentTitle}
                </h3>

                <p className="text-[10px] sm:text-xs font-bold text-[#6B7860] tracking-widest uppercase mb-5 sm:mb-6">
                  {t("heroLabelSub")}
                </p>

                {/* Macro Table Grid */}
                <div className="border-2 border-[#1E1E1E] mb-5 sm:mb-6 text-xs sm:text-sm font-bold bg-white/80">
                  <div className="grid grid-cols-2 border-b border-[#1E1E1E] p-2 sm:p-2.5">
                    <span className="text-gray-700">{t("heroProtein")}</span>
                    <span className="text-right text-[#8D9B7D] font-black text-sm sm:text-base">
                      {protein}g
                    </span>
                  </div>
                  <div className="grid grid-cols-2 border-b border-[#1E1E1E] p-2 sm:p-2.5 bg-white/60">
                    <span className="text-gray-700">{t("heroCarbs")}</span>
                    <span className="text-right font-extrabold">{carbs}g</span>
                  </div>
                  <div className="grid grid-cols-2 border-b border-[#1E1E1E] p-2 sm:p-2.5">
                    <span className="text-gray-700">{t("heroFat")}</span>
                    <span className="text-right font-extrabold">{fat}g</span>
                  </div>
                  <div className="grid grid-cols-2 border-b border-[#1E1E1E] p-2 sm:p-2.5 bg-white/60">
                    <span className="text-gray-700">{t("heroFiber")}</span>
                    <span className="text-right font-extrabold">{fiber}g</span>
                  </div>
                  <div className="grid grid-cols-2 border-b border-[#1E1E1E] p-2 sm:p-2.5">
                    <span className="text-gray-700">{t("heroSodium")}</span>
                    <span className="text-right font-extrabold">
                      {sodium} mg
                    </span>
                  </div>
                  <div className="grid grid-cols-2 border-b border-[#1E1E1E] p-2 sm:p-2.5 bg-white/60">
                    <span className="text-gray-700">{t("heroPotassium")}</span>
                    <span className="text-right font-extrabold">
                      {potassium} mg
                    </span>
                  </div>
                  <div className="grid grid-cols-2 p-2 sm:p-2.5 bg-[#8D9B7D]/20">
                    <span className="text-[#1E1E1E] font-black">
                      {t("heroCalories")}
                    </span>
                    <span className="text-right font-black text-sm sm:text-base text-[#1E1E1E]">
                      {calculatedKcal} KCAL
                    </span>
                  </div>
                </div>

                {/* Neat Label Info Badges */}
                <div className="flex flex-wrap items-center justify-between gap-1.5 border-b-2 border-[#1E1E1E] pb-3 sm:pb-4 mb-4 text-[9px] sm:text-[10px] font-mono font-bold text-gray-800 uppercase tracking-tight">
                  <span className="bg-white/90 border border-[#1E1E1E]/30 px-2 py-1 rounded shadow-xs">
                    100% FRESH HOMEMADE
                  </span>
                  <span className="bg-white/90 border border-[#1E1E1E]/30 px-2 py-1 rounded shadow-xs">
                    FOOD-GRADE SAFE
                  </span>
                  <span className="bg-white/90 border border-[#1E1E1E]/30 px-2 py-1 rounded shadow-xs">
                    REHEAT 30-45S
                  </span>
                </div>

                {/* Stamp */}
                <div className="flex items-end justify-between pt-1 sm:pt-2">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <CplFlaskIcon
                      size={24}
                      color="#8D9B7D"
                      className="sm:w-7 sm:h-7"
                    />
                    <div className="text-[9px] sm:text-[11px] font-black tracking-wider text-[#1E1E1E] uppercase leading-tight">
                      <div>{t("heroTitle1")}</div>
                      <div>{t("heroTitle2")}</div>
                      <div>{t("heroTitle3")}</div>
                    </div>
                  </div>

                  <div className="w-24 sm:w-32">
                    <div className="barcode-strip" />
                    <div className="text-[8px] sm:text-[9px] text-center font-mono mt-1 tracking-widest text-gray-800">
                      {currentCode}-2026
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
