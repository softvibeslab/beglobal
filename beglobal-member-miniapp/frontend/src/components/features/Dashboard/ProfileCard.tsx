import React from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/common"
import { GameState } from "@/store/gameStore"

interface ProfileCardProps {
  gameState: GameState | null
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ gameState }) => {
  if (!gameState) {
    return (
      <Card>
        <CardContent>Cargando perfil...</CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-primary-900 to-slate-800 border-primary-700">
      <CardContent>
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-bold text-primary-400 mb-2"
          >
            {gameState.level}
          </motion.div>
          <p className="text-slate-400 text-sm mb-4">Nivel</p>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>XP</span>
                <span>{gameState.xpToNext} falta</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((gameState.xp / (gameState.xp + gameState.xpToNext)) * 100, 100)}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-primary-500 rounded-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-700 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-success-400">🔥 {gameState.streak}</div>
                <p className="text-xs text-slate-400">Racha actual</p>
              </div>
              <div className="bg-slate-700 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-secondary-400">⭐ {gameState.streakMax}</div>
                <p className="text-xs text-slate-400">Racha máx</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
