<template>
  <div>
    <div class="page-header">
      <h1>Nos Activités</h1>
    </div>
    <div class="filtres">
      <button
        v-for="j in ['Tous', 'Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche']"
        :key="j"
        class="filtre-btn"
        :class="{ active: filtreJour === j }"
        @click="filtreJour = j"
      >{{ j }}</button>
    </div>

    <!-- Grille activités -->
    <div class="activites-grid">
      <div 
        v-for="a in activitesFiltrees" 
        :key="a.id" 
        class="activite-card"
      >
        <!-- Image de l'activité -->
        <div class="activite-img">
          <img :src="a.image || '/images/default.jpg'" :alt="a.nom" />
          <span class="jour-badge">{{ a.jour_semaine }}</span>
        </div>

        <div class="activite-body">
          <h3>{{ a.nom }}</h3>
          <p>{{ a.description }}</p>

          <div class="activite-infos">
            <span> {{ a.heure_debut }} – {{ a.heure_fin }}</span>
            <span>👥 {{ a.inscrits }}/{{ a.capacite_max }}</span>
          </div>

          <div class="activite-footer">
            <span class="prix">selon ton abonnements </span>
            <button 
              v-if="estConnecte"
              class="btn-inscrire"
              :disabled="a.inscrits >= a.capacite_max"
              @click="sInscrire(a.id)"
            >
              {{ a.inscrits >= a.capacite_max ? 'Complet' : "S'inscrire" }}
            </button>
            <RouterLink v-else to="/connexion" class="btn-inscrire">
              Se connecter
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <p v-if="message" class="message" :class="{ erreur: isError }">
      {{ message }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { activitesService, inscriptionsService } from '../services/api'

const activites = ref([])
const filtreJour = ref('Tous')
const message = ref('')
const isError = ref(false)

const estConnecte = ref(!!localStorage.getItem('token'))

const activitesFiltrees = computed(() =>
  filtreJour.value === 'Tous'
    ? activites.value
    : activites.value.filter(a => a.jour_semaine === filtreJour.value)
)

const chargerActivites = async () => {
  try {
    const res = await activitesService.getTous()
    activites.value = res.data
  } catch (e) {
    console.error(e)
  }
}

onMounted(chargerActivites)
const sInscrire = async (activiteId) => {
  const user = JSON.parse(localStorage.getItem('utilisateur') || '{}')
  if (!user.id) {
    message.value = 'Connectez-vous pour vous inscrire.'
    isError.value = true
    return
  }
  try {
    await inscriptionsService.creer({ 
      membre_id: user.id, 
      activite_id: activiteId,
      abonnement_id: user.abonnement_id || 1
    }) 
    message.value = 'Inscription réussie !'
    isError.value = false
    await chargerActivites()
  } catch (e) {
    message.value = e.response?.data?.error || 'Erreur'
    isError.value = true
  }
}
</script>

<style scoped>
.page-header {
  margin-bottom: 1.5rem;
}

.page-header h1 {
  font-size: 1.8rem;
  font-weight: 800;
  color: #1d1d1d;
}

.filtres {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.filtre-btn {
  padding: 0.4rem 1rem;
  border-radius: 20px;
  border: 2px solid #ddd;
  background: white;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.filtre-btn.active,
.filtre-btn:hover {
  background: #e63946;
  border-color: #e63946;
  color: white;
}

.activites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.activite-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  transition: transform 0.2s;
}

.activite-card:hover {
  transform: translateY(-4px);
}

.activite-img {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.activite-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.jour-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #e63946;
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.activite-body {
  padding: 1.2rem;
}

.activite-body h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1d1d1d;
}

.activite-body p {
  font-size: 0.85rem;
  color: #666;
  line-height: 1.5;
  margin-bottom: 0.8rem;
}

.activite-infos {
  display: flex;
  gap: 1rem;
  font-size: 0.82rem;
  color: #555;
  margin-bottom: 1rem;
}

.activite-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.prix {
  font-size: 1.1rem;
  font-weight: 800;
  color: #e63946;
}

.btn-inscrire {
  background: #e63946;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s;
}

.btn-inscrire:hover { background: #c1121f; }
.btn-inscrire:disabled {
  background: #ccc;
  cursor: not-allowed;
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
@media (max-width: 768px) {
  .page-header h1 { font-size: 1.4rem; }
  .filtres { gap: 0.4rem; }
  .filtre-btn { padding: 0.3rem 0.7rem; font-size: 0.8rem; }
  .activites-grid { grid-template-columns: 1fr; }
  .activite-img { height: 160px; }
}
</style>