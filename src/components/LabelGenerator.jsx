import React, { useState } from 'react';
import { CplFlaskIcon } from './CplLogo';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Copy, Check, Info } from 'lucide-react';
import { useCpl } from '../context/CplContext';

const PRESET_MEALS = [
  {
    code: "CPL-MON",
    name: "JAPANESE YAKITORI CHICKEN",
    protein: 45,
    carbs: 42,
    fat: 14,
    kcal: 474,
    batch: "MON-01",
    ingredients_ID: "Dada ayam panggang saus yakitori, nasi putih, telur mata sapi, biji wijen.",
    ingredients_EN: "Grilled chicken breast with yakitori sauce, white rice, fried egg, sesame seeds.",
  },
  {
    code: "CPL-TUE",
    name: "CRISPY CHILI GARLIC CHICKEN",
    protein: 44,
    carbs: 40,
    fat: 15,
    kcal: 471,
    batch: "TUE-02",
    ingredients_ID: "Ayam cabai garam renyah, bawang putih cincang, nasi putih, telur, sambal tempe buatan.",
    ingredients_EN: "Crispy garlic chili chicken, minced garlic, white rice, egg, homemade sambal tempe.",
  },
  {
    code: "CPL-WED",
    name: "JAPANESE CHICKEN NANBAN",
    protein: 46,
    carbs: 44,
    fat: 16,
    kcal: 504,
    batch: "WED-03",
    ingredients_ID: "Ayam airfried renyah, saus nanban khas Jepang, nasi putih, telur, irisan daun bawang.",
    ingredients_EN: "Crispy airfried chicken, Japanese nanban sauce, white rice, egg, sliced scallions.",
  },
  {
    code: "CPL-THU",
    name: "OYSTER GLAZED CHICKEN",
    protein: 45,
    carbs: 38,
    fat: 14,
    kcal: 458,
    batch: "THU-04",
    ingredients_ID: "Dada ayam empuk saus tiram, nasi putih, telur, tempe bakar gurih.",
    ingredients_EN: "Tender chicken in oyster sauce glaze, white rice, egg, grilled savory tempe.",
  },
  {
    code: "CPL-FRI",
    name: "CREAMY CURRY CHICKEN",
    protein: 43,
    carbs: 45,
    fat: 17,
    kcal: 505,
    batch: "FRI-05",
    ingredients_ID: "Dada ayam empuk kari creamy, rempah rempah khas, nasi putih, telur mata sapi.",
    ingredients_EN: "Tender chicken simmered in rich creamy curry sauce, spices, white rice, egg.",
  },
  {
    code: "CPL-SAT",
    name: "CRISPY GARLIC CHICKEN",
    protein: 45,
    carbs: 42,
    fat: 15,
    kcal: 483,
    batch: "SAT-06",
    ingredients_ID: "Ayam goreng renyah keemasan, bawang putih gurih, nasi putih, telur, tempe orek.",
    ingredients_EN: "Golden crispy garlic chicken, fragrant garlic, white rice, egg, sweet savory tempe orek.",
  }
];

