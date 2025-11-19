const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, adminController.getAdmin);

router.post('/', authenticateToken, adminController.createAdmin);

router.put('/:id', authenticateToken, adminController.updateAdmin);

router.delete('/:id', authenticateToken, adminController.deleteAdmin);

module.exports = router;
