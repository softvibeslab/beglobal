import React, { useState } from "react"
import { motion } from "framer-motion"
import { Button, Card, CardContent } from "@/components/common"

interface ExperienceSelectorProps {
  onSelect: (value: string) => void
  onBack: () => void
}

const experiences = [
  {
    id: "no_experience",
    label: "Sin experiencia",
    description: "Primera vez vendiendo online",
    icon: "👶",
  },
  {
    id: "some_experience",
    label: "Algo de experiencia",
    description: "He vendido 1-2 veces",
    icon: "👨‍🎓",
  },
  {
    id: "experienced",
    label: "Experimentado",
    description: "Vendo regularmente",
    icon: "🎯",
  },
  {
    id: "expert",
    label: "Experto",
    description: "Genero 5K+ MXN/mes",
    icon: "🏆",
  },
]

export const ExperienceSelector: React.FC<ExperienceSelectorProps> = ({ onSelect, onBack }) => {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 pt-8">
      <button
        onClick={onBack}
        className="mb-6 text-slate-300 hover:text-white transition-colors"
      >
        ← Atrás
      </button>

      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-white mb-2">¿Cuál es tu experiencia?</h2>
        <p className="text-slate-400 mb-8">Personalizamos el contenido según tu nivel</p>

        <div className="space-y-3 mb-8">
          {experiences.map((exp, idx) => (
            <motion.button
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelected(exp.id)}
              className={`w-full text-left transition-all ${
                selected === exp.id ? "ring-2 ring-primary-500" : ""
              }`}
            >
              <Card
                className={`cursor-pointer transition-all ${
                  selected === exp.id
                    ? "bg-primary-900 border-primary-500"
                    : "bg-slate-800 hover:bg-slate-700"
                }`}
              >
                <CardContent>
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{exp.icon}</span>
                    <div>
                      <p className="font-semibold text-white">{exp.label}</p>
                      <p className="text-sm text-slate-400">{exp.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.button>
          ))}
        </div>

        <Button
          fullWidth
          variant="primary"
          disabled={!selected}
          onClick={() => selected && onSelect(selected)}
        >
          Continuar
        </Button>
      </div>
    </div>
  )
}
