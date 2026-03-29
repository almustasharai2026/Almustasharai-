import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useAppGetMe, useAppSendMessage, useAppUploadFile } from "@/hooks/use-app-api";
import { removeToken } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Scale, LogOut, LayoutDashboard, Send, Paperclip, Camera as CameraIcon,
  Mic, FileText, Loader2, Coins, Sparkles, Menu, X, Plus, ChevronDown,
  Zap, BookOpen, Shield, Search, ClipboardList, Heart, Building2, Brain, GraduationCap
} from "lucide-react";
import { CameraCapture } from "@/components/CameraCapture";
import { LegalFormsDialog } from "@/components/LegalFormsDialog";
import { ChargeDialog } from "@/components/ChargeDialog";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const PERSONAS = [
  { id: "محامي الدفاع الجنائي", icon: <Shield className="w-4 h-4" />, emoji: "⚖️", label: "محامي الدفاع", desc: "استراتيجية دفاع جنائية متكاملة", color: "from-blue-500 to-blue-700", bg: "bg-blue-500/10", text: "text-blue-400", badge: "جنائي" },
  { id: "المحلل القانوني", icon: <Search className="w-4 h-4" />, emoji: "🔍", label: "المحلل القانوني", desc: "تحليل دقيق للعقود والنصوص", color: "from-violet-500 to-violet-700", bg: "bg-violet-500/10", text: "text-violet-400", badge: "تحليل" },
  { id: "رؤية القاضي", icon: <Scale className="w-4 h-4" />, emoji: "👨‍⚖️", label: "رؤية القاضي", desc: "توقع منطق القضاء وتحليل الأحكام", color: "from-amber-500 to-amber-700", bg: "bg-amber-500/10", text: "text-amber-400", badge: "قضاء" },
  { id: "الاستشارة الفورية", icon: <Zap className="w-4 h-4" />, emoji: "⚡", label: "استشارة فورية", desc: "إجابات قانونية سريعة ومباشرة", color: "from-emerald-500 to-emerald-700", bg: "bg-emerald-500/10", text: "text-emerald-400", badge: "سريع" },
  { id: "خبير العقود", icon: <ClipboardList className="w-4 h-4" />, emoji: "📋", label: "خبير العقود", desc: "صياغة ومراجعة العقود الاحترافية", color: "from-cyan-500 to-cyan-700", bg: "bg-cyan-500/10", text: "text-cyan-400", badge: "عقود" },
  { id: "محامي الأسرة", icon: <Heart className="w-4 h-4" />, emoji: "👨‍👩‍👧", label: "محامي الأسرة", desc: "الزواج، الطلاق، النفقة والحضانة", color: "from-rose-500 to-rose-700", bg: "bg-rose-500/10", text: "text-rose-400", badge: "أسرة" },
  { id: "محامي الأعمال", icon: <Building2 className="w-4 h-4" />, emoji: "🏢", label: "محامي الأعمال", desc: "الشركات والاستثمار والملكية الفكرية", color: "from-indigo-500 to-indigo-700", bg: "bg-indigo-500/10", text: "text-indigo-400", badge: "أعمال" },
  { id: "المختار الذكي", icon: <Brain className="w-4 h-4" />, emoji: "🧠", label: "المختار الذكي", desc: "اختيار أفضل مسار قانوني ممكن", color: "from-orange-500 to-orange-700", bg: "bg-orange-500/10", text: "text-orange-400", badge: "استراتيجي" },
  { id: "دكتور القانون", icon: <GraduationCap className="w-4 h-4" />, emoji: "📚", label: "دكتور القانون", desc: "شرح أكاديمي ومبادئ قانونية عميقة", color: "from-teal-500 to-teal-700", bg: "bg-teal-500/10", text: "text-teal-400", badge: "أكاديمي" },
];

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 px-1">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-current opacity-60"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </span>
  );
}

