const pool = require('../config/database');

class CreditService {
  static async getUserCredits(userId) {
    const result = await pool.query('SELECT balance FROM users WHERE id = $1', [userId]);
    return result.rows[0]?.balance || 0;
  }

  static async deductCredits(userId, amount) {
    const currentBalance = await this.getUserCredits(userId);
    if (currentBalance < amount) {
      return { success: false, message: 'رصيد غير كافي' };
    }

    const newBalance = currentBalance - amount;
    await pool.query('UPDATE users SET balance = $1 WHERE id = $2', [newBalance, userId]);
    
    return { success: true, newBalance };
  }

  static async addCredits(userId, amount) {
    const currentBalance = await this.getUserCredits(userId);
    const newBalance = currentBalance + amount;
    
    await pool.query('UPDATE users SET balance = $1 WHERE id = $2', [newBalance, userId]);
    
    return { success: true, newBalance };
  }

  static async setCredits(userId, amount) {
    await pool.query('UPDATE users SET balance = $1 WHERE id = $2', [amount, userId]);
    return { success: true, balance: amount };
  }

  static async logCreditTransaction(userId, type, amount, reason) {
    // Optional: Create a credit_transactions table for audit trail
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS credit_transactions (
          id SERIAL PRIMARY KEY,
          user_id INT NOT NULL,
          transaction_type TEXT NOT NULL,
          amount NUMERIC NOT NULL,
          reason TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        )
      `);

      await pool.query(
        'INSERT INTO credit_transactions (user_id, transaction_type, amount, reason) VALUES ($1, $2, $3, $4)',
        [userId, type, amount, reason]
      );
    } catch (error) {
      console.error('Credit transaction logging error:', error);
    }
  }

  static async getCreditTransactions(userId, limit = 50) {
    try {
      const result = await pool.query(
        'SELECT * FROM credit_transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
        [userId, limit]
      );
      return result.rows;
    } catch (error) {
      console.error('Getting credit transactions error:', error);
      return [];
    }
  }

  static CONSULTATION_COST = 1; // 1 credit per consultation
  static URGENT_COST = 5; // 5 credits for urgent consultation
  static PRIORITY_COST = 10; // 10 credits for priority request
}

module.exports = CreditService;
