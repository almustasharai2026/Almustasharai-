const AuthService = require('../services/authService');

class AuthController {
  static async register(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'يرجى توفير البريد وكلمة المرور' });
      }

      const result = await AuthService.register(email, password);
      res.status(201).json(result);
    } catch (error) {
      res.status(409).json({ error: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'يرجى توفير البريد وكلمة المرور' });
      }

      const result = await AuthService.login(email, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  static getMe(req, res) {
    const profile = AuthService.getUserProfile(req.user);
    res.json(profile);
  }
}

module.exports = AuthController;