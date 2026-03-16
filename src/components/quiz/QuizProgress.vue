<script setup>
defineProps({
  categoryName: { type: String, required: true },
  categoryColor: { type: String, required: true },
  currentIndex: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  progressPercent: { type: Number, required: true }
})
</script>

<template>
  <div class="quiz-progress">
    <div class="quiz-progress__header">
      <span class="quiz-progress__category" :style="{ color: categoryColor }">
        {{ categoryName }}
      </span>
      <span class="quiz-progress__counter">
        {{ currentIndex + 1 }} / {{ totalQuestions }}
      </span>
    </div>
    <div class="quiz-progress__bar">
      <div
        class="quiz-progress__fill"
        :style="{ width: progressPercent + '%', background: categoryColor }"
      />
    </div>
  </div>
</template>

<style scoped>
.quiz-progress__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.quiz-progress__category {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
  font-family: var(--font-sans);
}

.quiz-progress__counter {
  font-size: 13px;
  font-family: var(--font-sans);
  color: var(--text-secondary);
}

.quiz-progress__bar {
  height: 3px;
  background: var(--border-color);
  margin-bottom: 40px;
  border-radius: 2px;
}

.quiz-progress__fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.4s ease;
}
</style>
