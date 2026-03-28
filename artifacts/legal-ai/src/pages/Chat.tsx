import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useAppGetMe, useAppSendMessage, useAppUploadFile } from "@/hooks/use-app-api";
import { removeToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Scale, LogOut, LayoutDashboard, Send, Paperclip, Camera as CameraIcon, Mic, FileText, Loader2 } from "lucide-react";
import { CameraCapture } from "@/components/CameraCapture";
import { LegalFormsDialog } from "@/components/LegalFormsDialog";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const PERSONAS = [
  { id: "محامي الدفاع", icon: "⚖️", label: "محامي الدفاع", desc: "للقضايا الجنائية والمدنية" },
  { id: "المحلل القانوني", icon: "🔍", label: "المحلل القانوني", desc: "تحليل العقود والمستندات" },
  { id: "رؤية القاضي", icon: "👨‍⚖️", label: "رؤية القاضي", desc: "توقع مسار القضية" },
  { id: "استشارة سريعة", icon: "⚡", label: "استشارة سريعة", desc: "إجابات قانونية مباشرة" },
  { id: "المختار الذكي", icon: "🧠", label: "المختار الذكي", desc: "اختيار أفضل مسار قانوني" },
  { id: "دكتور القانون", icon: "📚", label: "دكتور القانون", desc: "تأصيل فقهي وقانوني" },
];

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  fileUrl?: string;
}

