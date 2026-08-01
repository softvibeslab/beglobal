import React, { useState } from "react"
import { motion } from "framer-motion"
import { Button, Card, CardContent } from "@/components/common"

interface ChannelSelectorProps {
  onSelect: (value: string) => void
  onBack: () => void
}

const channels = [
  { id: "instagram", label: "Instagram", description: "DMs + Link en bio", icon: "📸" },
  { id: "whatsapp", label: "WhatsApp", description: "Mensajes directos", icon: "💬" },
  { id: "tiktok", label: "TikTok", description: "Videos + Link en bio", icon: "🎥" },
  { id: "shopify", label: "Shopify/Tienda", description: "Tienda online propia", icon: "🛍️" },
  { id: "facebook", label: "Facebook", description: "Marketplace + Ads", icon: "f" },
  { id: "marketplace", label: "Marketplace", description: "Mercado Libre, Amazon", icon: "🏬" },
]

export const ChannelSelector: React.FC<ChannelSelectorProps> = ({ onSelect, onBack }) => {
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
        <h2 className="text-2xl font-bold text-white mb-2">¿Dónde vendes principalmente?</h2>
        <p className="text-slate-400 mb-8">Enfocamos en tu canal principal</p>

        <div className="space-y-3 mb-8">
          {channels.map((channel, idx) => (
            <motion.button
              key={channel.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelected(channel.id)}
              className={`w-full text-left transition-all ${
                selected === channel.id ? "ring-2 ring-primary-500" : ""
              }`}
            >
              <Card
                className={`cursor-pointer transition-all ${
                  selected === channel.id
                    ? "bg-primary-900 border-primary-500"
                    : "bg-slate-800 hover:bg-slate-700"
                }`}
              >
                <CardContent>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{channel.icon}</span>
                    <div>
                      <p className="font-semibold text-white">{channel.label}</p>
                      <p className="text-sm text-slate-400">{channel.description}</p>
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
