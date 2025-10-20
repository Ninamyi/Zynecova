const express = require('express');
const router = express.Router();
const soporteController = require('../controllers/soporteController');
const authenticateToken = require('../middleware/authMiddleware');

// Obtener reportes soporte
router.get('/', authenticateToken, soporteController.getSoporte);

// Crear reporte soporte
router.post('/', authenticateToken, soporteController.createSoporte);

// Actualizar estado
router.put('/:id', authenticateToken, soporteController.updateSoporte);

// Eliminar reporte soporte
router.delete('/:id', authenticateToken, soporteController.deleteSoporte);

module.exports = router;
