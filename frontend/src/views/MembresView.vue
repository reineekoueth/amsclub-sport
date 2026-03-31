<template>
  <div>
    <div class="page-header">
      <h1>Gestion des Membres</h1>
      <span class="badge-admin">Admin</span>
    </div>

    <!-- Barre de recherche -->
    <div class="card">
      <input
        v-model="recherche"
        type="text"
        placeholder="🔍 Rechercher un membre..."
        class="search-input"
      />

      <div v-if="chargement" class="loading">Chargement...</div>

      <table v-else class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in membresFiltres" :key="m.id">
            <td>#{{ m.id }}</td>
            <td><strong>{{ m.nom }} {{ m.prenom }}</strong></td>
            <td>{{ m.email }}</td>
            <td>
              <span class="badge" :class="m.role === 'admin' ? 'badge-red' : 'badge-green'">
                {{ m.role }}
              </span>
            </td>
            <td>
              <span class="badge" :class="m.actif ? 'badge-green' : 'badge-grey'">
                {{ m.actif ? 'Actif' : 'Inactif' }}
              </span>
            </td>
            <td>
              <button class="btn-danger" @click="desactiverMembre(m.id)">
                Désactiver
              </button>
            </td>
          </tr>
          <tr v-if="membresFiltres.length === 0">
            <td colspan="6" class="empty">Aucun membre trouvé.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-if="message" class="message" :class="{ erreur: isError }">
      {{ message }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { membresService } from '../services/api'

const membres = ref([])
const recherche = ref('')
const chargement = ref(true)
const message = ref('')
const isError = ref(false)

// Filtre les membres selon la recherche
const membresFiltres = computed(() => {
  const q = recherche.value.toLowerCase()
  return membres.value.filter(m =>
    m.nom.toLowerCase().includes(q) ||
    m.prenom.toLowerCase().includes(q) ||
    m.email.toLowerCase().includes(q)
  )
})

// Charge la liste des membres au chargement de la page
onMounted(async () => {
  try {
    const res = await membresService.getTous()
    membres.value = res.data
  } catch (e) {
    message.value = 'Erreur de chargement'
    isError.value = true
  } finally {
    chargement.value = false
  }
})

// Désactive un membre
const desactiverMembre = async (id) => {
  if (!confirm('Désactiver ce membre ?')) return
  try {
    await membresService.supprimer(id)
    const m = membres.value.find(m => m.id === id)
    if (m) m.actif = false
    message.value = 'Membre désactivé.'
    isError.value = false
  } catch (e) {
    message.value = e.response?.data?.error || 'Erreur'
    isError.value = true
  }
}
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.page-header h1 {
  font-size: 1.8rem;
  font-weight: 800;
}

.badge-admin {
  background: #e63946;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.search-input {
  width: 100%;
  padding: 0.7rem 1rem;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  margin-bottom: 1.2rem;
  outline: none;
}

.search-input:focus {
  border-color: #e63946;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.table th {
  background: #f4f4f4;
  padding: 0.7rem 1rem;
  text-align: left;
  font-weight: 700;
  color: #555;
  font-size: 0.82rem;
  text-transform: uppercase;
}

.table td {
  padding: 0.8rem 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.table tr:hover td {
  background: #fafafa;
}

.badge {
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 700;
}

.badge-red { background: #ffe0e0; color: #e63946; }
.badge-green { background: #d4edda; color: #155724; }
.badge-grey { background: #e2e3e5; color: #383d41; }

.btn-danger {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 5px 12px;
  font-size: 0.8rem;
  cursor: pointer;
}

.btn-danger:hover { background: #a71d2a; }

.empty {
  text-align: center;
  color: #999;
  padding: 2rem;
}

.loading {
  text-align: center;
  color: #999;
  padding: 2rem;
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