export function LabelGenerator({ onOpenOrder }) {
  const { language, t } = useCpl();
  const [activeTab, setActiveTab] = useState("custom");
  const [selectedPreset, setSelectedPreset] = useState(PRESET_MEALS[0]);
  const [customName, setCustomName] = useState("25g Protein Meal Box");
  const [protein, setProtein] = useState(25);
  const [carbs, setCarbs] = useState(35);
  const [fat, setFat] = useState(10);
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

  const isCustomMode = activeTab === "custom";
  const calculatedKcal = isCustomMode ? (protein * 4 + carbs * 4 + fat * 9) : selectedPreset.kcal;
  const currentCode = isCustomMode ? `CPL-${protein}G` : selectedPreset.code;
  const currentTitle = isCustomMode ? (customName.toUpperCase() || "CUSTOM HIGH-PROTEIN MEAL") : selectedPreset.name;

  const handleSelectPreset = (meal) => {
    setSelectedPreset(meal);
    setProtein(meal.protein);
    setCarbs(meal.carbs);
    setFat(meal.fat);
  };

  const handleCopySpec = () => {
    const text = `${t('labelSpecTitle')}\nItem: ${currentTitle} (${currentCode})\nProtein: ${protein}g | Carbs: ${carbs}g | Fat: ${fat}g | Calories: ${calculatedKcal} Kcal\n${t('labelStandardStr')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="label-generator" className="py-16 sm:py-20 bg-[var(--cpl-cream)] border-b border-[var(--cpl-border-muted)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-3">
          <Badge variant="default">
            <span>{t('labelEyebrow')}</span>
          </Badge>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-[var(--cpl-dark)]">
            {t('labelTitle')}
          </h2>
          <p className="text-sm sm:text-base text-[var(--cpl-dark-muted)] font-normal">
            {t('labelSubtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Controls */}
          <div className="lg:col-span-6 space-y-6">
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 w-full rounded-2xl p-1 bg-[#F0EAE1]">
                <TabsTrigger value="custom" className="rounded-xl font-extrabold">{t('labelCustomBuilder')}</TabsTrigger>
                <TabsTrigger value="preset" className="rounded-xl font-extrabold">{t('labelSelectMeal')}</TabsTrigger>
              </TabsList>

              <TabsContent value="preset" className="space-y-3 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PRESET_MEALS.map((meal) => {
                    const isSelected = selectedPreset.code === meal.code;
                    return (
                      <Card
                        key={meal.code}
                        onClick={() => handleSelectPreset(meal)}
                        className={`p-3.5 sm:p-4 cursor-pointer transition-all rounded-xl ${
                          isSelected
                            ? 'border-2 border-[var(--cpl-sage)] bg-[var(--cpl-sage-light)] shadow-md'
                            : 'border border-[var(--cpl-border-muted)] bg-[var(--cpl-white)] hover:border-[var(--cpl-dark)]'
                        }`}
                      >
                        <div className="flex justify-between items-center text-xs font-display font-extrabold text-[var(--cpl-sage-dark)]">
                          <span>{meal.code}</span>
                          <span className="text-[var(--cpl-dark-muted)] text-[10px] font-mono">{meal.kcal} KCAL</span>
                        </div>
                        <h4 className="font-display font-extrabold text-sm uppercase text-[var(--cpl-dark)] mt-1">{meal.name}</h4>
                        <div className="flex gap-2 text-xs font-bold text-[var(--cpl-dark-muted)] mt-2 pt-2 border-t border-[var(--cpl-border-light)]">
                          <span className="text-[var(--cpl-sage-dark)] font-extrabold">{meal.protein}g Protein</span>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="custom" className="space-y-4 mt-4">
                <Card className="p-4 sm:p-5 bg-[var(--cpl-white)] border border-[var(--cpl-border-muted)] space-y-4 rounded-2xl shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-display font-extrabold uppercase text-[var(--cpl-dark)]">Pilih Porsi Protein Resmi CPL</span>
                    <Badge variant="solid" className="bg-[#8A9C7A] text-white rounded-full px-3 py-1">4 Paket Porsi</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { g: 25, price: "Rp 25.000", label: "25g Protein Plan" },
                      { g: 60, price: "Rp 40.000", label: "60g Protein Plan" },
                      { g: 80, price: "Rp 50.000", label: "80g Protein Plan" },
                      { g: 100, price: "Rp 60.000", label: "100g Protein Plan" },
                    ].map((tier) => (
                      <Card
                        key={tier.g}
                        onClick={() => {
                          setProtein(tier.g);
                          setCustomName(`${tier.g}g Protein Meal Box`);
                        }}
                        className={`p-3.5 cursor-pointer transition-all border-2 text-center rounded-xl ${
                          protein === tier.g
                            ? 'border-[#1E1E1E] bg-[#EBF0E6] shadow-[2px_2px_0px_0px_#1E1E1E]'
                            : 'border-gray-200 bg-white hover:border-[#8A9C7A]'
                        }`}
                      >
                        <div className="text-sm font-display font-black text-[#1E1E1E]">{tier.g}g Protein</div>
                        <div className="text-xs font-extrabold text-[#647554] mt-0.5">{tier.price}</div>
                      </Card>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>

            <Card className="p-4 sm:p-5 bg-[var(--cpl-white)] border border-[var(--cpl-border-muted)] space-y-2 rounded-2xl text-xs shadow-sm">
              <div className="font-display font-bold uppercase tracking-wider text-[var(--cpl-dark)] flex items-center gap-1.5">
                <Info size={14} className="text-[var(--cpl-sage)] shrink-0" />
                <span>{t('labelIngredients')}</span>
              </div>
              <p className="text-[var(--cpl-dark-muted)] leading-relaxed font-normal">
                {!isCustomMode 
                  ? (language === 'ID' ? selectedPreset.ingredients_ID : selectedPreset.ingredients_EN) 
                  : t('labelCustomDesc')}
              </p>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={handleCopySpec}
                className="flex-1 flex items-center justify-center gap-2 rounded-full min-h-[44px]"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                <span>{copied ? t('labelCopiedSpec') : t('labelCopySpec')}</span>
              </Button>

              <Button
                variant="default"
                onClick={onOpenOrder}
                className="flex-1 flex items-center justify-center gap-2 rounded-full bg-[#8A9C7A] hover:bg-[#647554] text-white min-h-[44px]"
              >
                <span>{t('labelInspectCta')}</span>
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
              style={{ perspective: '1000px' }}
            >
              
              {/* CPL Guideline Label Card with Continuous 3D Motion & Gloss Sheen */}
              <div 
                style={{
                  transform: isLabelHovered 
                    ? `rotateX(${labelTilt.x}deg) rotateY(${labelTilt.y}deg) scale3d(1.03, 1.03, 1.03)` 
                    : undefined,
                  transition: isLabelHovered ? 'transform 0.1s ease-out, box-shadow 0.3s ease' : 'transform 0.5s ease-out, box-shadow 0.5s ease',
                  boxShadow: isLabelHovered ? '0 25px 50px -12px rgba(0, 0, 0, 0.3)' : '0 10px 25px -5px rgba(0, 0, 0, 0.12)'
                }}
                className={`cpl-label-paper p-5 sm:p-8 rounded-none border-2 border-[#1E1E1E] bg-[#F5F2EA] relative transition-all duration-300 ${!isLabelHovered ? 'cpl-3d-idle-float' : ''}`}
              >
                {/* Glossy Sheen Reflection Pass */}
                <div className="cpl-gloss-sheen" />
                
                <div className="flex justify-between items-center border-b-2 border-[#1E1E1E] pb-3 mb-5 sm:mb-6">
                  <span className="font-extrabold text-sm sm:text-base tracking-wider">{currentCode}</span>
                  <Badge variant="solid" className="px-2.5 py-1 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest bg-[#8A9C7A] text-white">
                    MEAL PREP
                  </Badge>
                </div>

                <h3 className="font-black text-2xl sm:text-4xl tracking-tight text-[#1E1E1E] uppercase leading-tight sm:leading-none mb-1 break-words">
                  {currentTitle}
                </h3>
                
                <p className="text-[10px] sm:text-xs font-bold text-[#647554] tracking-widest uppercase mb-5 sm:mb-6">
                  {t('heroLabelSub')}
                </p>

                {/* Macro Table Grid */}
                <div className="border-2 border-[#1E1E1E] mb-5 sm:mb-6 text-xs sm:text-sm font-bold bg-white/80">
                  <div className="grid grid-cols-2 border-b border-[#1E1E1E] p-2.5 sm:p-3">
                    <span className="text-gray-700">{t('heroProtein')}</span>
                    <span className="text-right text-[#8A9C7A] font-black text-sm sm:text-base">{protein}g</span>
                  </div>
                  <div className="grid grid-cols-2 border-b border-[#1E1E1E] p-2.5 sm:p-3 bg-white/60">
                    <span className="text-gray-700">{t('heroCarbs')}</span>
                    <span className="text-right font-extrabold">{carbs}g</span>
                  </div>
                  <div className="grid grid-cols-2 border-b border-[#1E1E1E] p-2.5 sm:p-3">
                    <span className="text-gray-700">{t('heroFat')}</span>
                    <span className="text-right font-extrabold">{fat}g</span>
                  </div>
                  <div className="grid grid-cols-2 p-2.5 sm:p-3 bg-[#8A9C7A]/20">
                    <span className="text-[#1E1E1E] font-black">{t('heroCalories')}</span>
                    <span className="text-right font-black text-sm sm:text-base text-[#1E1E1E]">{calculatedKcal} KCAL</span>
                  </div>
                </div>

                {/* Neat Label Info Badges */}
                <div className="flex flex-wrap items-center justify-between gap-1.5 border-b-2 border-[#1E1E1E] pb-3 sm:pb-4 mb-4 text-[9px] sm:text-[10px] font-mono font-bold text-gray-800 uppercase tracking-tight">
                  <span className="bg-white/90 border border-[#1E1E1E]/30 px-2 py-1 rounded shadow-xs">100% FRESH HOMEMADE</span>
                  <span className="bg-white/90 border border-[#1E1E1E]/30 px-2 py-1 rounded shadow-xs">FOOD-GRADE SAFE</span>
                  <span className="bg-white/90 border border-[#1E1E1E]/30 px-2 py-1 rounded shadow-xs">REHEAT 30-45S</span>
                </div>

                {/* Stamp */}
                <div className="flex items-end justify-between pt-1 sm:pt-2">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <CplFlaskIcon size={24} color="#8A9C7A" className="sm:w-7 sm:h-7" />
                    <div className="text-[9px] sm:text-[11px] font-black tracking-wider text-[#1E1E1E] uppercase leading-tight">
                      <div>{t('heroTitle1')}</div>
                      <div>{t('heroTitle2')}</div>
                      <div>{t('heroTitle3')}</div>
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
