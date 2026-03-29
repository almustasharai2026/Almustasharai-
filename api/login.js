const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('./db');
const { JWT_SECRET, DEFAULT_BALANCE } = require('../server/src/config/constants');

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

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

    let user;
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    user = rows[0];

    if (!user) {
      // Auto-create user on first login
      const hashed = await bcrypt.hash(password, 10);
      const username = email.split('@')[0];
      const { rows: newRows } = await pool.query(
        'INSERT INTO users (email, username, password, role, balance) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [email, username, hashed, 'user', DEFAULT_BALANCE]
      );
      user = newRows[0];
    } else {
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ error: 'بيانات اعتماد غير صحيحة' });
      }
    }

    const token = generateToken(user);
    res.status(200).json({
      token,
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
        balance: Number(user.balance)
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
};
