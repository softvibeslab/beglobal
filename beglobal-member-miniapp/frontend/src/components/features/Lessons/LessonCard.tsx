import React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, Badge } from "@/components/common"

interface LessonCardProps {
  id: number
  title: string
  status: "locked" | "available" | "completed"
  difficulty: string
  xpReward: number
  onClick: () => void
}

const statusColors = {
  locked: "opacity-50 cursor-not-allowed",
  available: "cursor-pointer hover:scale-105",
  completed: "opacity-75 cursor-pointer",
}

const statusIcons = {
  locked: "🔒",
  available: "📖",
  completed: "✓",
}

export const LessonCard: React.FC<LessonCardProps> = ({
  title,
  status,
  difficulty,
  xpReward,
  onClick,
}) => {
  const difficultyEmoji = {
    easy: "🟢",
    medium: "🟡",
    hard: "🔴",
  }

  return (
    <motion.div
      whileHover={status !== "locked" ? { scale: 1.05 } : undefined}
      whileTap={status !== "locked" ? { scale: 0.95 } : undefined}
      onClick={status !== "locked" ? onClick : undefined}
    >
      <Card className={`${statusColors[status]} transition-all`}>
        <CardContent className="p-4 text-center">
          <div className="text-3xl mb-2">{statusIcons[status]}</div>
          <p className="text-sm font-semibold text-white mb-2 line-clamp-2">{title}</p>
          <div className="flex gap-1 justify-center">
            <Badge variant="default" className="text-xs">
              {difficultyEmoji[difficulty as keyof typeof difficultyEmoji]}
            </Badge>
            <Badge variant="info" className="text-xs">
              {xpReward} XP
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
