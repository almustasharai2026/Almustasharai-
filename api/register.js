const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('./db');
const { JWT_SECRET, DEFAULT_BALANCE } = require('../server/src/config/constants');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'يرجى توفير البريد وكلمة المرور' });
    }

    const { rows: existing } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (existing.length > 0) {
      return res.status(409).json({ error: 'البريد مسجل بالفعل' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const username = email.split('@')[0];

    const { rows } = await pool.query(
      'INSERT INTO users (email, username, password, role, balance) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [email, username, hashed, 'user', DEFAULT_BALANCE]
    );

    const user = rows[0];
    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
        balance: DEFAULT_BALANCE
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
};
