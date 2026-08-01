import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common"
import { GameState } from "@/store/gameStore"
import { AchievementUnlockModal } from "./AchievementUnlockModal"

interface AchievementGalleryProps {
  achievements: GameState["achievements"]
}

// All possible achievements
const allAchievements = [
  { code: "first_mission", title: "Primeros pasos", description: "Completaste tu primera misión", icon: "🚀" },
  { code: "five_missions", title: "Quincenal", description: "Completaste 5 misiones", icon: "⭐" },
  { code: "streak_3", title: "Consistencia", description: "3 días de racha", icon: "🔥" },
  { code: "streak_7", title: "¡Sin parar!", description: "7 días de racha", icon: "🔥" },
  { code: "streak_30", title: "Campeón", description: "30 días de racha", icon: "🏆" },
  { code: "level_2", title: "Aprendiz", description: "Nivel 2", icon: "⭐" },
  { code: "level_5", title: "Aprendiz avanzado", description: "Nivel 5", icon: "⭐⭐" },
  { code: "level_10", title: "Maestro", description: "Nivel 10", icon: "⭐⭐⭐" },
  { code: "all_lessons_easy", title: "Conocedor", description: "Todas lecciones fáciles", icon: "🎓" },
  { code: "vendor_ready", title: "¡Listo para vender!", description: "5 primeras misiones", icon: "🛍️" },
  { code: "marketing_pro", title: "Marketing maestro", description: "Misiones de Ads", icon: "📊" },
]

export const AchievementGallery: React.FC<AchievementGalleryProps> = ({ achievements }) => {
  const unlockedCodes = new Set(achievements.map((a) => a.code))
  const [selectedAchievement, setSelectedAchievement] = useState<(typeof allAchievements)[0] | null>(
    null
  )

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            Logros ({achievements.length}/{allAchievements.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <AnimatePresence mode="popLayout">
              {allAchievements.map((ach, idx) => {
                const isUnlocked = unlockedCodes.has(ach.code)
                return (
                  <motion.button
                    key={ach.code}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={isUnlocked ? { scale: 1.1 } : undefined}
                    whileTap={isUnlocked ? { scale: 0.9 } : undefined}
                    onClick={() => isUnlocked && setSelectedAchievement(ach)}
                    className={`cursor-pointer transition-all ${!isUnlocked ? "opacity-30 grayscale" : ""}`}
                  >
                    <Card className="h-full hover:bg-slate-700 transition-all">
                      <CardContent className="p-3 flex flex-col items-center justify-center text-center">
                        <motion.div
                          animate={isUnlocked ? { scale: [1, 1.2, 1] } : undefined}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-3xl mb-1"
                        >
                          {ach.icon}
                        </motion.div>
                        <p className="text-xs font-semibold text-white">{ach.title}</p>
                        {!isUnlocked && (
                          <p className="text-xs text-slate-500 mt-1">Bloqueado</p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.button>
                )
              })}
            </AnimatePresence>
          </div>

          <div className="mt-4 bg-slate-700/30 rounded-lg p-3 text-xs text-slate-400">
            <p>🎯 Sigue completando lecciones y misiones para desbloquear más logros</p>
          </div>
        </CardContent>
      </Card>

      <AchievementUnlockModal
        achievement={selectedAchievement}
        onClose={() => setSelectedAchievement(null)}
      />
    </>
  )
}
