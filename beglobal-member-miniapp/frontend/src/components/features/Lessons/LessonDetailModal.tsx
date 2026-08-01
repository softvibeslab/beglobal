import React, { useState } from "react"
import { Modal } from "@/components/common"
import { Button, Badge } from "@/components/common"
import { useApi } from "@/hooks/useApi"

interface Lesson {
  id: number
  title: string
  description: string
  difficulty: string
  xp_reward: number
  duration_minutes: number
  status: string
  prerequisites: string[]
}

interface LessonDetailModalProps {
  lesson: Lesson | null
  onClose: () => void
}

export const LessonDetailModal: React.FC<LessonDetailModalProps> = ({ lesson, onClose }) => {
  const api = useApi()
  const [completing, setCompleting] = useState(false)

  if (!lesson) return null

  const handleComplete = async () => {
    if (lesson.status === "locked") return

    setCompleting(true)
    try {
      await api.post(`/api/member/lessons/${lesson.id}/complete`, {
        quiz_answers: JSON.stringify({}),
      })
      onClose()
    } catch (err) {
      console.error("Error completing lesson:", err)
    } finally {
      setCompleting(false)
    }
  }

  const difficultyColors = {
    easy: "Success",
    medium: "Warning",
    hard: "Danger",
  }

  return (
    <Modal isOpen={!!lesson} onClose={onClose} title={lesson.title} size="md">
      <div className="space-y-4">
        <p className="text-slate-300">{lesson.description}</p>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-700 rounded-lg p-3">
            <p className="text-xs text-slate-400">Dificultad</p>
            <Badge variant={difficultyColors[lesson.difficulty as keyof typeof difficultyColors] as any}>
              {lesson.difficulty}
            </Badge>
          </div>
          <div className="bg-slate-700 rounded-lg p-3">
            <p className="text-xs text-slate-400">XP</p>
            <p className="text-xl font-bold text-primary-400">{lesson.xp_reward}</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-3 col-span-2">
            <p className="text-xs text-slate-400">Duración</p>
            <p className="text-sm font-semibold text-white">~{lesson.duration_minutes} minutos</p>
          </div>
        </div>

        {lesson.prerequisites.length > 0 && (
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
            <p className="text-xs text-blue-300 font-semibold mb-2">Requisitos previos:</p>
            <ul className="text-xs text-slate-300 space-y-1">
              {lesson.prerequisites.map((pre) => (
                <li key={pre}>✓ {pre}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-4 space-y-2">
          {lesson.status === "completed" ? (
            <div className="bg-success-900/30 border border-success-500 rounded-lg p-3 text-center">
              <p className="text-success-300 font-semibold">✓ Completado</p>
            </div>
          ) : lesson.status === "locked" ? (
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-3 text-center">
              <p className="text-slate-400">Completa los requisitos previos</p>
            </div>
          ) : (
            <Button
              fullWidth
              variant="primary"
              disabled={completing}
              onClick={handleComplete}
            >
              {completing ? "Completando..." : "Completar Lección"}
            </Button>
          )}
          <Button fullWidth variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
