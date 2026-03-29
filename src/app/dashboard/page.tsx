
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Calendar, 
  Clock, 
  Video, 
  User, 
  Settings, 
  LogOut,
  Wallet,
  Upload,
  ShieldAlert,
  Zap,
  Activity,
  History
} from "lucide-react";
import Link from "next/link";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [chargeAmount, setChargeAmount] = useState("");

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push("/auth/login");
    }
  };

  const handleChargeRequest = () => {
    if (!chargeAmount) return;
    toast({
      title: "تم إرسال الطلب",
      description: "جاري مراجعة إيصال التحويل من قبل الإدارة لتحديث رصيدك.",
    });
    setChargeAmount("");
  };

  if (isUserLoading) return <div className="container py-32 text-center text-primary animate-pulse">جاري تحميل بياناتك...</div>;
  if (!user) return <div className="container py-32 text-center">يرجى تسجيل الدخول للوصول لهذه الصفحة.</div>;

  const isAdmin = user.email === "bishoysamy390@gmail.com";

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl" dir="rtl">
      {/* Admin Alert */}
      {isAdmin && (
        <div className="mb-8 p-6 glass rounded-2xl border-primary/40 flex flex-col md:flex-row items-center justify-between gap-6 animate-in zoom-in duration-500">
          <div className="flex items-center gap-4">
             <ShieldAlert className="h-10 w-10 text-primary" />
             <div className="text-right">
                <h2 className="font-bold text-primary text-xl">صلاحيات المالك مفعلة</h2>
                <p className="text-sm opacity-70">أهلاً بك في نظام إدارة المستشار AI.</p>
             </div>
          </div>
          <Link href="/admin">
            <Button size="lg" className="btn-primary rounded-xl font-bold">
               دخول لوحة الإدارة
            </Button>
          </Link>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div className="text-right space-y-2">
          <h1 className="text-4xl font-black text-white">مركز القيادة <span className="text-primary">الشخصي</span></h1>
          <div className="flex items-center gap-2 justify-end text-muted-foreground">
            <Zap className="h-4 w-4 text-primary" />
            <p className="text-lg">رصيد متاح: <span className="text-white font-bold">1,250 EGP</span></p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="glass rounded-xl gap-2 h-12">
            <Settings className="h-4 w-4" /> الإعدادات
          </Button>
          <Button variant="destructive" className="rounded-xl gap-2 h-12" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> خروج
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="glass-card border-none rounded-[2rem] overflow-hidden">
            <CardContent className="pt-10 text-center space-y-6">
              <div className="h-28 w-28 bg-primary/20 rounded-full mx-auto flex items-center justify-center border-4 border-white/5">
                <User className="h-14 w-14 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{user.displayName || "مستكشف قانوني"}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <Badge className="bg-primary/20 text-primary border-primary/20">عضو نشط</Badge>
            </CardContent>
          </Card>

          <Card className="glass-card border-none rounded-[2rem] p-6 space-y-6">
            <div className="flex items-center justify-between">
              <Wallet className="h-6 w-6 text-primary" />
              <h3 className="font-bold text-xl">شحن المحفظة</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-800/50 p-4 rounded-xl text-center border border-white/5">
                <Label className="text-xs text-muted-foreground block mb-1">رقم المحفظة (فودافون كاش)</Label>
                <p className="text-xl font-black text-white">01130031531</p>
              </div>
              <div className="space-y-2">
                <Label>المبلغ المراد شحنه (EGP)</Label>
                <Input 
                  type="number" 
                  placeholder="أدخل القيمة.." 
                  value={chargeAmount}
                  onChange={(e) => setChargeAmount(e.target.value)}
                  className="glass border-white/10 h-12"
                />
              </div>
              <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:bg-white/5 transition-all cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs opacity-50">أرفق صورة الإيصال للتحقق</p>
              </div>
              <Button onClick={handleChargeRequest} className="w-full btn-primary h-12 rounded-xl font-bold">إرسال الطلب</Button>
            </div>
          </Card>
        </div>

        {/* Sessions Area */}
        <div className="lg:col-span-8 space-y-8">
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <Link href="/consultants" className="text-primary font-bold hover:underline text-sm">+ حجز استشارة جديدة</Link>
              <h2 className="text-2xl font-bold flex items-center gap-3">
                 الجلسات القادمة <Activity className="h-5 w-5 text-primary" />
              </h2>
            </div>
            
            <Card className="glass-card border-none rounded-[2rem] p-6 hover:shadow-2xl transition-all">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 text-right">
                  <div className="h-16 w-16 glass rounded-xl flex items-center justify-center">
                    <Video className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">د. سارة الفهد</h4>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> اليوم</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 10:00 AM</span>
                    </div>
                  </div>
                </div>
                <Button className="btn-primary rounded-xl px-10 h-12 w-full md:w-auto">دخول الجلسة</Button>
              </div>
            </Card>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3 justify-end">
               الأرشيف القانوني <History className="h-5 w-5 text-primary" />
            </h2>
            <Card className="glass border-none rounded-[2rem] p-20 text-center text-muted-foreground opacity-30">
               <History className="h-12 w-12 mx-auto mb-4" />
               <p className="font-bold">لا يوجد سجلات سابقة حالياً</p>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
