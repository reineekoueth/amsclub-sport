<template>
  <div class="home">
    <!-- Si connecté -->
    <section v-if="estConnecte" class="hero hero-membre">
      <div class="hero-content">
        <div class="hero-tagline">Bienvenue</div>
        <h1>Bonjour <span>{{ utilisateur.prenom }}</span> 👋</h1>
        <p>Retrouvez vos activités et gérez vos inscriptions.</p>
        <div class="hero-btns">
          <RouterLink to="/mes-cours" class="btn btn-primary">Mes cours</RouterLink>
          <RouterLink to="/activites" class="btn btn-outline">Voir les activités</RouterLink>
        </div>
      </div>
      <div class="hero-stats">
        <div class="stat">
          <span class="stat-number">{{ nbInscriptions }}</span>
          <span class="stat-label">Mes activités</span>
        </div>
        <div class="stat">
          <span class="stat-number">{{ utilisateur.role }}</span>
          <span class="stat-label">Mon rôle</span>
        </div>
        <div class="stat">
          <span class="stat-number">7j/7</span>
          <span class="stat-label">Ouvert</span>
        </div>
      </div>
    </section>

    <!-- Si pas connecté -->
    <section v-else class="hero">
      <div class="hero-content">
        <div class="hero-tagline">Bienvenue</div>
        <h1>Le club sportif<br><span>AMS Club</span></h1>
        <p>Rejoignez notre communauté et découvrez nos activités sportives pour tous les niveaux.</p>
        <div class="hero-btns">
          <RouterLink to="/activites" class="btn btn-primary">Voir les activités</RouterLink>
          <RouterLink to="/inscription" class="btn btn-outline">Rejoindre le club</RouterLink>
        </div>
      </div>
      <div class="hero-stats">
        <div class="stat">
          <span class="stat-number">10</span>
          <span class="stat-label">Activités</span>
        </div>
        <div class="stat">
          <span class="stat-number">7j/7</span>
          <span class="stat-label">Ouvert</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { inscriptionsService } from '../services/api'

const utilisateur = ref(JSON.parse(localStorage.getItem('utilisateur') || '{}'))
const estConnecte = ref(!!localStorage.getItem('token'))
const nbInscriptions = ref(0)

onMounted(async () => {
  if (estConnecte.value && utilisateur.value.id) {
    try {
      const res = await inscriptionsService.getMembre(utilisateur.value.id)
      nbInscriptions.value = res.data.filter(i => i.statut === 'active').length
    } catch (e) {
      console.error(e)
    }
  }
})
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, #1d1d1d 60%, #2a0a0d);
  border-radius: 16px;
  padding: 3rem 2.5rem;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.hero-membre {
  background: linear-gradient(135deg, #1d1d1d 60%, #1a0a20);
}

.hero-tagline {
  font-size: 11px;
  color: #e63946;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.hero-content h1 {
  font-size: 2.5rem;
  font-weight: 900;
  line-height: 1.2;
  margin-bottom: 1rem;
}

.hero-content h1 span { color: #e63946; }

.hero-content p {
  font-size: 1rem;
  color: #aaa;
  margin-bottom: 1.5rem;
  max-width: 400px;
}

.hero-btns {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  display: inline-block;
  padding: 0.6rem 1.4rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-primary { background: #e63946; color: white; }
.btn-primary:hover { background: #c1121f; }

.btn-outline {
  border: 2px solid white;
  color: white;
  background: transparent;
}
.btn-outline:hover { background: white; color: #1d1d1d; }

.hero-stats {
  display: flex;
  gap: 1.5rem;
}

.stat {
  text-align: center;
  background: rgba(255,255,255,0.05);
  border: 1px solid #2a2a2a;
  padding: 1rem 1.5rem;
  border-radius: 12px;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 900;
  color: #e63946;
  text-transform: capitalize;
}

.stat-label {
  font-size: 0.85rem;
  color: #666;
}
</style>