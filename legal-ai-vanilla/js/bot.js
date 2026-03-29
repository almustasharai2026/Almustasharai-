// Bot functionality for legal AI advisor
document.addEventListener('DOMContentLoaded', function() {
    const questionInput = document.getElementById('question-input');
    const sendButton = document.getElementById('send-button');
    const messagesArea = document.getElementById('messages-area');
    const welcomeScreen = document.getElementById('welcome-screen');
    const chatInterface = document.getElementById('chat-interface');
    const exampleButtons = document.querySelectorAll('.example-btn');

    // Enable/disable send button based on input
    questionInput.addEventListener('input', function() {
        sendButton.disabled = !this.value.trim();
        // Auto-resize textarea
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });

    // Handle Enter key to send message
    questionInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (this.value.trim()) {
                sendMessage(this.value.trim());
                this.value = '';
                this.style.height = 'auto';
                sendButton.disabled = true;
            }
        }
    });

    // Send button click
    sendButton.addEventListener('click', function() {
        const question = questionInput.value.trim();
        if (question) {
            sendMessage(question);
            questionInput.value = '';
            questionInput.style.height = 'auto';
            sendButton.disabled = true;
        }
    });

    // Example button clicks
    exampleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const question = this.getAttribute('data-question');
            sendMessage(question);
        });
    });

    async function sendMessage(question) {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (userData.role !== 'owner' && (userData.balance || 0) <= 0) {
            alert('رصيدك غير كافٍ. يرجى شحن الرصيد من صفحة الدفع.');
            return;
        }

        const selectedPersona = document.getElementById('persona-select').value;

        if (welcomeScreen.style.display !== 'none') {
            welcomeScreen.style.display = 'none';
            chatInterface.style.display = 'flex';
        }

        addMessage(question, 'user');
        showTypingIndicator();

        try {
            const res = await fetch('/api/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userData.token}`
                },
                body: JSON.stringify({ question, personaId: selectedPersona })
            });

            const data = await res.json();
            hideTypingIndicator();

            if (!res.ok) {
                const fallback = generateLegalResponse(question, selectedPersona);
                addMessage(`خطأ من السيرفر: ${data.error || 'خطأ'} ؛ الرد المحلي: ${fallback}`, 'bot');
            } else {
                addMessage(data.response, 'bot');

                // Update local balance from backend
                if (data.balance !== undefined && userData.role !== 'owner') {
                    userData.balance = data.balance;
                    localStorage.setItem('userData', JSON.stringify(userData));
                }

                saveToHistory(question, data.response, selectedPersona);
            }
        } catch (error) {
            hideTypingIndicator();
            const fallback = generateLegalResponse(question, selectedPersona);
            addMessage(`فشل في الاتصال بالسيرفر. الرد المحلي: ${fallback}`, 'bot');
            saveToHistory(question, fallback, selectedPersona);
        }
    }

    function addMessage(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';

        if (type === 'user') {
            avatar.innerHTML = '<span>U</span>';
        } else {
            avatar.innerHTML = '<span>AI</span>';
        }

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = formatMessage(content);

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(contentDiv);

        messagesArea.appendChild(messageDiv);
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.id = 'typing-indicator';

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = '<span>AI</span>';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';

        typingDiv.appendChild(avatar);
        typingDiv.appendChild(contentDiv);

        messagesArea.appendChild(typingDiv);
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }

    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    function formatMessage(text) {
        // Simple formatting for legal responses
        return text
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .replace(/^/, '<p>')
            .replace(/$/, '</p>');
    }

    function generateLegalResponse(question, persona) {
        // Persona-specific responses
        const personaResponses = {
            'legal-advisor': 'كمستشار قانوني، أقدم لك النصيحة التالية:',
            'lawyer': 'كمحامٍ متخصص، إليك التحليل القانوني:',
            'judge': 'من منظور قضائي، يمكن القول:',
            'corporate-lawyer': 'في مجال قانون الشركات:',
            'criminal-lawyer': 'في القانون الجنائي:',
            'family-lawyer': 'في قانون الأسرة:',
            'contract-specialist': 'كأخصائي في العقود:',
            'legal-researcher': 'بناءً على البحث القانوني:',
            'appeal-expert': 'فيما يتعلق بالاستئناف:'
        };

        const personaPrefix = personaResponses[persona] || 'إليك الإجابة:';

        // Enhanced legal response generator
        const responses = {
            'عقد عمل': `${personaPrefix}

بناءً على سؤالك حول حقوقك في عقد العمل، إليك المعلومات الأساسية:

**الحقوق الأساسية للعامل:**
- الحق في راتب عادل ومنتظم
- إجازة سنوية مدفوعة الأجر
- إجازة مرضية
- تعويضات في حالة الإنهاء غير المشروع

**نصائح مهمة:**
1. اقرأ عقد العمل بعناية قبل التوقيع
2. احتفظ بنسخة من جميع الوثائق
3. استشر محامياً في حال وجود خلافات

هذه معلومات عامة وليست استشارة قانونية. يُفضل استشارة محامٍ متخصص للحصول على نصيحة دقيقة لحالتك.`,

            'نزاع قانوني': `${personaPrefix}

للحل نزاع قانوني، اتبع هذه الخطوات:

**الخطوات الموصى بها:**
1. **جمع الأدلة:** احتفظ بجميع الوثائق والمراسلات المتعلقة بالنزاع
2. **محاولة التسوية الودية:** ابدأ بالحوار مع الطرف الآخر
3. **الاستعانة بمحامٍ:** استشر محامياً متخصصاً في المجال
4. **اللجوء للقضاء:** إذا فشلت التسوية الودية

**الطرق البديلة للحل:**
- التحكيم
- الوساطة
- المحاكم التجارية

تذكر أن كل حالة فريدة وتحتاج إلى تقييم قانوني متخصص.`,

            'تأسيس شركة': `${personaPrefix}

خطوات تأسيس شركة في المملكة العربية السعودية:

**المتطلبات الأساسية:**
1. **اختيار نوع الشركة:** فردية، ذات مسؤولية محدودة، مساهمة
2. **دراسة الجدوى:** خطة عمل مفصلة
3. **الحصول على التراخيص:** من الجهات المختصة

**الإجراءات:**
- تسجيل الشركة في وزارة التجارة
- استخراج السجل التجاري
- فتح حساب بنكي
- التسجيل في الضرائب والتأمينات

**التكاليف التقريبية:**
- رسوم التسجيل: 1,000-5,000 ريال
- رأس المال الأدنى: حسب نوع الشركة

استشر متخصصاً للحصول على إرشادات دقيقة وفقاً لأحدث التشريعات.`
        };
        };

        // Check for keywords in the question
        const lowerQuestion = question.toLowerCase();

        if (lowerQuestion.includes('عقد') && lowerQuestion.includes('عمل')) {
            return responses['عقد عمل'];
        } else if (lowerQuestion.includes('نزاع') || lowerQuestion.includes('خلاف')) {
            return responses['نزاع قانوني'];
        } else if (lowerQuestion.includes('تأسيس') && lowerQuestion.includes('شركة')) {
            return responses['تأسيس شركة'];
        }

        // Default response
        return `شكراً لسؤالك: "${question}"

بناءً على سؤالك، إليك إجابة عامة:

**النصيحة العامة:**
- استشر محامياً متخصصاً للحصول على استشارة قانونية دقيقة
- احتفظ بجميع الوثائق المتعلقة بموضوعك
- تعرف على حقوقك وواجباتك القانونية

**خطوات موصى بها:**
1. جمع المعلومات والوثائق
2. استشارة متخصص قانوني
3. اتباع الإجراءات القانونية المناسبة

هذه معلومات عامة وليست بديلاً عن استشارة قانونية متخصصة. يُفضل مراجعة محامٍ لتقييم حالتك الخاصة.`;
    }

    function saveToHistory(question, response, persona) {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const history = JSON.parse(localStorage.getItem('consultationHistory') || '[]');
        
        history.push({
            id: Date.now(),
            question: question,
            response: response,
            persona: persona,
            timestamp: new Date().toISOString(),
            user: userData.username || 'guest'
        });
        
        localStorage.setItem('consultationHistory', JSON.stringify(history));
    }
});