function MessageRow({ msg, persona, userName }: { msg: Message; persona: typeof PERSONAS[0]; userName: string }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`group w-full py-6 px-4 ${isUser ? "bg-transparent" : "bg-secondary/20 border-y border-border/30"}`}
    >
      <div className="max-w-3xl mx-auto flex gap-4 items-start">
        {/* Avatar */}
        {isUser ? (
          <div className="flex-shrink-0 order-last">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-xs font-bold text-primary-foreground shadow-md">
              {userName.charAt(0)}
            </div>
          </div>
        ) : (
          <div className={`flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br ${persona.color} flex items-center justify-center shadow-lg text-white`}>
            {persona.icon}
          </div>
        )}

        {/* Content */}
        <div className={`flex-1 min-w-0 ${isUser ? "text-right" : "text-right"}`}>
          <div className="flex items-center gap-2 mb-1.5">
            {isUser ? (
              <>
                <span className="text-[10px] text-muted-foreground/50 mr-auto">
                  {msg.timestamp.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}
                </span>
                <span className="text-xs font-semibold text-foreground">{userName}</span>
              </>
            ) : (
              <>
                <span className={`text-xs font-bold ${persona.text}`}>{persona.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${persona.bg} ${persona.text} font-medium`}>{persona.badge}</span>
                <span className="text-[10px] text-muted-foreground/50 mr-auto">
                  {msg.timestamp.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </>
            )}
          </div>
          <div className={`text-sm leading-7 whitespace-pre-wrap break-words ${isUser ? "text-foreground/90" : "text-foreground"}`}>
            {msg.content}
          </div>
        </div>
      </div>
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
  const [chargeOpen, setChargeOpen] = useState(false);
  const [personaMenuOpen, setPersonaMenuOpen] = useState(false);

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
      setChargeOpen(true); return;
    }
    const newMsg: Message = { id: Date.now().toString(), role: "user", content: input.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    if (textareaRef.current) { textareaRef.current.style.height = "auto"; }

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

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
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
    setPersonaMenuOpen(false);
  };

  if (isLoading || !user) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center animate-pulse shadow-lg shadow-primary/20">
            <Scale className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-sm text-muted-foreground">جاري التحميل...</span>
        </div>
      </div>
    );
  }

  const isBalanceZero = user.balance <= 0 && user.role !== "admin";

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar">
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-md">
            <Scale className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-sm text-sidebar-foreground">المستشار AI</span>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* New Chat */}
      <div className="px-3 py-3">
        <button
          onClick={() => { setMessages([]); setSidebarOpen(false); }}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-border/40 hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-all text-sm group"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
          محادثة جديدة
        </button>
      </div>

      {/* Personas List */}
      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5 scrollbar-thin">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-bold px-3 pt-1 pb-2">
          المستشارون القانونيون
        </p>
        {PERSONAS.map((p) => {
          const active = selectedPersona.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => switchPersona(p)}
              className={`w-full text-right flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 ${
                active ? "bg-secondary text-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              }`}
            >
              <div className={`flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center text-white shadow-sm`}>
                <span className="text-xs">{p.icon}</span>
              </div>
              <div className="flex-1 min-w-0 text-right">
                <div className={`text-sm font-medium truncate ${active ? "text-foreground" : ""}`}>{p.label}</div>
              </div>
              {active && (
                <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${p.color} flex-shrink-0`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border space-y-1.5">
        {/* Balance */}
        <button onClick={() => setChargeOpen(true)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all ${
            isBalanceZero ? "border-destructive/30 bg-destructive/5 hover:bg-destructive/10" : "border-border/40 bg-secondary/30 hover:bg-secondary/60"
          }`}
        >
          <span className={`text-xs ${isBalanceZero ? "text-destructive" : "text-muted-foreground"}`}>رصيدي</span>
          <div className="flex items-center gap-1.5">
            <Coins className={`w-3.5 h-3.5 ${isBalanceZero ? "text-destructive" : "text-primary"}`} />
            <span className={`font-mono font-bold text-sm ${isBalanceZero ? "text-destructive" : "text-primary"}`}>{user.balance}</span>
            <Plus className={`w-3 h-3 ${isBalanceZero ? "text-destructive" : "text-primary"}`} />
          </div>
        </button>

        {user.role === "admin" && (
          <button onClick={() => setLocation("/admin")}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/8 transition-all text-sm">
            <LayoutDashboard className="w-3.5 h-3.5" />
            لوحة التحكم
          </button>
        )}

        {/* User */}
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-secondary/30">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20 flex items-center justify-center text-[11px] font-bold text-primary">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-foreground truncate">{user.name}</div>
            <div className="text-[10px] text-muted-foreground">{user.role === "admin" ? "مشرف النظام" : "عضو"}</div>
          </div>
          <button onClick={handleLogout} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" title="تسجيل خروج">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden" dir="rtl">

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-l border-sidebar-border shadow-xl relative z-20 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed top-0 right-0 h-full w-64 z-50 shadow-2xl lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Bar */}
        <header className="h-14 flex items-center gap-3 px-4 border-b border-border bg-background/95 backdrop-blur-xl z-10 flex-shrink-0">
          {/* Mobile menu */}
          <button onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-secondary transition-colors flex-shrink-0">
            <Menu className="w-5 h-5" />
          </button>

          {/* Persona selector - ChatGPT style */}
          <div className="relative">
            <button
              onClick={() => setPersonaMenuOpen(v => !v)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-secondary transition-all group"
            >
              <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${selectedPersona.color} flex items-center justify-center text-white shadow-sm`}>
                <span className="text-xs">{selectedPersona.icon}</span>
              </div>
              <span className="font-semibold text-sm">{selectedPersona.label}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${personaMenuOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {personaMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setPersonaMenuOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-2 right-0 w-80 bg-card border border-border rounded-2xl shadow-2xl z-20 overflow-hidden"
                  >
                    <div className="p-2 max-h-[70vh] overflow-y-auto">
                      <p className="text-[11px] text-muted-foreground px-3 py-2 font-semibold">اختر المستشار</p>
                      {PERSONAS.map(p => (
                        <button
                          key={p.id}
                          onClick={() => switchPersona(p)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-right ${
                            selectedPersona.id === p.id ? "bg-secondary" : "hover:bg-secondary/60"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center text-white shadow-sm flex-shrink-0`}>
                            {p.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold">{p.label}</div>
                            <div className="text-[11px] text-muted-foreground truncate">{p.desc}</div>
                          </div>
                          {selectedPersona.id === p.id && (
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${p.color} flex-shrink-0`} />
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Balance badge */}
          <button onClick={() => setChargeOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all hover:scale-105 ${
              isBalanceZero ? "border-destructive/40 text-destructive bg-destructive/5" : "border-primary/30 text-primary bg-primary/5"
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span className="font-mono">{user.balance}</span>
            <Plus className="w-3 h-3" />
          </button>
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">

          {/* Empty State */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="h-full flex flex-col items-center justify-center px-4 py-16 min-h-[50vh]"
            >
              <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${selectedPersona.color} flex items-center justify-center shadow-2xl mb-5`}>
                <span className="text-4xl">{selectedPersona.emoji}</span>
              </div>
              <div className={`flex items-center gap-2 ${selectedPersona.bg} ${selectedPersona.text} rounded-full px-3.5 py-1 text-xs font-bold mb-4`}>
                <Sparkles className="w-3 h-3" />
                {selectedPersona.badge}
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                مرحباً، أنا {selectedPersona.label}
              </h2>
              <p className="text-muted-foreground text-sm text-center max-w-sm mb-8 leading-relaxed">
                {selectedPersona.desc} — ابدأ بكتابة سؤالك أو اختر من الاقتراحات أدناه
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full">
                {[
                  "ما هي حقوقي القانونية في هذا الموضوع؟",
                  "أحتاج مساعدة في تحليل قضيتي",
                  "كيف أبدأ في رفع دعوى قضائية؟",
                  "ما هو القانون المنظم لهذه المسألة؟",
                ].map(q => (
                  <button key={q} onClick={() => setInput(q)}
                    className="text-right px-4 py-3 rounded-2xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all text-sm text-muted-foreground hover:text-foreground leading-snug">
                    {q}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Messages */}
          {messages.map(msg => (
            <MessageRow key={msg.id} msg={msg} persona={selectedPersona} userName={user.name} />
          ))}

          {/* Typing */}
          {isSending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-6 px-4 bg-secondary/20 border-y border-border/30"
            >
              <div className="max-w-3xl mx-auto flex gap-4 items-start">
                <div className={`flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br ${selectedPersona.color} flex items-center justify-center shadow-lg text-white`}>
                  {selectedPersona.icon}
                </div>
                <div className="flex items-center gap-1 pt-2">
                  <TypingDots />
                </div>
              </div>
            </motion.div>
          )}

          <div className="h-32" />
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 inset-x-0 px-4 pb-4 pt-2 bg-gradient-to-t from-background via-background to-transparent">
          <div className="max-w-3xl mx-auto">
            {/* Balance warning */}
            {isBalanceZero && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between bg-destructive/10 border border-destructive/25 rounded-2xl px-4 py-2.5 mb-2 text-xs">
                <span className="text-destructive font-medium">رصيدك صفر — لا يمكن الإرسال</span>
                <button onClick={() => setChargeOpen(true)} className="text-[#25D366] font-bold hover:underline">
                  💬 اشحن الآن
                </button>
              </motion.div>
            )}

            {/* Input Box */}
            <div className="relative bg-card border border-border rounded-2xl shadow-lg shadow-black/10 focus-within:border-primary/40 focus-within:shadow-primary/8 transition-all overflow-hidden">
              {/* Tools row */}
              <div className="flex items-center gap-1 px-3 pt-2.5">
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt,image/*" />
                <button onClick={() => fileInputRef.current?.click()} disabled={isUploading}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all" title="رفع ملف">
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
                </button>
                <button onClick={() => setCameraOpen(true)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all" title="كاميرا">
                  <CameraIcon className="w-4 h-4" />
                </button>
                <button onClick={toggleRecording}
                  className={`p-1.5 rounded-lg transition-all ${isRecording ? "text-destructive bg-destructive/10 animate-pulse" : "text-muted-foreground hover:text-primary hover:bg-primary/10"}`} title="تسجيل">
                  <Mic className="w-4 h-4" />
                </button>
                <button onClick={() => setFormsOpen(true)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all" title="نماذج قانونية">
                  <FileText className="w-4 h-4" />
                </button>
                <div className="flex-1" />
                <span className="text-[10px] text-muted-foreground/40 hidden sm:block">Enter للإرسال · Shift+Enter لسطر جديد</span>
              </div>

              {/* Textarea */}
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKey}
                placeholder={`اسأل ${selectedPersona.label}...`}
                disabled={isSending || isBalanceZero}
                rows={1}
                className="w-full resize-none border-none shadow-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm leading-relaxed px-4 pt-2 pb-3 min-h-[44px] max-h-40"
                style={{ height: "auto" }}
              />

              {/* Send button */}
              <div className="absolute left-3 bottom-2.5">
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isSending || isUploading || isBalanceZero}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    input.trim() && !isBalanceZero && !isSending
                      ? `bg-gradient-to-br ${selectedPersona.color} text-white shadow-md hover:scale-105 active:scale-95`
                      : "bg-secondary text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 rtl:-scale-x-100" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
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
      <ChargeDialog open={chargeOpen} onOpenChange={setChargeOpen} userName={user.name} userPhone={user.phone} currentBalance={user.balance} />
    </div>
  );
}
