const express = require('express');
const router = express.Router();
const pronosticosController = require('../controllers/pronosticosController');
const authenticateToken = require('../middleware/authMiddleware');

// Obtener pronósticos
router.get('/', authenticateToken, pronosticosController.getPronosticos);

// Crear pronóstico
router.post('/', authenticateToken, pronosticosController.createPronostico);

module.exports = router;
