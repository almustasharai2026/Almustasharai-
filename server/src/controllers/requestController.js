const RequestService = require('../services/requestService');
const multer = require('multer');
const path = require('path');

// Configure multer for screenshot uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

class RequestController {
  static async createRequest(req, res) {
    try {
      const { amount } = req.body;
      const screenshotPath = req.file ? req.file.path : null;

      const request = await RequestService.createRequest(req.user.username, amount, screenshotPath);
      res.status(201).json({ message: 'تم إرسال الطلب', request });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getRequests(req, res) {
    try {
      const requests = await RequestService.getRequests(req.user);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async acceptRequest(req, res) {
    try {
      const id = Number(req.params.id);
      await RequestService.acceptRequest(id);
      res.json({ message: 'تم قبول الطلب' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async rejectRequest(req, res) {
    try {
      const id = Number(req.params.id);
      await RequestService.rejectRequest(id);
      res.json({ message: 'تم رفض الطلب' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Middleware for file upload
  static uploadScreenshot = upload.single('screenshot');
}

module.exports = RequestController;