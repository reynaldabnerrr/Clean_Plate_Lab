import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "block h-11 w-full max-w-full min-w-0 box-border border border-[var(--cpl-dark)] bg-[var(--cpl-cream)] px-3 py-2 text-xs font-display font-bold text-[var(--cpl-dark)] ring-offset-background file:border-0 file:bg-transparent file:text-xs file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cpl-sage)] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
