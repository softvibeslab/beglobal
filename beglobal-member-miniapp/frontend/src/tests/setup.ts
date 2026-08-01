import "@testing-library/jest-dom"
import { expect, afterEach, vi } from "vitest"
import { cleanup } from "@testing-library/react"

afterEach(() => {
  cleanup()
})

global.Tg = {
  ready: vi.fn(),
  close: vi.fn(),
  sendData: vi.fn(),
  MainButton: {
    setText: vi.fn(),
    show: vi.fn(),
    hide: vi.fn(),
    onClick: vi.fn(),
  },
  BackButton: {
    show: vi.fn(),
    hide: vi.fn(),
    onClick: vi.fn(),
  },
  initData: "test_data",
  initDataUnsafe: {
    user: {
      id: 123,
      is_bot: false,
      first_name: "Test",
      username: "testuser",
    },
    auth_date: Math.floor(Date.now() / 1000),
    hash: "test_hash",
  },
  isExpanded: false,
  expand: vi.fn(),
  viewportHeight: 800,
} as any
