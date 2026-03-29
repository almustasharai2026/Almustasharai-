
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
  CreditCard,
  Scale,
  Plus,
  Trash2,
  Lock,
  Database,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  Activity,
  Loader2,
  Image as ImageIcon
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { collection, deleteDoc, doc, addDoc, updateDoc, increment, query, orderBy } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useMemoFirebase } from "@/firebase/provider";

export default function AdminDashboard() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const isAdmin = user?.email === "bishoysamy390@gmail.com";

  const specQuery = useMemoFirebase(() => collection(db!, "specializations"), [db]);
  const { data: specializations } = useCollection(specQuery);

  const usersQuery = useMemoFirebase(() => collection(db!, "users"), [db]);
  const { data: allUsers } = useCollection(usersQuery);

  const paymentQuery = useMemoFirebase(() => query(collection(db!, "paymentRequests"), orderBy("createdAt", "desc")), [db]);
  const { data: paymentRequests, isLoading: isPaymentsLoading } = useCollection(paymentQuery);

  const [newSpec, setNewSpec] = useState({ name: "", description: "" });
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

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
      toast({ title: "تمت الإضافة", description: "تم إضافة التخصص القانوني الجديد بنجاح." });
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ", description: "فشل في الإضافة." });
    }
  };

  const handleDeleteSpec = async (id: string) => {
    try {
      await deleteDoc(doc(db!, "specializations", id));
      toast({ title: "تم الحذف", description: "تم إزالة التخصص بنجاح." });
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ", description: "فشل في الحذف." });
    }
  };

  const handleApproveCredit = async (requestId: string, userId: string, amount: number) => {
    setIsProcessing(requestId);
    try {
      // 1. تحديث رصيد المستخدم
      await updateDoc(doc(db!, "users", userId), {
        balance: increment(amount)
      });
      // 2. تحديث حالة الطلب
      await updateDoc(doc(db!, "paymentRequests", requestId), {
        status: "approved",
        approvedAt: new Date().toISOString()
      });
      toast({ title: "تم القبول", description: `تم إضافة ${amount} جنيه إلى رصيد المستخدم بنجاح.` });
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ", description: "فشل في تحديث الرصيد." });
    } finally {
      setIsProcessing(null);
    }
  };

  const handleRejectCredit = async (requestId: string) => {
    setIsProcessing(requestId);
    try {
      await updateDoc(doc(db!, "paymentRequests", requestId), {
        status: "rejected",
        rejectedAt: new Date().toISOString()
      });
      toast({ title: "تم الرفض", description: "تم رفض طلب الشحن بنجاح." });
    } catch (e) {
      toast({ variant: "destructive", title: "خطأ", description: "فشل في تحديث الطلب." });
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl" dir="rtl">
      <header className="glass-cosmic p-10 rounded-[3rem] flex flex-col md:flex-row justify-between items-center gap-8 mb-12 border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -z-10" />
        <div className="text-right">
          <div className="flex items-center gap-3 justify-end mb-3">
            <Badge className="bg-primary/20 text-primary border-primary/30 px-4 py-1 rounded-full text-xs font-bold">السيادة الكاملة</Badge>
            <h1 className="text-4xl font-black text-white flex items-center gap-4">
               غرفة العمليات المركزية
               <Lock className="h-10 w-10 text-primary" />
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">أهلاً بك يا سيد بيشوي سامي. كل السلطات مفعلة لك.</p>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" className="rounded-2xl glass h-14 px-6 gap-3 border-white/10" onClick={() => toast({ title: "النسخ الاحتياطي", description: "جاري تجهيز نسخة من قاعدة البيانات..." })}>
              <Database className="h-5 w-5" /> النسخ الاحتياطي
           </Button>
           <Button className="cosmic-gradient rounded-2xl px-10 h-14 font-bold">تصدير التقارير</Button>
        </div>
      </header>

      <Tabs defaultValue="overview" className="space-y-10">
        <TabsList className="glass p-2 rounded-3xl w-full md:w-auto flex border-white/5 gap-2">
          <TabsTrigger value="overview" className="rounded-2xl px-10 py-4 data-[state=active]:bg-primary transition-all">
            <BarChart3 className="h-5 w-5 ml-2" /> إحصائيات حية
          </TabsTrigger>
          <TabsTrigger value="specialties" className="rounded-2xl px-10 py-4 data-[state=active]:bg-primary transition-all">
            <Scale className="h-5 w-5 ml-2" /> التخصصات
          </TabsTrigger>
          <TabsTrigger value="payments" className="rounded-2xl px-10 py-4 data-[state=active]:bg-primary transition-all">
            <CreditCard className="h-5 w-5 ml-2" /> طلبات الشحن
          </TabsTrigger>
          <TabsTrigger value="users" className="rounded-2xl px-10 py-4 data-[state=active]:bg-primary transition-all">
            <Users className="h-5 w-5 ml-2" /> المستخدمين
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-10 animate-in fade-in duration-700">
          <div className="grid md:grid-cols-4 gap-6">
            <StatCard label="المشتركين" value={allUsers?.length || "0"} icon={<Users className="text-indigo-400" />} trend="+12%" />
            <StatCard label="إيرادات اليوم" value="8,400 EGP" icon={<TrendingUp className="text-emerald-400" />} trend="+24%" />
            <StatCard label="الجلسات النشطة" value="5" icon={<Activity className="text-cyan-400" />} trend="بث مباشر" />
            <StatCard label="حالة النظام" value="مستقر" icon={<CheckCircle className="text-primary" />} trend="آمن" />
          </div>
        </TabsContent>

        <TabsContent value="specialties" className="space-y-8 animate-in slide-in-from-bottom-5 duration-700">
          <Card className="glass-card border-none rounded-[3rem] p-10">
            <div className="flex flex-col md:flex-row gap-4 mb-10">
              <Input 
                placeholder="اسم التخصص الجديد..." 
                value={newSpec.name}
                onChange={(e) => setNewSpec({...newSpec, name: e.target.value})}
                className="bg-transparent border-white/10 text-xl h-14 text-right rounded-2xl"
              />
              <Button onClick={handleAddSpec} className="cosmic-gradient rounded-2xl px-12 h-14 font-bold">
                إضافة التخصص
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {specializations?.map((spec) => (
                <div key={spec.id} className="p-8 glass rounded-[2rem] flex justify-between items-center group border-white/5 hover:border-primary/40 transition-all">
                  <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteSpec(spec.id)}>
                    <Trash2 className="h-6 w-6" />
                  </Button>
                  <div className="text-right">
                    <h4 className="font-bold text-2xl text-white">{spec.name}</h4>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="animate-in fade-in duration-700">
          <Card className="glass-card border-none rounded-[3rem] p-10">
            <div className="space-y-8">
              <h3 className="text-2xl font-black mb-6">مراجعة طلبات التمويل</h3>
              
              <div className="space-y-4">
                {paymentRequests?.filter(r => r.status === "pending").map((request) => (
                  <div key={request.id} className="p-8 glass rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-8 border-white/5">
                    <div className="flex gap-4">
                      <Button 
                        onClick={() => handleApproveCredit(request.id, request.userId, request.amount)} 
                        disabled={isProcessing === request.id}
                        className="bg-emerald-600 hover:bg-emerald-700 rounded-2xl px-10 h-14 font-bold"
                      >
                         {isProcessing === request.id ? <Loader2 className="h-5 w-5 animate-spin" /> : "قبول وشحن الرصيد"}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleRejectCredit(request.id)}
                        disabled={isProcessing === request.id}
                        className="text-red-500 border-red-500/20 rounded-2xl px-10 h-14 font-bold"
                      >
                         رفض الطلب
                      </Button>
                    </div>
                    <div className="text-right flex items-center gap-6">
                      <div>
                        <h4 className="font-black text-2xl text-white">{request.userName || "مستخدم غير معروف"}</h4>
                        <p className="text-primary font-black text-xl">{request.amount} EGP</p>
                        <p className="text-[10px] opacity-40">{new Date(request.createdAt).toLocaleString('ar-EG')}</p>
                      </div>
                      <div className="h-20 w-20 glass rounded-2xl flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
                         <ImageIcon className="h-8 w-8 opacity-40 text-primary" />
                      </div>
                    </div>
                  </div>
                ))}
                
                {paymentRequests?.filter(r => r.status === "pending").length === 0 && (
                  <div className="text-center py-20 opacity-30">
                    <CheckCircle className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-xl font-bold">لا توجد طلبات شحن معلقة حالياً.</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="animate-in fade-in duration-700">
           <Card className="glass-card border-none rounded-[3rem] p-10 overflow-hidden">
              <div className="relative overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="text-muted-foreground border-b border-white/5">
                      <th className="px-6 py-4">الاسم</th>
                      <th className="px-6 py-4">البريد</th>
                      <th className="px-6 py-4">الرصيد</th>
                      <th className="px-6 py-4">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers?.map((u) => (
                      <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="px-6 py-6 font-bold">{u.fullName}</td>
                        <td className="px-6 py-6 opacity-60">{u.email}</td>
                        <td className="px-6 py-6 text-primary font-black">{u.balance || 0} EGP</td>
                        <td className="px-6 py-6">
                          <Button variant="ghost" className="text-red-400" onClick={() => toast({ title: "تجميد الحساب", description: "سيتم تفعيل تجميد الحسابات في النسخة القادمة." })}>تجميد</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ label, value, icon, trend }: any) {
  return (
    <Card className="glass-card border-none rounded-[2rem] p-8 flex items-center justify-between group overflow-hidden">
      <div className="h-16 w-16 glass rounded-2xl flex items-center justify-center text-3xl transition-transform group-hover:scale-110">
        {icon}
      </div>
      <div className="text-right">
        <p className="text-xs text-muted-foreground font-black mb-1 opacity-60">{label}</p>
        <p className="text-3xl font-black text-white">{value}</p>
        <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[10px] mt-2">{trend}</Badge>
      </div>
    </Card>
  );
}
