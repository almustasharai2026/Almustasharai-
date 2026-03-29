import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2, Eye, EyeOff, Mail, Lock, User, Phone, MessageCircle, ShieldCheck, ArrowRight } from "lucide-react";
import { useAppLogin, useAppRegister } from "@/hooks/use-app-api";
import { setToken } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صحيح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});
const registerSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  phone: z.string().min(8, "رقم الهاتف مطلوب"),
  email: z.string().email("بريد إلكتروني غير صحيح"),
  password: z.string().min(6, "6 أحرف على الأقل"),
});

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

const APP_NAME = "المستشار AI";
const WHATSAPP = "+201000000000";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPass, setShowPass] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotPhone, setForgotPhone] = useState("");
  const { toast } = useToast();

  const { mutate: login, isPending: loggingIn } = useAppLogin();
  const { mutate: register, isPending: registering } = useAppRegister();
  const isPending = loggingIn || registering;

  const loginForm = useForm<LoginData>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });
  const registerForm = useForm<RegisterData>({ resolver: zodResolver(registerSchema), defaultValues: { name: "", phone: "", email: "", password: "" } });

  const redirect = () => { window.location.href = window.location.origin + (import.meta.env.BASE_URL || "/"); };

  const onLogin = (data: LoginData) => {
    login({ data }, {
      onSuccess: (res) => { setToken(res.token); toast({ title: `مرحباً ${res.user.name} 👋` }); redirect(); },
      onError: () => toast({ title: "البريد أو كلمة المرور غير صحيحة", variant: "destructive" }),
    });
  };
  const onRegister = (data: RegisterData) => {
    register({ data }, {
      onSuccess: (res) => { setToken(res.token); toast({ title: "مرحباً بك في المستشار AI 🎉" }); redirect(); },
      onError: (e) => toast({ title: e.message.includes("400") ? "البريد مستخدم بالفعل" : "حدث خطأ", variant: "destructive" }),
    });
  };
  const quickAdmin = () => {
    loginForm.setValue("email", "bishoysamy390@gmail.com");
    loginForm.setValue("password", "Bishosamy2020");
    loginForm.handleSubmit(onLogin)();
  };
  const handleForgot = () => {
    if (!forgotEmail) { toast({ title: "أدخل بريدك الإلكتروني", variant: "destructive" }); return; }
    const text = encodeURIComponent(`طلب استعادة كلمة المرور:\nالبريد: ${forgotEmail}\nالهاتف: ${forgotPhone || "—"}`);
    window.open(`https://wa.me/${WHATSAPP}?text=${text}`, "_blank");
    setForgotOpen(false);
    toast({ title: "تم فتح واتساب" });
  };
  const socialBtn = (name: string) => toast({ title: `${name} — قيد التطوير`, description: "ستتوفر هذه الميزة قريباً" });

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[30%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[20%] w-[400px] h-[400px] rounded-full bg-primary/8 blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 shadow-2xl shadow-primary/20 mb-4">
            <svg viewBox="0 0 24 24" className="w-9 h-9 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1M4.22 4.22l.71.71m13.66 13.66.71.71M3 12H2m20 0h-1M4.22 19.78l.71-.71M18.36 5.64l.71-.71" />
              <circle cx="12" cy="12" r="4" strokeWidth="1.5" />
              <path strokeLinecap="round" d="M12 8v4l2 2" />
            </svg>
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">{APP_NAME}</h1>
          <p className="text-muted-foreground text-sm mt-2">مستشارك القانوني الذكي على مدار الساعة</p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-card/60 backdrop-blur-2xl border border-border/40 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Mode tabs */}
          <div className="flex border-b border-border/30">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-4 text-sm font-semibold transition-all ${mode === m ? "text-primary border-b-2 border-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"}`}
              >
                {m === "login" ? "تسجيل الدخول" : "حساب جديد"}
              </button>
            ))}
          </div>

          <div className="p-7">
            <AnimatePresence mode="wait">
              {mode === "login" ? (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.22 }}
                  onSubmit={loginForm.handleSubmit(onLogin)}
                  className="space-y-4"
                >
                  {/* Email */}
                  <div className="relative">
                    <Mail className="absolute right-3.5 top-3.5 w-4.5 h-4.5 text-muted-foreground pointer-events-none" />
                    <Input
                      {...loginForm.register("email")}
                      placeholder="البريد الإلكتروني"
                      dir="ltr"
                      autoComplete="email"
                      className="pr-10 bg-secondary/50 border-border/50 focus:border-primary/50 rounded-xl h-12 text-sm"
                    />
                    {loginForm.formState.errors.email && <p className="text-xs text-destructive mt-1 px-1">{loginForm.formState.errors.email.message}</p>}
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <Lock className="absolute right-3.5 top-3.5 w-4.5 h-4.5 text-muted-foreground pointer-events-none" />
                    <Input
                      {...loginForm.register("password")}
                      type={showPass ? "text" : "password"}
                      placeholder="كلمة المرور"
                      autoComplete="current-password"
                      className="pr-10 pl-10 bg-secondary/50 border-border/50 focus:border-primary/50 rounded-xl h-12 text-sm"
                    />
                    <button type="button" onClick={() => setShowPass(v => !v)} className="absolute left-3.5 top-3.5 text-muted-foreground hover:text-foreground">
                      {showPass ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>

                  <div className="flex justify-end">
                    <button type="button" onClick={() => setForgotOpen(true)} className="text-xs text-primary hover:underline">
                      نسيت كلمة المرور؟
                    </button>
                  </div>

                  <Button type="submit" disabled={isPending} className="w-full h-12 rounded-xl text-base font-bold gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                    {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <>دخول <ArrowRight className="w-4 h-4 rtl:-scale-x-100" /></>}
                  </Button>

                  {/* Divider */}
                  <div className="flex items-center gap-3 my-1">
                    <div className="flex-1 h-px bg-border/40" />
                    <span className="text-[11px] text-muted-foreground">أو</span>
                    <div className="flex-1 h-px bg-border/40" />
                  </div>

                  {/* Social */}
                  <div className="grid grid-cols-3 gap-2">
                    <button type="button" onClick={() => socialBtn("Google")}
                      className="flex items-center justify-center gap-1.5 h-11 rounded-xl border border-border/50 bg-secondary/30 hover:bg-secondary/60 transition-all text-xs font-medium">
                      <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                      Google
                    </button>
                    <button type="button" onClick={() => socialBtn("Facebook")}
                      className="flex items-center justify-center gap-1.5 h-11 rounded-xl border border-border/50 bg-secondary/30 hover:bg-secondary/60 transition-all text-xs font-medium">
                      <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      Facebook
                    </button>
                    <button type="button" onClick={() => socialBtn("Apple")}
                      className="flex items-center justify-center gap-1.5 h-11 rounded-xl border border-border/50 bg-secondary/30 hover:bg-secondary/60 transition-all text-xs font-medium">
                      <svg className="w-4 h-4 fill-foreground" viewBox="0 0 24 24"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg>
                      Apple
                    </button>
                  </div>

                  {/* Admin */}
                  <button type="button" onClick={quickAdmin} disabled={isPending}
                    className="w-full flex items-center justify-center gap-2 h-10 rounded-xl border border-primary/20 text-primary hover:bg-primary/8 transition-all text-xs font-semibold mt-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "دخول كمشرف"}
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="register"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.22 }}
                  onSubmit={registerForm.handleSubmit(onRegister)}
                  className="space-y-3.5"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <User className="absolute right-3 top-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                      <Input {...registerForm.register("name")} placeholder="الاسم الكامل" autoComplete="name"
                        className="pr-9 bg-secondary/50 border-border/50 focus:border-primary/50 rounded-xl h-12 text-sm" />
                      {registerForm.formState.errors.name && <p className="text-xs text-destructive mt-1">{registerForm.formState.errors.name.message}</p>}
                    </div>
                    <div className="relative">
                      <Phone className="absolute right-3 top-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                      <Input {...registerForm.register("phone")} placeholder="رقم الهاتف" dir="ltr" autoComplete="tel"
                        className="pr-9 bg-secondary/50 border-border/50 focus:border-primary/50 rounded-xl h-12 text-sm" />
                      {registerForm.formState.errors.phone && <p className="text-xs text-destructive mt-1">{registerForm.formState.errors.phone.message}</p>}
                    </div>
                  </div>

                  <div className="relative">
                    <Mail className="absolute right-3.5 top-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input {...registerForm.register("email")} placeholder="البريد الإلكتروني" dir="ltr" autoComplete="email"
                      className="pr-10 bg-secondary/50 border-border/50 focus:border-primary/50 rounded-xl h-12 text-sm" />
                    {registerForm.formState.errors.email && <p className="text-xs text-destructive mt-1">{registerForm.formState.errors.email.message}</p>}
                  </div>

                  <div className="relative">
                    <Lock className="absolute right-3.5 top-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input {...registerForm.register("password")} type={showPass ? "text" : "password"} placeholder="كلمة المرور (6 أحرف+)" autoComplete="new-password"
                      className="pr-10 pl-10 bg-secondary/50 border-border/50 focus:border-primary/50 rounded-xl h-12 text-sm" />
                    <button type="button" onClick={() => setShowPass(v => !v)} className="absolute left-3.5 top-3.5 text-muted-foreground hover:text-foreground">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    {registerForm.formState.errors.password && <p className="text-xs text-destructive mt-1">{registerForm.formState.errors.password.message}</p>}
                  </div>

                  <div className="flex items-center gap-2 bg-primary/8 border border-primary/15 rounded-xl px-4 py-2.5 text-xs text-muted-foreground">
                    <span className="text-primary text-sm">🎁</span>
                    <span>تحصل على <strong className="text-primary">10 نقاط مجانية</strong> عند إنشاء حسابك</span>
                  </div>

                  <Button type="submit" disabled={isPending} className="w-full h-12 rounded-xl text-base font-bold gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                    {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <>إنشاء الحساب <ArrowRight className="w-4 h-4 rtl:-scale-x-100" /></>}
                  </Button>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-border/40" />
                    <span className="text-[11px] text-muted-foreground">أو التسجيل عبر</span>
                    <div className="flex-1 h-px bg-border/40" />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button type="button" onClick={() => socialBtn("Google")}
                      className="flex items-center justify-center gap-1.5 h-10 rounded-xl border border-border/50 bg-secondary/30 hover:bg-secondary/60 transition-all text-xs font-medium">
                      <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                      Google
                    </button>
                    <button type="button" onClick={() => socialBtn("Facebook")}
                      className="flex items-center justify-center gap-1.5 h-10 rounded-xl border border-border/50 bg-secondary/30 hover:bg-secondary/60 transition-all text-xs font-medium">
                      <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      Facebook
                    </button>
                    <button type="button" onClick={() => socialBtn("واتساب")}
                      className="flex items-center justify-center gap-1.5 h-10 rounded-xl border border-border/50 bg-secondary/30 hover:bg-secondary/60 transition-all text-xs font-medium">
                      <MessageCircle className="w-4 h-4 text-[#25D366]" />
                      واتساب
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <p className="text-center text-[11px] text-muted-foreground/50 mt-6">
          بالدخول أنت توافق على شروط الاستخدام وسياسة الخصوصية
        </p>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent className="max-w-sm" dir="rtl">
          <DialogHeader>
            <DialogTitle>استعادة كلمة المرور</DialogTitle>
            <DialogDescription>سنتواصل معك عبر واتساب لإعادة تعيين كلمة المرور</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="relative">
              <Mail className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="البريد الإلكتروني" className="pr-9" dir="ltr" />
            </div>
            <div className="relative">
              <Phone className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input value={forgotPhone} onChange={e => setForgotPhone(e.target.value)} placeholder="رقم الهاتف (اختياري)" className="pr-9" dir="ltr" />
            </div>
            <Button onClick={handleForgot} className="w-full gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold">
              <MessageCircle className="w-4 h-4" /> التواصل عبر واتساب
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
