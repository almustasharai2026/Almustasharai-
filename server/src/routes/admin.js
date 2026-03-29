const express = require('express');
const AdminController = require('../controllers/adminController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/users', authenticateToken, authorizeRoles('admin'), AdminController.getAllUsers);
router.get('/stats', authenticateToken, authorizeRoles('admin'), AdminController.getStatistics);

module.exports = router;