export default function Chat() {
  const [, setLocation] = useLocation();
  const { data: user, isLoading, error } = useAppGetMe();
  const { toast } = useToast();
  
  const [selectedPersona, setSelectedPersona] = useState(PERSONAS[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [formsOpen, setFormsOpen] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: sendMessage, isPending: isSending } = useAppSendMessage();
  const { mutate: uploadFile, isPending: isUploading } = useAppUploadFile();

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (error) {
      removeToken();
      setLocation("/auth");
    }
  }, [error, setLocation]);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isSending]);

  // Init Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = "ar-EG";
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(prev => prev + " " + transcript);
          setIsRecording(false);
        };
        
        recognitionRef.current.onerror = () => {
          setIsRecording(false);
          toast({ title: "تعذر تسجيل الصوت", variant: "destructive" });
        };
        
        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    }
  }, []);

  const handleLogout = () => {
    removeToken();
    setLocation("/auth");
  };

  const handleSend = () => {
    if (!input.trim() || isSending) return;
    if (user && user.balance <= 0) {
      toast({ title: "رصيدك غير كافٍ", description: "يرجى شحن رصيدك للمتابعة", variant: "destructive" });
      return;
    }

    const newMessage: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages(prev => [...prev, newMessage]);
    setInput("");

    sendMessage({ data: { persona: selectedPersona.id, message: input } }, {
      onSuccess: (res) => {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: "ai", content: res.reply }]);
      },
      onError: (err) => {
        toast({ title: "خطأ", description: err.message, variant: "destructive" });
        // Remove optimistic message if failed
        setMessages(prev => prev.filter(m => m.id !== newMessage.id));
      }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    handleProcessFile(file);
  };

  const handleProcessFile = (file: File) => {
    uploadFile({ data: { file } }, {
      onSuccess: (res) => {
        // Automatically add to input or send as message
        setInput(prev => prev + `\n[تم إرفاق ملف: ${res.filename}]\n${res.text ? res.text : ''}`);
        toast({ title: "تم رفع الملف بنجاح" });
      },
      onError: (err) => {
        toast({ title: "فشل رفع الملف", description: err.message, variant: "destructive" });
      }
    });
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (e) {
        toast({ title: "الميكروفون غير متاح", variant: "destructive" });
      }
    }
  };

  if (isLoading || !user) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background text-foreground">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  const isBalanceZero = user.balance <= 0;

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-80 border-l border-border bg-sidebar flex flex-col z-20 shadow-2xl relative">
        <div className="p-6 flex items-center gap-3 border-b border-sidebar-border bg-sidebar/50">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
            <Scale className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-sidebar-foreground">المحامي الذكي</h2>
            <p className="text-xs text-muted-foreground">مساعدك القانوني الموثوق</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="text-xs font-bold text-sidebar-foreground/50 mb-4 px-2 uppercase tracking-wider">الشخصيات القانونية</div>
          {PERSONAS.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPersona(p)}
              className={`w-full text-right p-3 rounded-xl transition-all duration-200 border flex items-center gap-3 ${
                selectedPersona.id === p.id 
                  ? 'bg-primary/10 border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.1)]' 
                  : 'bg-transparent border-transparent hover:bg-secondary hover:border-border'
              }`}
            >
              <div className="text-2xl drop-shadow-sm">{p.icon}</div>
              <div>
                <div className={`font-semibold ${selectedPersona.id === p.id ? 'text-primary' : 'text-sidebar-foreground'}`}>
                  {p.label}
                </div>
                <div className="text-xs text-muted-foreground line-clamp-1">{p.desc}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-sidebar-border bg-secondary/30">
          <div className="flex flex-col gap-2">
            {user.role === 'admin' && (
              <Button variant="outline" className="w-full gap-2 border-border hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => setLocation("/admin")}>
                <LayoutDashboard className="w-4 h-4" />
                لوحة التحكم
              </Button>
            )}
            <Button variant="ghost" className="w-full gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              تسجيل خروج
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative bg-card">
        {/* Top Header */}
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-6 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center font-bold text-primary shadow-inner border border-border">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-sm">{user.name}</div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-secondary px-4 py-2 rounded-xl border border-border shadow-inner">
            <span className="text-sm font-semibold text-muted-foreground">الرصيد:</span>
            <span className={`font-mono font-bold text-lg ${isBalanceZero ? 'text-destructive' : 'text-primary'}`}>{user.balance}</span>
          </div>
        </header>

        {/* WhatsApp Banner */}
        {isBalanceZero && (
          <div className="bg-destructive/10 border-b border-destructive/30 px-4 py-3 flex justify-between items-center text-sm shadow-inner">
            <div className="flex items-center gap-2 text-destructive font-semibold">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
              </span>
              رصيدك صفر. لا يمكنك إرسال المزيد من الاستفسارات.
            </div>
            <Button 
              size="sm" 
              className="bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg shadow-[#25D366]/20 font-bold"
              onClick={() => {
                const text = encodeURIComponent(`طلب شحن رصيد:\nالمستخدم: ${user.name}\nرقم الهاتف: ${user.phone}\nالمبلغ: `);
                window.open(`https://wa.me/+201000000000?text=${text}`, '_blank');
              }}
            >
              شحن عبر واتساب
            </Button>
          </div>
        )}

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-card to-background">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
              <div className="text-6xl mb-4 grayscale opacity-60">{selectedPersona.icon}</div>
              <h3 className="text-2xl font-display font-bold text-foreground mb-2">أنا {selectedPersona.label}</h3>
              <p className="text-muted-foreground max-w-md">كيف يمكنني مساعدتك اليوم؟ اطرح استفسارك القانوني وسأقوم بالرد فوراً.</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                key={msg.id} 
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[75%] rounded-2xl p-4 shadow-md leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user" 
                    ? "bg-primary text-primary-foreground rounded-tl-sm shadow-primary/20" 
                    : "bg-secondary text-secondary-foreground rounded-tr-sm border border-border"
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            ))
          )}
          {isSending && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-secondary text-secondary-foreground rounded-2xl rounded-tr-sm p-4 border border-border flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">جاري تحليل الاستفسار...</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-background border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.2)] z-10 relative">
          <div className="max-w-4xl mx-auto relative flex flex-col gap-3">
            
            {/* Toolbar above input */}
            <div className="flex gap-2 items-center text-muted-foreground">
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept=".pdf,.doc,.docx,.txt,image/*" />
              <Button variant="ghost" size="icon" className="hover:text-primary rounded-full hover:bg-primary/10 transition-colors" onClick={() => fileInputRef.current?.click()}>
                <Paperclip className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary rounded-full hover:bg-primary/10 transition-colors" onClick={() => setCameraOpen(true)}>
                <CameraIcon className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`rounded-full transition-all ${isRecording ? 'text-destructive bg-destructive/10 animate-pulse' : 'hover:text-primary hover:bg-primary/10'}`} 
                onClick={toggleRecording}
              >
                <Mic className="w-5 h-5" />
              </Button>
              <div className="w-px h-6 bg-border mx-2" />
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 rounded-full border-primary/30 text-primary hover:bg-primary/10 font-semibold"
                onClick={() => setFormsOpen(true)}
              >
                <FileText className="w-4 h-4" />
                النماذج القانونية
              </Button>
            </div>

            {/* Main Input */}
            <div className="flex gap-3">
              <Input 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder={`أرسل رسالة إلى ${selectedPersona.label}...`}
                className="flex-1 bg-secondary border-transparent focus:border-primary/50 focus:ring-primary/20 rounded-2xl py-6 px-5 text-base shadow-inner transition-all resize-none"
                disabled={isSending || isUploading || isBalanceZero}
              />
              <Button 
                size="icon" 
                onClick={handleSend}
                disabled={!input.trim() || isSending || isUploading || isBalanceZero}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/30 text-primary-foreground flex-shrink-0"
              >
                {isSending || isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6 rtl:-scale-x-100" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <CameraCapture open={cameraOpen} onOpenChange={setCameraOpen} onCapture={handleProcessFile} />
      <LegalFormsDialog open={formsOpen} onOpenChange={setFormsOpen} />
    </div>
  );
}
