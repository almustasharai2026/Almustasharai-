const pool = require('../config/database');

class Request {
  static async create({ username, amount, screenshotPath }) {
    const { rows } = await pool.query(
      'INSERT INTO requests (username, amount, screenshot, status) VALUES ($1,$2,$3,$4) RETURNING *',
      [username, amount, screenshotPath || null, 'pending']
    );
    return rows[0];
  }

  static async findAll() {
    const { rows } = await pool.query('SELECT * FROM requests ORDER BY created_at DESC');
    return rows;
  }

  static async findByUsername(username) {
    const { rows } = await pool.query('SELECT * FROM requests WHERE username = $1 ORDER BY created_at DESC', [username]);
    return rows;
  }

  static async findById(id) {
    const { rows } = await pool.query('SELECT * FROM requests WHERE id = $1', [id]);
    return rows[0] || null;
  }

  static async updateStatus(id, status) {
    await pool.query('UPDATE requests SET status = $1 WHERE id = $2', [status, id]);
  }

  static async getPendingCount() {
    const { rows } = await pool.query('SELECT COUNT(*) as count FROM requests WHERE status = $1', ['pending']);
    return Number(rows[0].count);
  }
}

module.exports = Request;