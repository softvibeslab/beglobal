import React from "react"
import { motion } from "framer-motion"

interface OnboardingProgressProps {
  current: number
  total: number
}

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({ current, total }) => {
  const steps = ["Bienvenida", "Experiencia", "Producto", "Canal"]
  const percentage = (current / total) * 100

  return (
    <div className="fixed top-0 left-0 right-0 bg-slate-900/80 backdrop-blur p-4 z-50">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between mb-2">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`flex-1 h-1 mx-1 rounded-full transition-all ${
                idx < current ? "bg-primary-500" : "bg-slate-700"
              }`}
            />
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-slate-400 text-center mt-2"
        >
          Paso {current} de {total}
        </motion.p>
      </div>
    </div>
  )
}
