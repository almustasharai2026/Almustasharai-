const express = require('express');
const multer = require('multer');
const BotController = require('../controllers/botController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get all personas
router.get('/api/personas', BotController.getPersonas);

// Ask question with persona
router.post('/api/ask', authMiddleware, BotController.askQuestion);

// Upload file and ask
router.post('/api/upload-ask', authMiddleware, upload.single('file'), BotController.uploadAndAsk);

// Get consultation history
router.get('/api/history', authMiddleware, BotController.getHistory);

// Delete history item
router.delete('/api/history/:historyId', authMiddleware, BotController.deleteHistoryItem);

// Clear all history
router.delete('/api/history', authMiddleware, BotController.clearHistory);

module.exports = router;
