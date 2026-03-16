<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'

const route = useRoute()
const router = useRouter()
const menuOpen = ref(false)

const navLinks = [
  { name: 'home', label: 'Accueil', path: '/' },
  { name: 'categories', label: 'Catégories', path: '/categories' },
  { name: 'about', label: 'A propos', path: '/about' }
]

/** Navigue vers la page et ferme le menu mobile */
function navigateTo(path) {
  menuOpen.value = false
  router.push(path)
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar__inner container">
      <router-link to="/" class="navbar__logo" @click="menuOpen = false">
        Savoir<span class="navbar__logo-accent">CI</span>
      </router-link>

      <!-- Bouton burger (mobile) -->
      <button class="navbar__burger" :class="{ 'navbar__burger--open': menuOpen }" @click="menuOpen = !menuOpen" aria-label="Menu">
        <span class="navbar__burger-line" />
        <span class="navbar__burger-line" />
        <span class="navbar__burger-line" />
      </button>

      <!-- Navigation -->
      <div class="navbar__right" :class="{ 'navbar__right--open': menuOpen }">
        <span
          v-for="link in navLinks"
          :key="link.name"
          class="navbar__link"
          :class="{ 'navbar__link--active': route.name === link.name }"
          @click="navigateTo(link.path)"
        >
          {{ link.label }}
        </span>
        <ThemeToggle />
      </div>
    </div>

    <!-- Overlay pour fermer le menu mobile -->
    <div v-if="menuOpen" class="navbar__overlay" @click="menuOpen = false" />
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  left: 0;
  width: 100%;
  top: 0;
  z-index: 100;
  background: color-mix(in srgb, var(--bg-primary) 95%, transparent);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-color);
  padding: 0 var(--padding-page);
}

.navbar__inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
}

.navbar__logo {
  font-size: 22px;
  font-weight: 800;
  font-family: var(--font-serif);
  color: var(--text-primary);
  letter-spacing: -1px;
  text-decoration: none;
  z-index: 102;
}

.navbar__logo-accent {
  color: var(--color-orange);
}

/* Bouton burger — masqué sur desktop */
.navbar__burger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 30px;
  height: 30px;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 102;
  padding: 0;
}

.navbar__burger-line {
  display: block;
  width: 100%;
  height: 2px;
  background: var(--text-primary);
  transition: all var(--transition-normal);
  transform-origin: center;
}

.navbar__burger--open .navbar__burger-line:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.navbar__burger--open .navbar__burger-line:nth-child(2) {
  opacity: 0;
}

.navbar__burger--open .navbar__burger-line:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

.navbar__right {
  display: flex;
  gap: 24px;
  align-items: center;
}

.navbar__link {
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-family: var(--font-sans);
  transition: all var(--transition-fast);
  text-decoration: none;
}

.navbar__link--active {
  font-weight: 700;
  color: var(--text-primary);
}

.navbar__link:hover {
  color: var(--text-primary);
}

.navbar__overlay {
  display: none;
}

/* ---- Responsive mobile ---- */
@media (max-width: 768px) {
  .navbar__burger {
    display: flex;
  }

  .navbar__right {
    position: fixed;
    top: 0;
    right: 0;
    width: 260px;
    height: 100vh;
    background: var(--bg-primary);
    flex-direction: column;
    align-items: flex-start;
    padding: 80px 32px 32px;
    gap: 28px;
    transform: translateX(100%);
    transition: transform var(--transition-normal);
    z-index: 101;
    border-left: 1px solid var(--border-color);
  }

  .navbar__right--open {
    transform: translateX(0);
  }

  .navbar__link {
    font-size: 14px;
    letter-spacing: 2px;
  }

  .navbar__overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: 100;
  }
}
</style>
