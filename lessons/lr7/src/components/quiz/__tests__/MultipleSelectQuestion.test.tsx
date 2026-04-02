import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { act } from '@testing-library/react'
import MultipleSelectQuestion from '../MultipleSelectQuestion'
import { gameStore } from '../../../stores/gameStore'
import { useUIStore } from '../../../stores/uiStore'
import { mockSingleQuestion } from '../../../test/mockData'

describe('MultipleSelectQuestion', () => {
  const defaultProps = {
    question: mockSingleQuestion,
    selectedAnswers: [],
  }

  beforeEach(() => {
    act(() => {
      gameStore.resetGame()
      useUIStore.setState({ theme: 'light' })
    })
  })

  it('should render all options', () => {  //следует отобразить все параметры
    render(<MultipleSelectQuestion {...defaultProps} />)

    expect(screen.getByText('Вариант 1')).toBeInTheDocument()
    expect(screen.getByText('Вариант 2')).toBeInTheDocument()
    expect(screen.getByText('Вариант 3')).toBeInTheDocument()
    expect(screen.getByText('Вариант 4')).toBeInTheDocument()
  })

  it('should show letter labels when not selected', () => {  //должны отображаться буквенные метки, если они не выбраны
    render(<MultipleSelectQuestion {...defaultProps} />)

    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
    expect(screen.getByText('C')).toBeInTheDocument()
    expect(screen.getByText('D')).toBeInTheDocument()
  })

  it('should show checkmark for selected answers', () => { //Проверяем поведение при выборе или не выборе первого варианта 
    render(<MultipleSelectQuestion {...defaultProps} selectedAnswers={[0]} />)
    expect(screen.getByText('✓')).toBeInTheDocument()
    expect(screen.queryByText('A')).not.toBeInTheDocument()
  })

  it('should toggle answer when clicked', async () => {
    const user = userEvent.setup() //создаем копию объекта
    render(<MultipleSelectQuestion {...defaultProps} />)  

    const buttons = screen.getAllByRole('button') //записываем все возможные значения кнопок
    await user.click(buttons[0]) //тыкаем первую кнопку

    expect(gameStore.selectedAnswers).toContain(0)  //проверяем существует ли эта кнопка
  })

  it('should disable all buttons when disabled', () => {
    render(<MultipleSelectQuestion {...defaultProps} disabled />) //рендерим неактивные кнопки

    const buttons = screen.getAllByRole('button') //записываем все возможные значения кнопок
    buttons.forEach(button => {   //перебираем все кнопки
      expect(button).toBeDisabled() //провалим тест если есть хоть одна активная
    })
  })
})
