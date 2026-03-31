const express = require('express');
const router = express.Router();
const { verifierToken, verifierAdmin } = require('../middleware/auth');
const { getToutesInscriptions, getInscriptionsMembre, creerInscription, annulerInscription } = require('../controllers/inscriptionsController');

// Routes protégées
router.get('/', verifierToken, verifierAdmin, getToutesInscriptions);
router.get('/membre/:id', verifierToken, getInscriptionsMembre);
router.post('/', verifierToken, creerInscription);
router.delete('/:id', verifierToken, annulerInscription);

module.exports = router;