const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportesController');
const authenticateToken = require('../middleware/authMiddleware');

// Obtener reportes
router.get('/', authenticateToken, reportesController.getReportes);

// Crear reporte
router.post('/', authenticateToken, reportesController.createReporte);

module.exports = router;
