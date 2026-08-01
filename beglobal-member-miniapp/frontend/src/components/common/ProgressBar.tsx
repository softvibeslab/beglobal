import React from "react"
import { motion } from "framer-motion"

interface ProgressBarProps {
  current: number
  max: number
  label?: string
  variant?: "primary" | "success" | "warning"
  animated?: boolean
}

const variantClasses = {
  primary: "bg-primary-500",
  success: "bg-success-500",
  warning: "bg-warning-500",
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  max,
  label,
  variant = "primary",
  animated = true,
}) => {
  const percentage = Math.min((current / max) * 100, 100)

  return (
    <div className="w-full">
      {label && <p className="text-sm font-medium text-slate-300 mb-2">{label}</p>}
      <div className="relative w-full h-2 bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full ${variantClasses[variant]}`}
        />
      </div>
      {label && (
        <p className="text-xs text-slate-400 mt-1">
          {current} / {max}
        </p>
      )}
    </div>
  )
}
