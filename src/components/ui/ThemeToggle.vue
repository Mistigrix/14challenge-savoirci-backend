<script setup>
import { useThemeStore } from '@/stores/theme.js'

const themeStore = useThemeStore()
</script>

<template>
  <button class="theme-toggle" @click="themeStore.toggleTheme" :aria-label="themeStore.darkMode ? 'Mode clair' : 'Mode sombre'">
    {{ themeStore.darkMode ? '☀' : '☾' }}
  </button>
</template>

<style scoped>
.theme-toggle {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color var(--transition-fast);
}

.theme-toggle:hover {
  border-color: var(--color-orange);
}
</style>
