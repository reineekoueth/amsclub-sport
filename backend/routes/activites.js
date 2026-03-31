const express = require('express');
const router = express.Router();
const { verifierToken, verifierAdmin } = require('../middleware/auth');
const { getToutesActivites, creerActivite, modifierActivite, supprimerActivite } = require('../controllers/activitesController');

// Routes publiques
router.get('/', getToutesActivites);

// Routes admin
router.post('/', verifierToken, verifierAdmin, creerActivite);
router.put('/:id', verifierToken, verifierAdmin, modifierActivite);
router.delete('/:id', verifierToken, verifierAdmin, supprimerActivite);

module.exports = router;