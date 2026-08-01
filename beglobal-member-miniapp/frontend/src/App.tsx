import React, { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useTelegram } from "@/hooks/useTelegram"
import { useGameStore } from "@/store/gameStore"
import { useApi } from "@/hooks/useApi"
import { OnboardingFlow } from "@/components/features/Onboarding"
import { DashboardView } from "@/components/features/Dashboard/DashboardView"
import { Card, CardContent } from "@/components/common"

function App() {
  const { isReady, user, initData } = useTelegram()
  const { gameState, user: appUser, setGameState, isLoading } = useGameStore()
  const api = useApi()
  const [onboardingComplete, setOnboardingComplete] = useState(false)

  useEffect(() => {
    if (!isReady || !initData) return

    const checkUser = async () => {
      try {
        const response = await api.get("/api/member/dashboard")
        setGameState(response.data)
        setOnboardingComplete(true)
      } catch (err) {
        // User not found, show onboarding
        setOnboardingComplete(false)
      }
    }

    checkUser()
  }, [isReady, initData])

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-primary-300 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">Inicializando...</p>
        </div>
      </div>
    )
  }

  // Show onboarding if not complete
  if (!onboardingComplete) {
    return <OnboardingFlow onComplete={() => setOnboardingComplete(true)} />
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pb-20">
        <Routes>
          <Route
            path="/"
            element={
              <div className="max-w-md mx-auto p-4 pt-4">
                <div className="text-center mb-6 sticky top-0 bg-gradient-to-b from-slate-900 to-transparent z-10 pb-4">
                  <h1 className="text-2xl font-bold text-white mb-1">BeGlobal</h1>
                  <p className="text-slate-400">Aprende a vender online 🚀</p>
                </div>

                {gameState ? (
                  <DashboardView gameState={gameState} />
                ) : (
                  <Card>
                    <CardContent>
                      <p className="text-center text-slate-300">
                        {isLoading ? "Cargando..." : "Completa el diagnóstico para empezar"}
                      </p>
                    </CardContent>
                  </Card>
                )}

                <div className="text-center mt-8 pb-8">
                  <p className="text-xs text-slate-500">
                    Usuario: {user?.username || user?.first_name || "Anónimo"}
                  </p>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
