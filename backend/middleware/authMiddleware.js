const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'cambialo_por_un_secreto';

function authenticateToken(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ error: 'No autorizado' });

  const token = auth.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No autorizado' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

module.exports = authenticateToken;
