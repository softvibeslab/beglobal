import React, { useRef, useState } from "react"
import { Modal, Button, Badge } from "@/components/common"
import { useApi } from "@/hooks/useApi"

interface Mission {
  id: number
  title: string
  description: string
  difficulty: string
  xp_reward: number
  coins_reward: number
  time_estimate_minutes: number
  deliverable_type: string
  status: "locked" | "available" | "completed"
}

interface MissionDetailModalProps {
  mission: Mission | null
  onClose: () => void
}

export const MissionDetailModal: React.FC<MissionDetailModalProps> = ({ mission, onClose }) => {
  const api = useApi()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [submitting, setSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  if (!mission) return null

  const deliverableOptions = {
    link: "🔗 Enlace",
    video: "🎥 Video",
    screenshot: "📸 Screenshot",
    document: "📄 Documento",
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = async () => {
    if (!selectedFile && mission.deliverable_type !== "link") return

    setSubmitting(true)
    try {
      const formData = new FormData()
      if (selectedFile) {
        formData.append("file", selectedFile)
      }

      // Mock submission (backend endpoint not created yet)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onClose()
    } catch (err) {
      console.error("Error submitting mission:", err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal isOpen={!!mission} onClose={onClose} title={mission.title} size="md">
      <div className="space-y-4">
        <p className="text-slate-300">{mission.description}</p>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-700 rounded-lg p-3">
            <p className="text-xs text-slate-400">Dificultad</p>
            <Badge variant={mission.difficulty === "hard" ? "danger" : "success"}>
              {mission.difficulty}
            </Badge>
          </div>
          <div className="bg-slate-700 rounded-lg p-3">
            <p className="text-xs text-slate-400">Duración</p>
            <p className="text-sm font-semibold text-white">~{mission.time_estimate_minutes} min</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-3">
            <p className="text-xs text-slate-400">XP</p>
            <p className="text-lg font-bold text-primary-400">{mission.xp_reward}</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-3">
            <p className="text-xs text-slate-400">Monedas</p>
            <p className="text-lg font-bold text-secondary-400">{mission.coins_reward}</p>
          </div>
        </div>

        {mission.status !== "locked" && (
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
            <p className="text-xs text-blue-300 font-semibold mb-2">
              📦 Tipo de entrega: {deliverableOptions[mission.deliverable_type as keyof typeof deliverableOptions]}
            </p>
            <p className="text-xs text-blue-200">
              Sube tu trabajo para que un coach te dé retroalimentación
            </p>
          </div>
        )}

        {mission.status === "available" && (
          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-slate-600 rounded-lg p-4 text-center hover:border-primary-500 transition-colors cursor-pointer"
            >
              <p className="text-sm text-slate-300">
                {selectedFile ? selectedFile.name : "Haz clic para subir archivo"}
              </p>
            </button>
          </div>
        )}

        <div className="pt-4 space-y-2">
          {mission.status === "completed" ? (
            <div className="bg-success-900/30 border border-success-500 rounded-lg p-3 text-center">
              <p className="text-success-300 font-semibold">✓ Completado</p>
            </div>
          ) : mission.status === "locked" ? (
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-3 text-center">
              <p className="text-slate-400">Completa las misiones anteriores</p>
            </div>
          ) : (
            <Button
              fullWidth
              variant="primary"
              disabled={submitting || !selectedFile}
              onClick={handleSubmit}
            >
              {submitting ? "Enviando..." : "Enviar Entrega"}
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
