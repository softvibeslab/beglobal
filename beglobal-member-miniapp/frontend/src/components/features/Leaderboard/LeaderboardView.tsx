import React, { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/common"

interface LeaderboardEntry {
  rank: number
  username: string
  level: number
  xp: number
  streak: number
  isCurrentUser: boolean
}

// Mock data
const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, username: "Sofia_Seller", level: 12, xp: 15000, streak: 45, isCurrentUser: false },
  { rank: 2, username: "Diego_Hustle", level: 11, xp: 13500, streak: 32, isCurrentUser: false },
  { rank: 3, username: "Laura_Shop", level: 10, xp: 12000, streak: 28, isCurrentUser: true },
  { rank: 4, username: "Carlos_Pro", level: 9, xp: 10500, streak: 21, isCurrentUser: false },
  { rank: 5, username: "Maria_Grind", level: 8, xp: 9000, streak: 18, isCurrentUser: false },
]

export const LeaderboardView: React.FC = () => {
  const [showEscalation, setShowEscalation] = useState(false)

  const currentUser = mockLeaderboard.find((e) => e.isCurrentUser)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>🏆 Leaderboard Global</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {mockLeaderboard.map((entry, idx) => (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  entry.isCurrentUser ? "bg-primary-900 border border-primary-500" : "bg-slate-800"
                }`}
              >
                <div className="text-2xl font-bold w-8">
                  {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : entry.rank}
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-white">
                    {entry.username} {entry.isCurrentUser && "(Tú)"}
                  </p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="default" className="text-xs">
                      Lvl {entry.level}
                    </Badge>
                    <Badge variant="info" className="text-xs">
                      {entry.xp.toLocaleString()} XP
                    </Badge>
                    <Badge variant="success" className="text-xs">
                      🔥 {entry.streak}
                    </Badge>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {currentUser && currentUser.level >= 5 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-secondary-900/30 to-primary-900/30 border border-secondary-500/30 rounded-lg p-4"
        >
          <div className="text-center">
            <p className="text-sm text-secondary-300 font-semibold mb-2">
              ✨ ¡Elegible para escalada a Team!
            </p>
            <p className="text-xs text-slate-300 mb-4">
              Has completado {currentUser.level} niveles. Sé un revisor y ayuda a otros.
            </p>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowEscalation(true)}
              fullWidth
            >
              Escalar a Perfil Team →
            </Button>
          </div>
        </motion.div>
      )}

      {showEscalation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-800 rounded-lg p-6 max-w-md mx-auto"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Escalada a Team</h2>
            <p className="text-slate-300 mb-6">
              Como Team, podrás revisar entregas de otros usuarios y ganar XP adicional.
            </p>
            <div className="bg-slate-700 rounded-lg p-4 mb-6 text-sm text-slate-300">
              <p className="font-semibold mb-2">Requisitos:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Nivel 5+</li>
                <li>5+ misiones completadas</li>
                <li>500+ XP</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <Button fullWidth variant="outline" onClick={() => setShowEscalation(false)}>
                Más tarde
              </Button>
              <Button fullWidth variant="secondary">
                Confirmar
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}
