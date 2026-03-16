import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { questions } from '@/data/questions.js'

/**
 * Store principal du quiz
 * Gère l'état de la partie en cours : catégorie, progression, score, réponses
 */
export const useQuizStore = defineStore('quiz', () => {
  const selectedCategory = ref(null)
  const currentIndex = ref(0)
  const score = ref(0)
  const selectedOption = ref(null)
  const answered = ref(false)
  const answers = ref([])

  /** Liste des questions de la catégorie sélectionnée */
  const currentQuestions = computed(() => {
    if (!selectedCategory.value) return []
    return questions[selectedCategory.value.id] || []
  })

  /** Question en cours */
  const currentQuestion = computed(() => currentQuestions.value[currentIndex.value] || null)

  /** Nombre total de questions */
  const totalQuestions = computed(() => currentQuestions.value.length)

  /** Pourcentage de progression */
  const progressPercent = computed(() => {
    if (totalQuestions.value === 0) return 0
    return ((currentIndex.value + 1) / totalQuestions.value) * 100
  })

  /** Pourcentage du score final */
  const scorePercent = computed(() => {
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
  const isLastQuestion = computed(() => currentIndex.value + 1 >= totalQuestions.value)

  /** Démarre un quiz avec la catégorie donnée */
  function startQuiz(category) {
    selectedCategory.value = category
    currentIndex.value = 0
    score.value = 0
    selectedOption.value = null
    answered.value = false
    answers.value = []
  }

  /** Enregistre la réponse du joueur */
  function submitAnswer(optionIndex) {
    if (answered.value) return

    selectedOption.value = optionIndex
    answered.value = true

    const isCorrect = optionIndex === currentQuestion.value.answerIndex
    if (isCorrect) score.value++

    answers.value.push({
      question: currentQuestion.value.question,
      pickedIndex: optionIndex,
      correctIndex: currentQuestion.value.answerIndex,
      isCorrect
    })
  }

  /** Passe à la question suivante et réinitialise l'état local */
  function nextQuestion() {
    currentIndex.value++
    selectedOption.value = null
    answered.value = false
  }

  /** Réinitialise complètement le quiz */
  function resetQuiz() {
    selectedCategory.value = null
    currentIndex.value = 0
    score.value = 0
    selectedOption.value = null
    answered.value = false
    answers.value = []
  }

  return {
    selectedCategory,
    currentIndex,
    score,
    selectedOption,
    answered,
    answers,
    currentQuestions,
    currentQuestion,
    totalQuestions,
    progressPercent,
    scorePercent,
    resultMessage,
    isLastQuestion,
    startQuiz,
    submitAnswer,
    nextQuestion,
    resetQuiz
  }
})
