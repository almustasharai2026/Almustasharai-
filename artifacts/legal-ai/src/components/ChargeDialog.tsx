import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getToken } from "@/lib/auth";
import { Loader2, MessageCircle, CheckCircle2, Sparkles, Zap, Crown, Star } from "lucide-react";

const PACKAGES = [
  {
    id: "starter",
    name: "باقة البداية",
    points: 50,
    price: "25 جنيه",
    icon: <Zap className="w-5 h-5" />,
    color: "from-emerald-500 to-emerald-700",
    border: "border-emerald-500/30",
    bg: "hover:bg-emerald-500/10",
    popular: false,
    perPoint: "0.5 ج/نقطة",
  },
  {
    id: "professional",
    name: "الباقة الاحترافية",
    points: 150,
    price: "60 جنيه",
    icon: <Star className="w-5 h-5" />,
    color: "from-primary to-primary/70",
    border: "border-primary/50",
    bg: "hover:bg-primary/10",
    popular: true,
    perPoint: "0.4 ج/نقطة",
  },
  {
    id: "elite",
    name: "الباقة المميزة",
    points: 400,
    price: "120 جنيه",
    icon: <Crown className="w-5 h-5" />,
    color: "from-violet-500 to-violet-700",
    border: "border-violet-500/30",
    bg: "hover:bg-violet-500/10",
    popular: false,
    perPoint: "0.3 ج/نقطة",
  },
  {
    id: "unlimited",
    name: "باقة المكتب",
    points: 1000,
    price: "250 جنيه",
    icon: <Sparkles className="w-5 h-5" />,
    color: "from-amber-500 to-amber-700",
    border: "border-amber-500/30",
    bg: "hover:bg-amber-500/10",
    popular: false,
    perPoint: "0.25 ج/نقطة",
  },
];

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  userName: string;
  userPhone: string;
  currentBalance: number;
}

type Step = "select" | "confirm" | "done";

export function ChargeDialog({ open, onOpenChange, userName, userPhone, currentBalance }: Props) {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("select");
  const [selected, setSelected] = useState(PACKAGES[1]);
  const [isLoading, setIsLoading] = useState(false);
  const [requestId, setRequestId] = useState<number | null>(null);

  const reset = () => { setStep("select"); setSelected(PACKAGES[1]); setRequestId(null); };

  const handleClose = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      const res = await fetch("/api/charge-request", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ package_name: selected.name, amount: selected.points }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "خطأ");
      setRequestId(data.request_id);
      setStep("confirm");
    } catch {
      toast({ title: "حدث خطأ، حاول مجدداً", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent(
      `🔔 طلب شحن رصيد - المستشار AI\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `👤 الاسم: ${userName}\n` +
      `📱 الهاتف: ${userPhone}\n` +
      `📦 الباقة: ${selected.name}\n` +
      `💰 النقاط: ${selected.points} نقطة\n` +
      `💵 السعر: ${selected.price}\n` +
      `🆔 رقم الطلب: #${requestId}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `يرجى تأكيد الدفع وإضافة النقاط لحسابي.`
    );
    window.open(`https://wa.me/+201000000000?text=${text}`, "_blank");
    setStep("done");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border shadow-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-right">
            {step === "select" && "اختر باقة الشحن"}
            {step === "confirm" && "تأكيد الطلب"}
            {step === "done" && "تم إرسال الطلب! 🎉"}
          </DialogTitle>
        </DialogHeader>

        {/* Step 1: Select Package */}
        {step === "select" && (
          <div className="space-y-4 mt-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 rounded-xl px-3 py-2.5">
              <span>رصيدك الحالي:</span>
              <span className="font-bold text-primary font-mono">{currentBalance} نقطة</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {PACKAGES.map(pkg => (
                <button
                  key={pkg.id}
                  onClick={() => setSelected(pkg)}
                  className={`relative text-right p-4 rounded-2xl border-2 transition-all ${
                    selected.id === pkg.id
                      ? `${pkg.border} bg-gradient-to-br ${pkg.color} bg-opacity-10 shadow-lg scale-[1.02]`
                      : `border-border ${pkg.bg}`
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                      الأكثر طلباً
                    </div>
                  )}
                  <div className={`inline-flex p-2 rounded-xl bg-gradient-to-br ${pkg.color} text-white mb-3`}>
                    {pkg.icon}
                  </div>
                  <div className="font-bold text-sm text-foreground">{pkg.name}</div>
                  <div className="text-2xl font-black font-mono text-primary mt-1">{pkg.points}</div>
                  <div className="text-xs text-muted-foreground">نقطة</div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-bold text-foreground">{pkg.price}</span>
                    <span className="text-[10px] text-muted-foreground">{pkg.perPoint}</span>
                  </div>
                  {selected.id === pkg.id && (
                    <CheckCircle2 className="absolute top-3 left-3 w-4 h-4 text-primary" />
                  )}
                </button>
              ))}
            </div>

            <div className="bg-secondary/30 rounded-xl p-3 text-xs text-muted-foreground space-y-1">
              <div className="font-semibold text-foreground">📌 ملاحظة:</div>
              <div>• كل رسالة تستهلك نقطة واحدة</div>
              <div>• النقاط لا تنتهي صلاحيتها</div>
              <div>• الدفع عبر واتساب - تحويل أو فودافون كاش</div>
            </div>

            <Button
              className="w-full py-6 text-base font-bold gap-2"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>المتابعة - {selected.points} نقطة بـ {selected.price}</>}
            </Button>
          </div>
        )}

        {/* Step 2: Confirm via WhatsApp */}
        {step === "confirm" && (
          <div className="space-y-5 mt-2">
            <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-2xl p-5 text-center">
              <div className="text-4xl mb-3">✅</div>
              <div className="font-bold text-foreground text-lg">تم تسجيل طلبك</div>
              <div className="text-sm text-muted-foreground mt-1">رقم الطلب: <span className="font-mono text-primary font-bold">#{requestId}</span></div>
            </div>

            <div className="space-y-2.5 text-sm">
              {[
                { label: "الباقة المختارة", value: selected.name },
                { label: "عدد النقاط", value: `${selected.points} نقطة` },
                { label: "المبلغ المطلوب", value: selected.price },
                { label: "الرصيد بعد الشحن", value: `${currentBalance + selected.points} نقطة` },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center px-4 py-2.5 bg-secondary/50 rounded-xl">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-bold text-foreground">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-600">
              ⚠️ الخطوة التالية: أرسل رسالة لمدير المنصة عبر واتساب لإتمام الدفع وإضافة النقاط
            </div>

            <Button
              onClick={openWhatsApp}
              className="w-full py-6 text-base font-bold gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg shadow-[#25D366]/25"
            >
              <MessageCircle className="w-5 h-5" />
              التواصل مع المدير عبر واتساب
            </Button>
          </div>
        )}

        {/* Step 3: Done */}
        {step === "done" && (
          <div className="space-y-5 mt-2 text-center">
            <div className="text-6xl py-4">🚀</div>
            <div>
              <div className="text-xl font-bold text-foreground">تم إرسال طلبك بنجاح!</div>
              <div className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto leading-relaxed">
                سيقوم المدير بمراجعة الطلب وإضافة النقاط لحسابك خلال دقائق بعد تأكيد الدفع.
              </div>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">رقم الطلب</span>
                <span className="font-mono font-bold text-primary">#{requestId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">النقاط المطلوبة</span>
                <span className="font-bold">{selected.points} نقطة</span>
              </div>
            </div>
            <Button className="w-full" onClick={() => handleClose(false)}>
              حسناً، سأنتظر
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
