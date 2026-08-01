import React from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/common"

interface StatsCardProps {
  icon: string
  label: string
  value: number | string
  trend?: number
  variant?: "primary" | "success" | "secondary"
}

const variants = {
  primary: "text-primary-400",
  success: "text-success-400",
  secondary: "text-secondary-400",
}

export const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  label,
  value,
  trend,
  variant = "primary",
}) => {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card className="bg-slate-800/50">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-400 mb-1">{label}</p>
              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`text-2xl font-bold ${variants[variant]}`}
              >
                {value}
              </motion.p>
              {trend !== undefined && (
                <p className={`text-xs mt-1 ${trend > 0 ? "text-success-400" : "text-slate-400"}`}>
                  {trend > 0 ? "+" : ""}{trend} esta semana
                </p>
              )}
            </div>
            <span className="text-3xl">{icon}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
