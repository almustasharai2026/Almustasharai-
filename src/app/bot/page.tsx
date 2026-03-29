
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BrainCircuit, Send, User, Bot, Sparkles, Scale } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
};

export default function BotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: "1", 
      role: "bot", 
      content: "مرحباً بك في منصة المستشار الذكية. أنا مساعدك القانوني المدعوم بالذكاء الاصطناعي. كيف يمكنني مساعدتك اليوم؟", 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Simulation of AI response - would be replaced with actual Genkit call
    setTimeout(() => {
      const botMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: "bot", 
        content: `بناءً على سؤالك حول "${input}"، يُنصح بمراجعة المادة القانونية المختصة في بلدك. بشكل عام، يتطلب هذا النوع من القضايا توثيقاً دقيقاً لجميع المراسلات. هل تود أن أرشح لك مستشاراً متخصصاً؟`, 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, botMsg]);
      setIsLoading(false);
    }, 1500);
  };

  const EXAMPLES = [
    "كيف أكتب عقد إيجار آمن؟",
    "ما هي شروط تأسيس شركة ناشئة؟",
    "عقوبة التأخر في دفع الراتب؟"
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl text-right" dir="rtl">
      <div className="grid lg:grid-cols-4 gap-8 h-[calc(100vh-12rem)]">
        
        <div className="lg:col-span-1 hidden lg:flex flex-col gap-6">
          <Card className="bg-primary text-primary-foreground border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 justify-end text-lg">
                مساعدك الذكي
                <Sparkles className="h-5 w-5 text-accent" />
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm opacity-90 leading-relaxed">
              هذا البوت مدعوم بتقنيات Gemini المتقدمة لتحليل النصوص القانونية وتقديم إرشادات أولية دقيقة.
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h3 className="font-bold text-primary text-sm px-2">أسئلة شائعة</h3>
            {EXAMPLES.map((ex, i) => (
              <Button 
                key={i} 
                variant="outline" 
                className="w-full text-right justify-start text-xs h-auto py-3 bg-card hover:border-accent"
                onClick={() => setInput(ex)}
              >
                {ex}
              </Button>
            ))}
          </div>
        </div>

        <Card className="lg:col-span-3 flex flex-col shadow-xl border-accent/10 overflow-hidden">
          <CardHeader className="border-b bg-muted/30 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary font-bold">
                 البوت القانوني الذكي
                <BrainCircuit className="h-6 w-6 text-accent" />
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                نشط الآن <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-grow overflow-hidden p-0 relative">
            <ScrollArea className="h-full p-6" ref={scrollRef}>
              <div className="space-y-6">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'bot' ? 'bg-primary text-white' : 'bg-accent text-white'}`}>
                      {msg.role === 'bot' ? <Bot className="h-6 w-6" /> : <User className="h-6 w-6" />}
                    </div>
                    <div className={`max-w-[80%] p-4 rounded-3xl ${msg.role === 'bot' ? 'bg-muted/50 rounded-tr-none' : 'bg-primary text-white rounded-tl-none shadow-md'}`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <span className={`text-[10px] mt-2 block opacity-50 ${msg.role === 'user' ? 'text-left' : 'text-right'}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0">
                      <Bot className="h-6 w-6 animate-bounce" />
                    </div>
                    <div className="bg-muted/50 p-4 rounded-3xl rounded-tr-none flex gap-1 items-center">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>

          <div className="p-4 border-t bg-card">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
              <Button type="submit" size="icon" className="shrink-0 bg-accent hover:bg-accent/90" disabled={isLoading}>
                <Send className="h-5 w-5 rotate-180" />
              </Button>
              <Input 
                placeholder="اسأل المستشار الذكي عن أي موضوع قانوني..." 
                className="flex-grow text-right bg-muted/30 focus-visible:ring-accent"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
              />
            </form>
            <p className="text-[10px] text-center text-muted-foreground mt-2">
              مدعوم بالذكاء الاصطناعي - قد تظهر أخطاء في بعض الأحيان
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
