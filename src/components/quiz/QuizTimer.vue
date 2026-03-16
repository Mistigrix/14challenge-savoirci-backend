<script setup>
defineProps({
  timeLeft: { type: Number, required: true },
  isWarning: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
})
</script>

<template>
  <div class="quiz-timer">
    <span
      class="quiz-timer__value"
      :class="{ 'quiz-timer__value--warning': isWarning, 'quiz-timer__value--pulse': isWarning && isActive }"
    >
      {{ timeLeft }}s
    </span>
  </div>
</template>

<style scoped>
.quiz-timer {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.quiz-timer__value {
  font-size: 28px;
  font-weight: 800;
  font-family: var(--font-serif);
  color: var(--text-primary);
  transition: color var(--transition-normal);
}

.quiz-timer__value--warning {
  color: var(--color-red);
}

.quiz-timer__value--pulse {
  animation: pulse 1s infinite;
}

@media (max-width: 576px) {
  .quiz-timer__value {
    font-size: 22px;
  }
}
</style>
