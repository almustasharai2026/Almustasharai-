import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useAppGetMe, useAppSendMessage, useAppUploadFile } from "@/hooks/use-app-api";
import { removeToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Scale, LogOut, LayoutDashboard, Send, Paperclip, Camera as CameraIcon,
  Mic, FileText, Loader2, ChevronRight, Coins, Sparkles, Menu, X
} from "lucide-react";
import { CameraCapture } from "@/components/CameraCapture";
import { LegalFormsDialog } from "@/components/LegalFormsDialog";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const PERSONAS = [
  {
    id: "محامي الدفاع الجنائي",
    icon: "⚖️",
    label: "محامي الدفاع",
    desc: "استراتيجية دفاع قانونية متكاملة",
    color: "from-blue-600 to-blue-800",
    accent: "blue",
    badge: "جنائي",
  },
  {
    id: "المحلل القانوني",
    icon: "🔍",
    label: "المحلل القانوني",
    desc: "تحليل دقيق للعقود والنصوص القانونية",
    color: "from-violet-600 to-violet-800",
    accent: "violet",
    badge: "تحليل",
  },
  {
    id: "رؤية القاضي",
    icon: "👨‍⚖️",
    label: "رؤية القاضي",
    desc: "توقع منطق القضاء وتحليل الأحكام",
    color: "from-amber-600 to-amber-800",
    accent: "amber",
    badge: "قضاء",
  },
  {
    id: "الاستشارة الفورية",
    icon: "⚡",
    label: "استشارة فورية",
    desc: "إجابات قانونية سريعة ومباشرة",
    color: "from-emerald-600 to-emerald-800",
    accent: "emerald",
    badge: "سريع",
  },
  {
    id: "خبير العقود",
    icon: "📋",
    label: "خبير العقود",
    desc: "صياغة ومراجعة العقود الاحترافية",
    color: "from-cyan-600 to-cyan-800",
    accent: "cyan",
    badge: "عقود",
  },
  {
    id: "محامي الأسرة",
    icon: "👨‍👩‍👧",
    label: "محامي الأسرة",
    desc: "الزواج، الطلاق، النفقة والحضانة",
    color: "from-rose-600 to-rose-800",
    accent: "rose",
    badge: "أسرة",
  },
  {
    id: "محامي الأعمال",
    icon: "🏢",
    label: "محامي الأعمال",
    desc: "الشركات والاستثمار والملكية الفكرية",
    color: "from-indigo-600 to-indigo-800",
    accent: "indigo",
    badge: "أعمال",
  },
  {
    id: "المختار الذكي",
    icon: "🧠",
    label: "المختار الذكي",
    desc: "اختيار أفضل مسار قانوني ممكن",
    color: "from-orange-600 to-orange-800",
    accent: "orange",
    badge: "استراتيجي",
  },
  {
    id: "دكتور القانون",
    icon: "📚",
    label: "دكتور القانون",
    desc: "شرح أكاديمي ومبادئ قانونية عميقة",
    color: "from-teal-600 to-teal-800",
    accent: "teal",
    badge: "أكاديمي",
  },
];

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-1">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-primary"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ msg, persona }: { msg: Message; persona: typeof PERSONAS[0] }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`flex items-end gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className={`w-9 h-9 rounded-2xl flex-shrink-0 bg-gradient-to-br ${persona.color} flex items-center justify-center text-lg shadow-lg`}>
          {persona.icon}
        </div>
      )}

      <div className={`flex flex-col gap-1 max-w-[72%] ${isUser ? "items-end" : "items-start"}`}>
        {!isUser && (
          <span className="text-xs text-muted-foreground px-1 font-semibold">{persona.label}</span>
        )}
        <div className={`rounded-3xl px-5 py-3.5 shadow-lg leading-relaxed whitespace-pre-wrap text-[0.95rem] ${
          isUser
            ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-tl-md shadow-primary/20"
            : "bg-card border border-border text-foreground rounded-tr-md"
        }`}>
          {msg.content}
        </div>
        <span className="text-[10px] text-muted-foreground/60 px-1">
          {msg.timestamp.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      {isUser && (
        <div className="w-9 h-9 rounded-2xl flex-shrink-0 bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary shadow-md">
          أنت
        </div>
      )}
    </motion.div>
  );
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { mutate: sendMessage, isPending: isSending } = useAppSendMessage();
  const { mutate: uploadFile, isPending: isUploading } = useAppUploadFile();

  useEffect(() => {
    if (error) { removeToken(); setLocation("/auth"); }
  }, [error, setLocation]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isSending]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SR) {
        recognitionRef.current = new SR();
        recognitionRef.current.lang = "ar-EG";
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.onresult = (e: any) => {
          setInput(prev => prev + (prev ? " " : "") + e.results[0][0].transcript);
          setIsRecording(false);
        };
        recognitionRef.current.onerror = () => { setIsRecording(false); toast({ title: "تعذر تسجيل الصوت", variant: "destructive" }); };
        recognitionRef.current.onend = () => setIsRecording(false);
      }
    }
  }, []);

  const handleLogout = () => { removeToken(); setLocation("/auth"); };

  const handleSend = () => {
    if (!input.trim() || isSending) return;
    if (user && user.balance <= 0 && user.role !== "admin") {
      toast({ title: "رصيدك غير كافٍ", description: "يرجى شحن رصيدك للمتابعة", variant: "destructive" });
      return;
    }

    const newMsg: Message = { id: Date.now().toString(), role: "user", content: input.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, newMsg]);
    setInput("");

    sendMessage({ data: { persona: selectedPersona.id, message: newMsg.content } }, {
      onSuccess: (res) => {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: "ai", content: res.reply, timestamp: new Date() }]);
      },
      onError: (err) => {
        toast({ title: "خطأ", description: err.message, variant: "destructive" });
        setMessages(prev => prev.filter(m => m.id !== newMsg.id));
      }
    });
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadFile({ data: { file } }, {
      onSuccess: (res) => {
        setInput(prev => prev + (prev ? "\n" : "") + `[مرفق: ${res.filename}]${res.text ? "\n" + res.text : ""}`);
        toast({ title: "✅ تم رفع الملف", description: res.filename });
      },
      onError: () => toast({ title: "فشل رفع الملف", variant: "destructive" }),
    });
  };

  const toggleRecording = () => {
    if (isRecording) { recognitionRef.current?.stop(); setIsRecording(false); }
    else { try { recognitionRef.current?.start(); setIsRecording(true); } catch { toast({ title: "الميكروفون غير متاح", variant: "destructive" }); } }
  };

  const switchPersona = (p: typeof PERSONAS[0]) => {
    setSelectedPersona(p);
    setMessages([]);
    setSidebarOpen(false);
  };

  if (isLoading || !user) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center animate-pulse">
            <Scale className="w-8 h-8 text-primary" />
          </div>
          <div className="text-muted-foreground text-sm">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  const isBalanceZero = user.balance <= 0 && user.role !== "admin";

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-3 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
          <Scale className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display font-bold text-base text-sidebar-foreground leading-none">المحامي الذكي</h1>
          <p className="text-[10px] text-muted-foreground mt-0.5 leading-none">مدعوم بالذكاء الاصطناعي</p>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden mr-auto text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Personas */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        <div className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest px-2 pt-1 pb-2">
          النماذج القانونية
        </div>
        {PERSONAS.map((p) => {
          const active = selectedPersona.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => switchPersona(p)}
              className={`w-full text-right p-3 rounded-2xl transition-all duration-200 flex items-center gap-3 group relative overflow-hidden ${
                active
                  ? "bg-sidebar-foreground/8 border border-primary/25 shadow-sm"
                  : "hover:bg-sidebar-foreground/5 border border-transparent"
              }`}
            >
              {active && (
                <div className={`absolute inset-0 bg-gradient-to-r ${p.color} opacity-5 rounded-2xl`} />
              )}
              <div className={`relative w-10 h-10 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center text-xl shadow-md flex-shrink-0`}>
                {p.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-semibold text-sm truncate ${active ? "text-primary" : "text-sidebar-foreground"}`}>
                  {p.label}
                </div>
                <div className="text-[11px] text-muted-foreground truncate mt-0.5">{p.desc}</div>
              </div>
              {active && <ChevronRight className="w-3.5 h-3.5 text-primary flex-shrink-0 rtl:rotate-180" />}
            </button>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-sidebar-border space-y-1.5">
        {/* Balance */}
        <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl border ${isBalanceZero ? "bg-destructive/10 border-destructive/30" : "bg-primary/5 border-primary/20"}`}>
          <div className="flex items-center gap-2">
            <Coins className={`w-4 h-4 ${isBalanceZero ? "text-destructive" : "text-primary"}`} />
            <span className="text-xs text-muted-foreground">الرصيد</span>
          </div>
          <span className={`font-mono font-bold text-base ${isBalanceZero ? "text-destructive" : "text-primary"}`}>
            {user.balance}
          </span>
        </div>

        {isBalanceZero && (
          <Button
            size="sm"
            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold gap-2 rounded-xl"
            onClick={() => {
              const t = encodeURIComponent(`طلب شحن رصيد:\nالمستخدم: ${user.name}\nالهاتف: ${user.phone}\nالمبلغ: `);
              window.open(`https://wa.me/+201000000000?text=${t}`, "_blank");
            }}
          >
            💬 شحن الرصيد عبر واتساب
          </Button>
        )}

        {user.role === "admin" && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-primary hover:bg-primary/8 rounded-xl"
            onClick={() => setLocation("/admin")}
          >
            <LayoutDashboard className="w-4 h-4" />
            لوحة التحكم
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/8 rounded-xl"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          تسجيل خروج
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden" dir="rtl">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col border-l border-sidebar-border bg-sidebar shadow-2xl relative z-20">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-72 bg-sidebar border-l border-sidebar-border z-50 shadow-2xl lg:hidden"
            >
              <Sidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <header className="h-14 flex items-center justify-between px-4 border-b border-border bg-background/90 backdrop-blur-xl z-10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-secondary transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            {/* Current persona pill */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r ${selectedPersona.color} bg-opacity-10`}>
              <span className="text-lg">{selectedPersona.icon}</span>
              <div>
                <div className="text-xs font-bold text-foreground leading-none">{selectedPersona.label}</div>
                <div className="text-[10px] text-muted-foreground leading-none mt-0.5">{selectedPersona.badge}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* User info */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="text-right">
                <div className="text-xs font-bold text-foreground">{user.name}</div>
                <div className="text-[10px] text-muted-foreground">{user.role === "admin" ? "مشرف" : "عضو"}</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Chat Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-6 space-y-5"
          style={{ background: "linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--card)) 100%)" }}
        >
          {/* Empty State */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="h-full flex flex-col items-center justify-center text-center px-4 min-h-[60vh]"
            >
              <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${selectedPersona.color} flex items-center justify-center text-5xl shadow-2xl mb-6`}>
                {selectedPersona.icon}
              </div>
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold text-primary">{selectedPersona.badge}</span>
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-3">أنا {selectedPersona.label}</h2>
              <p className="text-muted-foreground max-w-sm leading-relaxed text-sm mb-8">{selectedPersona.desc}</p>

              {/* Quick suggestions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full">
                {[
                  "ما هي حقوقي القانونية؟",
                  "أحتاج مساعدة في قضيتي",
                  "كيف أتعامل مع هذا الوضع؟",
                  "ما هو القانون المنظم لهذا؟",
                ].map(q => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="text-right px-4 py-3 rounded-2xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-sm text-muted-foreground hover:text-foreground"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Messages */}
          {messages.map(msg => (
            <MessageBubble key={msg.id} msg={msg} persona={selectedPersona} />
          ))}

          {/* Typing indicator */}
          {isSending && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-end gap-3"
            >
              <div className={`w-9 h-9 rounded-2xl flex-shrink-0 bg-gradient-to-br ${selectedPersona.color} flex items-center justify-center text-lg shadow-lg`}>
                {selectedPersona.icon}
              </div>
              <div className="bg-card border border-border rounded-3xl rounded-tr-md px-5 py-3.5 shadow-sm">
                <TypingDots />
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 border-t border-border bg-background/95 backdrop-blur-xl px-4 py-3">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-2 bg-card border border-border rounded-3xl px-3 py-2 shadow-xl shadow-black/10 focus-within:border-primary/40 focus-within:shadow-primary/10 transition-all">
              {/* Left Tools */}
              <div className="flex items-center gap-0.5 flex-shrink-0 pb-1.5">
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt,image/*" />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                  title="رفع ملف"
                >
                  {isUploading ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <Paperclip className="w-4.5 h-4.5" />}
                </button>
                <button
                  onClick={() => setCameraOpen(true)}
                  className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                  title="التقاط صورة"
                >
                  <CameraIcon className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={toggleRecording}
                  className={`p-2 rounded-xl transition-all ${isRecording ? "text-destructive bg-destructive/10 animate-pulse" : "text-muted-foreground hover:text-primary hover:bg-primary/10"}`}
                  title="تسجيل صوتي"
                >
                  <Mic className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={() => setFormsOpen(true)}
                  className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                  title="النماذج القانونية"
                >
                  <FileText className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Divider */}
              <div className="w-px h-6 bg-border flex-shrink-0 self-center" />

              {/* Textarea */}
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder={`اسأل ${selectedPersona.label}...`}
                disabled={isSending || isBalanceZero}
                rows={1}
                className="flex-1 resize-none border-none shadow-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm leading-relaxed py-2 min-h-[36px] max-h-40 overflow-y-auto"
                style={{ fieldSizing: "content" } as any}
              />

              {/* Send Button */}
              <button
                onClick={handleSend}
                disabled={!input.trim() || isSending || isUploading || isBalanceZero}
                className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center transition-all self-end mb-0.5 ${
                  input.trim() && !isBalanceZero
                    ? `bg-gradient-to-br ${selectedPersona.color} text-white shadow-lg hover:scale-105 active:scale-95`
                    : "bg-secondary text-muted-foreground cursor-not-allowed"
                }`}
              >
                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 rtl:-scale-x-100" />}
              </button>
            </div>

            <div className="flex items-center justify-between mt-2 px-1">
              <p className="text-[10px] text-muted-foreground/50">Enter للإرسال · Shift+Enter لسطر جديد</p>
              {isBalanceZero && (
                <button
                  onClick={() => {
                    const t = encodeURIComponent(`طلب شحن رصيد:\nالمستخدم: ${user.name}\nالهاتف: ${user.phone}`);
                    window.open(`https://wa.me/+201000000000?text=${t}`, "_blank");
                  }}
                  className="text-[10px] text-[#25D366] font-bold hover:underline"
                >
                  💬 شحن الرصيد الآن
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <CameraCapture open={cameraOpen} onOpenChange={setCameraOpen} onCapture={(file) => {
        uploadFile({ data: { file } }, {
          onSuccess: (res) => {
            setInput(prev => prev + (prev ? "\n" : "") + `[صورة: ${res.filename}]${res.text ? "\n" + res.text : ""}`);
            toast({ title: "✅ تم رفع الصورة" });
          },
          onError: () => toast({ title: "فشل رفع الصورة", variant: "destructive" }),
        });
      }} />
      <LegalFormsDialog open={formsOpen} onOpenChange={setFormsOpen} />
    </div>
  );
}
