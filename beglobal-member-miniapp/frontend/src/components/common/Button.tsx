import React from "react"
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
        secondary: "bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500",
        outline: "border border-slate-400 text-slate-300 hover:bg-slate-800 focus:ring-slate-500",
        danger: "bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500",
        success: "bg-success-600 text-white hover:bg-success-700 focus:ring-success-500",
      },
      size: {
        sm: "text-sm px-3 py-1",
        md: "text-base px-4 py-2",
        lg: "text-lg px-6 py-3",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, ...props }, ref) => (
    <button
      ref={ref}
      className={buttonVariants({ variant, size, fullWidth, className })}
      {...props}
    />
  )
)

Button.displayName = "Button"
