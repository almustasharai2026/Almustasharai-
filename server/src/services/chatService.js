const History = require('../models/history');
const UserService = require('./userService');
const { OPENAI_API_KEY } = require('../config/constants');
const OpenAI = require('openai');

if (!OPENAI_API_KEY) {
  console.warn('OPENAI_API_KEY not set. AI responses will be mocked.');
}

const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;

const SYSTEM_PROMPTS = {
  lawyer: `أنت محامٍ قانوني خبير. قدم إجابات قانونية دقيقة ومفصلة. هيكل الإجابة كالتالي:
- تحليل المشكلة
- النصيحة القانونية
- الخطوات المقترحة
- تحذيرات مهمة

استخدم لغة عربية فصحى وكن موضوعيًا.`,
  judge: `أنت قاضٍ قانوني. قدم تقييمًا قانونيًا موضوعيًا للقضية. هيكل الإجابة كالتالي:
- وصف القضية
- التحليل القانوني
- الحكم المقترح
- الأسباب

استخدم لغة عربية رسمية وكن عادلًا.`,
  consultant: `أنت مستشار قانوني. قدم استشارة شاملة ومفيدة. هيكل الإجابة كالتالي:
- فهم المشكلة
- الخيارات المتاحة
- التوصيات
- المخاطر والفوائد

استخدم لغة عربية واضحة وسهلة الفهم.`
};

class ChatService {
  static async askQuestion(user, question, persona) {
    if (!question || !persona) {
      throw new Error('السؤال أو الشخصية مفقود');
    }

    if (!UserService.canAsk(user)) {
      throw new Error('رصيد غير كافٍ');
    }

    let newBalance = Number(user.balance);
    if (user.role !== 'admin') {
      newBalance = await UserService.deductBalance(user.id, 1);
    }

    const systemPrompt = SYSTEM_PROMPTS[persona] || SYSTEM_PROMPTS.lawyer;

    try {
      let responseText;
      if (openai) {
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: question }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        });
        responseText = completion.choices[0].message.content.trim();
      } else {
        responseText = `🤖 (${persona}) الرد على: ${question}\n\nتحليل المشكلة: [محاكاة]\nالنصيحة: يرجى تعيين OPENAI_API_KEY للحصول على ردود حقيقية.`;
      }

      await History.create({
        username: user.username,
        role: user.role,
        question,
        response: responseText
      });

      return { response: responseText, balance: newBalance };
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('فشل في الحصول على رد من الذكاء الاصطناعي');
    }
  }

  static async getHistory(user) {
    if (user.role === 'admin') {
      return await History.findAll();
    }
    return await History.findByUsername(user.username);
  }
}

module.exports = ChatService;