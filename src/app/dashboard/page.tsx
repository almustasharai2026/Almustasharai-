
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
  History,
  Wallet,
  Upload,
  CreditCard,
  ShieldAlert
} from "lucide-react";
import Link from "next/link";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function UserDashboard() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isCharging, setIsCharging] = useState(false);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push("/auth/login");
    }
  };

  const handleChargeRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCharging(true);
    setTimeout(() => {
      toast({ title: "تم إرسال الطلب", description: "جاري مراجعة إيصال الدفع من قبل الإدارة." });
      setIsCharging(false);
    }, 2000);
  };

  const upcomingBookings = [
    { id: "b1", consultant: "د. سارة الفهد", date: "24 أكتوبر 2024", time: "10:00 صباحاً", status: "مؤكد" },
  ];

  if (isUserLoading) return <div className="container py-20 text-center">جاري تحميل البيانات...</div>;
  if (!user) return <div className="container py-20 text-center">يرجى تسجيل الدخول أولاً.</div>;

  const isAdmin = user.email === "bishoysamy390@gmail.com";

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl text-right" dir="rtl">
      {/* Admin Quick Link */}
      {isAdmin && (
        <div className="mb-6 p-4 bg-accent/10 border border-accent rounded-xl flex items-center justify-between">
          <Link href="/admin">
            <Button size="sm" className="bg-accent">دخول لوحة الإدارة</Button>
          </Link>
          <div className="flex items-center gap-2 font-bold text-accent">
            أنت مسجل كمالك للمنصة
            <ShieldAlert className="h-5 w-5" />
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-bold text-primary">مرحباً، {user.displayName || "مستخدم المستشار"}</h1>
          <p className="text-muted-foreground">رصيدك الحالي: <span className="text-accent font-bold">1,250 EGP</span></p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" /> الإعدادات
          </Button>
          <Button variant="destructive" size="sm" className="gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> خروج
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground overflow-hidden">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="h-20 w-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto border-2 border-accent">
                <User className="h-10 w-10 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{user.displayName || "الاسم غير متوفر"}</h3>
                <p className="text-sm opacity-70">{user.email}</p>
              </div>
              <Button variant="secondary" size="sm" className="w-full">تعديل الملف الشخصي</Button>
            </CardContent>
          </Card>

          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 justify-end">
                شحن الرصيد
                <Wallet className="h-5 w-5 text-accent" />
              </CardTitle>
              <CardDescription>اشحن رصيدك عبر فودافون كاش أو إنستا باي.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChargeRequest} className="space-y-4">
                <div className="space-y-2">
                  <Label>رقم المحفظة (01026427301)</Label>
                  <Input placeholder="المبلغ المراد شحنه" type="number" required />
                </div>
                <div className="space-y-2">
                  <Label>رفع صورة الإيصال</Label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">اضغط هنا لرفع الصورة</p>
                  </div>
                </div>
                <Button className="w-full bg-accent text-white" disabled={isCharging}>
                  {isCharging ? "جاري الإرسال..." : "إرسال الطلب"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <Link href="/consultants">
                <Button variant="link" size="sm">حجز جديد</Button>
              </Link>
              <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent" /> الحجوزات القادمة
              </h2>
            </div>
            
            {upcomingBookings.map((booking) => (
              <Card key={booking.id} className="hover:border-accent/50 transition-colors">
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Button size="sm">انضم للجلسة</Button>
                    <Badge>{booking.status}</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <h4 className="font-bold text-primary">{booking.consultant}</h4>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground justify-end">
                        <span className="flex items-center gap-1">{booking.time} <Clock className="h-3 w-3" /></span>
                        <span className="flex items-center gap-1">{booking.date} <Calendar className="h-3 w-3" /></span>
                      </div>
                    </div>
                    <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                      <Video className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2 justify-end">
              الاستشارات السابقة
              <History className="h-5 w-5 text-accent" />
            </h2>
            <Card>
              <CardContent className="p-4 text-center text-muted-foreground">
                لا توجد استشارات سابقة حتى الآن.
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
