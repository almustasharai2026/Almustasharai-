
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  User, 
  Paperclip, 
  Camera, 
  Mic, 
  Trash2,
  ShieldCheck,
  Zap,
  Loader2,
  AlertTriangle,
  Settings,
  X,
  ChevronRight,
  MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
  character?: string;
};

const CHARACTERS = [
  { id: "lawyer", name: "المحامي الفائق", icon: "⚖️", color: "from-blue-500/20 to-indigo-500/20", desc: "خبير القضايا والنزاعات المعقدة" },
  { id: "judge", name: "خبير القضاء", icon: "👨‍⚖️", color: "from-slate-500/20 to-slate-800/20", desc: "رؤية ثاقبة من منصة الحكم" },
  { id: "consultant", name: "مستشار استراتيجي", icon: "🏢", color: "from-emerald-500/20 to-teal-500/20", desc: "نمو الشركات والصفقات التجارية" },
  { id: "notary", name: "الكاتب العدل", icon: "✒️", color: "from-amber-500/20 to-orange-500/20", desc: "صحة وتوثيق المستندات والوكالات" },
  { id: "forensic", name: "خبير جنائي", icon: "🔍", color: "from-zinc-500/20 to-black/20", desc: "تحليل الأدلة الجنائية والتقنية" },
  { id: "arbitrator", name: "المحكم الدولي", icon: "🌍", color: "from-violet-500/20 to-purple-500/20", desc: "فض النزاعات الدولية والعقود" },
  { id: "mediator", name: "الوسيط القانوني", icon: "🤝", color: "from-sky-500/20 to-blue-500/20", desc: "حلول ودية سريعة خارج المحاكم" },
  { id: "researcher", name: "الباحث الأكاديمي", icon: "📚", color: "from-green-500/20 to-emerald-500/20", desc: "دراسات فقهية وقانونية عميقة" },
  { id: "prosecutor", name: "المدعي العام", icon: "📜", color: "from-rose-500/20 to-red-500/20", desc: "حماية الحقوق العامة والادعاء" },
];

const DISCLAIMER_TEXT = "\n\n--- \n⚠️ إخلاء مسؤولية: هذا الرد نتاج تحليل ذكاء اصطناعي لأغراض استرشادية فقط. لا يعتبر نصيحة قانونية نهائية، ويُنصح دائماً بمراجعة محامي مختص قبل اتخاذ أي إجراء قانوني.";

