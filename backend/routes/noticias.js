const express = require("express");
const router = express.Router();
const noticiaController = require("../controllers/noticiaController");
const authenticateToken = require("../middlewares/authMiddleware");
const { verificarRol } = require("../middlewares/rolesMiddleware");

router.get("/", noticiaController.obtenerNoticias);
router.get("/:id", noticiaController.obtenerNoticiaPorId);

router.post("/", authenticateToken, verificarRol(["admin", "empleado"]), noticiaController.crearNoticia);
router.put("/:id", authenticateToken, verificarRol(["admin", "empleado"]), noticiaController.actualizarNoticia);
router.delete("/:id", authenticateToken, verificarRol(["admin"]), noticiaController.eliminarNoticia);

module.exports = router;