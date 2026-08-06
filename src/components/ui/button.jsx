import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-xs font-sans font-bold uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cpl-sage)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--cpl-sage)] text-white hover:bg-[var(--cpl-sage-dark)] shadow-sm",
        dark:
          "bg-[var(--cpl-dark)] text-white hover:bg-[var(--cpl-sage-dark)] shadow-sm",
        outline:
          "border-2 border-[var(--cpl-dark)] text-[var(--cpl-dark)] hover:bg-[var(--cpl-dark)] hover:text-white",
        secondary:
          "bg-[var(--cpl-sage-light)] text-[var(--cpl-sage-dark)] hover:bg-[var(--cpl-sage)] hover:text-white",
        ghost:
          "text-[var(--cpl-dark)] hover:bg-[var(--cpl-sand-light)] hover:text-[var(--cpl-sage)]",
        link: "text-[var(--cpl-sage-dark)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 px-3 text-[11px]",
        lg: "h-14 px-8 text-sm",
        icon: "h-10 w-10 p-0 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
