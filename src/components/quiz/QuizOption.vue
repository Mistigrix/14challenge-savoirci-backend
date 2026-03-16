<script setup>
defineProps({
  label: { type: String, required: true },
  index: { type: Number, required: true },
  answered: { type: Boolean, default: false },
  isCorrect: { type: Boolean, default: false },
  isPicked: { type: Boolean, default: false },
  categoryColor: { type: String, default: '#FF8C00' }
})

defineEmits(['select'])

/** Convertit un index en lettre (0 → A, 1 → B, etc.) */
function indexToLetter(index) {
  return String.fromCharCode(65 + index)
}
</script>

<template>
  <div
    class="quiz-option"
    :class="{
      'quiz-option--correct': answered && isCorrect,
      'quiz-option--wrong': answered && isPicked && !isCorrect,
      'quiz-option--clickable': !answered
    }"
    @click="!answered && $emit('select', index)"
  >
    <span class="quiz-option__letter" :class="{
      'quiz-option__letter--correct': answered && isCorrect,
      'quiz-option__letter--wrong': answered && isPicked && !isCorrect
    }">
      {{ indexToLetter(index) }}
    </span>
    <span class="quiz-option__text">{{ label }}</span>
    <span v-if="answered && isCorrect" class="quiz-option__icon quiz-option__icon--correct">✓</span>
    <span v-if="answered && isPicked && !isCorrect" class="quiz-option__icon quiz-option__icon--wrong">✗</span>
  </div>
</template>

<style scoped>
.quiz-option {
  padding: 18px 24px;
  border: 1.5px solid var(--border-color);
  background: var(--bg-card);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.25s;
}

.quiz-option--clickable {
  cursor: pointer;
}

.quiz-option--clickable:hover {
  border-color: v-bind(categoryColor);
  background: var(--bg-surface);
}

.quiz-option--correct {
  background: color-mix(in srgb, var(--color-green) 7%, transparent);
  border-color: var(--color-green);
}

.quiz-option--wrong {
  background: color-mix(in srgb, var(--color-red) 7%, transparent);
  border-color: var(--color-red);
}

.quiz-option__letter {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 700;
  color: var(--text-secondary);
  border: 1.5px solid var(--border-color);
  transition: all 0.25s;
  flex-shrink: 0;
}

.quiz-option__letter--correct {
  color: var(--color-green);
  border-color: var(--color-green);
}

.quiz-option__letter--wrong {
  color: var(--color-red);
  border-color: var(--color-red);
}

.quiz-option__text {
  font-size: 16px;
  font-family: var(--font-sans);
  font-weight: 500;
  color: var(--text-primary);
}

.quiz-option--correct .quiz-option__text {
  color: var(--color-green);
}

.quiz-option--wrong .quiz-option__text {
  color: var(--color-red);
}

.quiz-option__icon {
  margin-left: auto;
  font-size: 16px;
}

.quiz-option__icon--correct {
  color: var(--color-green);
}

.quiz-option__icon--wrong {
  color: var(--color-red);
}

/* ---- Responsive mobile ---- */
@media (max-width: 576px) {
  .quiz-option {
    padding: 14px 16px;
    gap: 12px;
  }

  .quiz-option__letter {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }

  .quiz-option__text {
    font-size: 14px;
  }
}
</style>
