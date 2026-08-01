import React from "react"
import { motion } from "framer-motion"
import { GameState } from "@/store/gameStore"
import { Card, CardContent } from "@/components/common"

interface AchievementsListProps {
  achievements: GameState["achievements"]
}

export const AchievementsList: React.FC<AchievementsListProps> = ({ achievements }) => {
  const displayAchievements = achievements.slice(0, 6)

  if (achievements.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-6">
          <p className="text-slate-400 text-sm">Completa lecciones y misiones para desbloquear logros</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {displayAchievements.map((ach, idx) => (
        <motion.div
          key={ach.code}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
          whileHover={{ scale: 1.05 }}
        >
          <Card className="h-full cursor-pointer bg-slate-800/50 text-center hover:bg-slate-700 transition-all">
            <CardContent className="p-3 flex flex-col items-center">
              <div className="text-3xl mb-2">{ach.icon}</div>
              <p className="text-xs font-semibold text-white text-center line-clamp-2">{ach.title}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
