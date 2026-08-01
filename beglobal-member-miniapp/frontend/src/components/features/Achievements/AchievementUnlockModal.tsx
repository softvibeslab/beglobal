import React, { useEffect } from "react"
import { motion } from "framer-motion"
import { Modal, Button } from "@/components/common"

interface Achievement {
  code: string
  title: string
  description: string
  icon: string
}

interface AchievementUnlockModalProps {
  achievement: Achievement | null
  onClose: () => void
}

// Confetti particle
const Confetti = ({ delay }: { delay: number }) => (
  <motion.div
    initial={{ y: -10, x: Math.random() * 100 - 50, opacity: 1 }}
    animate={{ y: 500, opacity: 0 }}
    transition={{ duration: 2, delay }}
    className="fixed pointer-events-none"
  >
    {Math.random() > 0.5 ? "🎉" : "✨"}
  </motion.div>
)

export const AchievementUnlockModal: React.FC<AchievementUnlockModalProps> = ({
  achievement,
  onClose,
}) => {
  if (!achievement) return null

  return (
    <>
      {/* Confetti effect */}
      {Array.from({ length: 20 }).map((_, i) => (
        <Confetti key={i} delay={i * 0.05} />
      ))}

      <Modal isOpen={!!achievement} onClose={onClose} size="sm">
        <div className="flex flex-col items-center justify-center py-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
            className="text-8xl mb-6"
          >
            {achievement.icon}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-white text-center mb-2"
          >
            ¡Logro Desbloqueado!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl font-semibold text-primary-400 text-center mb-2"
          >
            {achievement.title}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-slate-300 text-center mb-6"
          >
            {achievement.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button variant="primary" onClick={onClose}>
              Continuar
            </Button>
          </motion.div>
        </div>
      </Modal>
    </>
  )
}
