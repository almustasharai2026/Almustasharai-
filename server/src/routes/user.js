const express = require('express');
const UserController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/ask', authenticateToken, UserController.ask);
router.get('/history', authenticateToken, UserController.getHistory);

module.exports = router;