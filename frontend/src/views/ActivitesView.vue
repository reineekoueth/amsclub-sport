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

    <div class="activites-grid">
      <div
        v-for="a in activitesFiltrees"
        :key="a.id"
        class="activite-card"
      >
        <div class="activite-img">
          <img :src="a.image || '/images/default.jpg'" :alt="a.nom" />
        </div>

        <div class="activite-body">
          <h3>{{ a.nom }}</h3>
          <p>{{ a.description }}</p>

          <!-- Créneaux horaires -->
          <div class="creneaux">
            <p class="creneaux-titre">Choisissez un créneau :</p>
            <div class="creneaux-liste">
              <button
                v-for="c in a.creneaux"
                :key="c.id"
                class="creneau-btn"
                :class="{
                  active: creneauSelectionne[a.id]?.id === c.id,
                  complet: c.inscrits >= c.capacite_max
                }"
                :disabled="c.inscrits >= c.capacite_max"
                @click="selectionnerCreneau(a.id, c)"
              >
                <span class="creneau-jour">{{ c.jour_semaine }}</span>
                <span class="creneau-heure">{{ c.heure_debut }} – {{ c.heure_fin }}</span>
                <span class="creneau-duree">⏱ {{ dureeSeance(c.heure_debut, c.heure_fin) }}</span>
                <span class="creneau-places">
                  {{ c.inscrits >= c.capacite_max ? 'Complet' : `${c.capacite_max - c.inscrits} places` }}
                </span>
              </button>
            </div>
          </div>

          <div class="activite-footer">
            <span class="prix">selon ton abonnement</span>
            <button
              v-if="estConnecte"
              class="btn-inscrire"
              :disabled="!creneauSelectionne[a.id]"
              @click="sInscrire(a.id)"
            >
              {{ creneauSelectionne[a.id] ? "S'inscrire" : 'Choisir un créneau' }}
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
const creneauSelectionne = ref({})

const estConnecte = ref(!!localStorage.getItem('token'))

const activitesFiltrees = computed(() =>
  filtreJour.value === 'Tous'
    ? activites.value
    : activites.value.filter(a =>
        a.creneaux?.some(c => c.jour_semaine === filtreJour.value)
      )
)

const dureeSeance = (debut, fin) => {
  const [hD, mD] = debut.split(':').map(Number)
  const [hF, mF] = fin.split(':').map(Number)
  const totalMin = (hF * 60 + mF) - (hD * 60 + mD)
  if (totalMin <= 0 || totalMin > 120) return 'Durée invalide'
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  return h > 0 ? `${h}h${m > 0 ? m + 'min' : ''}` : `${m}min`
}

const chargerActivites = async () => {
  try {
    const res = await activitesService.getTous()
    activites.value = res.data
  } catch (e) {
    console.error(e)
  }
}

const selectionnerCreneau = (activiteId, creneau) => {
  creneauSelectionne.value = {
    ...creneauSelectionne.value,
    [activiteId]: creneau
  }
}

const sInscrire = async (activiteId) => {
  const user = JSON.parse(localStorage.getItem('utilisateur') || '{}')
  const creneau = creneauSelectionne.value[activiteId]

  if (!user.id) {
    message.value = 'Connectez-vous pour vous inscrire.'
    isError.value = true
    return
  }

  if (!creneau) {
    message.value = 'Veuillez choisir un créneau.'
    isError.value = true
    return
  }

  try {
    await inscriptionsService.creer({
      membre_id: user.id,
      activite_id: activiteId,
      creneau_id: creneau.id,
      abonnement_id: user.abonnement_id || 1
    })

    message.value = `Inscription réussie — ${creneau.jour_semaine} ${creneau.heure_debut} !`
    isError.value = false
    creneauSelectionne.value[activiteId] = null
    await chargerActivites()
  } catch (e) {
    message.value = e.response?.data?.error || 'Erreur'
    isError.value = true
  }
}

onMounted(chargerActivites)
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

/* Créneaux */
.creneaux {
  margin-bottom: 1rem;
}

.creneaux-titre {
  font-size: 0.82rem;
  font-weight: 700;
  color: #555;
  margin-bottom: 0.5rem;
}

.creneaux-liste {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.creneau-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 12px;
  border: 2px solid #ddd;
  border-radius: 10px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 110px;
}

.creneau-btn:hover:not(:disabled) {
  border-color: #e63946;
  background: #fff5f5;
}

.creneau-btn.active {
  border-color: #e63946;
  background: #e63946;
  color: white;
}

.creneau-btn.complet {
  opacity: 0.45;
  cursor: not-allowed;
}

.creneau-jour {
  font-weight: 700;
  font-size: 0.82rem;
}

.creneau-heure {
  font-size: 0.78rem;
}

.creneau-duree {
  font-size: 0.72rem;
  opacity: 0.8;
}

.creneau-places {
  font-size: 0.7rem;
  opacity: 0.75;
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
  .creneaux-liste { gap: 0.4rem; }
  .creneau-btn { min-width: 90px; padding: 6px 8px; }
}
</style>