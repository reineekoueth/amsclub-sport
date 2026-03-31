const db = require('../config/db');

// Liste tous les abonnements actifs
const getTousAbonnements = async (req, res) => {
  try {
    const [abonnements] = await db.query(
      'SELECT * FROM abonnements WHERE actif = 1'
    );
    res.json(abonnements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getTousAbonnements };