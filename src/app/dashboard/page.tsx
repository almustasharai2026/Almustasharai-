
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
  Activity,
  History,
  Gift,
  ArrowUpRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { useUser, useAuth, useDoc, useFirestore } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { doc, addDoc, collection } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase/provider";

export default function Dashboard() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [chargeAmount, setChargeAmount] = useState("");
  const [isCharging, setIsCharging] = useState(false);

  const userDocRef = useMemoFirebase(() => user ? doc(db!, "users", user.uid) : null, [db, user]);
  const { data: profile } = useDoc(userDocRef);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push("/auth/login");
    }
  };

  const handleChargeRequest = async () => {
    if (!chargeAmount || !user || !db) {
      toast({ variant: "destructive", title: "بيانات ناقصة", description: "يرجى إدخال المبلغ المراد شحنه." });
      return;
    }
    
    setIsCharging(true);
    try {
      await addDoc(collection(db, "paymentRequests"), {
        userId: user.uid,
        userName: profile?.fullName || user.email,
        userEmail: user.email,
        amount: Number(chargeAmount),
        status: "pending",
        type: "wallet_transfer",
        createdAt: new Date().toISOString()
      });
      toast({
        title: "تم إرسال الطلب",
        description: "سيتم مراجعة إيصال التحويل وتحديث رصيدك خلال ١٥ دقيقة.",
      });
      setChargeAmount("");
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ في النظام", description: "فشل في إرسال طلب الشحن، يرجى المحاولة لاحقاً." });
    } finally {
      setIsCharging(false);
    }
  };

  if (isUserLoading) return (
    <div className="container py-32 text-center">
      <div className="inline-flex h-20 w-20 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4" />
      <p className="text-xl font-bold opacity-50">جاري الاتصال بالنظام الكوني...</p>
    </div>
  );

  if (!user) {
    router.push("/auth/login");
    return null;
  }

  const isAdmin = user.email === "bishoysamy390@gmail.com";

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl" dir="rtl">
      {isAdmin && (
        <div className="mb-12 p-8 glass-cosmic rounded-[2.5rem] border-primary/30 flex flex-col md:flex-row items-center justify-between gap-8 animate-in zoom-in duration-700">
          <div className="flex items-center gap-6">
             <div className="h-20 w-20 bg-primary/20 rounded-3xl flex items-center justify-center shadow-2xl">
               <ShieldAlert className="h-10 w-10 text-primary" />
             </div>
             <div className="text-right">
                <h2 className="font-black text-primary text-3xl mb-1">مركز سيادة المالك</h2>
                <p className="text-lg opacity-70">أهلاً بك يا بيشوي سامي. كل السلطات مفعلة لك حالياً.</p>
             </div>
          </div>
          <Link href="/admin">
            <Button size="lg" className="cosmic-gradient rounded-2xl font-black px-12 h-16 text-lg shadow-2xl">
               دخول غرفة العمليات
            </Button>
          </Link>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
        <div className="text-right space-y-2">
          <h1 className="text-5xl font-black text-white">مرحباً، <span className="text-gradient">{profile?.fullName || "مستشار المستقبل"}</span></h1>
          <p className="text-muted-foreground opacity-60">أهلاً بك في مركز قيادتك القانوني الخاص.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="glass rounded-2xl h-14 border-white/10 hover:bg-white/5" onClick={() => toast({ title: "الإعدادات", description: "سيتم تفعيل تخصيص الحساب قريباً." })}>
            <Settings className="h-5 w-5 ml-2" /> الإعدادات
          </Button>
          <Button variant="destructive" className="rounded-2xl h-14 bg-red-600/10 text-red-500 border-none" onClick={handleLogout}>
            <LogOut className="h-5 w-5 ml-2" /> خروج
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-10">
          <Card className="glass-cosmic border-none rounded-[3rem] p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px]" />
            <div className="space-y-8 text-center">
              <div className="h-32 w-32 bg-primary/20 rounded-full mx-auto flex items-center justify-center border-4 border-white/5 shadow-2xl relative">
                <User className="h-16 w-16 text-primary" />
                <div className="absolute bottom-1 right-1 h-8 w-8 bg-emerald-500 rounded-full border-4 border-slate-900" />
              </div>
              <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5">
                 <p className="text-xs text-muted-foreground font-black mb-2 uppercase">رصيدك الكوني</p>
                 <p className="text-5xl font-black text-white">
                   {profile?.balance || 0}
                   <span className="text-sm text-primary font-bold mr-2">EGP</span>
                 </p>
                 {profile?.balance === 50 && (
                   <div className="mt-4 flex items-center gap-2 justify-center text-emerald-400 text-xs font-bold animate-pulse">
                      <Gift className="h-4 w-4" /> رصيد ترحيبي مجاني نشط
                   </div>
                 )}
              </div>
            </div>
          </Card>

          <Card className="glass-card border-none rounded-[3rem] p-10 space-y-8">
            <div className="flex items-center justify-between">
              <Wallet className="h-8 w-8 text-primary" />
              <h3 className="font-black text-2xl">شحن المحفظة</h3>
            </div>
            <div className="space-y-6">
              <div className="glass p-5 rounded-2xl text-center border-primary/20 bg-primary/5">
                <Label className="text-[10px] text-primary font-black block mb-2 uppercase tracking-tighter">رقم التحويل الرسمي</Label>
                <p className="text-2xl font-black text-white tracking-[0.2em]">01130031531</p>
              </div>
              <Input 
                type="number" 
                placeholder="المبلغ (مثال: 500)" 
                value={chargeAmount}
                onChange={(e) => setChargeAmount(e.target.value)}
                className="glass border-white/5 h-14 rounded-2xl text-xl text-center font-black"
              />
              <div 
                className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center hover:bg-white/5 transition-all cursor-pointer"
                onClick={() => toast({ title: "رفع الإيصال", description: "يرجى اختيار صورة التحويل من جهازك." })}
              >
                <Upload className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs font-bold opacity-40">ارفق صورة التحويل للتحقق</p>
              </div>
              <Button 
                onClick={handleChargeRequest} 
                disabled={isCharging || !chargeAmount}
                className="w-full btn-primary h-16 rounded-2xl text-xl font-black shadow-2xl"
              >
                {isCharging ? "جاري الإرسال..." : "طلب شحن الرصيد"}
              </Button>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-10">
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <Link href="/consultants" className="text-primary font-black hover:underline flex items-center gap-2">
                 <ArrowUpRight className="h-5 w-5" /> حجز استشارة ذكية جديدة
              </Link>
              <h2 className="text-3xl font-black flex items-center gap-4">الجلسات القادمة <Activity className="h-6 w-6 text-primary animate-pulse" /></h2>
            </div>
            
            <Card className="glass-cosmic border-none rounded-[3rem] p-10 hover:shadow-primary/10 transition-all">
              <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="text-right flex items-center gap-6">
                  <div className="h-20 w-20 glass rounded-3xl flex items-center justify-center">
                    <Video className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-white">د. سارة الفهد</h4>
                    <p className="text-primary font-bold">قانون الشركات</p>
                    <Badge className="bg-white/5 text-muted-foreground mt-2 border-none">اليوم | 10:00 مساءً</Badge>
                  </div>
                </div>
                <Link href="/consultants/1/call">
                  <Button className="cosmic-gradient rounded-2xl px-12 h-16 text-xl font-black">دخول الجلسة</Button>
                </Link>
              </div>
            </Card>
          </section>

          <section className="space-y-8">
            <h2 className="text-3xl font-black flex items-center justify-end gap-4">الأرشيف <History className="h-6 w-6 text-primary opacity-40" /></h2>
            <Card className="glass border-none rounded-[3rem] p-20 text-center text-muted-foreground bg-white/5">
               <History className="h-12 w-12 opacity-20 mx-auto mb-4" />
               <p className="text-xl font-bold opacity-30">سجلك القانوني فارغ حالياً</p>
               <Button variant="link" className="text-primary mt-4" onClick={() => router.push('/bot')}>ابدأ أول محادثة الآن</Button>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
