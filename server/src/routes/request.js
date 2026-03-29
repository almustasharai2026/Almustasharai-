const express = require('express');
const RequestController = require('../controllers/requestController');
const AdminController = require('../controllers/adminController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.post('/request', authenticateToken, RequestController.uploadScreenshot, RequestController.createRequest);
router.get('/requests', authenticateToken, AdminController.getRequests);
router.post('/accept/:id', authenticateToken, authorizeRoles('admin'), RequestController.acceptRequest);
router.post('/reject/:id', authenticateToken, authorizeRoles('admin'), RequestController.rejectRequest);

module.exports = router;