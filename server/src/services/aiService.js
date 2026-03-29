const { OPENAI_API_KEY } = require('../config/constants');

// Persona configurations with system prompts
const personas = {
  lawyer: {
    name: 'محامي متخصص',
    description: 'محامي قانوني متخصص في الاستشارات القانونية',
    system: `أنت محامي قانوني متخصص وذو خبرة طويلة. تقدم استشارات قانونية دقيقة وموثوقة.
    - تركز على القوانين والتشريعات الحالية
    - تقدم حلول قانونية واقعية
    - تحذر من المخاطر القانونية المحتملة
    - تقدم النصائح بناءً على الحالات المشابهة
    - تركز على الوضوح والدقة القانونية`
  },
  
  judge: {
    name: 'قاضٍ محترف',
    description: 'قاضٍ ذو خبرة عالية في الحكم والفصل في القضايا',
    system: `أنت قاضٍ محترف وعادل متخصص في الفصل بين النزاعات.
    - تقيم الحالات من منظور قانوني محايد
    - تأخذ في الاعتبار جميع الجوانب القانونية
    - تقدم تحليلات قضائية موضوعية
    - تركز على العدالة والإنصاف
    - تقدم رأيك بناءً على السوابق القضائية`
  },
  
  legal_analyst: {
    name: 'محلل قانوني',
    description: 'متخصص في تحليل وفهم النصوص القانونية المعقدة',
    system: `أنت محلل قانوني ذو تخصص عميق في البحث والتحليل القانوني.
    - تحلل النصوص القانونية والتشريعات بعمق
    - تركز على التفاصيل والفروق الدقيقة
    - تقدم تحليلات شاملة ومدروسة
    - تربط بين القوانين المختلفة
    - تقدم رؤى استراتيجية قانونية`
  },
  
  quick_consultation: {
    name: 'استشارة سريعة',
    description: 'استشارة سريعة وموجزة للإجابة على التساؤلات العاجلة',
    system: `أنت مستشار قانوني متخصص في تقديم استشارات سريعة وموجزة.
    - تركز على الإجابات المباشرة والموجزة
    - تقدم النقاط الأساسية بسرعة
    - تتجنب التفاصيل الزائدة
    - تركز على الحلول العملية
    - تقدم نصائح قابلة للتطبيق الفوري`
  },
  
  smart_mediator: {
    name: 'وسيط ذكي',
    description: 'وسيط متخصص في حل النزاعات والتوفيق بين الأطراف',
    system: `أنت وسيط ذكي وحكيم متخصص في حل النزاعات بطرق سلمية.
    - تركز على فهم وجهات النظر المختلفة
    - تبحث عن الحلول الوسطية العادلة
    - تشجع على الحوار والنقاش الهادف
    - تقدم حلول توافقية مرضية
    - تركز على السلام والحفاظ على العلاقات`
  },
  
  law_doctor: {
    name: 'دكتور قانون',
    description: 'خبير قانوني أكاديمي متخصص في البحث العلمي والنظريات',
    system: `أنت دكتور قانون أكاديمي وخبير في النظريات القانونية.
    - تركز على الجوانب الأكاديمية والنظرية
    - تقدم شرحات علمية معمقة
    - تربط بين القانون والنظريات الحديثة
    - تقدم رؤى بحثية أصيلة
    - تركز على الفهم العميق والشامل`
  }
};

// Initialize OpenAI client
let openai = null;
try {
  const OpenAI = require('openai');
  openai = new OpenAI({ apiKey: OPENAI_API_KEY });
} catch (error) {
  console.warn('OpenAI not configured. Using mock responses.');
}

class AIService {
  static getPersonas() {
    return Object.entries(personas).map(([key, value]) => ({
      id: key,
      name: value.name,
      description: value.description
    }));
  }

  static getPersonaSystem(personaId) {
    return personas[personaId]?.system || personas.lawyer.system;
  }

