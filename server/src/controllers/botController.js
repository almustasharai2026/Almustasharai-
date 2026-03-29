const AIService = require('../services/aiService');
const CreditService = require('../services/creditService');
const UserService = require('../services/userService');
const pool = require('../config/database');

class BotController {
  static async getPersonas(req, res) {
    try {
      const personas = AIService.getPersonas();
      res.json({ success: true, personas });
    } catch (error) {
      console.error('Get personas error:', error);
      res.status(500).json({ success: false, message: 'خطأ في الحصول على الاستشارين' });
    }
  }

  static async askQuestion(req, res) {
    try {
      const { question, personaId = 'lawyer' } = req.body;
      const userId = req.user.id;

      if (!question || question.trim().length === 0) {
        return res.status(400).json({ success: false, message: 'السؤال مطلوب' });
      }

      // Check user credits
      const credits = await CreditService.getUserCredits(userId);
      if (credits < CreditService.CONSULTATION_COST) {
        return res.status(400).json({ 
          success: false, 
          message: 'رصيد غير كافي للاستشارة',
          requiredCredits: CreditService.CONSULTATION_COST,
          currentCredits: credits
        });
      }

      // Generate AI response
      const response = await AIService.generateResponse(question, personaId);

      // Deduct credits
      await CreditService.deductCredits(userId, CreditService.CONSULTATION_COST);
      await CreditService.logCreditTransaction(userId, 'deduct', CreditService.CONSULTATION_COST, `استشارة من ${personaId}`);

      // Save to history
      await pool.query(
        'INSERT INTO history (user_id, question, response, persona, role) VALUES ($1, $2, $3, $4, $5)',
        [userId, question, response, personaId, req.user.role]
      );

      // Get updated credits
      const newCredits = await CreditService.getUserCredits(userId);

      res.json({
        success: true,
        response,
        creditsUsed: CreditService.CONSULTATION_COST,
        creditsRemaining: newCredits
      });
    } catch (error) {
      console.error('Ask question error:', error);
      res.status(500).json({ success: false, message: 'خطأ في معالجة السؤال' });
    }
  }

  static async uploadAndAsk(req, res) {
    try {
      const { question, personaId = 'lawyer' } = req.body;
      const userId = req.user.id;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ success: false, message: 'الملف مطلوب' });
      }

      // Check user credits
      const credits = await CreditService.getUserCredits(userId);
      if (credits < CreditService.CONSULTATION_COST) {
        return res.status(400).json({ 
          success: false, 
          message: 'رصيد غير كافي',
          requiredCredits: CreditService.CONSULTATION_COST
        });
      }

      // Extract text from file (simplified - would need OCR library in production)
      let fileContent = file.buffer.toString('utf-8').substring(0, 500);

      // Generate AI response with file content
      const response = await AIService.generateResponse(question, personaId, fileContent);

      // Deduct credits
      await CreditService.deductCredits(userId, CreditService.CONSULTATION_COST);
      await CreditService.logCreditTransaction(userId, 'deduct', CreditService.CONSULTATION_COST, `استشارة مع ملف من ${personaId}`);

      // Save to history
      await pool.query(
        'INSERT INTO history (user_id, question, response, persona, role, file_name) VALUES ($1, $2, $3, $4, $5, $6)',
        [userId, question || 'تحليل ملف', response, personaId, req.user.role, file.originalname]
      );

      const newCredits = await CreditService.getUserCredits(userId);

      res.json({
        success: true,
        response,
        fileName: file.originalname,
        creditsUsed: CreditService.CONSULTATION_COST,
        creditsRemaining: newCredits
      });
    } catch (error) {
      console.error('Upload and ask error:', error);
      res.status(500).json({ success: false, message: 'خطأ في معالجة الملف' });
    }
  }

  static async getHistory(req, res) {
    try {
      const userId = req.user.id;
      const limit = req.query.limit || 50;

      const result = await pool.query(
        'SELECT * FROM history WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
        [userId, limit]
      );

      res.json({ success: true, history: result.rows });
    } catch (error) {
      console.error('Get history error:', error);
      res.status(500).json({ success: false, message: 'خطأ في جلب السجل' });
    }
  }

  static async deleteHistoryItem(req, res) {
    try {
      const { historyId } = req.params;
      const userId = req.user.id;

      const result = await pool.query(
        'DELETE FROM history WHERE id = $1 AND user_id = $2',
        [historyId, userId]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'السجل غير موجود' });
      }

      res.json({ success: true, message: 'تم حذف السجل' });
    } catch (error) {
      console.error('Delete history error:', error);
      res.status(500).json({ success: false, message: 'خطأ في حذف السجل' });
    }
  }

  static async clearHistory(req, res) {
    try {
      const userId = req.user.id;

      await pool.query('DELETE FROM history WHERE user_id = $1', [userId]);

      res.json({ success: true, message: 'تم حذف كل السجل' });
    } catch (error) {
      console.error('Clear history error:', error);
      res.status(500).json({ success: false, message: 'خطأ في حذف السجل' });
    }
  }
}

module.exports = BotController;
