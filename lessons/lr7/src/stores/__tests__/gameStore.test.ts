import { describe, it, expect, beforeEach } from 'vitest'
import { GameStore } from '../gameStore'
import { mockQuestions } from '../../test/mockData'

describe('GameStore', () => {
  let store: GameStore

  beforeEach(() => {
    store = new GameStore()
  })

  it('should initialize with default values', () => {  //проверка значений по умолчанию (до начала прохождения пусто)
    expect(store.gameStatus).toBe('idle')
    expect(store.questions).toEqual([])
    expect(store.score).toBe(0)
    expect(store.selectedAnswers).toEqual([])
  })

  it('should start game and reset state', () => { //запуск игры и сброс состояния
    store.score = 100 //храним значения типо прошлой игры
    store.selectedAnswers = [0, 1]

    store.startGame() //запускаем игру

    expect(store.gameStatus).toBe('playing') //проверка состояний 
    expect(store.score).toBe(0)
    expect(store.selectedAnswers).toEqual([])
  })

  it('should toggle answer selection', () => { //проверка на то, что при повторном нажатии ответ отменяется 
    store.toggleAnswer(0)
    expect(store.selectedAnswers).toEqual([0])

    store.toggleAnswer(0)
    expect(store.selectedAnswers).toEqual([])
  })

  it('should save correct answer', () => {
    store.setQuestionsFromAPI(mockQuestions) //берем вопрос
    store.toggleAnswer(0) // Правильный ответ (заведомо правильный берем)
    store.saveCurrentAnswer() //сохраняем текущий ответ 

    expect(store.answeredQuestions).toHaveLength(1) //сколько ответов хранится
    expect(store.answeredQuestions[0].isCorrect).toBe(true) //проверяем правильный ли ответ
  })
})
