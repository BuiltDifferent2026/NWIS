import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-xs border px-1.5 py-0.2 text-[10px] font-mono font-bold uppercase tracking-wider whitespace-nowrap transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[#1d70b8] text-white",
        secondary: "border-border bg-secondary text-secondary-foreground",
        destructive: "border-red-300 bg-red-50 text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300",
        outline: "border-border bg-transparent text-foreground",
        amber: "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-300",
        emerald: "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300",
        blue: "border-blue-300 bg-blue-50 text-blue-900 dark:border-blue-800/60 dark:bg-blue-950/40 dark:text-blue-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
