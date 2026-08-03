import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex min-h-7 items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-display font-extrabold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--cpl-sage)]",
  {
    variants: {
      variant: {
        default:
          "border-[var(--cpl-sage)]/30 bg-[var(--cpl-sage-light)] text-[var(--cpl-sage-dark)]",
        solid:
          "border-transparent bg-[var(--cpl-sage)] text-white",
        dark:
          "border-transparent bg-[var(--cpl-dark)] text-white",
        outline:
          "border-[var(--cpl-dark)] text-[var(--cpl-dark)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge }
