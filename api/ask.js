const { GoogleGenerativeAI } = require('@google/generative-ai');
const jwt = require('jsonwebtoken');
const { pool } = require('./db');
const { JWT_SECRET, GEMINI_API_KEY } = require('../server/src/config/constants');

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

const CONSULTATION_COST = 1;

const personas = {
  lawyer: {
    name: 'محامي قانوني',
    description: 'متخصص في القانون المدني والجنائي',
    systemPrompt: 'أنت محامي قانوني ذو خبرة عميقة في القوانين. أجب على الأسئلة القانونية بدقة واحترافية.'
  },
  hrexpert: {
    name: 'خبير الموارد البشرية',
    description: 'متخصص في قانون العمل والموارد البشرية',
    systemPrompt: 'أنت خبير موارد بشرية متخصص في قوانين العمل. قدم استشارات حول العقود والمزايا والإجازات.'
  },
  taxexpert: {
    name: 'خبير الضرائب',
    description: 'متخصص في القانون الضريبي',
    systemPrompt: 'أنت خبير ضرائب متخصص في القوانين الضريبية. قدم استشارات حول الضرائب والالتزامات الضريبية.'
  }
};

async function generateAIResponse(question, persona) {
  if (!GEMINI_API_KEY) {
    // Fallback mock response
    return `شكراً على سؤالك: "${question}". هذه استجابة تجريبية من ${personas[persona]?.name || 'الاستشارة'}. يرجى تفعيل مفتاح Gemini API للحصول على إجابات مباشرة من الذكاء الاصطناعي.`;
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `${personas[persona]?.systemPrompt || 'أنت مستشار قانوني.'}\n\nسؤال المستخدم: ${question}\n\nيرجى تقديم إجابة مفيدة وقانونية.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    return responseText || 'لم أتمكن من توليد إجابة';
  } catch (error) {
    console.error('AI generation error:', error.message);
    return `عذراً، حدث خطأ: ${error.message}`;
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
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

    const { question, personaId = 'lawyer' } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({ error: 'السؤال مطلوب' });
    }

    // Get user credits
    const { rows: userRows } = await pool.query('SELECT balance FROM users WHERE id = $1', [verified.id]);
    if (userRows.length === 0) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }

    const userBalance = Number(userRows[0].balance);
    if (userBalance < CONSULTATION_COST) {
      return res.status(400).json({
        success: false,
        message: 'رصيد غير كافي للاستشارة',
        requiredCredits: CONSULTATION_COST,
        currentCredits: userBalance
      });
    }

    // Generate AI response
    const response = await generateAIResponse(question, personaId);

    // Deduct credits
    await pool.query(
      'UPDATE users SET balance = balance - $1 WHERE id = $2',
      [CONSULTATION_COST, verified.id]
    );

    // Save to history
    await pool.query(
      'INSERT INTO history (user_id, question, response, persona, role) VALUES ($1, $2, $3, $4, $5)',
      [verified.id, question, response, personaId, verified.role]
    );

    // Get updated balance
    const { rows: updatedRows } = await pool.query('SELECT balance FROM users WHERE id = $1', [verified.id]);
    const newBalance = Number(updatedRows[0].balance);

    res.status(200).json({
      success: true,
      response,
      creditsUsed: CONSULTATION_COST,
      creditsRemaining: newBalance
    });
  } catch (error) {
    console.error('Ask question error:', error);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
};
