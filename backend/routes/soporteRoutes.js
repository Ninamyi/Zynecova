const express = require('express');
const router = express.Router();
const soporteController = require('../controllers/soporteController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, soporteController.getSoporte);

router.post('/', authenticateToken, soporteController.createSoporte);

router.put('/:id', authenticateToken, soporteController.updateSoporte);

router.delete('/:id', authenticateToken, soporteController.deleteSoporte);

module.exports = router;
