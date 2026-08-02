import React from 'react';
import logoImg from '../assets/CPL_logo.jpg';

export function CplLogoImage({ size = 42, className = "" }) {
  return (
    <img 
      src={logoImg} 
      alt="Clean Plate Lab Logo" 
      className={`object-contain rounded-full border-2 border-[#8A9C7A] select-none shrink-0 shadow-sm ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export function CplIcon({ size = 32, className = "" }) {
  return <CplLogoImage size={size} className={className} />;
}

export function CplPrimaryLogo({ className = "", size = "normal" }) {
  const isLarge = size === "large";
  const imgSize = isLarge ? 50 : 38;

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <CplLogoImage size={imgSize} />
      <div className="flex flex-col justify-center leading-none">
        <div className={`font-display font-black tracking-tighter uppercase text-[#1E1E1E] ${isLarge ? 'text-2xl' : 'text-lg sm:text-xl'}`}>
          CLEAN PLATE LAB
        </div>
        <div className={`font-display font-bold uppercase tracking-widest mt-1 text-[#647554] ${isLarge ? 'text-xs' : 'text-[10px]'}`}>
          GOOD FOOD. CLEAR DATA. BETTER YOU.
        </div>
      </div>
    </div>
  );
}

export function CplBadgeLogo({ size = 90, className = "" }) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <img 
        src={logoImg} 
        alt="Clean Plate Lab Circular Badge" 
        className="object-contain rounded-full border-2 border-[#8A9C7A] shadow-md"
        style={{ width: size, height: size }}
      />
    </div>
  );
}

export function CplFlaskIcon({ size = 20, color = "#8A9C7A" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2v7.5L4.5 18a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 9.5V2" />
      <line x1="8.5" y1="2" x2="15.5" y2="2" />
      <path d="M8.5 14h7" />
    </svg>
  );
}
