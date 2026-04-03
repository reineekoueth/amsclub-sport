import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' }
})

// Ajoute le token JWT automatiquement
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Redirige vers /connexion si token expiré
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('utilisateur')
      window.location.href = '/connexion'
    }
    return Promise.reject(error)
  }
)
// ===== MEMBRES =====
export const membresService = {
  inscription: (data) => api.post('/membres/inscription', data),
  connexion: (data) => api.post('/membres/connexion', data),
  getTous: () => api.get('/membres'),
  getParId: (id) => api.get(`/membres/${id}`),
  modifierProfil: (id, data) => api.put(`/membres/${id}`, data),
  supprimer: (id) => api.delete(`/membres/${id}`)
}

// ===== ACTIVITÉS =====
export const activitesService = {
  getTous: () => api.get('/activites'),
  creer: (data) => api.post('/activites', data),
  modifier: (id, data) => api.put(`/activites/${id}`, data),
  supprimer: (id) => api.delete(`/activites/${id}`)
}

// ===== ABONNEMENTS =====
export const abonnementsService = {
  getTous: () => api.get('/abonnements')
}

// ===== INSCRIPTIONS =====
export const inscriptionsService = {
  getTous: () => api.get('/inscriptions'),
  getMembre: (id) => api.get(`/inscriptions/membre/${id}`),
  creer: (data) => api.post('/inscriptions', data),
  annuler: (id) => api.delete(`/inscriptions/${id}`)
}

export default api