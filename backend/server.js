const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');

// Import des routes
const membresRoutes = require('./routes/membres');
const activitesRoutes = require('./routes/activites');
const abonnementsRoutes = require('./routes/abonnements');
const inscriptionsRoutes = require('./routes/inscriptions');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Branchement des routes
app.use('/api/membres', membresRoutes);
app.use('/api/activites', activitesRoutes);
app.use('/api/abonnements', abonnementsRoutes);
app.use('/api/inscriptions', inscriptionsRoutes);

// Route de test
app.get('/', (req, res) => {
  res.json({ message: '🏋️ API AMS Club fonctionne !' });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});