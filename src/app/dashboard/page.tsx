
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  Video, 
  User, 
  Settings, 
  LogOut,
  History
} from "lucide-react";
import Link from "next/link";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function UserDashboard() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push("/auth/login");
    }
  };

  const upcomingBookings = [
    { id: "b1", consultant: "د. سارة الفهد", date: "24 أكتوبر 2024", time: "10:00 صباحاً", type: "مكالمة فيديو", status: "مؤكد" },
    { id: "b2", consultant: "أحمد بن محمد", date: "28 أكتوبر 2024", time: "02:30 مساءً", type: "محادثة", status: "قيد الانتظار" },
  ];

  const pastConsultations = [
    { id: "p1", consultant: "ليلى إبراهيم", date: "15 سبتمبر 2024", topic: "تسجيل العلامة التجارية" },
  ];

  if (isUserLoading) return <div className="container py-20 text-center">جاري تحميل البيانات...</div>;
  if (!user) return <div className="container py-20 text-center">يرجى تسجيل الدخول أولاً.</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl text-right" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-bold text-primary">مرحباً بك، {user.displayName || "مستخدم المستشار"}</h1>
          <p className="text-muted-foreground">إدارة استشاراتك وإعدادات حسابك.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" /> الإعدادات
          </Button>
          <Button variant="destructive" size="sm" className="gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> تسجيل الخروج
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground">
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

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">إحصائيات سريعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <StatRow label="إجمالي الاستشارات" value="12" />
              <StatRow label="الجلسات القادمة" value="2" />
              <StatRow label="مستشارين تم حفظهم" value="5" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <Link href="/consultants">
                <Button variant="link" size="sm">حجز جديد</Button>
              </Link>
              <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent" />
                الحجوزات القادمة
              </h2>
            </div>
            
            <div className="grid gap-4">
              {upcomingBookings.map((booking) => (
                <Card key={booking.id} className="hover:border-accent/50 transition-colors">
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Button size="sm">انضم للجلسة</Button>
                      <Badge variant={booking.status === "مؤكد" ? "default" : "secondary"}>
                        {booking.status}
                      </Badge>
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
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2 justify-end">
              الاستشارات السابقة
              <History className="h-5 w-5 text-accent" />
            </h2>
            <Card>
              <CardContent className="p-0">
                {pastConsultations.map((p, idx) => (
                  <div key={p.id} className={`p-4 flex items-center justify-between ${idx !== pastConsultations.length - 1 ? 'border-b' : ''}`}>
                    <Button variant="outline" size="sm">عرض الملاحظات</Button>
                    <div className="space-y-1 text-right">
                      <p className="font-medium text-primary">{p.consultant}</p>
                      <p className="text-sm text-muted-foreground">{p.topic}</p>
                      <p className="text-xs text-muted-foreground">{p.date}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="font-bold text-primary">{value}</span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}
