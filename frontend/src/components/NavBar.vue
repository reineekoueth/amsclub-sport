<template>
  <div>
    <nav class="navbar">
      <div class="navbar-brand">
        <div class="logo"><span>⚡</span></div>
        <RouterLink to="/" class="brand-name">AMS<span>Club</span></RouterLink>
      </div>

      <!-- Liens desktop -->
      <ul class="navbar-links">
        <li><RouterLink to="/">Accueil</RouterLink></li>
        <li><RouterLink to="/activites">Activités</RouterLink></li>
        <li v-if="estConnecte"><RouterLink to="/mes-cours">Mes Cours</RouterLink></li>
        <li v-if="estAdmin"><RouterLink to="/membres">Membres</RouterLink></li>
      </ul>

      <!-- Auth desktop -->
      <div class="navbar-auth">
      
        <template v-if="estConnecte">
          <span class="user-name">👤 {{ utilisateur.prenom }}</span>
          <button class="btn btn-secondary" @click="deconnexion">Déconnexion</button>
        </template>

        <template v-else>
          <RouterLink to="/connexion" class="btn btn-secondary">Connexion</RouterLink>
          <RouterLink to="/inscription" class="btn btn-primary">S'inscrire</RouterLink>
        </template>
      </div>

      <!-- Burger mobile -->
      <button class="burger" @click="menuOuvert = !menuOuvert">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>

    <!-- Menu mobile -->
    <div class="mobile-menu" :class="{ ouvert: menuOuvert }">
      <RouterLink to="/" @click="menuOuvert = false">Accueil</RouterLink>
      <RouterLink to="/activites" @click="menuOuvert = false">Activités</RouterLink>
      <RouterLink v-if="estConnecte" to="/mes-cours" @click="menuOuvert = false">Mes Cours</RouterLink>
      <RouterLink v-if="estAdmin" to="/membres" @click="menuOuvert = false">Membres</RouterLink>
      
      <template v-if="estConnecte">
        <button @click="deconnexion">Déconnexion</button>
      </template>

      <template v-else>
        <RouterLink to="/connexion" @click="menuOuvert = false">Connexion</RouterLink>
        <RouterLink to="/inscription" @click="menuOuvert = false">S'inscrire</RouterLink>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const utilisateur = ref(JSON.parse(localStorage.getItem('utilisateur') || '{}'))
const estConnecte = ref(!!localStorage.getItem('token'))
const menuOuvert = ref(false)  // ← ajoute juste cette ligne !

watch(route, () => {
  utilisateur.value = JSON.parse(localStorage.getItem('utilisateur') || '{}')
  estConnecte.value = !!localStorage.getItem('token')
  menuOuvert.value = false  // ← ferme le menu quand on change de page
})

const estAdmin = computed(() => utilisateur.value.role === 'admin')

const deconnexion = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('utilisateur')
  estConnecte.value = false
  utilisateur.value = {}
  menuOuvert.value = false
  router.push('/connexion')
}
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #0d0d0d;
  padding: 0 2rem;
  height: 64px;
  border-bottom: 1px solid #2a2a2a;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo {
  width: 32px;
  height: 32px;
  background: #e63946;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.brand-name {
  color: white;
  font-size: 1.2rem;
  font-weight: 800;
  text-decoration: none;
  letter-spacing: 1px;
}

.brand-name span { color: #e63946; }

.navbar-links {
  display: flex;
  list-style: none;
  gap: 4px;
}

.navbar-links a {
  color: #888;
  text-decoration: none;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.navbar-links a:hover,
.navbar-links a.router-link-active {
  color: white;
  background: rgba(255,255,255,0.06);
}

.navbar-links a.router-link-active { color: #e63946; }

.navbar-auth {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-name {
  color: #aaa;
  font-size: 0.9rem;
}

/* Bouton menu burger (mobile) */
.burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  padding: 4px;
  background: none;
  border: none;
}

.burger span {
  display: block;
  width: 22px;
  height: 2px;
  background: white;
  border-radius: 2px;
  transition: all 0.3s;
}

/* Menu mobile ouvert */
.mobile-menu {
  display: none;
  flex-direction: column;
  background: #0d0d0d;
  border-top: 1px solid #1a1a1a;
  padding: 1rem 1.5rem;
  gap: 0.5rem;
}

.mobile-menu a, .mobile-menu button {
  color: #aaa;
  text-decoration: none;
  font-size: 0.95rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid #1a1a1a;
  background: none;
  border-left: none;
  border-right: none;
  border-top: none;
  cursor: pointer;
  text-align: left;
  width: 100%;
}

.mobile-menu a:hover { color: #e63946; }

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .navbar-links { display: none; }
  .navbar-auth { display: none; }
  .burger { display: flex; }
  .mobile-menu.ouvert { display: flex; }
  .navbar { padding: 0 1rem; }
}
</style>