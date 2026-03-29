import { useState } from "react";
import { useLocation } from "wouter";
import { useAppAdminStats, useAppAdminUsers, useAppAdminChargeUser, useAppGetMe } from "@/hooks/use-app-api";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users, CreditCard, MessageSquare, ArrowRightLeft, ShieldAlert,
  ArrowRight, Wallet, Loader2, CheckCircle2, XCircle, Clock, Package,
  TrendingUp, Bell
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UserInfo } from "@workspace/api-client-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getToken } from "@/lib/auth";

type Tab = "overview" | "users" | "charges";

interface ChargeRequest {
  id: number;
  user_id: number;
  user_name: string;
  user_phone: string;
  package_name: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  note: string | null;
  created_at: string;
}

function useChargeRequests() {
  return useQuery({
    queryKey: ["charge-requests"],
    queryFn: async () => {
      const token = getToken();
      const res = await fetch("/api/admin/charge-requests", { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("فشل جلب الطلبات");
      return res.json() as Promise<{ requests: ChargeRequest[] }>;
    },
    refetchInterval: 15000,
  });
}

function useApproveRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const token = getToken();
      const res = await fetch(`/api/admin/charge-requests/${id}/approve`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? "خطأ"); }
      return res.json();
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["charge-requests"] }); qc.invalidateQueries({ queryKey: ["admin-users"] }); qc.invalidateQueries({ queryKey: ["admin-stats"] }); },
  });
}

function useRejectRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const token = getToken();
      const res = await fetch(`/api/admin/charge-requests/${id}/reject`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? "خطأ"); }
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["charge-requests"] }),
  });
}

