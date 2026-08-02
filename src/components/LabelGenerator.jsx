import React, { useState } from 'react';
import { CplFlaskIcon } from './CplLogo';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import { Copy, Check, Info } from 'lucide-react';
import { useCpl } from '../context/CplContext';

const PRESET_MEALS = [
  {
    code: "CPL-014",
    name: "CHICKEN NANBAN",
    protein: 43,
    carbs: 46,
    fat: 18,
    kcal: 582,
    batch: "014",
    ingredients: "Sous-vide chicken breast, light greek tartar, purple rice, steamed edamame, microgreens.",
  },
  {
    code: "CPL-013",
    name: "SALMON TERIYAKI",
    protein: 46,
    carbs: 38,
    fat: 20,
    kcal: 612,
    batch: "013",
    ingredients: "Norwegian salmon fillet, organic quinoa, steamed broccoli florets, white sesame, glaze.",
  },
  {
    code: "CPL-015",
    name: "BEEF BULGOGI",
    protein: 41,
    carbs: 42,
    fat: 22,
    kcal: 598,
    batch: "015",
    ingredients: "Lean tenderloin beef strips, brown rice, fermented kimchi, roasted carrots, scallions.",
  },
  {
    code: "CPL-016",
    name: "CHICKPEA TIKKA",
    protein: 36,
    carbs: 52,
    fat: 14,
    kcal: 526,
    batch: "016",
    ingredients: "Organic chickpeas, coconut spiced tomato tikka curry, jasmine rice, roasted cauliflower.",
  },
  {
    code: "CPL-017",
    name: "PESTO CHICKEN BOWL",
    protein: 52,
    carbs: 30,
    fat: 16,
    kcal: 560,
    batch: "017",
    ingredients: "Grilled chicken breast, basil pumpkin seed pesto, chickpea pasta, cherry tomatoes, parmesan.",
  }
];

