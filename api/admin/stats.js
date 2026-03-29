const jwt = require('jsonwebtoken');
const { pool } = require('../db');
const { JWT_SECRET } = require('../../server/src/config/constants');

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'مطلوب توكن' });
    }

    const token = authHeader.split(' ')[1];
    const verified = verifyToken(token);

    if (!verified || verified.role !== 'admin') {
      return res.status(403).json({ error: 'غير مصرح' });
    }

    const { rows: users } = await pool.query(
      'SELECT id, email, username, role, balance FROM users ORDER BY id'
    );

    const { rows: requestsCount } = await pool.query(
      'SELECT COUNT(*) as count FROM requests'
    );

    const { rows: historyCount } = await pool.query(
      'SELECT COUNT(*) as count FROM history'
    );

    res.status(200).json({
      success: true,
      stats: {
        totalUsers: users.length,
        totalRequests: parseInt(requestsCount[0]?.count || 0),
        totalHistory: parseInt(historyCount[0]?.count || 0),
        users
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
};
