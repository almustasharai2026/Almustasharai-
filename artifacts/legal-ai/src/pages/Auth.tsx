import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scale, Loader2, Mail, Lock, User, Phone } from "lucide-react";
import { useAppLogin, useAppRegister } from "@/hooks/use-app-api";
import { setToken } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2, "الاسم مطلوب"),
  phone: z.string().min(8, "رقم الهاتف مطلوب"),
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
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
        toast({ title: "تم تسجيل الدخول بنجاح" });
        setLocation("/");
      },
      onError: (err) => {
        toast({ title: "فشل تسجيل الدخول", description: err.message, variant: "destructive" });
      }
    });
  };

  const onRegisterSubmit = (data: z.infer<typeof registerSchema>) => {
    register({ data }, {
      onSuccess: (res) => {
        setToken(res.token);
        toast({ title: "تم إنشاء الحساب بنجاح" });
        setLocation("/");
      },
      onError: (err) => {
        toast({ title: "فشل إنشاء الحساب", description: err.message, variant: "destructive" });
      }
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
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        {/* Mobile background fallback */}
        <div className="lg:hidden absolute inset-0 z-0 opacity-20">
          <img src={`${import.meta.env.BASE_URL}images/auth-bg.png`} alt="Bg" className="w-full h-full object-cover blur-sm" />
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <Scale className="w-10 h-10 text-primary" />
            <h1 className="text-3xl font-display font-bold text-primary">المحامي الذكي</h1>
          </div>

          <div className="bg-card/80 backdrop-blur-xl border border-border/50 p-8 rounded-3xl shadow-2xl">
            <div className="flex p-1 bg-secondary/50 rounded-xl mb-8 border border-border">
              <button 
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${isLogin ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
              >
                تسجيل الدخول
              </button>
              <button 
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${!isLogin ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
              >
                حساب جديد
              </button>
            </div>

            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.form 
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <Label>البريد الإلكتروني</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input 
                        {...loginForm.register("email")} 
                        placeholder="name@example.com" 
                        className="pr-10 bg-background/50 focus:bg-background transition-colors"
                      />
                    </div>
                    {loginForm.formState.errors.email && <p className="text-sm text-destructive">{loginForm.formState.errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>كلمة المرور</Label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input 
                        type="password"
                        {...loginForm.register("password")} 
                        placeholder="••••••••" 
                        className="pr-10 bg-background/50 focus:bg-background transition-colors"
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={isPending} className="w-full py-6 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 mt-4">
                    {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "دخول"}
                  </Button>
                </motion.form>
              ) : (
                <motion.form 
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <Label>الاسم الكامل</Label>
                    <div className="relative">
                      <User className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input 
                        {...registerForm.register("name")} 
                        placeholder="أحمد محمد" 
                        className="pr-10 bg-background/50 focus:bg-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>رقم الهاتف</Label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input 
                        {...registerForm.register("phone")} 
                        placeholder="01xxxxxxxxx" 
                        className="pr-10 bg-background/50 focus:bg-background text-left"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>البريد الإلكتروني</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input 
                        {...registerForm.register("email")} 
                        placeholder="name@example.com" 
                        className="pr-10 bg-background/50 focus:bg-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>كلمة المرور</Label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input 
                        type="password"
                        {...registerForm.register("password")} 
                        placeholder="••••••••" 
                        className="pr-10 bg-background/50 focus:bg-background"
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={isPending} className="w-full py-6 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 mt-4">
                    {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "إنشاء حساب"}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
