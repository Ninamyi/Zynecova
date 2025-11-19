const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Middleware para verificar que el  tenga el rol adecuado
 * @param {...string} rolesPermitidos
 */
function verificarRol(...rolesPermitidos) {
  return (req, res, next) => {
    try {

        const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ mensaje: "Acceso denegado. Token no proporcionado." });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.usuario = decoded;

      if (!rolesPermitidos.includes(req.usuario.rol)) {
        return res.status(403).json({ mensaje: "No tienes permisos para acceder a esta ruta." });
      }

      next();
    } catch (error) {
      console.error("Error en verificarRol:", error.message);
      res.status(403).json({ mensaje: "Token inválido o sesión expirada." });
    }
  };
}

module.exports = verificarRol;
