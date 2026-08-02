import React, { useState } from 'react';
import { CplPrimaryLogo, CplBadgeLogo, CplIcon } from './CplLogo';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Palette, Type, Layers } from 'lucide-react';

export function BrandGuidelineModal({ isOpen, onClose }) {
  const [copiedColor, setCopiedColor] = useState(null);

  const colorPalette = [
    { name: "Primary Sage Green", hex: "#8A9C7A", usage: "Brand accents, high-protein badges, active indicators" },
    { name: "Light Warm Cream", hex: "#F5F2EA", usage: "Primary background, editorial card surface" },
    { name: "Sand Neutral", hex: "#D6C7B0", usage: "Secondary accents, kraft packaging highlights" },
    { name: "Carbon Black", hex: "#1E1E1E", usage: "Primary display typography, hairline borders, text" },
  ];

  const handleCopy = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[var(--cpl-cream)] text-[var(--cpl-dark)] p-6 sm:p-10 space-y-6">
        
        <DialogHeader className="border-b-2 border-[var(--cpl-dark)] pb-4">
          <Badge variant="default" className="w-fit mb-2">
            <span>Official Identity System</span>
          </Badge>
          <DialogTitle className="text-3xl sm:text-4xl font-extrabold uppercase">
            CLEAN PLATE LAB BRAND GUIDELINES
          </DialogTitle>
          <DialogDescription className="text-xs font-mono uppercase tracking-widest text-[var(--cpl-sage-dark)]">
            Reference Specification • CPL_Guideline.JPG
          </DialogDescription>
        </DialogHeader>

        {/* 1. Logo Variants */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-display font-extrabold uppercase tracking-widest text-[var(--cpl-dark)]">
            <Layers size={16} className="text-[var(--cpl-sage)]" />
            <span>1. Logo & Mark System</span>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-6 bg-[var(--cpl-white)] flex flex-col items-center justify-between text-center rounded-none">
              <span className="text-[10px] font-mono text-gray-400 uppercase mb-4">PRIMARY LOGO</span>
              <div className="my-4">
                <CplPrimaryLogo color="#1E1E1E" size="normal" />
              </div>
              <span className="text-[10px] font-mono text-gray-500 mt-2">Stacked Bold Typography</span>
            </Card>

            <Card className="p-6 bg-[var(--cpl-white)] flex flex-col items-center justify-between text-center rounded-none">
              <span className="text-[10px] font-mono text-gray-400 uppercase mb-4">SECONDARY LOGO BADGE</span>
              <div className="my-2">
                <CplBadgeLogo size={100} color="#8A9C7A" />
              </div>
              <span className="text-[10px] font-mono text-gray-500 mt-2">Double Circular Stamp</span>
            </Card>

            <Card className="p-6 bg-[var(--cpl-white)] flex flex-col items-center justify-between text-center rounded-none">
              <span className="text-[10px] font-mono text-gray-400 uppercase mb-4">CONCENTRIC ICON</span>
              <div className="my-6">
                <CplIcon size={64} color="#8A9C7A" />
              </div>
              <span className="text-[10px] font-mono text-gray-500 mt-2">Concentric Plate Target</span>
            </Card>
          </div>
        </div>

        {/* 2. Color Palette */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-display font-extrabold uppercase tracking-widest text-[var(--cpl-dark)]">
            <Palette size={16} className="text-[var(--cpl-sage)]" />
            <span>2. Color Palette Swatches</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {colorPalette.map((color) => (
              <Card 
                key={color.hex}
                onClick={() => handleCopy(color.hex)}
                className="p-4 bg-[var(--cpl-white)] hover:border-[var(--cpl-dark)] cursor-pointer transition-all space-y-2 rounded-none"
              >
                <div 
                  className="h-16 w-full rounded border border-black/10 flex items-end justify-end p-2"
                  style={{ backgroundColor: color.hex }}
                >
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-white/90 text-black">
                    {copiedColor === color.hex ? "COPIED!" : color.hex}
                  </span>
                </div>

                <div className="font-display text-xs font-extrabold uppercase text-[var(--cpl-dark)]">
                  {color.name}
                </div>
                <div className="text-[10px] text-[var(--cpl-dark-muted)] leading-tight">
                  {color.usage}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 3. Typography */}
        <Card className="p-6 bg-[var(--cpl-white)] border-2 border-[var(--cpl-dark)] space-y-4 rounded-none">
          <div className="flex items-center gap-2 text-xs font-display font-extrabold uppercase tracking-widest text-[var(--cpl-dark)]">
            <Type size={16} className="text-[var(--cpl-sage)]" />
            <span>3. Typography System</span>
          </div>

          <div className="space-y-3">
            <div className="border-b border-[var(--cpl-border-light)] pb-2">
              <div className="text-[10px] font-mono text-gray-400">PRIMARY DISPLAY FONT</div>
              <div className="font-display font-extrabold text-2xl uppercase tracking-tighter text-[var(--cpl-dark)]">
                Neue Haas Grotesk Display Pro / Space Grotesk
              </div>
              <div className="text-xs text-[var(--cpl-dark-muted)]">
                ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789 - _ . : : ! ? ( ) / %
              </div>
            </div>

            <div>
              <div className="text-[10px] font-mono text-gray-400">BODY & DATA TABLES</div>
              <div className="font-sans font-semibold text-sm text-[var(--cpl-dark)]">
                Plus Jakarta Sans (Regular, SemiBold, Bold)
              </div>
              <div className="text-xs text-[var(--cpl-dark-muted)]">
                Real food. Clear data. Better you. Thoughtful meals. Clear choices. A better tomorrow.
              </div>
            </div>
          </div>
        </Card>

        <div className="flex justify-end pt-2">
          <Button variant="dark" onClick={onClose}>
            Close Guidelines
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
