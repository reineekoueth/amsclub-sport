const db = require('../config/db');

const getToutesInscriptions = async (req, res) => {
  try {
    const [inscriptions] = await db.query(`
      SELECT i.*, 
        m.nom, m.prenom, m.email,
        a.nom AS activite, a.jour_semaine, a.heure_debut,
        ab.nom AS abonnement, ab.prix
      FROM inscriptions i
      JOIN membres m ON i.membre_id = m.id
      JOIN activites a ON i.activite_id = a.id
      JOIN abonnements ab ON i.abonnement_id = ab.id
      ORDER BY i.date_debut DESC
    `);
    res.json(inscriptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getInscriptionsMembre = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT i.*,
        a.nom AS activite, a.jour_semaine, 
        a.heure_debut, a.heure_fin, a.image,
        ab.nom AS abonnement, ab.prix
      FROM inscriptions i
      JOIN activites a ON i.activite_id = a.id
      JOIN abonnements ab ON i.abonnement_id = ab.id
      WHERE i.membre_id = ?
      ORDER BY i.date_debut DESC
    `, [req.params.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const creerInscription = async (req, res) => {
  const { membre_id, activite_id, abonnement_id } = req.body;

  if (!membre_id || !activite_id || !abonnement_id) {
    return res.status(400).json({ error: 'Champs obligatoires manquants' });
  }

  try {
    const [dejaInscrit] = await db.query(
      "SELECT id FROM inscriptions WHERE membre_id = ? AND activite_id = ? AND statut = 'active'",
      [membre_id, activite_id]
    );
    if (dejaInscrit.length > 0) {
      return res.status(409).json({ error: 'Vous êtes déjà inscrit à cette activité !' });
    }

    const [activite] = await db.query(
      'SELECT capacite_max FROM activites WHERE id = ?', [activite_id]
    );
    if (activite.length === 0) {
      return res.status(404).json({ error: 'Activité non trouvée' });
    }

    const [inscrits] = await db.query(
      "SELECT COUNT(*) AS nb FROM inscriptions WHERE activite_id = ? AND statut = 'active'",
      [activite_id]
    );
    if (inscrits[0].nb >= activite[0].capacite_max) {
      return res.status(409).json({ error: 'Activité complète' });
    }

    const [abonnement] = await db.query(
      'SELECT nb_activites_max FROM abonnements WHERE id = ?', [abonnement_id]
    );

    const [nbInscriptions] = await db.query(
      "SELECT COUNT(*) AS nb FROM inscriptions WHERE membre_id = ? AND statut = 'active'",
      [membre_id]
    );

    if (nbInscriptions[0].nb >= abonnement[0].nb_activites_max) {
      return res.status(409).json({ 
        error: "Limite d'activités atteinte pour votre abonnement !" 
      });
    }

    const date_debut = new Date();
    const date_fin = new Date();
    date_fin.setMonth(date_fin.getMonth() + 3);

    const [result] = await db.query(
      'INSERT INTO inscriptions (membre_id, activite_id, abonnement_id, date_debut, date_fin) VALUES (?, ?, ?, ?, ?)',
      [membre_id, activite_id, abonnement_id, date_debut, date_fin]
    );

    res.status(201).json({ message: 'Inscription réussie !', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const annulerInscription = async (req, res) => {
  try {
    await db.query(
      "UPDATE inscriptions SET statut = 'annulee' WHERE id = ?", 
      [req.params.id]
    );
    res.json({ message: 'Inscription annulée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { 
  getToutesInscriptions, 
  getInscriptionsMembre, 
  creerInscription, 
  annulerInscription 
};