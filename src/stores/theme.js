import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Store pour la gestion du thème (clair/sombre)
 * Persiste le choix dans localStorage
 */
export const useThemeStore = defineStore('theme', () => {
  const darkMode = ref(loadSavedTheme())

  /** Charge le thème sauvegardé ou utilise le mode clair par défaut */
  function loadSavedTheme() {
    const saved = localStorage.getItem('savoirci-theme')
    return saved === 'dark'
  }

  /** Bascule entre mode clair et sombre */
  function toggleTheme() {
    darkMode.value = !darkMode.value
    applyTheme()
  }

  /** Applique le thème au DOM et sauvegarde la préférence */
  function applyTheme() {
    document.documentElement.setAttribute('data-theme', darkMode.value ? 'dark' : 'light')
    localStorage.setItem('savoirci-theme', darkMode.value ? 'dark' : 'light')
  }

  // Appliquer le thème au démarrage
  applyTheme()

  return { darkMode, toggleTheme }
})
