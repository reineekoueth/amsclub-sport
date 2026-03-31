const db = require('../config/db');//importe la connexion à la base de données MySQL
const bcrypt = require('bcrypt');// por chifrrer le mdp 
const jwt = require('jsonwebtoken');

// Inscription
const inscription = async (req, res) => {
  const { nom, prenom, email, telephone, adresse, date_naissance, mot_de_passe } = req.body;

  if (!nom || !prenom || !email || !mot_de_passe) {
    return res.status(400).json({ error: 'Champs obligatoires manquants' });
  }

  try {
    const [existe] = await db.query(
      'SELECT id FROM membres WHERE email = ?', [email]
    );
    if (existe.length > 0) {
      return res.status(409).json({ error: 'Email déjà utilisé' });
    }

    const hash = await bcrypt.hash(mot_de_passe, 10);

     const [result] = await db.query(
  'INSERT INTO membres (nom, prenom, email, telephone, adresse, date_naissance, mot_de_passe) VALUES (?, ?, ?, ?, ?, ?, ?)',
  [nom, prenom, email, telephone || null, adresse || null, date_naissance, hash]
);

    res.status(201).json({ message: 'Compte créé !', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Connexion
const connexion = async (req, res) => {
  const { email, mot_de_passe } = req.body;

  if (!email || !mot_de_passe) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  try {
    const [rows] = await db.query(
      'SELECT * FROM membres WHERE email = ? AND actif = 1', [email]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    const membre = rows[0];
    const valide = await bcrypt.compare(mot_de_passe, membre.mot_de_passe);
    if (!valide) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    const token = jwt.sign(
      { id: membre.id, email: membre.email, role: membre.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Connexion réussie',
      token,
      utilisateur: {
        id: membre.id,
        nom: membre.nom,
        prenom: membre.prenom,
        email: membre.email,
        role: membre.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Liste tous les membres
const getTousMembres = async (req, res) => {
  try {
    const [membres] = await db.query(
      'SELECT id, nom, prenom, email, role, actif FROM membres ORDER BY nom'
    );
    res.json(membres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Supprimer un membre
const supprimerMembre = async (req, res) => {
  try {
    await db.query(
      'UPDATE membres SET actif = 0 WHERE id = ?', [req.params.id]
    );
    res.json({ message: 'Membre désactivé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Récupérer un membre par ID
const getMembreParId = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, nom, prenom, email, telephone, adresse, date_naissance, role, date_inscription FROM membres WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Membre non trouvé' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Modifier son profil
const modifierProfil = async (req, res) => {
  const { nom, prenom, telephone, adresse } = req.body;
  try {
    await db.query(
      'UPDATE membres SET nom = ?, prenom = ?, telephone = ?, adresse = ? WHERE id = ?',
      [nom, prenom, telephone || null, adresse || null, req.params.id]
    );
    res.json({ message: 'Profil mis à jour !' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = { inscription, connexion, getTousMembres, supprimerMembre,getMembreParId,
  modifierProfil};