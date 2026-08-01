import React, { useEffect, useState } from "react"
import { useApi } from "@/hooks/useApi"
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/common"
import { LessonCard } from "./LessonCard"
import { LessonDetailModal } from "./LessonDetailModal"

interface Lesson {
  id: number
  code: string
  title: string
  description: string
  difficulty: string
  xp_reward: number
  duration_minutes: number
  status: string
  completed_at: number
  prerequisites: string[]
}

export const SkillTree: React.FC = () => {
  const api = useApi()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
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

  if (loading) {
    return (
      <Card>
        <CardContent>
          <p className="text-center text-slate-400">Cargando árbol de habilidades...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Árbol de Habilidades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                id={lesson.id}
                title={lesson.title}
                status={lesson.status as "locked" | "available" | "completed"}
                difficulty={lesson.difficulty}
                xpReward={lesson.xp_reward}
                onClick={() => setSelectedLesson(lesson)}
              />
            ))}
          </div>

          <div className="bg-slate-700/30 rounded-lg p-3 text-xs text-slate-400">
            <p>📌 Completa lecciones para desbloquear las siguientes</p>
          </div>
        </CardContent>
      </Card>

      <LessonDetailModal lesson={selectedLesson} onClose={() => setSelectedLesson(null)} />
    </>
  )
}
