import React from 'react';
import logoImg from '../assets/CPL_logo.webp';

export function CplLogoImage({ size = 42, className = "" }) {
  return (
    <img 
      src={logoImg} 
      alt="Clean Plate Lab Logo" 
      className={`object-contain select-none shrink-0 ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export function CplIcon({ size = 32, className = "" }) {
  return <CplLogoImage size={size} className={className} />;
}

export function CplPrimaryLogo({ className = "", size = "normal", inverted = false }) {
  const isLarge = size === "large";
  const imgSize = isLarge ? 50 : 38;

  return (
    <div className={`flex items-center gap-2 min-[360px]:gap-3 select-none ${className}`}>
      <CplLogoImage size={imgSize} />
      <div className="flex flex-col justify-center leading-none">
        <div className={`font-display font-black tracking-tighter uppercase ${inverted ? 'text-white' : 'text-[#1E1E1E]'} ${isLarge ? 'text-2xl' : 'text-base min-[360px]:text-lg sm:text-xl'}`}>
          CLEAN PLATE LAB
        </div>
        <div className={`mt-1 font-display font-bold uppercase tracking-widest ${inverted ? 'text-[#B8C8AA]' : 'text-[#647554]'} ${isLarge ? 'text-xs' : 'hidden text-[8px] min-[360px]:block sm:text-[10px]'}`}>
          GOOD FOOD. CLEAR DATA. BETTER YOU.
        </div>
      </div>
    </div>
  );
}

export function CplBadgeLogo({ size = 90, className = "" }) {
  const hasCustomSize = className.includes('w-') || className.includes('h-');
  const style = !hasCustomSize && size ? { width: size, height: size } : {};

  return (
    <div 
      className={`relative flex items-center justify-center select-none rounded-full shrink-0 p-1.5 ${className}`}
      style={style}
    >
      <img 
        src={logoImg} 
        alt="Clean Plate Lab Circular Badge" 
        className="w-full h-full object-contain"
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
