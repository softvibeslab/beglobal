import React from "react"
import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"

interface NavItem {
  path: string
  icon: string
  label: string
}

const navItems: NavItem[] = [
  { path: "/", icon: "🏠", label: "Inicio" },
  { path: "/lessons", icon: "📚", label: "Lecciones" },
  { path: "/missions", icon: "🎲", label: "Misiones" },
  { path: "/achievements", icon: "🏆", label: "Logros" },
  { path: "/leaderboard", icon: "📊", label: "Ranking" },
]

export const BottomNav: React.FC = () => {
  const location = useLocation()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 z-40">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link key={item.path} to={item.path} className="flex-1">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className={`w-full py-3 px-2 flex flex-col items-center gap-1 transition-colors ${
                    isActive
                      ? "text-primary-400 bg-slate-800/50"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-xs font-medium">{item.label}</span>
                </motion.button>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
