
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  User, 
  Sparkles, 
  Paperclip, 
  Camera, 
  Mic, 
  X, 
  FileText,
  Settings2,
  ChevronLeft,
  Info,
  History,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
  attachments?: { type: 'image' | 'file' | 'audio', url: string, name?: string }[];
  character?: string;
};

const CHARACTERS = [
  { id: "lawyer", name: "المحامي الشخصي", en: "Lawyer", icon: "⚖️", color: "from-blue-600 to-blue-800", desc: "خبير في القانون المدني والجنائي" },
  { id: "judge", name: "منصة القضاء", en: "Judge", icon: "👨‍⚖️", color: "from-red-600 to-red-900", desc: "رؤية تحليلية من وجهة نظر القانون" },
  { id: "consultant", name: "مستشار الشركات", en: "Consultant", icon: "📋", color: "from-emerald-600 to-emerald-900", desc: "خبير في تأسيس وعقود الشركات" },
  { id: "notary", name: "كاتب العدل الذكي", en: "Notary", icon: "🖋️", color: "from-amber-600 to-amber-900", desc: "توثيق وتصديق المحررات" },
];

export default function BotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: "1", 
      role: "bot", 
      content: "أهلاً بك في غرفة العمليات القانونية. أنا ذكاء المستشار الاصطناعي، كيف يمكنني خدمتك اليوم؟", 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeChar, setActiveChar] = useState(CHARACTERS[0]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [attachments, setAttachments] = useState<{ type: 'image' | 'file' | 'audio', url: string, name?: string }[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  const openCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (error) {
      setIsCameraOpen(false);
      toast({ variant: 'destructive', title: 'خطأ', description: 'لا يمكن الوصول للكاميرا' });
    }
  };

  const handleSend = async () => {
    if (!input.trim() && attachments.length === 0) return;

    const userMsg: Message = { 
      id: Date.now().toString(), 
      role: "user", 
      content: input, 
      timestamp: new Date(),
      attachments: [...attachments]
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setAttachments([]);
    setIsLoading(true);

    setTimeout(() => {
      const botMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: "bot", 
        character: activeChar.name,
        content: `بصفتي ${activeChar.name}، وبعد مراجعة استفسارك بدقة، أنصحك بالآتي: يجب أولاً التأكد من صياغة العقد بما يحفظ حقوق الطرفين وفقاً للمادة 42 من القانون...`, 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, botMsg]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl h-[calc(100vh-6rem)] flex flex-col gap-6" dir="rtl">
      
      <div className="grid lg:grid-cols-12 gap-6 flex-grow overflow-hidden">
        
        {/* Sidebar - Personalities & Info */}
        <div className="lg:col-span-3 hidden lg:flex flex-col gap-6">
          <div className="glass p-6 rounded-[2rem] space-y-6">
            <h3 className="font-black text-primary text-xl px-2">الخبراء الرقميون</h3>
            <div className="space-y-3">
              {CHARACTERS.map((char) => (
                <button
                  key={char.id}
                  onClick={() => setActiveChar(char)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 border-2 ${
                    activeChar.id === char.id 
                    ? 'border-accent bg-accent/5 shadow-lg shadow-accent/5 scale-105' 
                    : 'border-transparent hover:bg-muted/50 opacity-60'
                  }`}
                >
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-2xl shadow-inner bg-gradient-to-br ${char.color} text-white`}>
                    {char.icon}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">{char.name}</p>
                    <p className="text-[10px] text-muted-foreground">{char.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="glass p-6 rounded-[2rem] mt-auto">
            <div className="flex items-center gap-2 text-accent mb-2">
              <Info className="h-4 w-4" />
              <p className="text-xs font-bold">تنبيه قانوني</p>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              جميع الاستجابات صادرة عن ذكاء اصطناعي لغرض الإرشاد فقط. يرجى مراجعة محامي معتمد قبل اتخاذ أي قرار رسمي.
            </p>
          </div>
        </div>

        {/* Main Chat Interface - Futuristic Control Center */}
        <Card className="lg:col-span-9 flex flex-col glass border-none rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          
          {/* Header */}
          <div className="p-6 border-b flex items-center justify-between bg-white/40 dark:bg-black/40">
            <div className="flex items-center gap-4">
              <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${activeChar.color} text-white flex items-center justify-center text-2xl shadow-lg`}>
                {activeChar.icon}
              </div>
              <div>
                <h2 className="text-xl font-black text-primary">{activeChar.name}</h2>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">تشفير 256-بت نشط</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="rounded-xl"><History className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon" className="rounded-xl text-red-500"><Trash2 className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon" className="rounded-xl"><Settings2 className="h-5 w-5" /></Button>
            </div>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="flex-grow p-6 bg-gradient-to-b from-transparent to-muted/20" ref={scrollRef}>
            <div className="max-w-4xl mx-auto space-y-8">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                    msg.role === 'bot' ? `bg-gradient-to-br ${activeChar.color}` : 'bg-primary'
                  } text-white`}>
                    {msg.role === 'bot' ? <span className="text-2xl">{activeChar.icon}</span> : <User className="h-7 w-7" />}
                  </div>
                  <div className={`max-w-[80%] space-y-2 ${msg.role === 'user' ? 'text-left' : 'text-right'}`}>
                    <div className={`p-6 rounded-[2rem] text-sm leading-relaxed shadow-sm ${
                      msg.role === 'bot' 
                      ? 'bg-white dark:bg-zinc-900 border border-white/40 rounded-tr-none' 
                      : 'bg-primary text-white rounded-tl-none'
                    }`}>
                      {msg.content}
                      
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2 justify-end">
                          {msg.attachments.map((att, i) => (
                            <div key={i} className="rounded-xl overflow-hidden border bg-background/10 backdrop-blur-sm max-w-[180px] group relative">
                              {att.type === 'image' ? (
                                <img src={att.url} alt="Attached" className="h-32 w-full object-cover" />
                              ) : (
                                <div className="p-4 flex items-center gap-3">
                                  <FileText className="h-6 w-6 text-accent" />
                                  <span className="text-[10px] truncate max-w-[100px]">{att.name}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] opacity-40 px-2">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4 animate-in fade-in duration-500">
                  <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${activeChar.color} text-white flex items-center justify-center shrink-0 shadow-lg`}>
                    <Sparkles className="h-6 w-6 animate-spin-slow" />
                  </div>
                  <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] rounded-tr-none flex gap-1.5 items-center shadow-sm">
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area - Command Center Style */}
          <div className="p-6 bg-white/60 dark:bg-black/60 backdrop-blur-md border-t">
            <div className="max-w-4xl mx-auto space-y-4">
              {/* Attachments Preview */}
              {attachments.length > 0 && (
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {attachments.map((att, i) => (
                    <div key={i} className="relative h-20 w-20 rounded-2xl border-2 border-accent/20 bg-background/50 backdrop-blur-sm shrink-0 group">
                      <button 
                        onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 z-10 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-lg"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      {att.type === 'image' ? (
                        <img src={att.url} className="h-full w-full object-cover rounded-2xl" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center"><FileText className="h-8 w-8 text-accent" /></div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-4 items-end">
                <div className="flex gap-2 pb-1">
                  <Button type="button" variant="secondary" size="icon" className="rounded-2xl h-12 w-12 hover:bg-accent hover:text-white transition-all shadow-sm" onClick={() => fileInputRef.current?.click()}>
                    <Paperclip className="h-5 w-5" />
                    <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if(file) setAttachments([...attachments, { type: file.type.startsWith('image/') ? 'image' : 'file', url: URL.createObjectURL(file), name: file.name }]);
                    }} />
                  </Button>
                  <Button type="button" variant="secondary" size="icon" className="rounded-2xl h-12 w-12 hover:bg-accent hover:text-white transition-all shadow-sm" onClick={openCamera}>
                    <Camera className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="flex-grow relative group">
                  <Input 
                    placeholder={`اكتب رسالتك لـ ${activeChar.name}...`} 
                    className="pr-6 pl-16 text-right glass border-2 border-transparent focus-visible:border-accent rounded-[2rem] h-14 text-lg shadow-inner"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    className="absolute left-2 top-2 h-10 w-10 rounded-2xl bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/20 transition-all active:scale-95" 
                    disabled={isLoading || (!input.trim() && attachments.length === 0)}
                  >
                    <Send className="h-5 w-5 rotate-180" />
                  </Button>
                </div>
                
                <Button type="button" variant="secondary" size="icon" className="rounded-2xl h-12 w-12 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                  <Mic className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        </Card>
      </div>

      {/* Camera Modal Overlay */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="max-w-2xl w-full glass p-8 rounded-[3rem] space-y-6 relative border-white/20">
            <Button variant="ghost" className="absolute top-6 right-6 text-white h-12 w-12 rounded-full" onClick={() => setIsCameraOpen(false)}>
              <X className="h-8 w-8" />
            </Button>
            <video ref={videoRef} className="w-full rounded-[2rem] aspect-video bg-black shadow-2xl" autoPlay muted />
            <div className="flex justify-center">
              <Button 
                onClick={() => {
                  if (videoRef.current) {
                    const canvas = document.createElement('canvas');
                    canvas.width = videoRef.current.videoWidth;
                    canvas.height = videoRef.current.videoHeight;
                    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
                    setAttachments([...attachments, { type: 'image', url: canvas.toDataURL('image/jpeg'), name: 'Captured Photo' }]);
                    setIsCameraOpen(false);
                  }
                }} 
                className="h-24 w-24 rounded-full bg-white text-black hover:bg-white/90 border-[6px] border-accent shadow-2xl animate-pulse"
              >
                <div className="h-10 w-10 rounded-full border-2 border-black" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
