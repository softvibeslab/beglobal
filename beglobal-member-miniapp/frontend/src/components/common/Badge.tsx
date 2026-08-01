import React from "react"

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info"
  children: React.ReactNode
}

const variantStyles = {
  default: "bg-slate-700 text-slate-200",
  success: "bg-success-900 text-success-300",
  warning: "bg-warning-900 text-warning-300",
  danger: "bg-danger-900 text-danger-300",
  info: "bg-primary-900 text-primary-300",
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", className = "", ...props }, ref) => (
    <span
      ref={ref}
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variantStyles[variant]} ${className}`}
      {...props}
    />
  )
)

Badge.displayName = "Badge"
