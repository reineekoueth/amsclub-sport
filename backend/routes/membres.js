const express = require('express');
const router = express.Router();
const { verifierToken, verifierAdmin } = require('../middleware/auth');
const { 
  inscription, 
  connexion, 
  getTousMembres, 
  supprimerMembre,
  getMembreParId,
  modifierProfil
} = require('../controllers/membresController');

// Routes publiques
router.post('/inscription', inscription);
router.post('/connexion', connexion);

// Routes protégées
router.get('/', verifierToken, verifierAdmin, getTousMembres);
router.get('/:id', verifierToken, getMembreParId);
router.put('/:id', verifierToken, modifierProfil);
router.delete('/:id', verifierToken, verifierAdmin, supprimerMembre);

module.exports = router;