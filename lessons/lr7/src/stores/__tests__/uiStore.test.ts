import { describe, it, expect, beforeEach } from 'vitest'
import { useUIStore } from '../uiStore'
import { act } from '@testing-library/react'

describe('UIStore', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should have initial state', () => { //проинициализировались ли темы
    const { theme} = useUIStore.getState()
    expect(['light', 'dark']).toContain(theme)
  })

  it('should set theme', () => { //проверяем установилась ли тема
    act(() => {
      useUIStore.getState().setTheme('dark')
    })

    expect(useUIStore.getState().theme).toBe('dark')
  })

  it('should toggle theme', () => { //проверяем меняется ли тема вообще (смотрим перезаписываются ли данные в хранилище данных)
    act(() => {
      useUIStore.getState().setTheme('light')
    })

    act(() => {
      useUIStore.getState().toggleTheme()
    })
    expect(useUIStore.getState().theme).toBe('dark')

    act(() => {
      useUIStore.getState().toggleTheme()
    })
    expect(useUIStore.getState().theme).toBe('light')
  })
})
