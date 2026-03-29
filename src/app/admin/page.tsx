
"use client";

import { useUser, useFirestore, useCollection } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  TrendingUp, 
  ShieldCheck,
  CreditCard,
  Scale,
  Plus,
  Trash2,
  Settings,
  Activity,
  Lock,
  Database,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { collection, deleteDoc, doc, addDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useMemoFirebase } from "@/firebase/provider";

export default function AdminDashboard() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  // Admin access check
  const isAdmin = user?.email === "bishoysamy390@gmail.com";

  // Firestore Queries
  const specQuery = useMemoFirebase(() => collection(db!, "specializations"), [db]);
  const { data: specializations, isLoading: isSpecLoading } = useCollection(specQuery);

  const [newSpec, setNewSpec] = useState({ name: "", description: "" });

  if (!isUserLoading && !isAdmin) {
    router.push("/dashboard");
    return null;
  }

  const handleAddSpec = async () => {
    if (!newSpec.name) return;
    try {
      await addDoc(collection(db!, "specializations"), {
        ...newSpec,
        createdAt: new Date().toISOString()
      });
      setNewSpec({ name: "", description: "" });
      toast({ title: "تم الإضافة", description: "تم إضافة التخصص القانوني بنجاح." });
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ", description: "فشل التحديث." });
    }
  };

  const handleDeleteSpec = async (id: string) => {
    try {
      await deleteDoc(doc(db!, "specializations", id));
      toast({ title: "تم الحذف", description: "تم حذف التخصص بنجاح." });
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ", description: "فشل الحذف." });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl" dir="rtl">
      {/* Admin Header */}
      <header className="glass p-8 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-6 mb-12 border-primary/20">
        <div className="text-right">
          <div className="flex items-center gap-3 justify-end mb-2">
            <Badge className="bg-primary/20 text-primary border-primary/30">المشرف الأعلى</Badge>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
               غرفة العمليات المركزية
               <Lock className="h-8 w-8 text-primary" />
            </h1>
          </div>
          <p className="text-muted-foreground">أهلاً بيشوي سامي، تحكم كامل في كوكب المستشار.</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="rounded-xl glass gap-2 border-white/10">
              <Database className="h-4 w-4" /> النسخ الاحتياطي
           </Button>
           <Button className="btn-primary rounded-xl px-8">تصدير البيانات</Button>
        </div>
      </header>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="glass p-1 rounded-2xl w-full md:w-auto flex overflow-x-auto justify-start border-white/5">
          <TabsTrigger value="overview" className="rounded-xl px-8 py-3 data-[state=active]:bg-primary">
            <Activity className="h-4 w-4 ml-2" /> الإحصائيات
          </TabsTrigger>
          <TabsTrigger value="specialties" className="rounded-xl px-8 py-3 data-[state=active]:bg-primary">
            <Scale className="h-4 w-4 ml-2" /> التخصصات
          </TabsTrigger>
          <TabsTrigger value="payments" className="rounded-xl px-8 py-3 data-[state=active]:bg-primary">
            <CreditCard className="h-4 w-4 ml-2" /> المدفوعات
          </TabsTrigger>
          <TabsTrigger value="users" className="rounded-xl px-8 py-3 data-[state=active]:bg-primary">
            <Users className="h-4 w-4 ml-2" /> المستخدمين
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8 animate-in fade-in duration-500">
          <div className="grid md:grid-cols-3 gap-6">
            <StatCard label="إجمالي المستخدمين" value="3,152" icon={<Users className="text-blue-400" />} trend="+12%" />
            <StatCard label="إجمالي الإيرادات" value="62,800 EGP" icon={<TrendingUp className="text-emerald-400" />} trend="+25%" />
            <StatCard label="استشارات جارية" value="14" icon={<Activity className="text-cyan-400" />} trend="LIVE" />
          </div>
        </TabsContent>

        <TabsContent value="specialties" className="space-y-8 animate-in fade-in duration-500">
          <Card className="glass-card border-none rounded-[2rem]">
            <CardHeader className="p-8">
              <CardTitle className="text-2xl font-bold">إدارة التخصصات</CardTitle>
              <CardDescription>أضف أو عدل التخصصات القانونية المتاحة في المنصة.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-8">
              <div className="flex flex-col md:flex-row gap-4 glass p-4 rounded-2xl border-primary/10">
                <Input 
                  placeholder="اسم التخصص الجديد..." 
                  value={newSpec.name}
                  onChange={(e) => setNewSpec({...newSpec, name: e.target.value})}
                  className="bg-transparent border-white/10 text-lg h-12 text-right"
                />
                <Button onClick={handleAddSpec} className="btn-primary rounded-xl px-10 h-12">
                  <Plus className="h-5 w-5 ml-2" /> إضافة
                </Button>
              </div>
              
              <div className="grid gap-4">
                {isSpecLoading ? (
                  <div className="text-center py-10 opacity-50">جاري التحميل...</div>
                ) : (
                  specializations?.map((spec) => (
                    <div key={spec.id} className="p-6 glass rounded-2xl flex justify-between items-center hover:bg-white/5 transition-all">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-500/10" onClick={() => handleDeleteSpec(spec.id)}>
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <h4 className="font-bold text-xl text-white">{spec.name}</h4>
                        <p className="text-sm opacity-50">{spec.description || "لا يوجد وصف حالي"}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="animate-in fade-in duration-500">
          <Card className="glass-card border-none rounded-[2rem] p-8">
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 glass rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 border-white/5">
                  <div className="flex gap-3">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-xl px-6">
                       <CheckCircle className="h-4 w-4 ml-2" /> قبول
                    </Button>
                    <Button variant="outline" className="text-red-500 border-red-500/20 hover:bg-red-500/10 rounded-xl px-6">
                       <XCircle className="h-4 w-4 ml-2" /> رفض
                    </Button>
                  </div>
                  <div className="text-right">
                    <h4 className="font-bold text-lg text-white">{i === 1 ? "بيشوي سامي" : "أحمد محمود"}</h4>
                    <p className="text-primary font-bold">{i * 500} EGP</p>
                    <p className="text-xs opacity-40">01130031531 - محفظة إلكترونية</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ label, value, icon, trend }: any) {
  return (
    <Card className="glass-card border-none rounded-3xl p-8 flex items-center justify-between relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full" />
      <div className="h-16 w-16 glass rounded-2xl flex items-center justify-center text-3xl shadow-lg border-white/5 bg-white/5 relative z-10">
        {icon}
      </div>
      <div className="text-right relative z-10">
        <p className="text-xs text-muted-foreground font-bold uppercase mb-1">{label}</p>
        <p className="text-3xl font-black text-white">{value}</p>
        <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[10px] mt-2">{trend}</Badge>
      </div>
    </Card>
  );
}
