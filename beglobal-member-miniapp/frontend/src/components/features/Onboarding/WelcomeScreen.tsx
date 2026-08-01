import React from "react"
import { motion } from "framer-motion"
import { Button, Card, CardContent } from "@/components/common"

interface WelcomeScreenProps {
  onNext: () => void
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl mb-6"
        >
          🚀
        </motion.div>

        <h1 className="text-3xl font-bold text-white mb-4">Bienvenido a BeGlobal</h1>
        <p className="text-slate-300 mb-8 text-lg">Aprende a crear y escalar tu negocio de ecommerce</p>

        <Card className="mb-8 bg-slate-800/50">
          <CardContent>
            <p className="text-slate-200 text-sm">
              Gamificación con XP, logros y racha diaria. 10 lecciones + 10 misiones prácticas.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Button fullWidth variant="primary" size="lg" onClick={onNext}>
            Empecemos
          </Button>
          <p className="text-xs text-slate-400">Esto toma ~2 minutos</p>
        </div>
      </motion.div>
    </div>
  )
}
