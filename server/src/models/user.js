const pool = require('../config/database');

class User {
  static async findByEmail(email) {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0] || null;
  }

  static async findByUsername(username) {
    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return rows[0] || null;
  }

  static async findById(id) {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return rows[0] || null;
  }

  static async findAll() {
    const { rows } = await pool.query('SELECT id, email, username, role, balance FROM users ORDER BY id');
    return rows;
  }

  static async create({ email, username, password, role = 'user', balance = 10 }) {
    const { rows } = await pool.query(
      'INSERT INTO users (email, username, password, role, balance) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [email, username, password, role, balance]
    );
    return rows[0];
  }

  static async updateBalance(id, balance) {
    await pool.query('UPDATE users SET balance = $1 WHERE id = $2', [balance, id]);
  }

  static async addBalance(username, amount) {
    await pool.query('UPDATE users SET balance = balance + $1 WHERE username = $2', [amount, username]);
  }
}

module.exports = User;