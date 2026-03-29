const pool = require('../config/database');

class History {
  static async create({ username, role, question, response }) {
    const { rows } = await pool.query(
      'INSERT INTO history (username, role, question, response) VALUES ($1,$2,$3,$4) RETURNING *',
      [username, role, question, response]
    );
    return rows[0];
  }

  static async findAll() {
    const { rows } = await pool.query('SELECT * FROM history ORDER BY created_at DESC');
    return rows;
  }

  static async findByUsername(username) {
    const { rows } = await pool.query('SELECT * FROM history WHERE username = $1 ORDER BY created_at DESC', [username]);
    return rows;
  }
}

module.exports = History;