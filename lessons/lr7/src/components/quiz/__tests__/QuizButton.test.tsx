import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { act } from '@testing-library/react'
import QuizButton from '../QuizButton'
import { useUIStore } from '../../../stores/uiStore'

describe('QuizButton', () => {
  beforeEach(() => {
    act(() => {
      useUIStore.setState({ theme: 'light' })
    })
  })

  it('should render button with text', () => { // проверяем создаются ли кнопки со значением
    render(<QuizButton onClick={() => {}}>Click me</QuizButton>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('should call onClick when clicked', async () => {
    const handleClick = vi.fn() //отслеживание состояний
    const user = userEvent.setup() //копируем объект пользователя

    render(<QuizButton onClick={handleClick}>Click me</QuizButton>)
    await user.click(screen.getByRole('button')) //нажимаем от лица этого юзера на кнопку
    await user.click(screen.getByRole('button')) //еще раз нажмем
    await user.click(screen.getByRole('button')) //и последний раз нажмем
    expect(handleClick).toHaveBeenCalledTimes(3) //смотрим сколько раз нажали кнопку 
  })

  it('should not call onClick when disabled', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<QuizButton onClick={handleClick} disabled>Click me</QuizButton>) //рендерим неактивную кнопку
    await user.click(screen.getByRole('button')) //тыкаем на нее

    expect(handleClick).not.toHaveBeenCalled() //для прохождения теста в отслеживании состояний должно быть пусто, ибо кнопка неактивная 
  })
})
