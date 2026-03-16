<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/quiz.js'
import { questions } from '@/data/questions.js'

const router = useRouter()
const quizStore = useQuizStore()

// Redirige si aucun quiz n'a été complété
onMounted(() => {
  if (!quizStore.selectedCategory || quizStore.answers.length === 0) {
    router.replace('/categories')
  }
})

/** Relance le quiz avec la même catégorie */
function handleReplay() {
  quizStore.startQuiz(quizStore.selectedCategory)
  router.push('/quiz')
}

/** Récupère le texte d'une option à partir de son index */
function getOptionText(questionIndex, optionIndex) {
  const categoryQuestions = questions[quizStore.selectedCategory.id]
  if (!categoryQuestions || !categoryQuestions[questionIndex]) return ''
  return categoryQuestions[questionIndex].options[optionIndex] || ''
}
</script>

<template>
  <div v-if="quizStore.selectedCategory" class="score container">
    <!-- En-tête du résultat -->
    <p class="score__category">{{ quizStore.selectedCategory.name }} — Résultat</p>
    <h1 class="score__percent">{{ quizStore.scorePercent }}%</h1>
    <p class="score__message" :class="{ 'score__message--success': quizStore.scorePercent >= 60 }">
      {{ quizStore.resultMessage }}
    </p>
    <p class="score__detail">
      {{ quizStore.score }} bonne{{ quizStore.score > 1 ? 's' : '' }}
      réponse{{ quizStore.score > 1 ? 's' : '' }}
      sur {{ quizStore.totalQuestions }}
    </p>

    <!-- Récapitulatif des réponses -->
    <div class="score__recap">
      <p class="score__recap-title">Récapitulatif</p>
      <div
        v-for="(answer, i) in quizStore.answers"
        :key="i"
        class="score__answer"
      >
        <span class="score__answer-icon" :class="answer.isCorrect ? 'score__answer-icon--correct' : 'score__answer-icon--wrong'">
          {{ answer.isCorrect ? '✓' : '✗' }}
        </span>
        <div class="score__answer-content">
          <p class="score__answer-question">{{ answer.question }}</p>
          <p v-if="!answer.isCorrect && answer.pickedIndex >= 0" class="score__answer-picked">
            Votre réponse : {{ getOptionText(i, answer.pickedIndex) }}
          </p>
          <p class="score__answer-correct">
            Bonne réponse : {{ getOptionText(i, answer.correctIndex) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="score__actions">
      <button class="score__btn score__btn--primary" @click="handleReplay">Rejouer</button>
      <button class="score__btn score__btn--secondary" @click="router.push('/categories')">Autre catégorie</button>
    </div>
  </div>
</template>

<style scoped>
.score {
  max-width: 700px;
  padding-top: 60px;
  padding-bottom: 60px;
  text-align: center;
}

.score__category {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: 700;
  font-family: var(--font-sans);
  margin-bottom: 20px;
  color: var(--color-orange);
}

.score__percent {
  font-size: 96px;
  font-weight: 800;
  font-family: var(--font-serif);
  color: var(--text-primary);
  margin-bottom: 8px;
  letter-spacing: -4px;
}

.score__message {
  font-size: 24px;
  font-weight: 600;
  font-family: var(--font-serif);
  color: var(--color-orange);
  margin-bottom: 8px;
  font-style: italic;
}

.score__message--success {
  color: var(--color-green);
}

.score__detail {
  font-size: 15px;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  margin-bottom: 40px;
}

/* Récapitulatif */
.score__recap {
  text-align: left;
  margin-bottom: 40px;
}

.score__recap-title {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
  font-family: var(--font-sans);
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.score__answer {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.score__answer-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
  margin-top: 2px;
}

.score__answer-icon--correct {
  background: var(--color-green);
}

.score__answer-icon--wrong {
  background: var(--color-red);
}

.score__answer-question {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
  font-family: var(--font-sans);
}

.score__answer-picked {
  font-size: 12px;
  color: var(--color-red);
  margin-bottom: 2px;
  font-family: var(--font-sans);
}

.score__answer-correct {
  font-size: 12px;
  color: var(--color-green);
  font-family: var(--font-sans);
}

/* Actions */
.score__actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.score__btn {
  padding: 14px 32px;
  font-size: 13px;
  font-weight: 700;
  font-family: var(--font-sans);
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: transform var(--transition-fast);
}

.score__btn:active {
  transform: scale(0.97);
}

.score__btn--primary {
  background: var(--color-orange);
  color: #fff;
  border: none;
}

.score__btn--secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1.5px solid var(--border-color);
}

/* ---- Responsive mobile ---- */
@media (max-width: 576px) {
  .score {
    padding-top: 36px;
    padding-bottom: 36px;
  }

  .score__percent {
    font-size: 64px;
    letter-spacing: -2px;
  }

  .score__message {
    font-size: 20px;
  }

  .score__answer {
    padding: 12px 0;
  }

  .score__actions {
    flex-direction: column;
  }

  .score__btn {
    width: 100%;
    text-align: center;
  }
}
</style>
