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
 * Chaque clé correspond au slug de la catégorie côté backend
 * Les couleurs reflètent l'identité visuelle du projet (orange/vert CI)
 */
const CATEGORY_COLORS = {
  histoire: '#FF8C00',     // Orange — couleur principale CI
  geographie: '#3B82F6',   // Bleu
  culture: '#009E49',      // Vert — couleur secondaire CI
  economie: '#8B5CF6',     // Violet
  sport: '#E53E3E',        // Rouge
  technologie: '#0EA5E9',  // Bleu ciel
  coran: '#14B8A6',        // Turquoise
  bible: '#EC4899'         // Rose
}

/**
 * Retourne la couleur associée à une catégorie
 * Utilise l'orange par défaut si le slug n'est pas reconnu
 */
export function getCategoryColor(slug) {
  return CATEGORY_COLORS[slug] || '#FF8C00'
}

/**
 * Store principal du quiz — pilote toute la logique de jeu
 *
 * Responsabilités :
 * - Gérer la session de quiz (démarrage, progression, fin)
 * - Communiquer avec l'API pour chaque action (soumettre réponse, question suivante)
 * - Maintenir un historique local des réponses pour l'affichage du score
 * - Fournir des propriétés calculées pour l'interface (progression, score, etc.)
 */
export const useQuizStore = defineStore('quiz', () => {

  // ============================================================
  // État (refs réactives)
  // ============================================================

  // --- Session ---
  const sessionId = ref(null)              // Identifiant unique de la session API
  const selectedCategory = ref(null)       // Catégorie choisie par l'utilisateur (enrichie avec couleur)
  const currentQuestion = ref(null)        // Question actuellement affichée
  const meta = ref({                       // Métadonnées de progression fournies par l'API
    totalQuestions: 0,
    currentQuestion: 0,
    timeLimit: 15                          // Temps par question en secondes
  })
  const loading = ref(false)               // Indicateur de chargement (requêtes API en cours)
  const error = ref(null)                  // Dernier message d'erreur, null si tout va bien

  // --- Réponse en cours ---
  const answered = ref(false)              // Vrai si l'utilisateur a déjà répondu à la question courante
  const selectedAnswerId = ref(null)       // ID de la réponse choisie par l'utilisateur
  const answerResult = ref(null)           // Résultat retourné par l'API après soumission

  // --- Historique local (côté client) ---
  const score = ref(0)                     // Nombre de bonnes réponses accumulées
  const answers = ref([])                  // Liste des réponses données (pour la page de résultats)
  const completed = ref(false)             // Vrai quand toutes les questions ont été traitées

  // --- Résultats API ---
  const apiResult = ref(null)              // Résultats complets récupérés depuis l'API en fin de quiz

  // ============================================================
  // Propriétés calculées (computed)
  // ============================================================

  /** Index courant en base 0 — utile pour l'affichage et les composants de progression */
  const currentIndex = computed(() => meta.value.currentQuestion - 1)

  /** Nombre total de questions dans la session */
  const totalQuestions = computed(() => meta.value.totalQuestions)

  /** Pourcentage de progression (0 à 100) — alimente la barre de progression */
  const progressPercent = computed(() => {
    if (totalQuestions.value === 0) return 0
    return (meta.value.currentQuestion / totalQuestions.value) * 100
  })

  /**
   * Pourcentage du score final
   * Priorité aux données API si disponibles, sinon calcul local
   */
  const scorePercent = computed(() => {
    if (apiResult.value) return apiResult.value.score.percentage
    if (totalQuestions.value === 0) return 0
    return Math.round((score.value / totalQuestions.value) * 100)
  })

  /** Message de félicitations adapté au score obtenu */
  const resultMessage = computed(() => {
    if (scorePercent.value === 100) return 'Parfait !'
    if (scorePercent.value >= 60) return 'Bien joué !'
    return 'Continuez !'
  })

  /** Vrai si la question courante est la dernière du quiz */
  const isLastQuestion = computed(() => meta.value.currentQuestion >= totalQuestions.value)

  /** Options de réponse de la question courante (tableau exploité par QuizOption) */
  const currentOptions = computed(() => {
    if (!currentQuestion.value) return []
    return currentQuestion.value.answers || []
  })

  /**
   * Index de l'option sélectionnée dans le tableau currentOptions
   * Retourne -1 si aucune sélection — utilisé pour le style :is-picked
   */
  const selectedOptionIndex = computed(() => {
    if (!selectedAnswerId.value || !currentOptions.value.length) return -1
    return currentOptions.value.findIndex(a => a.id === selectedAnswerId.value)
  })

  /**
   * Index de la bonne réponse dans le tableau currentOptions
   * Disponible uniquement après soumission — utilisé pour révéler la correction
   */
  const correctOptionIndex = computed(() => {
    if (!answerResult.value) return -1
    return currentOptions.value.findIndex(a => a.id === answerResult.value.correctAnswer.id)
  })

  // ============================================================
  // Actions (fonctions asynchrones communiquant avec l'API)
  // ============================================================

  /**
   * Démarre une nouvelle session de quiz
   * Réinitialise tout l'état local puis appelle l'API pour obtenir la première question
   * @param {Object} category — objet catégorie avec au minimum { id, slug }
   */
  async function startQuiz(category) {
    // Réinitialisation de l'état pour une nouvelle partie
    loading.value = true
    error.value = null
    completed.value = false
    apiResult.value = null
    score.value = 0
    answers.value = []
    answered.value = false
    selectedAnswerId.value = null
    answerResult.value = null

    // Enrichit la catégorie avec sa couleur associée
    selectedCategory.value = {
      ...category,
      color: getCategoryColor(category.slug)
    }

    try {
      // Appel API : crée la session et récupère la première question
      const data = await startQuizSession(category.id)
      sessionId.value = data.sessionId
      currentQuestion.value = data.question
      meta.value = data.meta

      // Si l'API renvoie les infos complètes de la catégorie, on les utilise
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

  /**
   * Soumet la réponse de l'utilisateur à l'API
   * Empêche les doubles soumissions grâce au flag `answered`
   * @param {string|number} answerId — identifiant de la réponse choisie
   * @returns {Object} résultat de la soumission (isCorrect, correctAnswer, etc.)
   */
  async function submitAnswer(answerId) {
    // Garde : empêche la double soumission ou l'envoi sans session active
    if (answered.value || !sessionId.value) return

    selectedAnswerId.value = answerId
    answered.value = true
    loading.value = true

    try {
      // Envoie la réponse au backend pour validation
      const result = await submitQuizAnswer(sessionId.value, answerId)
      answerResult.value = result

      // Incrémente le score local si la réponse est correcte
      if (result.isCorrect) {
        score.value++
      }

      // Sauvegarde dans l'historique local pour la page de résultats
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

  /**
   * Gère l'expiration du temps (timeout)
   * Envoie la dernière option comme fallback pour que l'API enregistre le timeout
   * La réponse est marquée comme incorrecte côté client, peu importe le résultat
   */
  async function submitTimeExpired() {
    // Garde : vérifie qu'on peut encore soumettre
    if (answered.value || !sessionId.value || !currentOptions.value.length) return

    // On envoie le dernier choix pour signaler le timeout au backend
    const fallbackId = currentOptions.value[currentOptions.value.length - 1].id
    selectedAnswerId.value = null      // null = pas de sélection visible dans l'UI
    answered.value = true
    loading.value = true

    try {
      const result = await submitQuizAnswer(sessionId.value, fallbackId)
      answerResult.value = result

      // Enregistre comme réponse expirée dans l'historique local
      answers.value.push({
        question: currentQuestion.value.text,
        providedAnswer: null,            // Aucune réponse choisie par l'utilisateur
        correctAnswer: result.correctAnswer?.text || '',
        isCorrect: false,                // Toujours faux en cas de timeout
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

  /**
   * Passe à la question suivante
   * Réinitialise l'état de réponse puis récupère la prochaine question via l'API
   * @returns {{ completed: boolean }} — indique si le quiz est terminé
   */
  async function nextQuestion() {
    if (!sessionId.value) return

    // Réinitialise l'état de réponse pour la nouvelle question
    loading.value = true
    answered.value = false
    selectedAnswerId.value = null
    answerResult.value = null

    try {
      const data = await fetchNextQuestion(sessionId.value)

      // Si l'API indique que le quiz est terminé
      if (data.completed) {
        completed.value = true
        return { completed: true }
      }

      // Charge la nouvelle question et ses métadonnées
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

  /**
   * Récupère les résultats complets du quiz depuis l'API
   * Appelé sur la page Score pour afficher le récapitulatif détaillé
   * @returns {Object|null} résultats complets (score, détails par question, etc.)
   */
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

  /**
   * Réinitialise complètement le store à son état initial
   * Utilisé quand l'utilisateur quitte le quiz ou retourne à l'accueil
   */
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

  // ============================================================
  // Exposition publique — tout ce qui est accessible aux composants
  // ============================================================
  return {
    // État
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

    // Computed
    currentIndex,
    totalQuestions,
    progressPercent,
    scorePercent,
    resultMessage,
    isLastQuestion,
    currentOptions,
    selectedOptionIndex,
    correctOptionIndex,

    // Actions
    startQuiz,
    submitAnswer,
    submitTimeExpired,
    nextQuestion,
    loadResult,
    resetQuiz
  }
})
