const jwt = require('jsonwebtoken');

const verifierToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];//vérifier si quelqu'un a son badge d'entrée//
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Accès refusé : token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.utilisateur = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token invalide ou expiré' });
  }
};

const verifierAdmin = (req, res, next) => {
  if (req.utilisateur.role !== 'admin') {
    return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
  }
  next();
};

module.exports = { verifierToken, verifierAdmin };