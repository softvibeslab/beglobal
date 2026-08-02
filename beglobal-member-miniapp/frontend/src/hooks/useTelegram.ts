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
    const tg = (window as any).Tg as TelegramWebApp

    if (tg) {
      // Estamos en Telegram WebApp
      tg.ready()
      setIsReady(true)
      setUser(tg.initDataUnsafe.user)
      setInitData(tg.initData)

      if (!tg.isExpanded) {
        tg.expand()
      }
    } else {
      // Modo testing - cuando no estamos en Telegram
      setIsReady(true)
      setUser({
        id: 12345,
        is_bot: false,
        first_name: "Usuario",
        username: "test_user"
      })
      setInitData("test_init_data")
    }
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
