const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticateToken = require('../middleware/authMiddleware');

// Obtener registros admin
router.get('/', authenticateToken, adminController.getAdmin);

// Crear registro admin
router.post('/', authenticateToken, adminController.createAdmin);

// Editar registro admin
router.put('/:id', authenticateToken, adminController.updateAdmin);

// Eliminar registro admin
router.delete('/:id', authenticateToken, adminController.deleteAdmin);

module.exports = router;
