const ChatService = require('../services/chatService');

class UserController {
  static async ask(req, res) {
    try {
      const { question, persona } = req.body;
      const result = await ChatService.askQuestion(req.user, question, persona);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getHistory(req, res) {
    try {
      const history = await ChatService.getHistory(req.user);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = UserController;