  static async generateResponse(question, personaId = 'lawyer', fileContent = null) {
    const systemPrompt = this.getPersonaSystem(personaId);
    let userMessage = question;

    if (fileContent) {
      userMessage = `تم رفع ملف بالمحتوى التالي:\n${fileContent}\n\nالسؤال: ${question}`;
    }

    // If OpenAI is not configured, return mock response
    if (!openai) {
      return this.getMockResponse(question, personaId);
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      
      // Fallback to mock response if API fails
      return this.getMockResponse(question, personaId);
    }
  }

  static getMockResponse(question, personaId = 'lawyer') {
    const responses = {
      lawyer: `كمحامي متخصص، أنصحك بالآتي: يجب دراسة جميع التفاصيل القانونية المتعلقة بموضوعك بعناية. 
      من المهم التأكد من اتباع جميع الإجراءات القانونية الصحيحة والاحتفاظ بالمستندات اللازمة.
      أنصحك بطلب استشارة قانونية متخصصة للتعامل مع قضيتك بشكل أفضل.
      سؤالك: "${question.substring(0, 50)}..."`,
      
      judge: `من وجهة نظري كقاضٍ محترف، يجب النظر إلى هذه الحالة من جميع الجوانب القانونية.
      التقييم الموضوعي يتطلب فهم عميق جميع المستندات والأدلة والسوابق القضائية ذات الصلة.
      التوصية الأولية هي جمع كل المعلومات اللازمة قبل اتخاذ أي قرار نهائي.
      سؤالك: "${question.substring(0, 50)}..."`,
      
      legal_analyst: `كمحلل قانوني، أقدم لك التحليل التالي: يتطلب فهم النص القانوني بعمق،
      والبحث عن الارتباطات بين القوانين المختلفة، ودراسة السوابق القضائية ذات الصلة.
      التحليل الشامل يساعد على فهم جميع الآثار القانونية والمالية للقضية.
      سؤالك: "${question.substring(0, 50)}..."`,
      
      quick_consultation: `الإجابة السريعة: في هذه الحالة، يجب عليك اتخاذ الخطوات التالية بسرعة:
      أولاً، جمع كل المستندات المهمة. ثانياً، التواصل مع الجهات المختصة. ثالثاً، توثيق كل شيء بشكل جيد.
      هذا سيساعدك على حماية حقوقك بشكل أفضل.
      سؤالك: "${question.substring(0, 50)}..."`,
      
      smart_mediator: `كوسيط ذكي، أرى أن الحل يكمن في التفاهم والحوار البناء بين الأطراف.
      يجب على الجميع إظهار المرونة والرغبة في التوصل إلى حل وسطي عادل.
      يمكننا معاً إيجاد حل يرضي جميع الأطراف ويحافظ على العلاقات الطيبة.
      سؤالك: "${question.substring(0, 50)}..."`,
      
      law_doctor: `من المنظور الأكاديمي، هذا الموضوع يتعلق بنظريات قانونية مهمة جداً.
      البحث العميق يوضح العلاقة بين المبادئ القانونية الأساسية والحالات العملية.
      الدراسات الحديثة تشير إلى أهمية فهم السياق التاريخي والثقافي للقانون.
      سؤالك: "${question.substring(0, 50)}..."`,
    };

    return responses[personaId] || responses.lawyer;
  }

  static async analyzeFile(fileContent, personaId = 'lawyer') {
    return this.generateResponse(`الرجاء تحليل وشرح محتوى الملف المرفق بالتفصيل.`, personaId, fileContent);
  }

  static async transcribeAudio(audioBuffer) {
    if (!openai) {
      return 'تم استلام الملف الصوتي. تحويل الصوت إلى نص يتطلب معالجة متقدمة.';
    }

    try {
      const response = await openai.audio.transcriptions.create({
        model: 'whisper-1',
        file: audioBuffer
      });

      return response.text;
    } catch (error) {
      console.error('Audio transcription error:', error);
      return 'عذراً، فشل تحويل الملف الصوتي إلى نص.';
    }
  }
}

module.exports = AIService;
