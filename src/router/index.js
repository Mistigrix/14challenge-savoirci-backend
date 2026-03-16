import { createRouter, createWebHistory } from 'vue-router'

/**
 * Configuration des routes de l'application
 * Chargement différé (lazy loading) pour optimiser les performances
 */
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/categories',
    name: 'categories',
    component: () => import('@/views/CategoriesView.vue')
  },
  {
    path: '/quiz',
    name: 'quiz',
    component: () => import('@/views/QuizView.vue')
  },
  {
    path: '/score',
    name: 'score',
    component: () => import('@/views/ScoreView.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
