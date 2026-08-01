import React, { useState } from "react"
import { useApi } from "@/hooks/useApi"
import { useGameStore } from "@/store/gameStore"
import { WelcomeScreen } from "./WelcomeScreen"
import { ExperienceSelector } from "./ExperienceSelector"
import { ProductSelector } from "./ProductSelector"
import { ChannelSelector } from "./ChannelSelector"
import { OnboardingProgress } from "./OnboardingProgress"
import { motion } from "framer-motion"

interface OnboardingFlowProps {
  onComplete: () => void
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const api = useApi()
  const { setGameState } = useGameStore()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    experience: "",
    product: "",
    channel: "",
    blocker: "capital",
    capital: "1000",
  })

  const handleExperienceSelect = (value: string) => {
    setFormData({ ...formData, experience: value })
    setStep(2)
  }

  const handleProductSelect = (value: string) => {
    setFormData({ ...formData, product: value })
    setStep(3)
  }

  const handleChannelSelect = async (value: string) => {
    const newData = { ...formData, channel: value }
    setFormData(newData)
    setLoading(true)

    try {
      const response = await api.post("/api/member/diagnosis", newData)
      setGameState(response.data)
      setTimeout(() => onComplete(), 500)
    } catch (error) {
      console.error("Error submitting diagnosis:", error)
      setLoading(false)
    }
  }

  return (
    <>
      <OnboardingProgress current={step + 1} total={4} />

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {step === 0 && <WelcomeScreen onNext={() => setStep(1)} />}
        {step === 1 && (
          <ExperienceSelector
            onSelect={handleExperienceSelect}
            onBack={() => setStep(0)}
          />
        )}
        {step === 2 && (
          <ProductSelector
            onSelect={handleProductSelect}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <ChannelSelector
            onSelect={handleChannelSelect}
            onBack={() => setStep(2)}
          />
        )}
      </motion.div>

      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-primary-300 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white">Completando tu perfil...</p>
          </div>
        </div>
      )}
    </>
  )
}
