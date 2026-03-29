
"use client";

import { useUser, useFirestore, useCollection } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  TrendingUp, 
  ShieldCheck,
  CreditCard,
  History,
  Scale,
  Plus,
  Trash2,
  Edit2,
  Settings,
  Activity,
  UserPlus,
  ArrowRight,
  Database,
  Lock
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { collection, deleteDoc, doc, addDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useMemoFirebase } from "@/firebase/provider";

export default function SupremeAdminPanel() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Admin access check
  const isAdmin = user?.email === "bishoysamy390@gmail.com";

  // Firestore Queries
  const specQuery = useMemoFirebase(() => collection(db!, "specializations"), [db]);
  const { data: specializations } = useCollection(specQuery);

  const [newSpec, setNewSpec] = useState({ name: "", description: "" });

  if (!isUserLoading && !isAdmin) {
    router.push("/dashboard");
    return null;
  }

  const handleAddSpec = async () => {
    if (!newSpec.name) return;
    try {
      await addDoc(collection(db!, "specializations"), newSpec);
      setNewSpec({ name: "", description: "" });
      toast({ title: "تمت العملية", description: "تم إضافة التخصص القانوني بنجاح." });
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ", description: "فشل تحديث قاعدة البيانات." });
    }
  };

  const handleDeleteSpec = async (id: string) => {
    try {
      await deleteDoc(doc(db!, "specializations", id));
      toast({ title: "تم الحذف", description: "تم إزالة التخصص من النظام." });
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ", description: "فشل الحذف." });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl h-full flex flex-col gap-10" dir="rtl">
      {/* Supreme Admin Header */}
      <header className="glass-cosmic p-10 rounded-[3.5rem] flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden border-accent/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-[60px] rounded-full" />
        <div className="text-right space-y-2">
          <div className="flex items-center gap-4 justify-end">
            <Badge className="bg-accent/20 text-accent border-accent/40 px-4 py-1 rounded-full font-black">مالك المنصة</Badge>
            <h1 className="text-5xl font-black text-white flex items-center gap-4">
               مركز العمليات العليا
               <Lock className="h-10 w-10 text-accent" />
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">أهلاً بيشوي، لديك السيطرة المطلقة على خوارزميات العدالة الذكية.</p>
        </div>
        <div className="flex gap-4">
           <Button className="h-14 px-8 rounded-2xl glass-cosmic border-accent/20 hover:bg-accent/10 text-white font-bold gap-2">
              <Database className="h-5 w-5 text-accent" /> نسخة احتياطية
           </Button>
           <Button className="h-14 px-10 rounded-2xl cosmic-gradient font-black text-lg shadow-2xl">تصدير التقارير</Button>
        </div>
      </header>

      <div className="grid lg:grid-cols-4 gap-10">
        {/* Navigation Command Sidebar */}
        <aside className="lg:col-span-1 space-y-4">
          <AdminNavButton label="لوحة المعلومات" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} icon={<Activity className="h-6 w-6" />} />
          <AdminNavButton label="إدارة التخصصات" active={activeTab === "specialties"} onClick={() => setActiveTab("specialties")} icon={<Scale className="h-6 w-6" />} />
          <AdminNavButton label="طلبات الشحن" active={activeTab === "payments"} onClick={() => setActiveTab("payments")} icon={<CreditCard className="h-6 w-6" />} count={2} />
          <AdminNavButton label="المستخدمين" active={activeTab === "users"} onClick={() => setActiveTab("users")} icon={<Users className="h-6 w-6" />} />
          <AdminNavButton label="إعدادات النظام" active={activeTab === "settings"} onClick={() => setActiveTab("settings")} icon={<Settings className="h-6 w-6" />} />
        </aside>

        {/* Dynamic Operational Content */}
        <main className="lg:col-span-3 space-y-10">
          {activeTab === "overview" && (
            <div className="grid md:grid-cols-3 gap-8">
              <StatCard label="إجمالي المستخدمين" value="2,840" icon={<Users className="text-blue-500" />} trend="+12%" />
              <StatCard label="إيرادات المركز" value="45,200 EGP" icon={<TrendingUp className="text-green-500" />} trend="+8%" />
              <StatCard label="استشارات فعالة" value="18" icon={<Activity className="text-orange-500" />} trend="LIVE" />
            </div>
          )}

          {activeTab === "specialties" && (
            <Card className="glass-cosmic border-none rounded-[3rem] overflow-hidden">
              <CardHeader className="p-10 border-b border-white/5 bg-white/5">
                <CardTitle className="text-3xl font-black">هندسة التخصصات</CardTitle>
                <CardDescription className="text-lg">تعديل التخصصات القانونية المتاحة في قاعدة بيانات المستشار.</CardDescription>
              </CardHeader>
              <CardContent className="p-10 space-y-8">
                <div className="flex gap-4 glass-cosmic p-6 rounded-[2rem] border-accent/10">
                  <Input 
                    placeholder="اسم التخصص القانوني الجديد" 
                    value={newSpec.name}
                    onChange={(e) => setNewSpec({...newSpec, name: e.target.value})}
                    className="bg-transparent border-none text-2xl h-16 text-right text-white placeholder:text-white/20"
                  />
                  <Button onClick={handleAddSpec} className="cosmic-gradient rounded-2xl px-10 h-16 font-black text-lg gap-2">
                    <Plus className="h-6 w-6" /> إضافة
                  </Button>
                </div>
                <div className="grid gap-4">
                  {specializations?.map((spec) => (
                    <div key={spec.id} className="p-8 glass-cosmic rounded-[2rem] flex justify-between items-center group hover:bg-white/10 transition-all border-white/5">
                      <div className="flex gap-3">
                        <Button variant="ghost" size="icon" className="h-12 w-12 text-red-500 hover:bg-red-500/20 rounded-xl" onClick={() => handleDeleteSpec(spec.id)}>
                          <Trash2 className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-12 w-12 text-blue-500 hover:bg-blue-500/20 rounded-xl">
                          <Edit2 className="h-5 w-5" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <h4 className="font-black text-2xl text-white">{spec.name}</h4>
                        <p className="text-sm opacity-60 text-white/70">{spec.description || "لا يوجد وصف فني متاح"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "payments" && (
            <Card className="glass-cosmic border-none rounded-[3rem] p-10">
              <CardHeader className="mb-6">
                <CardTitle className="text-3xl font-black">مراجعة المدفوعات</CardTitle>
              </CardHeader>
              <div className="space-y-6">
                {[1, 2].map((i) => (
                  <div key={i} className="p-8 glass-cosmic rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-8 hover:border-accent/20 transition-all">
                    <div className="flex gap-4">
                      <Button className="bg-green-600 hover:bg-green-700 rounded-2xl h-14 px-8 font-black">تأكيد العملية</Button>
                      <Button variant="outline" className="text-red-500 border-red-500/20 h-14 px-8 rounded-2xl">رفض</Button>
                    </div>
                    <div className="text-right">
                      <h4 className="font-black text-2xl">مستخدم {i === 1 ? "أحمد علي" : "سارة محمود"}</h4>
                      <p className="text-lg font-bold text-accent">750 EGP - فودافون كاش</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, trend }: any) {
  return (
    <Card className="glass-cosmic border-none rounded-[2.5rem] p-8 flex items-center justify-between relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-24 h-24 bg-white/5 translate-x-[-20%] translate-y-[-20%] rounded-full group-hover:scale-150 transition-transform" />
      <div className="h-20 w-20 glass-cosmic rounded-3xl flex items-center justify-center text-4xl shadow-2xl relative z-10">
        {icon}
      </div>
      <div className="text-right relative z-10">
        <div className="flex items-center gap-2 justify-end mb-1">
           <Badge className="bg-green-500/20 text-green-500 border-none text-[10px]">{trend}</Badge>
           <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">{label}</p>
        </div>
        <p className="text-4xl font-black text-white">{value}</p>
      </div>
    </Card>
  );
}

function AdminNavButton({ label, active, onClick, icon, count }: any) {
  return (
    <Button 
      variant={active ? "default" : "ghost"} 
      className={`w-full justify-end gap-6 h-20 rounded-[2rem] transition-all duration-500 ${
        active 
        ? 'cosmic-gradient shadow-[0_10px_30px_rgba(255,107,0,0.3)] scale-105' 
        : 'hover:bg-white/5 text-white/70'
      }`}
      onClick={onClick}
    >
      {count && <Badge className="bg-white/20 text-white ml-auto font-black">{count}</Badge>}
      <span className="font-black text-xl">{label}</span>
      <div className={active ? 'text-white' : 'text-accent'}>{icon}</div>
    </Button>
  );
}
