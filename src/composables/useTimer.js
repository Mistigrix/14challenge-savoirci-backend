import { ref, onUnmounted } from 'vue'

/**
 * Composable pour gérer un compte à rebours
 * @param {number} duration - Durée initiale en secondes
 * @param {Function} onExpired - Callback appelé quand le temps est écoulé
 */
export function useTimer(duration = 15, onExpired = null) {
  const timeLeft = ref(duration)
  const isActive = ref(false)
  let intervalId = null

  /** Démarre le compte à rebours */
  function start() {
    stop()
    timeLeft.value = duration
    isActive.value = true
    intervalId = setInterval(() => {
      timeLeft.value--
      if (timeLeft.value <= 0) {
        stop()
        if (onExpired) onExpired()
      }
    }, 1000)
  }

  /** Arrête le compte à rebours */
  function stop() {
    isActive.value = false
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  /** Réinitialise et redémarre le timer */
  function restart() {
    start()
  }

  // Nettoyage automatique à la destruction du composant
  onUnmounted(() => stop())

  return { timeLeft, isActive, start, stop, restart }
}
