const AdminService = require('../services/adminService');
const RequestService = require('../services/requestService');

class AdminController {
  static async getAllUsers(req, res) {
    try {
      const users = await AdminService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getStatistics(req, res) {
    try {
      const stats = await AdminService.getStatistics();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getRequests(req, res) {
    try {
      const { status } = req.query;
      let requests;
      if (status) {
        requests = await AdminService.filterRequests(status);
      } else {
        requests = await RequestService.getRequests(req.user);
      }
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AdminController;