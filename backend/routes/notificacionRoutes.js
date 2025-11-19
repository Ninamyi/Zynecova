const express = require('express');
const router = express.Router();
const notificacionController = require('../controllers/notificacionController');
const authenticateToken = require("../middlewares/authMiddleware");

router.use(authenticateToken); 

router.get('/:usuarioId', notificacionController.getNotificacionesByUsuario); 

router.get('/no-leidas/:usuarioId', notificacionController.getConteoNoLeidas);

router.put('/:id/leida', notificacionController.marcarComoLeida); 

module.exports = router;
