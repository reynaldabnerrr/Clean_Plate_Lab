import React from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "../../lib/utils";

export function LoadingSpinner({
  label = "Memuat data...",
  className,
  iconClassName,
}) {
  return (
    <span
      role="status"
      aria-live="polite"
      className={cn("inline-flex items-center justify-center gap-2", className)}
    >
      <RefreshCw
        aria-hidden="true"
        className={cn("h-4 w-4 animate-spin", iconClassName)}
      />
      <span>{label}</span>
    </span>
  );
}

export function Skeleton({ className }) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse bg-[#1E1E1E]/10", className)}
    />
  );
}

function MenuCardSkeleton({ className, hideImage = false }) {
  return (
    <div
      className={cn(
        "overflow-hidden border-2 border-[#1E1E1E] bg-white shadow-[6px_6px_0_#1E1E1E]",
        className,
      )}
    >
      {hideImage ? (
        <div className="flex min-h-14 items-center justify-between gap-3 border-b-2 border-[#1E1E1E] bg-[#1E1E1E] px-4 py-3 sm:px-5">
          <Skeleton className="h-6 w-24 bg-white/80" />
          <Skeleton className="h-2.5 w-20 bg-white/25" />
        </div>
      ) : (
        <Skeleton className="h-52 w-full border-b-2 border-[#1E1E1E] sm:h-60" />
      )}
      <div className="space-y-5 p-5 sm:p-6">
        <div className="space-y-2">
          <Skeleton className="h-2.5 w-28" />
          <Skeleton className="h-7 w-4/5" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-12 border border-[#1E1E1E]/20" />
          ))}
        </div>
        <Skeleton className="h-11 w-full border-2 border-[#1E1E1E]/20" />
      </div>
    </div>
  );
}

export function MenuGridSkeleton({
  count = 6,
  className,
  mobileCarousel = false,
  hideImage = false,
}) {
  return (
    <div role="status" aria-label="Memuat data menu dari database">
      <span className="sr-only">Memuat data menu dari database...</span>
      <div
        className={cn(
          mobileCarousel
            ? "-mx-4 flex snap-x gap-4 overflow-hidden px-4 pb-3 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 xl:grid-cols-3"
            : "grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3",
          className,
        )}
      >
        {Array.from({ length: count }).map((_, index) => (
          <MenuCardSkeleton
            key={index}
            hideImage={hideImage}
            className={
              mobileCarousel
                ? "min-w-0 flex-[0_0_calc(100%-2rem)] snap-start md:flex-auto"
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}

export function FullScreenLoader({
  title = "Menyiapkan dashboard",
  description = "Memeriksa sesi dan menyinkronkan data Supabase...",
}) {
  return (
    <main className="grid min-h-[100dvh] place-items-center bg-[#FEFDF9] p-5 text-[#1E1E1E]">
      <div className="w-full max-w-sm border-2 border-[#1E1E1E] bg-white p-6 text-center shadow-[7px_7px_0_#1E1E1E] sm:p-8">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border-2 border-[#1E1E1E] bg-[#E1ECD3] shadow-[3px_3px_0_#1E1E1E]">
          <RefreshCw aria-hidden="true" className="h-6 w-6 animate-spin text-[#6B7860]" />
        </div>
        <h1 className="mt-5 font-display text-xl font-black uppercase tracking-tight sm:text-2xl">
          {title}
        </h1>
        <p className="mt-2 text-xs font-medium leading-relaxed text-[#1E1E1E]/65">
          {description}
        </p>
        <span className="sr-only" role="status" aria-live="polite">
          {description}
        </span>
      </div>
    </main>
  );
}
