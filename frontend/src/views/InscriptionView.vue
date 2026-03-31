<template>
  <div class="auth-page">
    <div class="left-panel">
      <div class="left-tagline">Nouveau membre</div>
      <h1 class="left-title">Rejoignez<br><span>AMS Club</span></h1>
      <p class="left-desc">Créez votre compte et choisissez votre abonnement.</p>

      <!-- Abonnements -->
      <div class="abonnements">
        <div
          v-for="a in abonnements"
          :key="a.id"
          class="abo-card"
          :class="{ active: form.abonnement_id === a.id }"
          @click="form.abonnement_id = a.id"
        >
          <span class="abo-nom">{{ a.nom }}</span>
          <span class="abo-prix">{{ a.prix }}€ <small>/trimestre</small></span>
          <span class="abo-desc">{{ a.description }}</span>
        </div>
      </div>
    </div>

    <div class="right-panel">
      <div class="form-title">Créer un compte</div>
      <div class="form-subtitle">Tous les champs * sont obligatoires</div>

      <form @submit.prevent="sInscrire">
        <div class="form-grid">
          <div class="form-group">
            <label>Nom *</label>
            <input v-model="form.nom" type="text" required />
          </div>
          <div class="form-group">
            <label>Prénom *</label>
            <input v-model="form.prenom" type="text" required />
          </div>
        </div>

        <div class="form-group">
          <label>Email *</label>
          <input v-model="form.email" type="email" required />
        </div>

        <div class="form-group">
          <label>Téléphone</label>
          <input v-model="form.telephone" type="tel" placeholder="06 00 00 00 00" />
        </div>

        <div class="form-group">
          <label>Adresse</label>
          <input v-model="form.adresse" type="text" placeholder="1 rue de la Paix, Paris" />
        </div>

        <div class="form-group">
          <label>Date de naissance * <small>(16 ans minimum)</small></label>
          <input v-model="form.date_naissance" type="date" required />
        </div>

        <div class="form-group">
          <label>Mot de passe * <small>(6 caractères minimum)</small></label>
          <input v-model="form.mot_de_passe" type="password" minlength="10" required />
        </div>

        <p v-if="erreur" class="erreur-msg">{{ erreur }}</p>
        <p v-if="succes" class="succes-msg">{{ succes }}</p>

        <button type="submit" class="btn-submit" :disabled="chargement || !form.abonnement_id">
          {{ chargement ? 'Création…' : 'Créer mon compte' }}
        </button>

        <p v-if="!form.abonnement_id" class="hint">
          Choisissez un abonnement à gauche
        </p>
      </form>

      <p class="switch-link">
        Déjà membre ?
        <RouterLink to="/connexion">Se connecter</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { membresService, abonnementsService } from '../services/api'

const router = useRouter()

const form = ref({
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  adresse: '',
  date_naissance: '',
  mot_de_passe: '',
  abonnement_id: null
})

const abonnements = ref([])
const erreur = ref('')
const succes = ref('')
const chargement = ref(false)

// Charge les abonnements au chargement de la page
onMounted(async () => {
  try {
    const res = await abonnementsService.getTous()
    abonnements.value = res.data
  } catch (e) {
    console.error(e)
  }
})

const sInscrire = async () => {
  erreur.value = ''
  succes.value = ''
  chargement.value = true
  try {
    await membresService.inscription(form.value)
    succes.value = 'Compte créé ! Redirection vers la connexion...'
    setTimeout(() => router.push('/connexion'), 2000)
  } catch (e) {
    erreur.value = e.response?.data?.error || 'Erreur lors de la création'
  } finally {
    chargement.value = false
  }
}
</script>

<style scoped>
.auth-page {
  display: flex;
  min-height: calc(100vh - 140px);
  margin: -2rem;
}

.left-panel {
  flex: 1;
  background: #111;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
}

.left-tagline {
  font-size: 11px;
  color: #e63946;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.left-title {
  font-size: 2rem;
  color: white;
  font-weight: 800;
  line-height: 1.2;
}

.left-title span { color: #e63946; }

.left-desc {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.7;
}

.abonnements {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.abo-card {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  padding: 1rem 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.abo-card:hover {
  border-color: #e63946;
}

.abo-card.active {
  border-color: #e63946;
  background: #1e0a0c;
}

.abo-nom {
  font-size: 0.95rem;
  font-weight: 700;
  color: white;
}

.abo-prix {
  font-size: 1.2rem;
  font-weight: 800;
  color: #e63946;
}

.abo-prix small {
  font-size: 0.75rem;
  color: #666;
  font-weight: 400;
}

.abo-desc {
  font-size: 0.8rem;
  color: #555;
}

.right-panel {
  width: 420px;
  background: #161616;
  border-left: 1px solid #222;
  padding: 3rem 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow-y: auto;
}

.form-title {
  font-size: 1.8rem;
  color: white;
  font-weight: 800;
  margin-bottom: 4px;
}

.form-subtitle {
  font-size: 0.85rem;
  color: #555;
  margin-bottom: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 0.9rem;
}

.form-group label {
  font-size: 11px;
  font-weight: 600;
  color: #666;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.form-group label small {
  text-transform: none;
  letter-spacing: 0;
  color: #444;
}

.form-group input {
  background: #1e1e1e;
  border: 1px solid #2e2e2e;
  border-radius: 8px;
  padding: 9px 12px;
  color: white;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus { border-color: #e63946; }
.form-group input::placeholder { color: #444; }

.erreur-msg {
  background: #2a1515;
  border: 1px solid #5a1a1a;
  color: #ff6b6b;
  padding: 0.6rem 0.9rem;
  border-radius: 8px;
  font-size: 0.88rem;
  margin-bottom: 1rem;
}

.succes-msg {
  background: #0f2a1a;
  border: 1px solid #1a5a2a;
  color: #4caf50;
  padding: 0.6rem 0.9rem;
  border-radius: 8px;
  font-size: 0.88rem;
  margin-bottom: 1rem;
}

.btn-submit {
  width: 100%;
  background: #e63946;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-submit:hover { background: #c1121f; }
.btn-submit:disabled { background: #333; cursor: not-allowed; }

.hint {
  text-align: center;
  font-size: 0.82rem;
  color: #555;
  margin-top: 8px;
}

.switch-link {
  text-align: center;
  margin-top: 1.2rem;
  font-size: 0.9rem;
  color: #555;
}

.switch-link a {
  color: #e63946;
  font-weight: 600;
  text-decoration: none;
}
</style>