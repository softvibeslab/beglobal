import React, { useState } from "react"
import { motion } from "framer-motion"
import { Button, Card, CardContent } from "@/components/common"

interface ProductSelectorProps {
  onSelect: (value: string) => void
  onBack: () => void
}

const products = [
  { id: "physical", label: "Productos físicos", description: "Ropa, electrónica, etc", icon: "📦" },
  { id: "digital", label: "Productos digitales", description: "Cursos, plantillas, etc", icon: "💻" },
  { id: "services", label: "Servicios", description: "Consultoría, diseño, etc", icon: "🎨" },
  { id: "saas", label: "SaaS/Software", description: "App o software recurrente", icon: "⚙️" },
]

export const ProductSelector: React.FC<ProductSelectorProps> = ({ onSelect, onBack }) => {
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
        <h2 className="text-2xl font-bold text-white mb-2">¿Qué vendes?</h2>
        <p className="text-slate-400 mb-8">Adaptamos las estrategias a tu modelo</p>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {products.map((prod, idx) => (
            <motion.button
              key={prod.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelected(prod.id)}
              className={`transition-all ${
                selected === prod.id ? "ring-2 ring-primary-500" : ""
              }`}
            >
              <Card
                className={`h-full cursor-pointer text-center transition-all ${
                  selected === prod.id
                    ? "bg-primary-900 border-primary-500"
                    : "bg-slate-800 hover:bg-slate-700"
                }`}
              >
                <CardContent className="p-4">
                  <div className="text-3xl mb-2">{prod.icon}</div>
                  <p className="font-semibold text-white text-sm">{prod.label}</p>
                  <p className="text-xs text-slate-400 mt-1">{prod.description}</p>
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
