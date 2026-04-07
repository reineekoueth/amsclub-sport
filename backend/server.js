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

// --- CORS ---
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://amsclub-sport.vercel.app',
    process.env.FRONTEND_URL
  ],
  credentials: true
}));

// --- Middleware ---
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

//  IMPORTANT POUR TESTS
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  });
}

module.exports = app;