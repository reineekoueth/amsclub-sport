const db = require('../config/db');

// Liste toutes les activités actives
const getToutesActivites = async (req, res) => {
  try {
    const [activites] = await db.query(`
      SELECT a.*, 
        (SELECT COUNT(*) FROM inscriptions i 
         WHERE i.activite_id = a.id 
         AND i.statut = 'active') AS inscrits
      FROM activites a
      WHERE a.actif = 1
      ORDER BY FIELD(jour_semaine, 
        'Lundi','Mardi','Mercredi','Jeudi',
        'Vendredi','Samedi','Dimanche')
    `);
    res.json(activites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Créer une activité (admin)
const creerActivite = async (req, res) => {
  const { nom, description, image, jour_semaine, heure_debut, heure_fin, capacite_max } = req.body;

  if (!nom || !jour_semaine || !heure_debut || !heure_fin) {
    return res.status(400).json({ error: 'Champs obligatoires manquants' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO activites (nom, description, image, jour_semaine, heure_debut, heure_fin, capacite_max) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nom, description, image || null, jour_semaine, heure_debut, heure_fin, capacite_max || 25]
    );
    res.status(201).json({ message: 'Activité créée', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Modifier une activité (admin)
const modifierActivite = async (req, res) => {
  const { nom, description, image, jour_semaine, heure_debut, heure_fin, capacite_max } = req.body;
  try {
    await db.query(
      'UPDATE activites SET nom=?, description=?, image=?, jour_semaine=?, heure_debut=?, heure_fin=?, capacite_max=? WHERE id=?',
      [nom, description, image, jour_semaine, heure_debut, heure_fin, capacite_max, req.params.id]
    );
    res.json({ message: 'Activité mise à jour' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Supprimer une activité (admin)
const supprimerActivite = async (req, res) => {
  try {
    await db.query('UPDATE activites SET actif = 0 WHERE id = ?', [req.params.id]);
    res.json({ message: 'Activité désactivée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getToutesActivites, creerActivite, modifierActivite, supprimerActivite };