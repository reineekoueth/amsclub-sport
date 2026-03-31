<template>
  <div class="auth-page">
    <div class="left-panel">
      <div class="left-tagline">Espace membre</div>
      <h1 class="left-title">Bienvenue sur<br>votre <span>AMS Club</span></h1>
      <p class="left-desc"> Connectez-vous pour accéder à vos activités </p>
      <div class="stats-row">
        <div class="stat-box">
          <span class="stat-num">10</span>
          <span class="stat-lbl">Activités</span>
        </div>
        <div class="stat-box">
          <span class="stat-num">7j/7</span>
          <span class="stat-lbl">Ouvert</span>
        </div>
      </div>
    </div>

    <div class="right-panel">
      <div class="form-title">Connexion</div>
      <div class="form-subtitle">Accédez à votre espace membre</div>

      <form @submit.prevent="seConnecter">
        <div class="form-group">
          <label>Email</label>
          <input 
            v-model="form.email" 
            type="email" 
            placeholder="exemple@email.fr" 
            required 
          />
        </div>

        <div class="form-group">
          <label>Mot de passe</label>
          <input 
            v-model="form.mot_de_passe" 
            type="password" 
            placeholder="••••••••" 
            required 
          />
        </div>

        <p v-if="erreur" class="erreur-msg">{{ erreur }}</p>

        <button type="submit" class="btn-submit" :disabled="chargement">
          {{ chargement ? 'Connexion…' : 'Se connecter' }}
        </button>
      </form>

      <p class="switch-link">
        Pas encore membre ?
        <RouterLink to="/inscription">Créer un compte</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { membresService } from '../services/api'

const router = useRouter()

// Les données du formulaire
const form = ref({ email: '', mot_de_passe: '' })
const erreur = ref('')
const chargement = ref(false)

const seConnecter = async () => {
  erreur.value = ''
  chargement.value = true
  try {
    // On envoie email + mot de passe au backend
    const res = await membresService.connexion(form.value)

    // On sauvegarde le token et les infos dans localStorage
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('utilisateur', JSON.stringify(res.data.utilisateur))

    // On redirige vers l'accueil
    router.push('/')
  } catch (e) {
    erreur.value = e.response?.data?.error || 'Erreur de connexion'
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
  padding: 3rem 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.left-tagline {
  font-size: 11px;
  color: #e63946;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.left-title {
  font-size: 2.5rem;
  color: white;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 16px;
}

.left-title span { color: #e63946; }

.left-desc {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.7;
  max-width: 320px;
  margin-bottom: 2rem;
}

.stats-row {
  display: flex;
  gap: 1rem;
}

.stat-box {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  padding: 12px 20px;
  text-align: center;
}

.stat-num {
  display: block;
  font-size: 1.5rem;
  font-weight: 800;
  color: #e63946;
}

.stat-lbl {
  font-size: 11px;
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
}

.form-title {
  font-size: 1.8rem;
  color: white;
  font-weight: 800;
  margin-bottom: 4px;
}

.form-subtitle {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 1rem;
}

.form-group label {
  font-size: 11px;
  font-weight: 600;
  color: #666;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.form-group input {
  background: #1e1e1e;
  border: 1px solid #2e2e2e;
  border-radius: 8px;
  padding: 10px 14px;
  color: white;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus {
  border-color: #e63946;
}

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
  margin-top: 8px;
  transition: background 0.2s;
}

.btn-submit:hover { background: #c1121f; }
.btn-submit:disabled { background: #555; cursor: not-allowed; }

.switch-link {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #555;
}

.switch-link a {
  color: #e63946;
  font-weight: 600;
  text-decoration: none;
}
</style>