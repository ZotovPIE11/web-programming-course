import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { act } from '@testing-library/react'
import EssayQuestion from '../EssayQuestion'
import { useUIStore } from '../../../stores/uiStore'
import { mockEssayQuestion } from '../../../test/mockData'

describe('EssayQuestion', () => {
  const defaultProps = {
    question: mockEssayQuestion,
    essayAnswer: '',
    onAnswerChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    act(() => {
      useUIStore.setState({ theme: 'light' })
    })
  })

  it('should render textarea with placeholder', () => {   //следует отобразить текстовую область с помощью заполнителя
    render(<EssayQuestion {...defaultProps} />)
    expect(screen.getByPlaceholderText('Введите ваш ответ здесь...')).toBeInTheDocument()
  })

  it('should display current answer value', () => {  //должно отображаться текущее значение ответа пользователя
    render(<EssayQuestion {...defaultProps} essayAnswer="Test answer" />)
    expect(screen.getByDisplayValue('Test answer')).toBeInTheDocument()
  })
 //бахнем два теста в одном 
  it('should call onAnswerChange when typing', async () => { //следует вызывать onAnswerChange при вводе текста
    const handleChange = vi.fn() //создаем отслеживание и записываем в handleChange
    const user = userEvent.setup() //создаем копию объекта

    render(<EssayQuestion {...defaultProps} onAnswerChange={handleChange} />)

    const textarea = screen.getByPlaceholderText('Введите ваш ответ здесь...')
    await user.type(textarea, 'A')

    expect(handleChange).toHaveBeenCalledWith('A')
  })

  it('should show character count', () => { //должно отображаться количество символов
    render(<EssayQuestion {...defaultProps} essayAnswer="Hello,world" />)
    expect(screen.getByText(/11 символов/)).toBeInTheDocument()
  })

  it('should display minimum length requirement', () => { //ищем вариант ответа с минимальным значением (ответ с mockData)
    render(<EssayQuestion {...defaultProps} />)
    expect(screen.getByText(/минимум 100/)).toBeInTheDocument()
  })

  it('should respect maxLength attribute', () => { //Ищем максимальную длину ответа (ответ с mockData)
    render(<EssayQuestion {...defaultProps} />)
    const textarea = screen.getByPlaceholderText('Введите ваш ответ здесь...') as HTMLTextAreaElement
    expect(textarea.maxLength).toBe(1000)
  })
})
