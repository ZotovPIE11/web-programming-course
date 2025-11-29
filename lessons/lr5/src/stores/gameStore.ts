import { makeAutoObservable } from 'mobx';
import { Question, Answer } from '../types/quiz';
import { mockQuestions } from '../data/questions';
import type { QuestionPreview, AnswerResult } from '../../generated/api/quizBattleAPI.schemas';

/**
 * GameStore - MobX Store для управления игровой логикой
 *
 * Используется в Task2 и Task4
 */
class GameStore {
  // Observable состояние
  gameStatus: 'idle' | 'playing' | 'finished' = 'idle';

  // Список вопросов
  questions: Question[] = [];
  // Индекс текущего вопроса
  currentQuestionIndex = 0;
  // Набранный счёт
  score = 0;
  // Выбранные ответы для текущего вопроса (множественный выбор)
  selectedAnswers: number[] = [];
  // История ответов
  answeredQuestions: Answer[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  // Actions - методы для изменения состояния

  startGame() {
    this.gameStatus = 'playing';
    this.questions = mockQuestions;
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.selectedAnswers = [];
    this.answeredQuestions = [];
  }

  /**
   * Переключение варианта ответа (множественный выбор)
   */
  toggleAnswer(answerIndex: number) {
    if (this.selectedAnswers.includes(answerIndex)) {
      this.selectedAnswers = this.selectedAnswers.filter((i) => i !== answerIndex);
    } else {
      this.selectedAnswers = [...this.selectedAnswers, answerIndex];
    }
  }

  /**
   * Сохранить ответ на текущий вопрос в историю и обновить счёт
   */
  saveCurrentAnswer() {
    const question = this.currentQuestion;
    if (!question || this.selectedAnswers.length === 0) return;

    const correctIndex = question.correctAnswer;
    const isCorrect =
      this.selectedAnswers.length === 1 && this.selectedAnswers[0] === correctIndex;

    if (isCorrect) {
      this.score += 1;
    }

    this.answeredQuestions.push({
      questionId: question.id,
      selectedAnswers: [...this.selectedAnswers],
      isCorrect,
    });
  }

  /**
   * Переход к следующему вопросу
   */
  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex += 1;
      this.selectedAnswers = [];
    } else {
      this.finishGame();
    }
  }

  /**
   * Завершить игру
   */
  finishGame() {
    this.gameStatus = 'finished';
  }

  /**
   * Полный сброс состояния
   */
  resetGame() {
    this.gameStatus = 'idle';
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.selectedAnswers = [];
    this.answeredQuestions = [];
  }

  // Computed values - вычисляемые значения

  get currentQuestion(): Question | null {
    if (this.questions.length === 0) return null;
    return this.questions[this.currentQuestionIndex] ?? null;
  }

  get progress(): number {
    if (this.questions.length === 0) return 0;
    // Процент уже пройденных вопросов
    return Math.round((this.currentQuestionIndex / this.questions.length) * 100);
  }

  get isLastQuestion(): boolean {
    if (this.questions.length === 0) return false;
    return this.currentQuestionIndex === this.questions.length - 1;
  }

  get correctAnswersCount(): number {
    return this.answeredQuestions.filter((a) => a.isCorrect).length;
  }

  /**
   * Загружает вопросы из API-сессии в локальный store
   */
  setQuestionsFromAPI(questions: QuestionPreview[]) {
    this.questions = questions.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options ?? [],
      // Правильные ответы на клиент не приходят, поэтому помечаем как -1
      correctAnswer: -1,
      difficulty: q.difficulty,
    }));
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.selectedAnswers = [];
    this.answeredQuestions = [];
    this.gameStatus = 'playing';
  }

  /**
   * Обновляет результат последнего ответа по данным с сервера
   */
  updateAnswerResult(apiResult: AnswerResult) {
    const isCorrect = apiResult.status === 'correct';
    const points = apiResult.pointsEarned ?? 0;

    this.score += points;

    const last = this.answeredQuestions[this.answeredQuestions.length - 1];
    if (last) {
      last.isCorrect = isCorrect;
    }
  }
}

export const gameStore = new GameStore();
