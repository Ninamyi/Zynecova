const express = require("express");
const router = express.Router();

const noticiaController = require('../controllers/noticiaController');
const authenticateToken = require("../middlewares/authMiddleware");
const verificarRol = require("../middlewares/rolesMiddleware");

router.get('/', noticiaController.getNoticiasDatosAmbientales);
router.get('/admin', authenticateToken, verificarRol(["admin", "empleado"]), noticiaController.getNoticiasAdmin); 
router.post("/", authenticateToken, verificarRol(["admin", "empleado"]), noticiaController.crearNoticia);
router.put("/:id", authenticateToken, verificarRol(["admin", "empleado"]), noticiaController.actualizarNoticia);
router.put("/:id", authenticateToken, verificarRol(["admin", "empleado"]), noticiaController.actualizarNoticia);
module.exports = router;