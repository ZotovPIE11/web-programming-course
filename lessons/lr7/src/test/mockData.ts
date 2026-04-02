import type { Question, QuestionResponse } from '../types/quiz'

export const mockQuestions: Question[] = [
  {
    id: '1',
    type: 'multiple-select',
    question: 'Что такое React?',
    options: [
      'Библиотека для создания пользовательских интерфейсов',
      'Язык программирования',
      'База данных',
      'Операционная система',
    ],
    correctAnswer: 0,
    difficulty: 'easy',
  },
  {
    id: '2',
    type: 'multiple-select',
    question: 'Какой хук используется для управления состоянием?',
    options: ['useEffect', 'useState', 'useContext', 'useMemo'],
    correctAnswer: 1,
    difficulty: 'medium',
  },
  {
    id: '3',
    type: 'essay',
    question: 'Объясните, что такое виртуальный DOM',
    correctAnswer: 0,
    difficulty: 'hard',
    minLength: 50,
    maxLength: 500,
  },
]

export const mockQuestionResponses: QuestionResponse[] = [
  {
    id: '1',
    type: 'multiple-select',
    question: 'Что такое React?',
    options: [
      'Библиотека для создания пользовательских интерфейсов',
      'Язык программирования',
      'База данных',
      'Операционная система',
    ],
    difficulty: 'easy',
    maxPoints: 10,
  },
  {
    id: '2',
    type: 'multiple-select',
    question: 'Какой хук используется для управления состоянием?',
    options: ['useEffect', 'useState', 'useContext', 'useMemo'],
    difficulty: 'medium',
    maxPoints: 15,
  },
]

export const mockSingleQuestion: Question = {
  id: 'test-1',
  type: 'multiple-select',
  question: 'Тестовый вопрос?',
  options: ['Вариант 1', 'Вариант 2', 'Вариант 3', 'Вариант 4'],
  correctAnswer: 2,
  difficulty: 'easy',
}

export const mockEssayQuestion: Question = {
  id: 'essay-1',
  type: 'essay',
  question: 'Напишите эссе о React',
  correctAnswer: 0,
  difficulty: 'hard',
  minLength: 100,
  maxLength: 1000,
}
