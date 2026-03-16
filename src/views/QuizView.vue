<script setup>
import { watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/quiz.js'
import { useTimer } from '@/composables/useTimer.js'
import QuizProgress from '@/components/quiz/QuizProgress.vue'
import QuizTimer from '@/components/quiz/QuizTimer.vue'
import QuizOption from '@/components/quiz/QuizOption.vue'

const router = useRouter()
const quizStore = useQuizStore()

/** Gère l'expiration du timer en soumettant une réponse vide (-1) */
function handleTimerExpired() {
  quizStore.submitAnswer(-1)
}

const { timeLeft, isActive, start, stop, restart } = useTimer(15, handleTimerExpired)

// Redirige vers les catégories si aucune catégorie n'est sélectionnée
onMounted(() => {
  if (!quizStore.selectedCategory) {
    router.replace('/categories')
    return
  }
  start()
})

/** Soumet la réponse et arrête le timer */
function handleAnswer(index) {
  stop()
  quizStore.submitAnswer(index)
}

/** Passe à la question suivante ou affiche le score */
function handleNext() {
  if (quizStore.isLastQuestion) {
    router.push('/score')
  } else {
    quizStore.nextQuestion()
    restart()
  }
}
</script>

<template>
  <div v-if="quizStore.currentQuestion" class="quiz container">
    <QuizProgress
      :category-name="quizStore.selectedCategory.name"
      :category-color="quizStore.selectedCategory.color"
      :current-index="quizStore.currentIndex"
      :total-questions="quizStore.totalQuestions"
      :progress-percent="quizStore.progressPercent"
    />

    <QuizTimer
      :time-left="timeLeft"
      :is-warning="timeLeft <= 5"
      :is-active="isActive && !quizStore.answered"
    />

    <!-- Question -->
    <h2 class="quiz__question">{{ quizStore.currentQuestion.question }}</h2>

    <!-- Options de réponse -->
    <div class="quiz__options">
      <QuizOption
        v-for="(opt, i) in quizStore.currentQuestion.options"
        :key="i"
        :label="opt"
        :index="i"
        :answered="quizStore.answered"
        :is-correct="i === quizStore.currentQuestion.answerIndex"
        :is-picked="i === quizStore.selectedOption"
        :category-color="quizStore.selectedCategory.color"
        @select="handleAnswer"
      />
    </div>

    <!-- Bouton suivant -->
    <div v-if="quizStore.answered" class="quiz__actions">
      <button
        class="quiz__next-btn"
        :style="{ background: quizStore.selectedCategory.color }"
        @click="handleNext"
      >
        {{ quizStore.isLastQuestion ? 'Voir le score' : 'Suivante →' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.quiz {
  max-width: 700px;
  padding-top: 48px;
  padding-bottom: 48px;
}

.quiz__question {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.35;
  font-family: var(--font-serif);
  color: var(--text-primary);
  margin-bottom: 36px;
  letter-spacing: -0.5px;
}

.quiz__options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 40px;
}

.quiz__actions {
  display: flex;
  justify-content: flex-end;
}

.quiz__next-btn {
  padding: 14px 36px;
  border: none;
  cursor: pointer;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  font-family: var(--font-sans);
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: transform var(--transition-fast);
}

.quiz__next-btn:active {
  transform: scale(0.97);
}

/* ---- Responsive mobile ---- */
@media (max-width: 576px) {
  .quiz {
    padding-top: 28px;
    padding-bottom: 28px;
  }

  .quiz__question {
    font-size: 22px;
    margin-bottom: 24px;
  }

  .quiz__options {
    gap: 10px;
    margin-bottom: 28px;
  }

  .quiz__actions {
    justify-content: stretch;
  }

  .quiz__next-btn {
    width: 100%;
    text-align: center;
    padding: 14px 20px;
  }
}
</style>
