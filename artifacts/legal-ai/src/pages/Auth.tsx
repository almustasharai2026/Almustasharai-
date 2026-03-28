import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Scale, Loader2, Mail, Lock, User, Phone, Eye, EyeOff, MessageCircle, ShieldCheck } from "lucide-react";
import { useAppLogin, useAppRegister } from "@/hooks/use-app-api";
import { setToken } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

const registerSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  phone: z.string().min(8, "رقم الهاتف مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotPhone, setForgotPhone] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { mutate: login, isPending: isLoginPending } = useAppLogin();
  const { mutate: register, isPending: isRegisterPending } = useAppRegister();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", name: "", phone: "" },
  });

  const onLoginSubmit = (data: z.infer<typeof loginSchema>) => {
    login({ data }, {
      onSuccess: (res) => {
        setToken(res.token);
        toast({ title: "✅ تم تسجيل الدخول بنجاح", description: `مرحباً بك يا ${res.user.name}` });
        window.location.href = window.location.origin + (import.meta.env.BASE_URL || "/");
      },
      onError: (err: Error) => {
        const msg = err.message || "";
        let desc = "تحقق من البريد الإلكتروني وكلمة المرور";
        if (msg.includes("401") || msg.toLowerCase().includes("unauthorized")) {
          desc = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
        }
        toast({ title: "❌ فشل تسجيل الدخول", description: desc, variant: "destructive" });
      }
    });
  };

  const onRegisterSubmit = (data: z.infer<typeof registerSchema>) => {
    register({ data }, {
      onSuccess: (res) => {
        setToken(res.token);
        toast({ title: "✅ تم إنشاء الحساب بنجاح", description: "مرحباً بك في المحامي الذكي!" });
        window.location.href = window.location.origin + (import.meta.env.BASE_URL || "/");
      },
      onError: (err: Error) => {
        const msg = err.message || "";
        let desc = "حدث خطأ أثناء إنشاء الحساب";
        if (msg.includes("400") || msg.toLowerCase().includes("already")) {
          desc = "البريد الإلكتروني مستخدم بالفعل";
        }
        toast({ title: "❌ فشل إنشاء الحساب", description: desc, variant: "destructive" });
      }
    });
  };

  const handleAdminLogin = () => {
    loginForm.setValue("email", "bishoysamy390@gmail.com");
    loginForm.setValue("password", "Bishosamy2020");
    loginForm.handleSubmit(onLoginSubmit)();
  };

  const handleForgotPassword = () => {
    if (!forgotEmail) {
      toast({ title: "يرجى إدخال بريدك الإلكتروني", variant: "destructive" });
      return;
    }
    const text = encodeURIComponent(
      `طلب إعادة تعيين كلمة المرور:\nالبريد الإلكتروني: ${forgotEmail}\nرقم الهاتف: ${forgotPhone || "لم يُدخل"}`
    );
    window.open(`https://wa.me/+201000000000?text=${text}`, "_blank");
    setForgotOpen(false);
    toast({ title: "تم فتح واتساب", description: "سيتواصل معك المشرف لإعادة تعيين كلمة المرور" });
  };

  const handleSocialLogin = (provider: string) => {
    toast({
      title: `تسجيل الدخول عبر ${provider}`,
      description: "هذه الميزة قيد التطوير وستكون متاحة قريباً",
    });
  };

  const isPending = isLoginPending || isRegisterPending;

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground">
      {/* Visual Section */}
      <div className="hidden lg:flex w-1/2 relative bg-secondary overflow-hidden items-center justify-center border-l border-border">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-background/90 via-background/40 to-transparent z-10" />
          <img
            src={`${import.meta.env.BASE_URL}images/auth-bg.png`}
            alt="Law library"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 max-w-lg p-12 text-center">
          <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-primary to-primary/50 p-1 flex items-center justify-center shadow-2xl shadow-primary/20">
            <div className="w-full h-full bg-card rounded-xl flex items-center justify-center">
              <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Logo" className="w-16 h-16 object-contain" />
            </div>
          </div>
          <h1 className="text-5xl font-display font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-white drop-shadow-sm">المحامي الذكي</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            مساعدك القانوني الشخصي المعتمد على الذكاء الاصطناعي. استشارات، صياغة عقود، ومراجعة قانونية في ثوانٍ معدودة.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4 text-center">
            {[
              { num: "6", label: "شخصيات قانونية" },
              { num: "∞", label: "استشارات فورية" },
              { num: "100%", label: "سرية تامة" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="text-2xl font-bold text-primary">{stat.num}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative overflow-y-auto">
        <div className="lg:hidden absolute inset-0 z-0 opacity-20">
          <img src={`${import.meta.env.BASE_URL}images/auth-bg.png`} alt="Bg" className="w-full h-full object-cover blur-sm" />
        </div>

        <div className="w-full max-w-md relative z-10 py-6">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <Scale className="w-10 h-10 text-primary" />
            <h1 className="text-3xl font-display font-bold text-primary">المحامي الذكي</h1>
          </div>

          <div className="bg-card/80 backdrop-blur-xl border border-border/50 p-8 rounded-3xl shadow-2xl">
            {/* Tabs */}
            <div className="flex p-1 bg-secondary/50 rounded-xl mb-7 border border-border">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${isLogin ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"}`}
              >
                تسجيل الدخول
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${!isLogin ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"}`}
              >
                حساب جديد
              </button>
            </div>

            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                >
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                    <div className="space-y-2">
                      <Label>البريد الإلكتروني</Label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                          {...loginForm.register("email")}
                          placeholder="name@example.com"
                          autoComplete="email"
                          className="pr-10 bg-background/50 focus:bg-background transition-colors"
                          dir="ltr"
                        />
                      </div>
                      {loginForm.formState.errors.email && (
                        <p className="text-xs text-destructive">{loginForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>كلمة المرور</Label>
                        <button
                          type="button"
                          onClick={() => setForgotOpen(true)}
                          className="text-xs text-primary hover:underline"
                        >
                          نسيت كلمة المرور؟
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          {...loginForm.register("password")}
                          placeholder="••••••••"
                          autoComplete="current-password"
                          className="pr-10 pl-10 bg-background/50 focus:bg-background transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {loginForm.formState.errors.password && (
                        <p className="text-xs text-destructive">{loginForm.formState.errors.password.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isPending}
                      className="w-full py-6 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                    >
                      {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "دخول"}
                    </Button>
                  </form>

                  {/* Divider */}
                  <div className="flex items-center gap-3 my-5">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground">أو تسجيل الدخول عبر</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  {/* Social Login */}
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleSocialLogin("Google")}
                      className="flex items-center justify-center gap-2 border border-border rounded-xl py-3 hover:bg-secondary transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="text-xs font-medium">Google</span>
                    </button>

                    <button
                      onClick={() => handleSocialLogin("Facebook")}
                      className="flex items-center justify-center gap-2 border border-border rounded-xl py-3 hover:bg-secondary transition-colors"
                    >
                      <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span className="text-xs font-medium">Facebook</span>
                    </button>

                    <button
                      onClick={() => handleSocialLogin("Apple")}
                      className="flex items-center justify-center gap-2 border border-border rounded-xl py-3 hover:bg-secondary transition-colors"
                    >
                      <svg className="w-5 h-5 fill-foreground" viewBox="0 0 24 24">
                        <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
                      </svg>
                      <span className="text-xs font-medium">Apple</span>
                    </button>
                  </div>

                  {/* Admin Quick Login */}
                  <div className="mt-5 pt-5 border-t border-border">
                    <button
                      type="button"
                      onClick={handleAdminLogin}
                      disabled={isPending}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-primary/30 text-primary hover:bg-primary/10 transition-colors text-sm font-semibold"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "دخول كمشرف (المالك)"}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label>الاسم الكامل</Label>
                      <div className="relative">
                        <User className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                          {...registerForm.register("name")}
                          placeholder="أحمد محمد"
                          autoComplete="name"
                          className="pr-10 bg-background/50 focus:bg-background"
                        />
                      </div>
                      {registerForm.formState.errors.name && (
                        <p className="text-xs text-destructive">{registerForm.formState.errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>رقم الهاتف</Label>
                      <div className="relative">
                        <Phone className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                          {...registerForm.register("phone")}
                          placeholder="01xxxxxxxxx"
                          autoComplete="tel"
                          className="pr-10 bg-background/50 focus:bg-background text-left"
                          dir="ltr"
                        />
                      </div>
                      {registerForm.formState.errors.phone && (
                        <p className="text-xs text-destructive">{registerForm.formState.errors.phone.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>البريد الإلكتروني</Label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                          {...registerForm.register("email")}
                          placeholder="name@example.com"
                          autoComplete="email"
                          className="pr-10 bg-background/50 focus:bg-background"
                          dir="ltr"
                        />
                      </div>
                      {registerForm.formState.errors.email && (
                        <p className="text-xs text-destructive">{registerForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>كلمة المرور</Label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          {...registerForm.register("password")}
                          placeholder="••••••••"
                          autoComplete="new-password"
                          className="pr-10 pl-10 bg-background/50 focus:bg-background"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {registerForm.formState.errors.password && (
                        <p className="text-xs text-destructive">{registerForm.formState.errors.password.message}</p>
                      )}
                    </div>

                    <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-xs text-muted-foreground">
                      🎁 ستحصل على <span className="text-primary font-bold">10 نقاط مجانية</span> عند إنشاء حسابك
                    </div>

                    <Button
                      type="submit"
                      disabled={isPending}
                      className="w-full py-6 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                    >
                      {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "إنشاء حساب"}
                    </Button>
                  </form>

                  {/* Divider */}
                  <div className="flex items-center gap-3 my-5">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground">أو عبر</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  {/* Social Register */}
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleSocialLogin("Google")}
                      className="flex items-center justify-center gap-2 border border-border rounded-xl py-3 hover:bg-secondary transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="text-xs font-medium">Google</span>
                    </button>

                    <button
                      onClick={() => handleSocialLogin("Facebook")}
                      className="flex items-center justify-center gap-2 border border-border rounded-xl py-3 hover:bg-secondary transition-colors"
                    >
                      <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span className="text-xs font-medium">Facebook</span>
                    </button>

                    <button
                      onClick={() => handleSocialLogin("WhatsApp")}
                      className="flex items-center justify-center gap-2 border border-border rounded-xl py-3 hover:bg-secondary transition-colors"
                    >
                      <MessageCircle className="w-5 h-5 text-[#25D366]" />
                      <span className="text-xs font-medium">واتساب</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent className="max-w-sm" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">نسيت كلمة المرور؟</DialogTitle>
            <DialogDescription className="text-right">
              أدخل بياناتك وسنتواصل معك عبر واتساب لإعادة تعيين كلمة المرور
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="pr-10"
                  dir="ltr"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>رقم الهاتف (اختياري)</Label>
              <div className="relative">
                <Phone className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  value={forgotPhone}
                  onChange={e => setForgotPhone(e.target.value)}
                  placeholder="01xxxxxxxxx"
                  className="pr-10"
                  dir="ltr"
                />
              </div>
            </div>
            <Button
              onClick={handleForgotPassword}
              className="w-full gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold"
            >
              <MessageCircle className="w-4 h-4" />
              التواصل مع الدعم عبر واتساب
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
