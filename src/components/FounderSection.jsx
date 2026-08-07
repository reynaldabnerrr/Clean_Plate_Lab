import React from "react";
import { Badge } from "./ui/badge";
import { GraduationCap, FlaskConical, Quote, Sparkles, ShieldCheck, Dumbbell } from "lucide-react";
import { useSiteCopy } from "../hooks/useSiteCopy";

export function FounderSection() {
  const copy = useSiteCopy();
  const founder = copy.founder || {};

  const principles = [
    { icon: FlaskConical, label: "Food Science Precision" },
    { icon: Dumbbell, label: "High-Protein Verified" },
    { icon: ShieldCheck, label: "100% Macro Transparency" },
  ];

  return (
    <section
      id="founder"
      className="border-b border-[#1E1E1E] bg-[#FEFDF9] py-14 sm:py-24 relative overflow-hidden"
    >
      {/* Background Accent Grid */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[radial-gradient(#1E1E1E_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-10 sm:mb-16 space-y-3">
          <Badge variant="default">{founder.eyebrow}</Badge>
          <h2 className="font-display text-3xl font-black uppercase tracking-tight text-[var(--cpl-dark)] sm:text-5xl">
            {founder.title}
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
          {/* Founder Photo & Academic Specs Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative border-2 border-[#1E1E1E] bg-white p-3.5 sm:p-4 shadow-[8px_8px_0_#1E1E1E] transition-all duration-300 hover:shadow-[12px_12px_0_#8D9B7D]">
              <div className="relative aspect-square overflow-hidden border-2 border-[#1E1E1E] bg-[#E1ECD3]/30 group">
                <img
                  src="/images/founder.webp"
                  alt={founder.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />

                {/* Bottom Overlay Nameplate */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#1E1E1E] via-[#1E1E1E]/80 to-transparent p-5 pt-12 text-white">
                  <p className="font-display text-xl sm:text-2xl font-black uppercase tracking-tight leading-tight">
                    {founder.name}
                  </p>
                  <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#C8D8B8] mt-0.5">
                    {founder.role}
                  </p>
                </div>
              </div>

              {/* Academic Degree Bar */}
              <div className="mt-3.5 flex items-center gap-3 border-2 border-[#1E1E1E] bg-[#F4F7F1] p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#1E1E1E] bg-white text-[#8D9B7D]">
                  <GraduationCap className="size-4 text-[#6B7860]" />
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-[9px] font-black uppercase tracking-widest text-[#6B7860]">
                    ACADEMIC BACKGROUND
                  </p>
                  <p className="font-sans text-xs font-extrabold text-[#1E1E1E] truncate">
                    {founder.degree}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Founder Story & Quote (7 cols) */}
          <div className="space-y-5 lg:col-span-7">
            {/* Tag & Founder Title */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 border border-[#1E1E1E]/20 bg-white px-3 py-1 shadow-xs">
                <FlaskConical className="size-3.5 text-[#8D9B7D]" />
                <span className="font-mono text-[11px] font-extrabold uppercase tracking-widest text-[#6B7860]">
                  Food Scientist & Founder
                </span>
              </div>
              <h3 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#1E1E1E]">
                {founder.name}
              </h3>
            </div>

            {/* Featured Quote Card */}
            <div className="relative border-2 border-[#1E1E1E] bg-[#E1ECD3]/50 p-6 sm:p-7 shadow-[6px_6px_0_#1E1E1E]">
              <Quote className="absolute top-4 right-4 size-10 text-[#8D9B7D]/30 shrink-0 pointer-events-none" />
              <p className="relative z-10 font-display text-base sm:text-xl font-black italic tracking-tight text-[#1E1E1E] leading-snug">
                {founder.quote}
              </p>
            </div>

            {/* Bio Card */}
            <div className="border-2 border-[#1E1E1E] bg-white p-5 sm:p-6 shadow-[4px_4px_0_#1E1E1E]">
              <p className="text-xs sm:text-sm leading-relaxed text-[#2B2B2B] font-medium">
                {founder.bio}
              </p>
            </div>

            {/* Principles Footer Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {principles.map((item) => {
                const IconComp = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 border-2 border-[#1E1E1E] bg-white p-2.5 shadow-[2px_2px_0_#1E1E1E]"
                  >
                    <IconComp className="size-3.5 shrink-0 text-[#8D9B7D]" />
                    <span className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-[#1E1E1E]">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
