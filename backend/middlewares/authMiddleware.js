const jwt = require("jsonwebtoken");
require("dotenv").config();

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ mensaje: "Acceso denegado. No se proporcionó token." });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ mensaje: "Token no encontrado en la cabecera Authorization." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    res.status(403).json({ mensaje: "Token inválido o expirado." });
  }
}

module.exports = authenticateToken;


