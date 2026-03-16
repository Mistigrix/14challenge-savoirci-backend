<script setup>
import { useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/quiz.js'
import { categories } from '@/data/categories.js'

const router = useRouter()
const quizStore = useQuizStore()

/** Lance le quiz pour la catégorie sélectionnée */
function handleStartQuiz(category) {
  quizStore.startQuiz(category)
  router.push('/quiz')
}
</script>

<template>
  <div class="categories container">
    <h1 class="categories__title">Catégories</h1>
    <p class="categories__subtitle">Choisissez un thème et lancez le quiz</p>

    <div class="categories__grid">
      <div
        v-for="(cat, i) in categories"
        :key="cat.id"
        class="category-detail"
        @click="handleStartQuiz(cat)"
        @mouseenter="$event.currentTarget.style.borderColor = cat.color"
        @mouseleave="$event.currentTarget.style.borderColor = ''"
      >
        <div class="category-detail__header">
          <span class="category-detail__number" :style="{ color: cat.color }">
            {{ String(i + 1).padStart(2, '0') }}
          </span>
          <span class="category-detail__badge" :style="{ background: cat.color + '12', color: cat.color }">
            {{ cat.count }} Q
          </span>
        </div>
        <h3 class="category-detail__name">{{ cat.name }}</h3>
        <p class="category-detail__desc">{{ cat.desc }}</p>
        <span class="category-detail__play" :style="{ color: cat.color }">Jouer →</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.categories {
  padding-top: 48px;
  padding-bottom: 48px;
}

.categories__title {
  font-size: 48px;
  font-weight: 800;
  font-family: var(--font-serif);
  color: var(--text-primary);
  margin-bottom: 8px;
  letter-spacing: -1px;
}

.categories__subtitle {
  font-size: 15px;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  margin-bottom: 40px;
}

.categories__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.category-detail {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 40px 32px;
  cursor: pointer;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.category-detail__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.category-detail__number {
  font-size: 48px;
  font-weight: 800;
  font-family: var(--font-serif);
  opacity: 0.2;
}

.category-detail__badge {
  font-size: 11px;
  padding: 4px 12px;
  font-weight: 600;
  font-family: var(--font-sans);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.category-detail__name {
  font-size: 28px;
  font-weight: 700;
  font-family: var(--font-serif);
  color: var(--text-primary);
  margin-bottom: 8px;
}

.category-detail__desc {
  font-size: 14px;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  margin-bottom: 24px;
}

.category-detail__play {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: var(--font-sans);
}

/* ---- Responsive tablette ---- */
@media (max-width: 992px) {
  .categories__title {
    font-size: 36px;
  }
}

/* ---- Responsive mobile ---- */
@media (max-width: 576px) {
  .categories {
    padding-top: 32px;
  }

  .categories__title {
    font-size: 28px;
  }

  .categories__grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .category-detail {
    padding: 28px 20px;
  }

  .category-detail__number {
    font-size: 36px;
  }

  .category-detail__name {
    font-size: 22px;
  }
}
</style>
