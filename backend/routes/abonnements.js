const express = require('express');
const router = express.Router();
const { getTousAbonnements } = require('../controllers/abonnementsController');

// Route publique → tout le monde peut voir les abonnements
router.get('/', getTousAbonnements);

module.exports = router;