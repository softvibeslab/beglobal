import axios from "axios"
import { useTelegram } from "./useTelegram"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8090"

export const useApi = () => {
  const { initData } = useTelegram()

  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  })

  client.interceptors.request.use((config) => {
    if (initData) {
      config.headers["x-tg-init-data"] = initData
    }
    return config
  })

  return client
}

export const useApiForm = () => {
  const { initData } = useTelegram()

  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  client.interceptors.request.use((config) => {
    if (initData) {
      config.headers["x-tg-init-data"] = initData
    }
    return config
  })

  return client
}
