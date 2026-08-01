import React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, Badge } from "@/components/common"

interface MissionCardProps {
  id: number
  title: string
  description: string
  difficulty: string
  xpReward: number
  status: "locked" | "available" | "completed"
  onClick: () => void
}

const statusEmoji = {
  locked: "🔒",
  available: "🎲",
  completed: "✓",
}

export const MissionCard: React.FC<MissionCardProps> = ({
  title,
  description,
  difficulty,
  xpReward,
  status,
  onClick,
}) => {
  const difficultyColor = {
    easy: "success",
    medium: "warning",
    hard: "danger",
  }

  return (
    <motion.div
      whileHover={status !== "locked" ? { scale: 1.02, y: -2 } : undefined}
      whileTap={status !== "locked" ? { scale: 0.98 } : undefined}
      onClick={status !== "locked" ? onClick : undefined}
    >
      <Card className={`${status === "locked" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="text-2xl">{statusEmoji[status]}</div>
            <Badge variant={difficultyColor[difficulty as keyof typeof difficultyColor] as any}>
              {difficulty}
            </Badge>
          </div>
          <h3 className="font-semibold text-white mb-2 line-clamp-2">{title}</h3>
          <p className="text-xs text-slate-400 line-clamp-2 mb-3">{description}</p>
          <div className="text-sm font-bold text-primary-400">{xpReward} XP</div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
