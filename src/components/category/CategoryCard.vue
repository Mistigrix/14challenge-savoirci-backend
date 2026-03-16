<script setup>
defineProps({
  category: { type: Object, required: true },
  index: { type: Number, required: true }
})

defineEmits(['select'])
</script>

<template>
  <div
    class="category-card"
    :style="{ borderTopColor: category.color }"
    @click="$emit('select', category)"
  >
    <p class="category-card__number" :style="{ color: category.color }">
      {{ String(index + 1).padStart(2, '0') }}
    </p>
    <p class="category-card__name">{{ category.name }}</p>
    <p class="category-card__desc">{{ category.desc }}</p>
    <p class="category-card__count">{{ category.count }} questions</p>
  </div>
</template>

<style scoped>
.category-card {
  background: var(--bg-card);
  padding: 32px 24px;
  cursor: pointer;
  transition: background var(--transition-normal);
  border-top: 3px solid;
}

.category-card:hover {
  background: var(--bg-surface);
}

.category-card__number {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
  font-family: var(--font-sans);
  margin-bottom: 12px;
}

.category-card__name {
  font-size: 20px;
  font-weight: 700;
  font-family: var(--font-serif);
  color: var(--text-primary);
  margin-bottom: 8px;
}

.category-card__desc {
  font-size: 13px;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  margin-bottom: 16px;
}

.category-card__count {
  font-size: 12px;
  color: var(--text-secondary);
  font-family: var(--font-sans);
}
</style>
