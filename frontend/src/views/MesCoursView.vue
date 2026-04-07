<template>
  <div>
    <h1 class="page-title">Mes Cours</h1>

    <div v-if="chargement" class="loading">Chargement...</div>

    <div v-else-if="inscriptions.length === 0" class="empty-state card">
      <p>Vous n'êtes inscrit à aucune activité.</p>
      <RouterLink to="/activites" class="btn-red">
        Découvrir les activités
      </RouterLink>
    </div>

    <div v-else class="inscriptions-grid">
      <div v-for="i in inscriptions" :key="i.id" class="card inscription-card">
        <div class="inscription-header">
          <span class="jour-badge">{{ i.jour_semaine }}</span>
          <span class="statut" :class="'statut-' + i.statut">
            {{ i.statut }}
          </span>
        </div>

        <h3>{{ i.activite }}</h3>

        <div class="inscription-infos">
          <span>🕐 {{ i.heure_debut }} – {{ i.heure_fin }}</span>
        </div>

       <p class="date-inscription">
          Inscrit le {{ new Date(i.date_debut).toLocaleDateString('fr-FR') }}
        </p>

        <button
          v-if="i.statut === 'active'"
          class="btn-danger"
          @click="seDesinscrire(i.id)"
        >
          Se désinscrire
        </button>
      </div>
    </div>

    <p v-if="message" class="message" :class="{ erreur: isError }">
      {{ message }}
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { inscriptionsService } from '../services/api'

const inscriptions = ref([])
const chargement = ref(true)
const message = ref('')
const isError = ref(false)

const utilisateur = JSON.parse(localStorage.getItem('utilisateur') || '{}')

onMounted(async () => {
  try {
    const res = await inscriptionsService.getMembre(utilisateur.id)
    inscriptions.value = res.data
  } catch (e) {
    message.value = 'Erreur de chargement'
    isError.value = true
  } finally {
    chargement.value = false
  }
})

const seDesinscrire = async (id) => {
  if (!confirm('Se désinscrire de cette activité ?')) return
  try {
    await inscriptionsService.annuler(id)
    const i = inscriptions.value.find(i => i.id === id)
    if (i) i.statut = 'annulée'
    message.value = 'Désinscription effectuée.'
    isError.value = false
  } catch (e) {
    message.value = e.response?.data?.error || 'Erreur'
    isError.value = true
  }
}
</script>

<style scoped>
.page-title {
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
}

.inscriptions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 1.4rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.inscription-card {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.inscription-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.jour-badge {
  background: #e63946;
  color: white;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.statut {
  font-size: 0.8rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
}

.statut-active { background: #d4edda; color: #155724; }
.statut-annulee { background: #f8d7da; color: #721c24; }
.statut-suspendue { background: #fff3cd; color: #856404; }

.inscription-card h3 {
  font-size: 1.1rem;
  font-weight: 700;
}

.inscription-infos {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: #555;
}

.date-inscription {
  font-size: 0.8rem;
  color: #999;
}

.btn-danger {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  margin-top: auto;
}

.btn-danger:hover { background: #a71d2a; }

.empty-state {
  text-align: center;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #666;
}

.btn-red {
  background: #e63946;
  color: white;
  padding: 8px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
}

.loading {
  text-align: center;
  color: #999;
  padding: 3rem;
}

.message {
  margin-top: 1rem;
  padding: 0.8rem;
  border-radius: 8px;
  background: #d4edda;
  color: #155724;
  font-weight: 600;
}

.message.erreur {
  background: #f8d7da;
  color: #721c24;
}
</style>