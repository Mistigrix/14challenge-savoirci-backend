/**
 * Configuration de base pour les appels API
 * À compléter quand les endpoints du backend Express seront disponibles
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

/**
 * Effectue une requête HTTP vers l'API backend
 * @param {string} endpoint - Chemin relatif de l'endpoint (ex: '/categories')
 * @param {Object} options - Options fetch supplémentaires
 * @returns {Promise<any>} Données JSON de la réponse
 */
export async function fetchApi(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  })

  if (!response.ok) {
    throw new Error(`Erreur API : ${response.status} ${response.statusText}`)
  }

  return response.json()
}