const STATUS_MAP = {
  pending: { label: "بانتظار الموافقة", color: "bg-amber-500/10 text-amber-500 border-amber-500/20", icon: <Clock className="w-3 h-3" /> },
  approved: { label: "تمت الموافقة", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", icon: <CheckCircle2 className="w-3 h-3" /> },
  rejected: { label: "مرفوض", color: "bg-destructive/10 text-destructive border-destructive/20", icon: <XCircle className="w-3 h-3" /> },
};

export default function Admin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: currentUser, isLoading: isMeLoading } = useAppGetMe();
  const { data: stats, isLoading: statsLoading } = useAppAdminStats();
  const { data: usersData, isLoading: usersLoading } = useAppAdminUsers();
  const { mutate: chargeUser, isPending: isCharging } = useAppAdminChargeUser();
  const { data: chargeData, isLoading: chargesLoading } = useChargeRequests();
  const { mutate: approveRequest, isPending: isApproving } = useApproveRequest();
  const { mutate: rejectRequest, isPending: isRejecting } = useRejectRequest();

  const [tab, setTab] = useState<Tab>("overview");
  const [chargeDialog, setChargeDialog] = useState<{ open: boolean; user: UserInfo | null }>({ open: false, user: null });
  const [chargeAmount, setChargeAmount] = useState("");
  const [quickAmounts] = useState([25, 50, 100, 200, 500]);

  if (isMeLoading) return (
    <div className="h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  if (!currentUser || currentUser.role !== "admin") {
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
        toast({ title: "✅ تم شحن الرصيد", description: res.message });
        setChargeDialog({ open: false, user: null });
        setChargeAmount("");
      },
      onError: (err) => toast({ title: "خطأ", description: err.message, variant: "destructive" }),
    });
  };

  const pendingCount = chargeData?.requests.filter(r => r.status === "pending").length ?? 0;

  const TABS = [
    { id: "overview" as Tab, label: "نظرة عامة", icon: <TrendingUp className="w-4 h-4" /> },
    { id: "users" as Tab, label: "المستخدمون", icon: <Users className="w-4 h-4" /> },
    {
      id: "charges" as Tab, label: "طلبات الشحن", icon: <Bell className="w-4 h-4" />,
      badge: pendingCount > 0 ? pendingCount : null,
    },
  ];

  const statCards = [
    { title: "إجمالي المستخدمين", value: stats?.total_users ?? 0, icon: <Users className="w-5 h-5" />, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20" },
    { title: "إجمالي الأرصدة", value: stats?.total_balance ?? 0, icon: <CreditCard className="w-5 h-5" />, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { title: "المحادثات", value: stats?.total_conversations ?? 0, icon: <MessageSquare className="w-5 h-5" />, color: "text-violet-500", bg: "bg-violet-500/10 border-violet-500/20" },
    { title: "المعاملات", value: stats?.total_transactions ?? 0, icon: <ArrowRightLeft className="w-5 h-5" />, color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20" },
    { title: "طلبات معلقة", value: pendingCount, icon: <Clock className="w-5 h-5" />, color: "text-orange-500", bg: "bg-orange-500/10 border-orange-500/20" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      {/* Top Bar */}
      <div className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-display font-bold">لوحة التحكم</h1>
            <p className="text-xs text-muted-foreground">مرحباً {currentUser.name} - صلاحيات المشرف</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setLocation("/")}>
            العودة للمنصة
            <ArrowRight className="w-4 h-4 rtl:-scale-x-100" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-6 flex gap-1 pb-0">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all relative ${
                tab === t.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.icon}
              {t.label}
              {t.badge && (
                <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* Overview Tab */}
        {tab === "overview" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {statsLoading
                ? Array(5).fill(0).map((_, i) => <Card key={i} className="animate-pulse h-28 bg-card" />)
                : statCards.map((s, i) => (
                  <Card key={i} className={`bg-card border ${s.bg} shadow-sm`}>
                    <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
                      <CardTitle className="text-xs font-medium text-muted-foreground">{s.title}</CardTitle>
                      <div className={s.color}>{s.icon}</div>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className={`text-3xl font-bold font-mono ${s.color}`}>{s.value.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                ))
              }
            </div>

            {/* Recent charge requests preview */}
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base font-bold">آخر طلبات الشحن</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setTab("charges")} className="text-primary text-xs">
                  عرض الكل
                </Button>
              </CardHeader>
              <CardContent>
                {chargesLoading
                  ? <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                  : chargeData?.requests.slice(0, 5).map(r => {
                    const st = STATUS_MAP[r.status];
                    return (
                      <div key={r.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                        <div>
                          <div className="font-semibold text-sm">{r.user_name}</div>
                          <div className="text-xs text-muted-foreground">{r.package_name} · {r.amount} نقطة</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full border ${st.color}`}>
                            {st.icon}{st.label}
                          </div>
                          <span className="text-[10px] text-muted-foreground">{format(new Date(r.created_at), "MM/dd HH:mm")}</span>
                        </div>
                      </div>
                    );
                  })
                }
                {chargeData?.requests.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">لا توجد طلبات بعد</div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Users Tab */}
        {tab === "users" && (
          <Card className="bg-card border-border shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                جميع المستخدمين ({usersData?.users.length ?? 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {usersLoading
                ? <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                : (
                  <div className="rounded-xl border border-border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-secondary/50">
                        <TableRow className="border-border hover:bg-transparent">
                          <TableHead className="text-right">المستخدم</TableHead>
                          <TableHead className="text-right">الهاتف</TableHead>
                          <TableHead className="text-right">تاريخ التسجيل</TableHead>
                          <TableHead className="text-right">الرصيد</TableHead>
                          <TableHead className="text-right">شحن يدوي</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {usersData?.users.map(user => (
                          <TableRow key={user.id} className="border-border hover:bg-secondary/20 transition-colors">
                            <TableCell>
                              <div>
                                <div className="font-semibold">{user.name}</div>
                                <div className="text-xs text-muted-foreground">{user.email}</div>
                              </div>
                            </TableCell>
                            <TableCell dir="ltr" className="text-right font-mono text-sm text-muted-foreground">{user.phone}</TableCell>
                            <TableCell className="text-muted-foreground text-sm">{format(new Date(user.created_at), "yyyy/MM/dd")}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold font-mono border ${user.balance > 0 ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-destructive/10 text-destructive border-destructive/20"}`}>
                                {user.balance}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground text-xs"
                                onClick={() => setChargeDialog({ open: true, user })}
                              >
                                <Wallet className="w-3.5 h-3.5" />
                                شحن
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        {usersData?.users.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">لا يوجد مستخدمون بعد</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
            </CardContent>
          </Card>
        )}

        {/* Charge Requests Tab */}
        {tab === "charges" && (
          <div className="space-y-4">
            {/* Pending banner */}
            {pendingCount > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl px-5 py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-amber-500 animate-bounce" />
                </div>
                <div>
                  <div className="font-bold text-amber-600">يوجد {pendingCount} طلب شحن بانتظار موافقتك</div>
                  <div className="text-xs text-amber-600/70 mt-0.5">راجع الطلبات أدناه واتخذ الإجراء المناسب</div>
                </div>
              </div>
            )}

            <Card className="bg-card border-border shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  طلبات الشحن ({chargeData?.requests.length ?? 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {chargesLoading
                  ? <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                  : (
                    <div className="space-y-3">
                      {chargeData?.requests.map(r => {
                        const st = STATUS_MAP[r.status];
                        const isPending = r.status === "pending";
                        return (
                          <div key={r.id} className={`rounded-2xl border p-4 transition-all ${isPending ? "border-amber-500/30 bg-amber-500/5" : "border-border bg-secondary/20"}`}>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${isPending ? "bg-amber-500/20 text-amber-600" : "bg-secondary text-muted-foreground"}`}>
                                  #{r.id}
                                </div>
                                <div>
                                  <div className="font-bold">{r.user_name}</div>
                                  <div className="text-xs text-muted-foreground mt-0.5" dir="ltr">{r.user_phone}</div>
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">{r.package_name}</span>
                                    <span className="text-sm font-mono font-bold text-foreground">{r.amount} نقطة</span>
                                  </div>
                                  {r.note && <div className="text-xs text-muted-foreground mt-1 italic">"{r.note}"</div>}
                                  <div className="text-[10px] text-muted-foreground mt-1">
                                    {format(new Date(r.created_at), "yyyy/MM/dd - HH:mm")}
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                <div className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border ${st.color}`}>
                                  {st.icon}{st.label}
                                </div>

                                {isPending && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-destructive/30 text-destructive hover:bg-destructive hover:text-white text-xs gap-1"
                                      onClick={() => rejectRequest(r.id, {
                                        onSuccess: () => toast({ title: "تم رفض الطلب" }),
                                        onError: (e) => toast({ title: e.message, variant: "destructive" }),
                                      })}
                                      disabled={isRejecting}
                                    >
                                      <XCircle className="w-3.5 h-3.5" />
                                      رفض
                                    </Button>
                                    <Button
                                      size="sm"
                                      className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs gap-1 shadow-lg shadow-emerald-500/20"
                                      onClick={() => approveRequest(r.id, {
                                        onSuccess: (res) => toast({ title: "✅ تمت الموافقة", description: res.message }),
                                        onError: (e) => toast({ title: e.message, variant: "destructive" }),
                                      })}
                                      disabled={isApproving}
                                    >
                                      {isApproving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                      موافقة وشحن
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {chargeData?.requests.length === 0 && (
                        <div className="text-center py-16 text-muted-foreground">
                          <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                          <div>لا توجد طلبات شحن بعد</div>
                        </div>
                      )}
                    </div>
                  )}
              </CardContent>
            </Card>
          </div>
        )}

      </div>

      {/* Manual Charge Dialog */}
      <Dialog open={chargeDialog.open} onOpenChange={(v) => !v && setChargeDialog({ open: false, user: null })}>
        <DialogContent className="sm:max-w-md bg-card border-border shadow-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">شحن رصيد يدوي</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 bg-secondary rounded-xl border border-border">
              <div className="text-xs text-muted-foreground">المستخدم</div>
              <div className="font-bold text-lg mt-0.5">{chargeDialog.user?.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{chargeDialog.user?.email}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-muted-foreground">الرصيد الحالي:</span>
                <span className="font-mono font-bold text-primary">{chargeDialog.user?.balance} نقطة</span>
              </div>
            </div>

            {/* Quick amounts */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">اختر مبلغاً سريعاً</label>
              <div className="flex flex-wrap gap-2">
                {quickAmounts.map(amt => (
                  <button
                    key={amt}
                    onClick={() => setChargeAmount(String(amt))}
                    className={`px-3 py-1.5 rounded-xl text-sm font-bold border transition-all ${chargeAmount === String(amt) ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/50 hover:bg-primary/10"}`}
                  >
                    {amt}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">أو أدخل قيمة مخصصة (نقاط)</label>
              <Input
                type="number"
                min="1"
                value={chargeAmount}
                onChange={(e) => setChargeAmount(e.target.value)}
                placeholder="مثال: 100"
                className="bg-background text-lg py-5 font-mono"
              />
            </div>

            {chargeAmount && Number(chargeAmount) > 0 && (
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-sm text-center">
                سيصبح الرصيد: <span className="font-bold font-mono text-primary">{(chargeDialog.user?.balance ?? 0) + Number(chargeAmount)} نقطة</span>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setChargeDialog({ open: false, user: null })}>إلغاء</Button>
            <Button
              onClick={handleChargeSubmit}
              disabled={!chargeAmount || Number(chargeAmount) <= 0 || isCharging}
              className="bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 gap-2"
            >
              {isCharging ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Wallet className="w-4 h-4" /> تأكيد الشحن</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
