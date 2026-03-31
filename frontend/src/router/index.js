import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ConnexionView from '../views/ConnexionView.vue'
import InscriptionView from '../views/InscriptionView.vue'
import ActivitesView from '../views/ActivitesView.vue'
import MembresView from '../views/MembresView.vue'
import MesCoursView from '../views/MesCoursView.vue' 


const routes = [
  { 
    path: '/', 
    name: 'home', 
    component: HomeView 
  },
  { 
    path: '/connexion', 
    name: 'connexion', 
    component: ConnexionView 
  },
  { 
  path: '/inscription', 
  name: 'inscription', 
  component: InscriptionView 
  },
  {
  path: '/membres',
  name: 'membres',
  component: MembresView,
  meta: { requiresAuth: true, requiresAdmin: true }
},
{
  path: '/mes-cours',
  name: 'mes-cours',
  component: MesCoursView,
  meta: { requiresAuth: true }
},
{
  path: '/activites',
  name: 'activites',
  component: ActivitesView
}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
// Vérifie avant chaque changement de page
router.beforeEach((to, from) => {
  const token = localStorage.getItem('token')
  const utilisateur = JSON.parse(localStorage.getItem('utilisateur') || '{}')

  if (to.meta.requiresAuth && !token) {
    return '/connexion'
  }

  if (to.meta.requiresAdmin && utilisateur.role !== 'admin') {
    return '/'
  }
})
export default router