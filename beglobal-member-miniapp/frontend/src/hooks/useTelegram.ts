import { useEffect, useState } from "react"

interface TelegramUser {
  id: number
  is_bot: boolean
  first_name: string
  username?: string
  language_code?: string
}

interface TelegramWebApp {
  ready: () => void
  close: () => void
  sendData: (data: string) => void
  MainButton: {
    setText: (text: string) => void
    show: () => void
    hide: () => void
    onClick: (fn: () => void) => void
  }
  BackButton: {
    show: () => void
    hide: () => void
    onClick: (fn: () => void) => void
  }
  initData: string
  initDataUnsafe: {
    user: TelegramUser
    auth_date: number
    hash: string
  }
  isExpanded: boolean
  expand: () => void
  viewportHeight: number
}

export const useTelegram = () => {
  const [isReady, setIsReady] = useState(false)
  const [user, setUser] = useState<TelegramUser | null>(null)
  const [initData, setInitData] = useState<string>("")

  useEffect(() => {
    const initTelegram = () => {
      const tg = (window as any).Tg as TelegramWebApp

      try {
        if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
          // Estamos en Telegram WebApp
          if (typeof tg.ready === 'function') {
            tg.ready()
          }
          setUser(tg.initDataUnsafe.user)
          setInitData(tg.initData || "")

          if (tg.isExpanded === false && typeof tg.expand === 'function') {
            tg.expand()
          }
        } else {
          // Modo testing - cuando no estamos en Telegram
          setUser({
            id: 12345,
            is_bot: false,
            first_name: "Usuario",
            username: "test_user"
          })
          setInitData("test_init_data")
        }
      } catch (error) {
        console.error("Error initializing Telegram:", error)
        // Fallback a testing mode
        setUser({
          id: 12345,
          is_bot: false,
          first_name: "Usuario",
          username: "test_user"
        })
        setInitData("test_init_data")
      }

      setIsReady(true)
    }

    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initTelegram)
      return () => document.removeEventListener('DOMContentLoaded', initTelegram)
    } else {
      initTelegram()
    }

    // Timeout de seguridad - forzar inicialización después de 2 segundos
    const timeout = setTimeout(() => {
      setIsReady(true)
      setUser({
        id: 12345,
        is_bot: false,
        first_name: "Usuario",
        username: "test_user"
      })
    }, 2000)

    return () => clearTimeout(timeout)
  }, [])

  return {
    isReady,
    user,
    initData,
    tg: (window as any).Tg as TelegramWebApp | undefined,
  }
}

export const useMainButton = () => {
  const tg = (window as any).Tg as TelegramWebApp | undefined

  return {
    setText: (text: string) => tg?.MainButton.setText(text),
    show: () => tg?.MainButton.show(),
    hide: () => tg?.MainButton.hide(),
    onClick: (fn: () => void) => tg?.MainButton.onClick(fn),
  }
}

export const useBackButton = () => {
  const tg = (window as any).Tg as TelegramWebApp | undefined

  return {
    show: () => tg?.BackButton.show(),
    hide: () => tg?.BackButton.hide(),
    onClick: (fn: () => void) => tg?.BackButton.onClick(fn),
  }
}
