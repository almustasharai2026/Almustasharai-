const jwt = require('jsonwebtoken');
const { pool } = require('./db');
const { JWT_SECRET } = require('../server/src/config/constants');

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

    if (!verified) {
      return res.status(401).json({ error: 'توكن غير صالح' });
    }

    const { rows } = await pool.query('SELECT id, email, username, role, balance FROM users WHERE id = $1', [verified.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }

    const user = rows[0];
    res.status(200).json({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      balance: Number(user.balance)
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
};
