const express = require('express');
const router = express.Router();
const pronosticosController = require('../controllers/pronosticosController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, pronosticosController.getPronosticos);

router.post('/', authenticateToken, pronosticosController.createPronostico);

module.exports = router;
