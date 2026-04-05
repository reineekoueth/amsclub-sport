const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');

const membresRoutes = require('./routes/membres');
const activitesRoutes = require('./routes/activites');
const abonnementsRoutes = require('./routes/abonnements');
const inscriptionsRoutes = require('./routes/inscriptions');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware CORS ---
app.use(cors({
  origin: [
    'http://localhost:5173',                  // frontend local
    'https://amsclub-sport.vercel.app',      // frontend déployé
    process.env.FRONTEND_URL                  // variable d'environnement si besoin
  ],
  credentials: true
}));

// --- Middleware pour parser JSON et url-encoded ---
// C’est la partie qui résout les erreurs 400 car req.body était undefined
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Routes ---
app.use('/api/membres', membresRoutes);
app.use('/api/activites', activitesRoutes);
app.use('/api/abonnements', abonnementsRoutes);
app.use('/api/inscriptions', inscriptionsRoutes);

app.get('/', (req, res) => {
  res.json({ message: '🏋️ API AMS Club fonctionne !' });
});

// --- Démarrage serveur ---
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});