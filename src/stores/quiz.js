import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  startQuizSession,
  submitQuizAnswer,
  fetchNextQuestion,
  fetchQuizResult
} from '@/services/api.js'

/**
 * Couleurs associées aux catégories (l'API ne les fournit pas)
 * Mapping par slug pour rester cohérent
 */
const CATEGORY_COLORS = {
  histoire: '#FF8C00',
  geographie: '#3B82F6',
  culture: '#009E49',
  economie: '#8B5CF6',
  sport: '#E53E3E',
  technologie: '#0EA5E9',
  coran: '#14B8A6',
  bible: '#EC4899'
}

/** Retourne la couleur associée à une catégorie */
export function getCategoryColor(slug) {
  return CATEGORY_COLORS[slug] || '#FF8C00'
}

/**
 * Store principal du quiz
 * Gère l'état de la partie via l'API : session, question courante, réponses
 */
export const useQuizStore = defineStore('quiz', () => {
  // --- État de la session ---
  const sessionId = ref(null)
  const selectedCategory = ref(null)
  const currentQuestion = ref(null)
  const meta = ref({ totalQuestions: 0, currentQuestion: 0, timeLimit: 15 })
  const loading = ref(false)
  const error = ref(null)

  // --- État de la réponse en cours ---
  const answered = ref(false)
  const selectedAnswerId = ref(null)
  const answerResult = ref(null)

  // --- Historique local ---
  const score = ref(0)
  const answers = ref([])
  const completed = ref(false)

  // --- Résultats API ---
  const apiResult = ref(null)

  // --- Computed ---

  /** Index courant (0-based, pour l'affichage) */
  const currentIndex = computed(() => meta.value.currentQuestion - 1)

  /** Nombre total de questions */
  const totalQuestions = computed(() => meta.value.totalQuestions)

  /** Pourcentage de progression */
  const progressPercent = computed(() => {
    if (totalQuestions.value === 0) return 0
    return (meta.value.currentQuestion / totalQuestions.value) * 100
  })

  /** Pourcentage du score final */
  const scorePercent = computed(() => {
    if (apiResult.value) return apiResult.value.score.percentage
    if (totalQuestions.value === 0) return 0
    return Math.round((score.value / totalQuestions.value) * 100)
  })

  /** Message de résultat selon le score */
  const resultMessage = computed(() => {
    if (scorePercent.value === 100) return 'Parfait !'
    if (scorePercent.value >= 60) return 'Bien joué !'
    return 'Continuez !'
  })

  /** Vérifie si c'est la dernière question */
  const isLastQuestion = computed(() => meta.value.currentQuestion >= totalQuestions.value)

  /** Options de la question courante (format compatible avec QuizOption) */
  const currentOptions = computed(() => {
    if (!currentQuestion.value) return []
    return currentQuestion.value.answers || []
  })

  /** Index de l'option sélectionnée (pour QuizOption :is-picked) */
  const selectedOptionIndex = computed(() => {
    if (!selectedAnswerId.value || !currentOptions.value.length) return -1
    return currentOptions.value.findIndex(a => a.id === selectedAnswerId.value)
  })

  /** Index de la bonne réponse (révélé après soumission) */
  const correctOptionIndex = computed(() => {
    if (!answerResult.value) return -1
    return currentOptions.value.findIndex(a => a.id === answerResult.value.correctAnswer.id)
  })

  // --- Actions API ---

  /** Démarre un quiz via l'API */
  async function startQuiz(category) {
    loading.value = true
    error.value = null
    completed.value = false
    apiResult.value = null
    score.value = 0
    answers.value = []
    answered.value = false
    selectedAnswerId.value = null
    answerResult.value = null

    // Enrichit la catégorie avec la couleur
    selectedCategory.value = {
      ...category,
      color: getCategoryColor(category.slug)
    }

    try {
      const data = await startQuizSession(category.id)
      sessionId.value = data.sessionId
      currentQuestion.value = data.question
      meta.value = data.meta

      // Met à jour la catégorie avec les données API si disponibles
      if (data.category) {
        selectedCategory.value = {
          ...data.category,
          color: getCategoryColor(data.category.slug)
        }
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /** Soumet la réponse à l'API */
  async function submitAnswer(answerId) {
    if (answered.value || !sessionId.value) return

    selectedAnswerId.value = answerId
    answered.value = true
    loading.value = true

    try {
      const result = await submitQuizAnswer(sessionId.value, answerId)
      answerResult.value = result

      if (result.isCorrect) {
        score.value++
      }

      // Enregistre dans l'historique local
      answers.value.push({
        question: currentQuestion.value.text,
        providedAnswer: result.providedAnswer?.text || null,
        correctAnswer: result.correctAnswer?.text || '',
        isCorrect: result.isCorrect,
        timeExpired: result.timeExpired
      })

      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /** Soumet une réponse "temps écoulé" (envoie la dernière option comme fallback) */
  async function submitTimeExpired() {
    if (answered.value || !sessionId.value || !currentOptions.value.length) return

    // Envoie le dernier choix possible pour signaler le timeout
    const fallbackId = currentOptions.value[currentOptions.value.length - 1].id
    selectedAnswerId.value = null
    answered.value = true
    loading.value = true

    try {
      const result = await submitQuizAnswer(sessionId.value, fallbackId)
      answerResult.value = result

      answers.value.push({
        question: currentQuestion.value.text,
        providedAnswer: null,
        correctAnswer: result.correctAnswer?.text || '',
        isCorrect: false,
        timeExpired: true
      })

      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /** Passe à la question suivante via l'API */
  async function nextQuestion() {
    if (!sessionId.value) return

    loading.value = true
    answered.value = false
    selectedAnswerId.value = null
    answerResult.value = null

    try {
      const data = await fetchNextQuestion(sessionId.value)

      if (data.completed) {
        completed.value = true
        return { completed: true }
      }

      currentQuestion.value = data.question
      meta.value = data.meta
      return { completed: false }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /** Récupère les résultats complets depuis l'API */
  async function loadResult() {
    if (!sessionId.value) return null

    loading.value = true
    try {
      const result = await fetchQuizResult(sessionId.value)
      apiResult.value = result
      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /** Réinitialise complètement le quiz */
  function resetQuiz() {
    sessionId.value = null
    selectedCategory.value = null
    currentQuestion.value = null
    meta.value = { totalQuestions: 0, currentQuestion: 0, timeLimit: 15 }
    answered.value = false
    selectedAnswerId.value = null
    answerResult.value = null
    score.value = 0
    answers.value = []
    completed.value = false
    apiResult.value = null
    loading.value = false
    error.value = null
  }

  return {
    sessionId,
    selectedCategory,
    currentQuestion,
    meta,
    loading,
    error,
    answered,
    selectedAnswerId,
    answerResult,
    score,
    answers,
    completed,
    apiResult,
    currentIndex,
    totalQuestions,
    progressPercent,
    scorePercent,
    resultMessage,
    isLastQuestion,
    currentOptions,
    selectedOptionIndex,
    correctOptionIndex,
    startQuiz,
    submitAnswer,
    submitTimeExpired,
    nextQuestion,
    loadResult,
    resetQuiz
  }
})
