import { create } from "zustand"

export interface User {
  tg_id: number
  username: string
  profile: string
  experience_level: string
  onboarding_step: string
}

export interface GameState {
  xp: number
  level: number
  streak: number
  streakMax: number
  lessonsCompleted: number
  missionsCompleted: number
  xpToNext: number
  achievements: Achievement[]
}

export interface Achievement {
  code: string
  title: string
  icon: string
  unlockedAt: number
}

interface Store {
  user: User | null
  gameState: GameState | null
  isLoading: boolean
  error: string | null

  setUser: (user: User | null) => void
  setGameState: (state: GameState | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useGameStore = create<Store>((set) => ({
  user: null,
  gameState: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setGameState: (gameState) => set({ gameState }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set({ user: null, gameState: null, isLoading: false, error: null }),
}))
