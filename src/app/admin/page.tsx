
"use client";

import { useUser } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  ShieldCheck,
  CreditCard,
  History,
  Scale
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminPanel() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("requests");

  // Admin access check for bishoysamy390@gmail.com
  if (!isUserLoading && user?.email !== "bishoysamy390@gmail.com") {
    router.push("/dashboard");
    return null;
  }

  const paymentRequests = [
    { id: "req-1", user: "علي حمدان", amount: "500 EGP", method: "Vodafone Cash", date: "2024-10-22", status: "pending" },
    { id: "req-2", user: "منى زكي", amount: "1000 EGP", method: "InstaPay", date: "2024-10-21", status: "pending" },
  ];

  const stats = [
    { label: "إجمالي المستخدمين", value: "1,250", icon: <Users className="text-blue-500" /> },
    { label: "الطلبات النشطة", value: "48", icon: <History className="text-orange-500" /> },
    { label: "الأرباح الكلية", value: "25,000 EGP", icon: <TrendingUp className="text-green-500" /> },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl text-right" dir="rtl">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-headline font-bold text-primary flex items-center gap-2 justify-end">
            إدارة منصة المستشار
            <ShieldCheck className="h-8 w-8 text-accent" />
          </h1>
          <p className="text-muted-foreground">مرحباً بيشوي، لديك كامل الصلاحيات لإدارة النظام.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">تصدير التقارير</Button>
          <Button className="bg-accent">إضافة مستشار</Button>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, i) => (
          <Card key={i} className="shadow-sm border-muted">
            <CardContent className="pt-6 flex justify-between items-center">
              <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                {stat.icon}
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-2">
          <AdminNavButton label="طلبات الشحن" active={activeTab === "requests"} onClick={() => setActiveTab("requests")} icon={<CreditCard className="h-4 w-4" />} count={2} />
          <AdminNavButton label="إدارة المستخدمين" active={activeTab === "users"} onClick={() => setActiveTab("users")} icon={<Users className="h-4 w-4" />} />
          <AdminNavButton label="إحصائيات المنصة" active={activeTab === "stats"} onClick={() => setActiveTab("stats")} icon={<TrendingUp className="h-4 w-4" />} />
          <AdminNavButton label="السجلات القانونية" active={activeTab === "logs"} onClick={() => setActiveTab("logs")} icon={<Scale className="h-4 w-4" />} />
        </aside>

        <main className="lg:col-span-3">
          <Card className="shadow-lg border-none">
            <CardHeader className="border-b">
              <CardTitle>طلبات شحن الرصيد المعلقة</CardTitle>
              <CardDescription>قم بمراجعة إيصالات الدفع والموافقة عليها.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {paymentRequests.map((req) => (
                  <div key={req.id} className="p-6 flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-muted/20 transition-colors">
                    <div className="flex gap-4">
                      <Button variant="outline" size="sm" className="text-red-500 hover:bg-red-50 gap-1 border-red-200">
                        <XCircle className="h-4 w-4" /> رفض
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 gap-1">
                        <CheckCircle className="h-4 w-4" /> موافقة
                      </Button>
                      <Button variant="ghost" size="sm" className="text-accent underline">عرض الإيصال</Button>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center gap-2 justify-end">
                        <Badge variant="secondary">{req.method}</Badge>
                        <h4 className="font-bold text-lg">{req.user}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{req.amount} - {req.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

function AdminNavButton({ label, active, onClick, icon, count }: any) {
  return (
    <Button 
      variant={active ? "default" : "ghost"} 
      className={`w-full justify-end gap-3 h-12 ${active ? 'bg-primary' : 'hover:bg-accent/10'}`}
      onClick={onClick}
    >
      {count && <Badge className="bg-accent text-accent-foreground ml-auto">{count}</Badge>}
      {label}
      {icon}
    </Button>
  );
}
