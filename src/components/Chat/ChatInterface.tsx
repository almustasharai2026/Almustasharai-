import { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, FileText, Download } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { translations } from '../../lib/translations';
import type { Database } from '../../lib/database.types';
import { exportToPDF, exportToWord } from '../../lib/exportUtils';

type Message = Database['public']['Tables']['messages']['Row'];
type Consultation = Database['public']['Tables']['consultations']['Row'];

interface ChatInterfaceProps {
  consultation: Consultation;
  onBack: () => void;
}

export function ChatInterface({ consultation, onBack }: ChatInterfaceProps) {
  const { profile, refreshProfile } = useAuth();
  const { language } = useApp();
  const t = translations[language];
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
  }, [consultation.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('consultation_id', consultation.id)
        .order('created_at');

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !profile || loading) return;

    if (profile.credits < 1) {
      alert(t.notEnoughCredits);
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    try {
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          consultation_id: consultation.id,
          role: 'user',
          content: userMessage,
        });

      if (messageError) throw messageError;

      const { error: creditError } = await supabase
        .from('profiles')
        .update({ credits: profile.credits - 1 })
        .eq('id', profile.id);

      if (creditError) throw creditError;

      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: profile.id,
          amount: -1,
          type: 'message',
          description: language === 'ar' ? 'رسالة استشارة' : 'Consultation message',
        });

      if (transactionError) throw transactionError;

      await refreshProfile();

      const aiResponse = generateAIResponse();

      const { error: aiMessageError } = await supabase
        .from('messages')
        .insert({
          consultation_id: consultation.id,
          role: 'assistant',
          content: aiResponse,
        });

      if (aiMessageError) throw aiMessageError;

      await loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAIResponse = (): string => {
    if (language === 'ar') {
      return `شكراً لسؤالك. بناءً على ما ذكرته، أود أن أوضح النقاط القانونية التالية:

1. القانون المعمول به في هذه الحالة يتطلب النظر في جميع التفاصيل المتعلقة بالموضوع.

2. من المهم جداً الاحتفاظ بجميع المستندات والإثباتات ذات الصلة بالقضية.

3. أنصحك بالتشاور مع محامٍ متخصص لمراجعة التفاصيل الدقيقة لحالتك.

هل لديك أي معلومات إضافية أو أسئلة محددة تود مناقشتها؟`;
    } else {
      return `Thank you for your question. Based on what you've mentioned, I'd like to clarify the following legal points:

1. The applicable law in this case requires consideration of all relevant details.

2. It's very important to keep all documents and evidence related to the case.

3. I recommend consulting with a specialized lawyer to review the specific details of your situation.

Do you have any additional information or specific questions you'd like to discuss?`;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                {consultation.title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t.messageCost}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => exportToPDF(messages, consultation.title, language)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-gray-600 dark:text-gray-400"
              title={t.exportPDF}
            >
              <FileText className="w-5 h-5" />
            </button>
            <button
              onClick={() => exportToWord(messages, consultation.title, language)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-gray-600 dark:text-gray-400"
              title={t.exportWord}
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {new Date(message.created_at).toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 border border-gray-200 dark:border-gray-700">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.typeMessage}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
