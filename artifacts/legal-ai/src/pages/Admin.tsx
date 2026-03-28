import { useState } from "react";
import { useLocation } from "wouter";
import { useAppAdminStats, useAppAdminUsers, useAppAdminChargeUser, useAppGetMe } from "@/hooks/use-app-api";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, MessageSquare, ArrowRightLeft, ShieldAlert, ArrowRight, Wallet, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UserInfo } from "@workspace/api-client-react";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: currentUser, isLoading: isMeLoading } = useAppGetMe();
  
  const { data: stats, isLoading: statsLoading } = useAppAdminStats();
  const { data: usersData, isLoading: usersLoading } = useAppAdminUsers();
  const { mutate: chargeUser, isPending: isCharging } = useAppAdminChargeUser();

  const [chargeDialog, setChargeDialog] = useState<{ open: boolean; user: UserInfo | null }>({ open: false, user: null });
  const [chargeAmount, setChargeAmount] = useState("");

  if (isMeLoading) return null;

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground space-y-4">
        <ShieldAlert className="w-16 h-16 text-destructive" />
        <h1 className="text-2xl font-bold">غير مصرح لك بالدخول</h1>
        <Button onClick={() => setLocation("/")} variant="outline">العودة للرئيسية</Button>
      </div>
    );
  }

  const handleChargeSubmit = () => {
    if (!chargeDialog.user || !chargeAmount) return;
    
    chargeUser({ data: { user_id: chargeDialog.user.id, amount: Number(chargeAmount) } }, {
      onSuccess: (res) => {
        toast({ title: "تم شحن الرصيد بنجاح", description: res.message });
        setChargeDialog({ open: false, user: null });
        setChargeAmount("");
      },
      onError: (err) => {
        toast({ title: "خطأ", description: err.message, variant: "destructive" });
      }
    });
  };

  const statCards = [
    { title: "إجمالي المستخدمين", value: stats?.total_users || 0, icon: <Users className="w-6 h-6 text-blue-500" />, bg: "bg-blue-500/10 border-blue-500/20" },
    { title: "إجمالي الأرصدة", value: stats?.total_balance || 0, icon: <CreditCard className="w-6 h-6 text-green-500" />, bg: "bg-green-500/10 border-green-500/20" },
    { title: "المحادثات", value: stats?.total_conversations || 0, icon: <MessageSquare className="w-6 h-6 text-purple-500" />, bg: "bg-purple-500/10 border-purple-500/20" },
    { title: "المعاملات", value: stats?.total_transactions || 0, icon: <ArrowRightLeft className="w-6 h-6 text-orange-500" />, bg: "bg-orange-500/10 border-orange-500/20" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">لوحة التحكم</h1>
            <p className="text-muted-foreground mt-1">نظرة عامة على أداء المنصة والمستخدمين</p>
          </div>
          <Button variant="outline" className="gap-2 border-border" onClick={() => setLocation("/")}>
            العودة للمنصة
            <ArrowRight className="w-4 h-4 rtl:-scale-x-100" />
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsLoading ? (
            Array(4).fill(0).map((_, i) => (
              <Card key={i} className="bg-card border-border animate-pulse h-32"></Card>
            ))
          ) : (
            statCards.map((stat, i) => (
              <Card key={i} className={`bg-card border shadow-lg ${stat.bg}`}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <div className="p-2 rounded-lg bg-background/50 backdrop-blur-sm shadow-sm">{stat.icon}</div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold font-mono text-foreground">{stat.value}</div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Users Table */}
        <Card className="bg-card border-border shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold">المستخدمين</CardTitle>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : (
              <div className="rounded-xl border border-border overflow-hidden">
                <Table>
                  <TableHeader className="bg-secondary/50">
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-right">الاسم</TableHead>
                      <TableHead className="text-right">البريد</TableHead>
                      <TableHead className="text-right">الهاتف</TableHead>
                      <TableHead className="text-right">تاريخ التسجيل</TableHead>
                      <TableHead className="text-right">الرصيد</TableHead>
                      <TableHead className="text-right">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersData?.users.map((user) => (
                      <TableRow key={user.id} className="border-border hover:bg-secondary/20 transition-colors">
                        <TableCell className="font-semibold">{user.name}</TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell dir="ltr" className="text-right font-mono text-muted-foreground">{user.phone}</TableCell>
                        <TableCell className="text-muted-foreground">{format(new Date(user.created_at), 'yyyy/MM/dd')}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${user.balance > 0 ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>
                            {user.balance}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/20 gap-2"
                            onClick={() => setChargeDialog({ open: true, user })}
                          >
                            <Wallet className="w-4 h-4" />
                            شحن
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {usersData?.users.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center p-8 text-muted-foreground">لا يوجد مستخدمين بعد</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Charge Dialog */}
      <Dialog open={chargeDialog.open} onOpenChange={(v) => !v && setChargeDialog({ open: false, user: null })}>
        <DialogContent className="sm:max-w-md bg-card border-border shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">شحن رصيد</DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="p-4 bg-secondary rounded-xl border border-border">
              <div className="text-sm text-muted-foreground mb-1">المستخدم:</div>
              <div className="font-bold text-lg text-foreground">{chargeDialog.user?.name}</div>
              <div className="text-sm font-mono text-primary mt-2">الرصيد الحالي: {chargeDialog.user?.balance}</div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">قيمة الشحن (نقاط)</label>
              <Input 
                type="number" 
                min="1"
                value={chargeAmount} 
                onChange={(e) => setChargeAmount(e.target.value)}
                placeholder="أدخل عدد النقاط"
                className="bg-background text-lg py-6"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" className="border-border" onClick={() => setChargeDialog({ open: false, user: null })}>إلغاء</Button>
            <Button onClick={handleChargeSubmit} disabled={!chargeAmount || isCharging} className="bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20">
              {isCharging ? <Loader2 className="w-4 h-4 animate-spin" /> : "تأكيد الشحن"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
