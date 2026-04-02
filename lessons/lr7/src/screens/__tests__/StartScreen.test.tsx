import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { act } from '@testing-library/react'
import StartScreen from '../StartScreen'
import { useUIStore } from '../../stores/uiStore'

describe('StartScreen', () => {
  const mockOnStart = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    act(() => {
      useUIStore.setState({ theme: 'light', soundEnabled: true })
    })
  })

  it('should render main content', () => { //Проверяем страницу на наличие текста
    render(<StartScreen onStart={mockOnStart} isLoading={false} />)

    expect(screen.getByText('Quiz Game')).toBeInTheDocument()
    expect(screen.getByText('MobX + Zustand Edition')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Начать игру' })).toBeInTheDocument()
  })

  it('should call onStart when start button is clicked', async () => {
    const user = userEvent.setup()
    render(<StartScreen onStart={mockOnStart} isLoading={false} />)

    await user.click(screen.getByRole('button', { name: 'Начать игру' }))

    expect(mockOnStart).toHaveBeenCalledTimes(1)
  })

  it('should disable button when loading', () => {
    render(<StartScreen onStart={mockOnStart} isLoading={true} />)

    const button = screen.getByRole('button', { name: 'Загрузка...' })
    expect(button).toBeDisabled()
  })

  it('should toggle theme when theme button clicked', async () => {
    const user = userEvent.setup() //копируем юзера
    act(() => {
      useUIStore.setState({ theme: 'light' }) //передаем светлую тему в функцию выбранной темы
    })

    const { rerender } = render(<StartScreen onStart={mockOnStart} isLoading={false} />) //перезапускаем
    expect(screen.getByText('🌙')).toBeInTheDocument()  //ищем тепную тему по тексту

    const themeButton = screen.getAllByRole('button').find(button =>
      button.textContent?.includes('🌙') //ищем кнопку с темной темой
    )

    if (themeButton) {
      await user.click(themeButton) //нажимаем на кнопку темной темы
    }

    rerender(<StartScreen onStart={mockOnStart} isLoading={false} />)
    expect(screen.getByText('☀️')).toBeInTheDocument() //значение должно смениться на переключение на светлую тему
  })
})