export default function BotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "bot", content: "أهلاً بك في فضاء المستشار الذكي. اختر الخبير الذي تفضله لبدء رحلتك القانونية.", timestamp: new Date() }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeChar, setActiveChar] = useState(CHARACTERS[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSelectCharacter = (char: typeof CHARACTERS[0]) => {
    setActiveChar(char);
    toast({
      title: `تم تفعيل ${char.name}`,
      description: "النظام جاهز لاستقبال استفسارك الآن.",
    });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      const botMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: "bot", 
        character: activeChar.name,
        content: `بصفتي ${activeChar.name}، قمت بتحليل استفسارك بعناية. بناءً على التشريعات السارية في اختصاص ${activeChar.desc}، أرى أن حالتك تتطلب التركيز على الجوانب الإجرائية أولاً لضمان حقوقك القانونية.` + DISCLAIMER_TEXT,
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, botMsg]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] w-full overflow-hidden bg-background/50" dir="rtl">
      
      {/* Sidebar - Characters Library */}
      <aside className={`w-80 glass-cosmic border-l border-white/5 transition-all duration-500 hidden lg:flex flex-col p-6 gap-8 ${isSidebarOpen ? 'ml-0' : '-mr-80'}`}>
        <div className="flex items-center gap-3 px-2">
          <div className="h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
             <Zap className="h-5 w-5 text-white opacity-80" />
          </div>
          <h2 className="text-xl font-black text-white/90">فريق الخبراء</h2>
        </div>

        <ScrollArea className="flex-1 -mx-2 px-2">
          <div className="space-y-2">
            {CHARACTERS.map((char) => (
              <button
                key={char.id}
                onClick={() => handleSelectCharacter(char)}
                className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all border group relative overflow-hidden ${
                  activeChar.id === char.id 
                  ? 'bg-white/10 border-white/10 shadow-2xl' 
                  : 'border-transparent hover:bg-white/5'
                }`}
              >
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-2xl bg-gradient-to-br ${char.color} shrink-0`}>
                  {char.icon}
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white/90">{char.name}</p>
                  <p className="text-[10px] text-white/40 line-clamp-1">{char.desc}</p>
                </div>
                {activeChar.id === char.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-full" />}
              </button>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-3xl flex items-center gap-4">
          <ShieldCheck className="h-8 w-8 text-white/20 shrink-0" />
          <p className="text-[10px] text-white/30 leading-relaxed font-medium">الخصوصية والشفافية هي أساس عملنا القانوني الذكي.</p>
        </div>
      </aside>

      {/* Main Chat Command Center */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Chat Header */}
        <header className="h-20 border-b border-white/[0.05] flex items-center justify-between px-8 bg-background/20 backdrop-blur-md z-30">
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" className="lg:hidden rounded-2xl glass" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <Settings className="h-5 w-5" />
             </Button>
             <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl">
                {activeChar.icon}
             </div>
             <div>
                <h1 className="text-lg font-black text-white/90">{activeChar.name}</h1>
                <p className="text-[10px] text-white/30 flex items-center gap-2">
                   <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   التحليل الذكي نشط
                </p>
             </div>
          </div>
          <div className="flex gap-2">
             <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-red-500/10 text-red-500/50 hover:text-red-500" onClick={() => setMessages([messages[0]])}>
                <Trash2 className="h-5 w-5" />
             </Button>
          </div>
        </header>

        {/* Message Viewport */}
        <ScrollArea className="flex-1 p-6 md:p-12" ref={scrollRef}>
          <div className="max-w-4xl mx-auto space-y-12 pb-10">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                  msg.role === 'bot' ? 'bg-white/5' : 'bg-white text-slate-950'
                }`}>
                  {msg.role === 'bot' ? <MessageSquare className="h-5 w-5 opacity-40" /> : <User className="h-6 w-6" />}
                </div>
                <div className={`max-w-[85%] space-y-2 ${msg.role === 'user' ? 'text-left' : 'text-right'}`}>
                  <div className={`p-6 md:p-8 rounded-[2rem] text-sm md:text-lg leading-relaxed whitespace-pre-wrap border ${
                    msg.role === 'bot' 
                    ? 'bg-white/[0.02] border-white/[0.05] text-white/90 rounded-tr-none' 
                    : 'bg-white/5 border-white/10 text-white font-medium rounded-tl-none'
                  }`}>
                    {msg.content}
                    
                    {msg.id === "1" && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8">
                        {CHARACTERS.slice(0, 6).map((char) => (
                          <Button
                            key={char.id}
                            variant="outline"
                            className="bg-white/5 border-white/[0.05] hover:border-white/20 h-auto py-4 rounded-2xl group transition-all"
                            onClick={() => handleSelectCharacter(char)}
                          >
                            <span className="text-xl group-hover:scale-125 transition-transform">{char.icon}</span>
                            <span className="text-[10px] font-black text-white/70">{char.name}</span>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-white/20 px-4 font-bold">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-6 animate-pulse">
                <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-white/20" />
                </div>
                <div className="bg-white/[0.02] p-8 rounded-[2rem] rounded-tr-none w-32 border border-white/[0.05] flex justify-center gap-2">
                  <div className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Elegant Input Panel */}
        <div className="p-8 bg-background/40 backdrop-blur-2xl border-t border-white/[0.05]">
          <div className="max-w-4xl mx-auto flex gap-4 items-end">
            <div className="flex gap-2 pb-1">
              <Button type="button" variant="ghost" size="icon" className="h-14 w-14 rounded-3xl glass hover:bg-white/10">
                <Paperclip className="h-5 w-5 opacity-40" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="h-14 w-14 rounded-3xl glass hover:bg-white/10">
                <Camera className="h-5 w-5 opacity-40" />
              </Button>
            </div>
            <div className="flex-grow relative">
              <Input 
                placeholder={`تحدث مع ${activeChar.name}...`} 
                className="pr-6 pl-16 text-right glass border-white/[0.05] rounded-[1.8rem] h-16 text-lg focus-visible:ring-1 ring-white/20"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button 
                onClick={handleSend} 
                disabled={isLoading || !input.trim()}
                className={`absolute left-2 top-2 h-12 w-12 rounded-2xl transition-all ${
                  input.trim() ? 'bg-white text-slate-950 scale-100' : 'bg-white/5 text-white/20 scale-90'
                }`}
              >
                <Send className="h-5 w-5 rotate-180" />
              </Button>
            </div>
            <Button type="button" variant="ghost" size="icon" className="h-14 w-14 rounded-3xl glass hover:bg-red-500/10 text-red-400">
              <Mic className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-[8px] text-center mt-6 opacity-20 font-black uppercase tracking-[0.3em]">الجيل الرابع من الذكاء الاصطناعي القانوني - الفئة الفاخرة</p>
        </div>
      </main>
    </div>
  );
}
