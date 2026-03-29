const jwt = require('jsonwebtoken');
const { pool } = require('../../db');
const { JWT_SECRET } = require('../../../server/src/config/constants');

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

module.exports = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'ID مطلوب' });
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

    if (req.method === 'POST') {
      // Accept request - approve payment
      const { rows } = await pool.query(
        'UPDATE requests SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        ['approved', id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'الطلب غير موجود' });
      }

      // Add balance to user
      const request = rows[0];
      await pool.query(
        'UPDATE users SET balance = balance + $1 WHERE id = $2',
        [request.amount, request.user_id]
      );

      res.status(200).json({
        success: true,
        message: 'تم قبول الطلب',
        request: rows[0]
      });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
};
