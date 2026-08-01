import React, { useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useTelegram } from "@/hooks/useTelegram"
import { useGameStore } from "@/store/gameStore"
import { useApi } from "@/hooks/useApi"
import { ProfileCard } from "@/components/features/Dashboard/ProfileCard"
import { Card, CardContent, Button } from "@/components/common"

function App() {
  const { isReady, user, initData } = useTelegram()
  const { gameState, setGameState, isLoading } = useGameStore()
  const api = useApi()

  useEffect(() => {
    if (!isReady || !initData) return

    const loadDashboard = async () => {
      try {
        const response = await api.get("/api/member/dashboard")
        setGameState(response.data)
      } catch (err) {
        console.error("Error loading dashboard:", err)
      }
    }

    loadDashboard()
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

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pb-20">
        <Routes>
          <Route
            path="/"
            element={
              <div className="max-w-md mx-auto p-4 space-y-4 pt-4">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-white mb-1">BeGlobal</h1>
                  <p className="text-slate-400">Aprende a vender online 🚀</p>
                </div>

                {gameState ? (
                  <>
                    <ProfileCard gameState={gameState} />

                    <Card>
                      <CardContent>
                        <div className="text-center space-y-4">
                          <div>
                            <p className="text-slate-400 text-sm mb-2">Completado</p>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-slate-700 rounded-lg p-3">
                                <div className="text-2xl font-bold text-primary-400">
                                  {gameState.lessonsCompleted}
                                </div>
                                <p className="text-xs text-slate-400">Lecciones</p>
                              </div>
                              <div className="bg-slate-700 rounded-lg p-3">
                                <div className="text-2xl font-bold text-secondary-400">
                                  {gameState.missionsCompleted}
                                </div>
                                <p className="text-xs text-slate-400">Misiones</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Button fullWidth variant="primary" disabled={isLoading}>
                      {isLoading ? "Cargando..." : "Continuar aprendiendo"}
                    </Button>
                  </>
                ) : (
                  <Card>
                    <CardContent>
                      <p className="text-center text-slate-300">
                        Completa el diagnóstico para empezar
                      </p>
                    </CardContent>
                  </Card>
                )}

                <div className="text-center mt-8">
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