export function LabelGenerator({ onOpenOrder }) {
  const { t } = useCpl();
  const [activeTab, setActiveTab] = useState("preset");
  const [selectedPreset, setSelectedPreset] = useState(PRESET_MEALS[0]);
  const [customName, setCustomName] = useState("");
  const [protein, setProtein] = useState(PRESET_MEALS[0].protein);
  const [carbs, setCarbs] = useState(PRESET_MEALS[0].carbs);
  const [fat, setFat] = useState(PRESET_MEALS[0].fat);
  const [copied, setCopied] = useState(false);

  const isCustomMode = activeTab === "custom";
  const calculatedKcal = isCustomMode ? (protein * 4 + carbs * 4 + fat * 9) : selectedPreset.kcal;
  const currentCode = isCustomMode ? "CPL-CUSTOM" : selectedPreset.code;
  const currentTitle = isCustomMode ? (customName.toUpperCase() || "CUSTOM HIGH-PROTEIN MEAL") : selectedPreset.name;

  const handleSelectPreset = (meal) => {
    setSelectedPreset(meal);
    setProtein(meal.protein);
    setCarbs(meal.carbs);
    setFat(meal.fat);
  };

  const handleCopySpec = () => {
    const text = `CLEAN PLATE LAB PRODUCT SPEC\nItem: ${currentTitle} (${currentCode})\nProtein: ${protein}g | Carbs: ${carbs}g | Fat: ${fat}g | Calories: ${calculatedKcal} Kcal\nStandard: Good Food. Clear Data. Better You.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="label-generator" className="py-20 bg-[var(--cpl-cream)] border-b border-[var(--cpl-border-muted)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <Badge variant="default">
            <span>{t('labelEyebrow')}</span>
          </Badge>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-[var(--cpl-dark)]">
            {t('labelTitle')}
          </h2>
          <p className="text-base text-[var(--cpl-dark-muted)] font-normal">
            {t('labelSubtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Controls */}
          <div className="lg:col-span-6 space-y-6">
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="preset">{t('labelSelectMeal')}</TabsTrigger>
                <TabsTrigger value="custom">Custom Macro Builder</TabsTrigger>
              </TabsList>

              <TabsContent value="preset" className="space-y-3 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PRESET_MEALS.map((meal) => {
                    const isSelected = selectedPreset.code === meal.code;
                    return (
                      <Card
                        key={meal.code}
                        onClick={() => handleSelectPreset(meal)}
                        className={`p-4 cursor-pointer transition-all rounded-none ${
                          isSelected
                            ? 'border-2 border-[var(--cpl-sage)] bg-[var(--cpl-sage-light)]'
                            : 'border border-[var(--cpl-border-muted)] bg-[var(--cpl-white)] hover:border-[var(--cpl-dark)]'
                        }`}
                      >
                        <div className="flex justify-between items-center text-xs font-display font-extrabold text-[var(--cpl-sage-dark)]">
                          <span>{meal.code}</span>
                          <span className="font-bold text-[var(--cpl-dark)]">{meal.kcal} KCAL</span>
                        </div>
                        <div className="font-display font-extrabold text-sm uppercase text-[var(--cpl-dark)] mt-1">
                          {meal.name}
                        </div>
                        <div className="flex gap-3 text-xs text-[var(--cpl-dark-muted)] mt-2 font-mono">
                          <span>P: <strong className="text-[var(--cpl-sage-dark)]">{meal.protein}g</strong></span>
                          <span>C: <strong>{meal.carbs}g</strong></span>
                          <span>F: <strong>{meal.fat}g</strong></span>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="custom" className="space-y-5 bg-[var(--cpl-white)] p-6 border border-[var(--cpl-border-muted)] mt-4">
                <div>
                  <label className="block text-xs font-display font-bold uppercase tracking-widest text-[var(--cpl-dark)] mb-2">
                    Meal Title:
                  </label>
                  <Input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. ULTRA LEAN BISON BOWL"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-display font-bold text-[var(--cpl-dark)]">
                    <span>PROTEIN TARGET</span>
                    <span className="text-[var(--cpl-sage-dark)] font-extrabold">{protein}g</span>
                  </div>
                  <Slider min={20} max={75} step={1} value={[protein]} onValueChange={(val) => setProtein(val[0])} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-display font-bold text-[var(--cpl-dark)]">
                    <span>COMPLEX CARBS</span>
                    <span className="font-extrabold">{carbs}g</span>
                  </div>
                  <Slider min={10} max={90} step={1} value={[carbs]} onValueChange={(val) => setCarbs(val[0])} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-display font-bold text-[var(--cpl-dark)]">
                    <span>HEALTHY FATS</span>
                    <span className="font-extrabold">{fat}g</span>
                  </div>
                  <Slider min={5} max={45} step={1} value={[fat]} onValueChange={(val) => setFat(val[0])} />
                </div>
              </TabsContent>
            </Tabs>

            <Card className="p-4 bg-[var(--cpl-white)] text-xs space-y-2 rounded-none border border-[var(--cpl-border-muted)]">
              <div className="font-display font-bold uppercase tracking-wider text-[var(--cpl-dark)] flex items-center gap-1.5">
                <Info size={14} className="text-[var(--cpl-sage)]" />
                <span>{t('labelIngredients')}</span>
              </div>
              <p className="text-[var(--cpl-dark-muted)] leading-relaxed font-normal">
                {!isCustomMode ? selectedPreset.ingredients : "Custom lab formulation using CPL certified grass-fed proteins, organic complex grains, and cold-pressed fats."}
              </p>
            </Card>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleCopySpec}
                className="flex-1 flex items-center justify-center gap-2 rounded-full"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                <span>{copied ? "Copied Spec" : "Copy Macro Specs"}</span>
              </Button>

              <Button
                variant="default"
                onClick={onOpenOrder}
                className="flex-1 flex items-center justify-center gap-2 rounded-full bg-[#8A9C7A] hover:bg-[#647554] text-white"
              >
                <span>{t('labelInspectCta')}</span>
              </Button>
            </div>

          </div>

          {/* Right Live Label Display */}
          <div className="lg:col-span-6 flex justify-center sticky top-28">
            <div className="w-full max-w-md">
              
              {/* Exact CPL Guideline Label Card */}
              <div className="cpl-label-paper p-8 rounded-none border-2 border-[#1E1E1E] shadow-2xl relative">
                
                <div className="flex justify-between items-center border-b-2 border-[#1E1E1E] pb-3 mb-6">
                  <span className="font-extrabold text-base tracking-wider">{currentCode}</span>
                  <Badge variant="solid" className="px-3 py-1 text-xs font-extrabold uppercase tracking-widest bg-[#8A9C7A] text-white">
                    MEAL PREP
                  </Badge>
                </div>

                <h3 className="font-black text-4xl tracking-tight text-[#1E1E1E] uppercase leading-none mb-1">
                  {currentTitle}
                </h3>
                
                <p className="text-xs font-bold text-[#647554] tracking-widest uppercase mb-6">
                  MEAL PREP FOR A BETTER TOMORROW
                </p>

                {/* Macro Table Grid */}
                <div className="border-2 border-[#1E1E1E] mb-6 text-sm font-bold bg-white/40">
                  <div className="grid grid-cols-2 border-b border-[#1E1E1E] p-3">
                    <span className="text-gray-700">PROTEIN</span>
                    <span className="text-right text-[#8A9C7A] font-black text-base">{protein}g</span>
                  </div>
                  <div className="grid grid-cols-2 border-b border-[#1E1E1E] p-3 bg-white/60">
                    <span className="text-gray-700">CARBS</span>
                    <span className="text-right font-extrabold">{carbs}g</span>
                  </div>
                  <div className="grid grid-cols-2 border-b border-[#1E1E1E] p-3">
                    <span className="text-gray-700">FAT</span>
                    <span className="text-right font-extrabold">{fat}g</span>
                  </div>
                  <div className="grid grid-cols-2 p-3 bg-[#8A9C7A]/20">
                    <span className="text-[#1E1E1E] font-black">CALORIES</span>
                    <span className="text-right font-black text-base text-[#1E1E1E]">{calculatedKcal} KCAL</span>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-3 text-xs font-mono border-b-2 border-[#1E1E1E] pb-4 mb-4 text-gray-800 uppercase">
                  <div>
                    <div className="text-[9px] text-gray-500">PREPARED</div>
                    <div className="font-bold">TODAY</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-gray-500">USE BY</div>
                    <div className="font-bold">+3 DAYS</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-gray-500">BATCH</div>
                    <div className="font-bold">{isCustomMode ? "C-99" : selectedPreset.batch}</div>
                  </div>
                </div>

                {/* Stamp */}
                <div className="flex items-end justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <CplFlaskIcon size={28} color="#8A9C7A" />
                    <div className="text-[11px] font-black tracking-wider text-[#1E1E1E] uppercase leading-tight">
                      <div>REAL FOOD.</div>
                      <div>CLEAR DATA.</div>
                      <div>BETTER YOU.</div>
                    </div>
                  </div>

                  <div className="w-32">
                    <div className="barcode-strip" />
                    <div className="text-[9px] text-center font-mono mt-1 tracking-widest text-gray-800">
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
