import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common"
import { GameState } from "@/store/gameStore"
import { ProfileCard } from "./ProfileCard"
import { StatsCard } from "./StatsCard"
import { LessonsList } from "./LessonsList"
import { AchievementsList } from "./AchievementsList"

interface DashboardViewProps {
  gameState: GameState
}

export const DashboardView: React.FC<DashboardViewProps> = ({ gameState }) => {
  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <ProfileCard gameState={gameState} />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatsCard icon="🔥" label="Racha" value={gameState.streak} trend={0} />
        <StatsCard icon="📚" label="Lecciones" value={gameState.lessonsCompleted} />
        <StatsCard icon="🎲" label="Misiones" value={gameState.missionsCompleted} />
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Logros Desbloqueados</CardTitle>
        </CardHeader>
        <CardContent>
          <AchievementsList achievements={gameState.achievements} />
        </CardContent>
      </Card>

      {/* Lessons Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Próximas Lecciones</CardTitle>
        </CardHeader>
        <CardContent>
          <LessonsList />
        </CardContent>
      </Card>

      {/* Footer spacer */}
      <div className="h-20" />
    </div>
  )
}
