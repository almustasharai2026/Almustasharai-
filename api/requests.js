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
  if (req.method === 'POST') {
    // Create a new request
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

      const { amount } = req.body;

      if (!amount || Number(amount) <= 0) {
        return res.status(400).json({ error: 'المبلغ غير صحيح' });
      }

      const { rows } = await pool.query(
        'INSERT INTO requests (user_id, amount, status) VALUES ($1, $2, $3) RETURNING *',
        [verified.id, amount, 'pending']
      );

      res.status(201).json({
        success: true,
        request: rows[0]
      });
    } catch (error) {
      console.error('Create request error:', error);
      res.status(500).json({ error: 'خطأ في الخادم' });
    }
  } else if (req.method === 'GET') {
    // Get all requests or user's requests
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

      let query = 'SELECT r.*, u.username, u.email FROM requests r JOIN users u ON r.user_id = u.id';
      let params = [];

      if (verified.role !== 'admin') {
        query += ' WHERE r.user_id = $1';
        params = [verified.id];
      }

      query += ' ORDER BY r.created_at DESC';

      const { rows } = await pool.query(query, params);

      res.status(200).json({
        success: true,
        requests: rows
      });
    } catch (error) {
      console.error('Get requests error:', error);
      res.status(500).json({ error: 'خطأ في الخادم' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
