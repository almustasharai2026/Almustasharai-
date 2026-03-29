const User = require('../models/user');
const Request = require('../models/request');

class AdminService {
  static async getAllUsers() {
    return await User.findAll();
  }

  static async getStatistics() {
    const users = await User.findAll();
    const requests = await Request.findAll();

    const totalUsers = users.length;
    const totalRevenue = requests
      .filter(r => r.status === 'accepted')
      .reduce((sum, r) => sum + Number(r.amount), 0);

    const pendingRequests = requests.filter(r => r.status === 'pending').length;
    const acceptedRequests = requests.filter(r => r.status === 'accepted').length;
    const rejectedRequests = requests.filter(r => r.status === 'rejected').length;

    return {
      totalUsers,
      totalRevenue,
      pendingRequests,
      acceptedRequests,
      rejectedRequests
    };
  }

  static async filterRequests(status) {
    if (!status) {
      return await Request.findAll();
    }
    const { rows } = await pool.query('SELECT * FROM requests WHERE status = $1 ORDER BY created_at DESC', [status]);
    return rows;
  }
}

module.exports = AdminService;