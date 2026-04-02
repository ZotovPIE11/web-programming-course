import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

// Mock localStorage для Zustand persist middleware
class LocalStorageMock {
  private store: Record<string, string> = {}

  getItem(key: string): string | null {
    return this.store[key] || null
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value)
  }

  removeItem(key: string): void {
    delete this.store[key]
  }

  clear(): void {
    this.store = {}
  }

  get length(): number {
    return Object.keys(this.store).length
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store)
    return keys[index] || null
  }
}

const localStorageMock = new LocalStorageMock()

// Устанавливаем mock перед всеми тестами
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

// Очищаем localStorage перед каждым тестом
beforeEach(() => {
  localStorageMock.clear()
})

// Автоматическая очистка после каждого теста
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})
