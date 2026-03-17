<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '@/stores/quiz.js'
import { fetchStats } from '@/services/api.js'
import { getCategoryColor } from '@/stores/quiz.js'
import CategoryCard from '@/components/category/CategoryCard.vue'
import AppLoader from '@/components/ui/AppLoader.vue'

const router = useRouter()
const quizStore = useQuizStore()

const categories = ref([])
const totalQuestions = ref(0)
const loading = ref(true)

/** Charge les stats et catégories depuis l'API */
onMounted(async () => {
  try {
    const data = await fetchStats()
    totalQuestions.value = data.totalQuestions
    categories.value = data.categories.map(cat => ({
      ...cat,
      color: getCategoryColor(cat.slug),
      count: cat.questionCount || 0,
      desc: cat.description || ''
    }))
  } catch {
    /* Affiche la page sans les données dynamiques */
  } finally {
    loading.value = false
  }
})

/** Lance le quiz pour la catégorie sélectionnée */
async function handleStartQuiz(category) {
  try {
    await quizStore.startQuiz(category)
    router.push('/quiz')
  } catch {
    router.push('/categories')
  }
}
</script>

<template>
  <div class="home container">
    <!-- Loader inline -->
    <AppLoader v-if="loading" text="Chargement" />

    <template v-else>
      <!-- Section héro - layout asymétrique éditorial -->
      <section class="hero">
        <div class="hero__content">
          <p class="hero__badge">Challenge 14-14-14 — Jour 4</p>
          <h1 class="hero__title">
            Testez vos<br />
            <span class="hero__title-accent">connaissances</span>
          </h1>
          <p class="hero__description">
            Quiz interactif sur la Côte d'Ivoire : histoire, géographie, culture, économie, sport, technologie, le Coran et la Bible.
            Combien de bonnes réponses pouvez-vous obtenir ?
          </p>
          <router-link to="/categories" class="hero__cta">Commencer le quiz</router-link>
        </div>

        <!-- Bloc de statistiques -->
        <div class="hero__stats-wrapper">
          <div class="hero__stats">
            <div class="hero__stat">
              <p class="hero__stat-value">{{ totalQuestions }}</p>
              <p class="hero__stat-label">Questions</p>
            </div>
            <div class="hero__stat">
              <p class="hero__stat-value hero__stat-value--green">{{ categories.length }}</p>
              <p class="hero__stat-label">Catégories</p>
            </div>
            <div class="hero__stat">
              <p class="hero__stat-value hero__stat-value--orange">15s</p>
              <p class="hero__stat-label">Par question</p>
            </div>
          </div>
          <!-- Éléments décoratifs -->
          <div class="hero__deco hero__deco--orange" />
          <div class="hero__deco hero__deco--green" />
        </div>
      </section>

      <!-- Aperçu des catégories -->
      <section class="categories-preview">
        <div class="categories-preview__header">
          <h2 class="categories-preview__title">Catégories</h2>
          <router-link to="/categories" class="categories-preview__link">Voir tout →</router-link>
        </div>
        <div class="categories-preview__grid">
          <CategoryCard
            v-for="(cat, i) in categories"
            :key="cat.id"
            :category="cat"
            :index="i"
            @select="handleStartQuiz"
          />
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.home {
  padding-bottom: 60px;
}

/* Section Héro */
.hero {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 40px;
  padding: 80px 0 60px;
  align-items: center;
}

.hero__badge {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: var(--color-orange);
  font-weight: 700;
  font-family: var(--font-sans);
  margin-bottom: 16px;
}

.hero__title {
  font-size: 64px;
  font-weight: 800;
  line-height: 1.05;
  margin-bottom: 24px;
  font-family: var(--font-serif);
  color: var(--text-primary);
  letter-spacing: -2px;
}

.hero__title-accent {
  font-style: italic;
  color: var(--color-orange);
}

.hero__description {
  font-size: 18px;
  line-height: 1.7;
  color: var(--text-secondary);
  margin-bottom: 36px;
  font-family: var(--font-sans);
  max-width: 440px;
}

.hero__cta {
  display: inline-block;
  padding: 16px 40px;
  background: var(--color-orange);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  font-family: var(--font-sans);
  text-transform: uppercase;
  letter-spacing: 2px;
  border: none;
  cursor: pointer;
  transition: transform var(--transition-fast);
  text-decoration: none;
}

.hero__cta:active {
  transform: scale(0.97);
}

/* Bloc statistiques */
.hero__stats-wrapper {
  position: relative;
}

.hero__stats {
  background: var(--bg-surface);
  padding: 48px 32px;
  border-left: 4px solid var(--color-orange);
}

.hero__stat {
  margin-bottom: 24px;
}

.hero__stat:last-child {
  margin-bottom: 0;
}

.hero__stat-value {
  font-size: 42px;
  font-weight: 800;
  font-family: var(--font-serif);
  color: var(--text-primary);
  line-height: 1.1;
  margin-bottom: 8px;
}

.hero__stat-value--green {
  color: var(--color-green);
}

.hero__stat-value--orange {
  color: var(--color-orange);
}

.hero__stat-label {
  font-size: 13px;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.hero__deco {
  position: absolute;
}

.hero__deco--orange {
  top: -20px;
  right: -20px;
  width: 80px;
  height: 80px;
  background: var(--color-orange);
  opacity: 0.08;
}

.hero__deco--green {
  bottom: -15px;
  left: -15px;
  width: 50px;
  height: 50px;
  background: var(--color-green);
  opacity: 0.1;
}

/* Aperçu catégories */
.categories-preview {
  border-top: 1px solid var(--border-color);
  padding-top: 48px;
}

.categories-preview__header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 32px;
}

.categories-preview__title {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: 700;
  font-family: var(--font-sans);
  color: var(--text-primary);
}

.categories-preview__link {
  font-size: 12px;
  color: var(--color-orange);
  cursor: pointer;
  font-family: var(--font-sans);
  font-weight: 600;
  text-decoration: none;
}

.categories-preview__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--border-color);
}

/* ---- Responsive tablette ---- */
@media (max-width: 992px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 48px 0 40px;
  }

  .hero__title {
    font-size: 48px;
  }

  .hero__stats {
    display: flex;
    gap: 32px;
    padding: 32px 24px;
  }

  .hero__stat {
    margin-bottom: 0;
  }

  .hero__deco {
    display: none;
  }

  .categories-preview__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* ---- Responsive mobile ---- */
@media (max-width: 576px) {
  .home {
    padding-bottom: 40px;
  }

  .hero {
    padding: 32px 0 28px;
    gap: 24px;
  }

  .hero__title {
    font-size: 36px;
    letter-spacing: -1px;
  }

  .hero__description {
    font-size: 15px;
    margin-bottom: 28px;
  }

  .hero__cta {
    padding: 14px 28px;
    font-size: 12px;
    width: 100%;
    text-align: center;
  }

  .hero__stats {
    flex-direction: column;
    gap: 16px;
    padding: 24px 20px;
  }

  .hero__stat-value {
    font-size: 32px;
  }

  .categories-preview {
    padding-top: 32px;
  }

  .categories-preview__grid {
    grid-template-columns: 1fr;
  }
}
</style>
