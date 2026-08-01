import React, { useEffect, useState } from "react"
import { useApi } from "@/hooks/useApi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common"
import { MissionCard } from "./MissionCard"
import { MissionDetailModal } from "./MissionDetailModal"

interface Mission {
  id: number
  code: string
  title: string
  description: string
  difficulty: string
  xp_reward: number
  coins_reward: number
  time_estimate_minutes: number
  deliverable_type: string
  status: "locked" | "available" | "completed"
}

export const MissionsList: React.FC = () => {
  const api = useApi()
  const [missions, setMissions] = useState<Mission[]>([])
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMissions = async () => {
      try {
        // Mock data for now (backend endpoint not created yet)
        const mockMissions: Mission[] = [
          {
            id: 1,
            code: "mission_01",
            title: "Tu primer landing",
            description: "Crea una landing page",
            difficulty: "easy",
            xp_reward: 100,
            coins_reward: 10,
            time_estimate_minutes: 15,
            deliverable_type: "link",
            status: "available",
          },
          {
            id: 2,
            code: "mission_02",
            title: "Contenido que vende",
            description: "Graba un video corto",
            difficulty: "easy",
            xp_reward: 125,
            coins_reward: 15,
            time_estimate_minutes: 20,
            deliverable_type: "video",
            status: "available",
          },
          {
            id: 3,
            code: "mission_03",
            title: "Primera venta",
            description: "Completa primera transacción",
            difficulty: "easy",
            xp_reward: 150,
            coins_reward: 20,
            time_estimate_minutes: 30,
            deliverable_type: "screenshot",
            status: "locked",
          },
        ]
        setMissions(mockMissions)
      } catch (err) {
        console.error("Error loading missions:", err)
      } finally {
        setLoading(false)
      }
    }
    loadMissions()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardContent>
          <p className="text-center text-slate-400">Cargando misiones...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Misiones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 mb-4">
            {missions.map((mission) => (
              <MissionCard
                key={mission.id}
                id={mission.id}
                title={mission.title}
                description={mission.description}
                difficulty={mission.difficulty}
                xpReward={mission.xp_reward}
                status={mission.status}
                onClick={() => setSelectedMission(mission)}
              />
            ))}
          </div>

          <div className="bg-slate-700/30 rounded-lg p-3 text-xs text-slate-400">
            <p>🎯 Sube tus entregas y obtén retroalimentación de un coach</p>
          </div>
        </CardContent>
      </Card>

      <MissionDetailModal mission={selectedMission} onClose={() => setSelectedMission(null)} />
    </>
  )
}
