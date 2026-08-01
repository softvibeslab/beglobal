import React from "react"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={`bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-lg ${className}`}
      {...props}
    />
  )
)

Card.displayName = "Card"

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = "", ...props }, ref) => (
    <div ref={ref} className={`mb-4 ${className}`} {...props} />
  )
)

CardHeader.displayName = "CardHeader"

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className = "", ...props }, ref) => (
    <h2 ref={ref} className={`text-xl font-bold text-white ${className}`} {...props} />
  )
)

CardTitle.displayName = "CardTitle"

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = "", ...props }, ref) => (
    <div ref={ref} className={`text-slate-300 ${className}`} {...props} />
  )
)

CardContent.displayName = "CardContent"
