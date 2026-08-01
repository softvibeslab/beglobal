import React, { useEffect, useState } from "react"
import { useApi } from "@/hooks/useApi"
import { Card, CardContent, Badge } from "@/components/common"
import { motion } from "framer-motion"

interface Lesson {
  id: number
  title: string
  status: string
  xp_reward: number
  difficulty: string
}

export const LessonsList: React.FC = () => {
  const api = useApi()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLessons = async () => {
      try {
        const response = await api.get("/api/member/lessons")
        setLessons(response.data.lessons)
      } catch (err) {
        console.error("Error loading lessons:", err)
      } finally {
        setLoading(false)
      }
    }
    loadLessons()
  }, [])

  const difficultyColors = {
    easy: "bg-success-900 text-success-300",
    medium: "bg-warning-900 text-warning-300",
    hard: "bg-danger-900 text-danger-300",
  }

  if (loading) {
    return <div className="text-center text-slate-400">Cargando lecciones...</div>
  }

  return (
    <div className="space-y-3">
      {lessons.slice(0, 5).map((lesson, idx) => (
        <motion.div
          key={lesson.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
        >
          <Card
            className={`cursor-pointer transition-all hover:bg-slate-700 ${
              lesson.status === "completed" ? "opacity-75" : ""
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-white text-sm">{lesson.title}</p>
                    <Badge variant={lesson.status === "completed" ? "success" : "default"}>
                      {lesson.status === "completed" ? "✓" : "Bloqueado"}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Badge
                      variant="info"
                      className={
                        difficultyColors[lesson.difficulty as keyof typeof difficultyColors]
                      }
                    >
                      {lesson.difficulty}
                    </Badge>
                    <Badge variant="default">{lesson.xp_reward} XP</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
