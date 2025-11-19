const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportesController');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, reportesController.getReportes);

router.post('/', authenticateToken, reportesController.createReporte);

module.exports = router;
