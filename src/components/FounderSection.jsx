import React from "react";
import { Badge } from "./ui/badge";
import { Check, Award, GraduationCap, FlaskConical } from "lucide-react";
import { useSiteCopy } from "../hooks/useSiteCopy";

export function FounderSection() {
  const copy = useSiteCopy();
  const founder = copy.founder || {};

  return (
    <section
      id="founder"
      className="border-b border-[#1E1E1E] bg-[var(--cpl-white)] py-12 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-10 sm:mb-16">
          <Badge variant="default">{founder.eyebrow}</Badge>
          <h2 className="mt-3 font-display text-2xl font-extrabold uppercase tracking-tight text-[var(--cpl-dark)] sm:mt-4 sm:text-5xl">
            {founder.title}
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
          {/* Founder Photo & Quick Specs Card */}
          <div className="lg:col-span-5">
            <div className="relative border-2 border-[#1E1E1E] bg-white p-3 shadow-[8px_8px_0_#1E1E1E] sm:p-4">
              <div className="relative aspect-[4/5] overflow-hidden border border-[#1E1E1E]">
                <img
                  src="/images/founder.webp"
                  alt={founder.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#1E1E1E]/90 via-[#1E1E1E]/50 to-transparent p-4 pt-12 text-white">
                  <p className="font-display text-xl font-extrabold uppercase tracking-tight">
                    {founder.name}
                  </p>
                  <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#C8D8B8]">
                    {founder.role}
                  </p>
                </div>
              </div>

              {/* Academic Badge */}
              <div className="mt-4 flex items-center gap-2 border-t border-[#1E1E1E]/20 pt-3">
                <GraduationCap className="size-4 shrink-0 text-[#8D9B7D]" />
                <span className="font-mono text-[11px] font-bold text-[#1E1E1E]">
                  {founder.degree}
                </span>
              </div>
            </div>
          </div>

          {/* Founder Story & Highlights */}
          <div className="space-y-6 lg:col-span-7">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#8D9B7D]">
                <FlaskConical className="size-5" />
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#6B7860]">
                  Food Scientist & Innovator
                </span>
              </div>
              <h3 className="font-display text-2xl font-extrabold uppercase text-[#1E1E1E] sm:text-3xl">
                {founder.name}
              </h3>
              <p className="text-xs leading-6 text-[var(--cpl-dark-muted)] sm:text-sm sm:leading-7">
                {founder.bio}
              </p>
            </div>

            {/* Highlights List */}
            {founder.highlights && (
              <div className="border-2 border-[#1E1E1E] bg-[#FEFDF9] p-4 sm:p-5 shadow-[4px_4px_0_#8D9B7D]">
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#6B7860] mb-3 flex items-center gap-1.5">
                  <Award className="size-3.5 text-[#8D9B7D]" />
                  Key Qualifications & Innovation Credentials
                </p>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {founder.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-[11px] font-bold text-[#1E1E1E] sm:text-xs"
                    >
                      <Check className="mt-0.5 size-3.5 shrink-0 text-[#8D9B7D]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Founder Quote */}
            <blockquote className="border-l-4 border-[#8D9B7D] bg-white p-4 text-xs font-semibold italic text-[#1E1E1E] sm:p-5 sm:text-sm leading-relaxed shadow-[2px_2px_0_#1E1E1E]">
              {founder.quote}
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
