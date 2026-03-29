
"use client";

import { Check, Zap, Shield, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const OFFERS = [
  {
    id: "basic",
    name: "الباقة الأساسية",
    price: "100",
    description: "مثالية للاستشارات البسيطة والسريعة.",
    features: ["٣ استشارات ذكية", "تحميل ٥ نماذج", "دعم فني عبر البريد"],
    icon: <Zap className="h-6 w-6 text-blue-400" />,
    color: "border-blue-500/20"
  },
  {
    id: "pro",
    name: "الباقة الاحترافية",
    price: "250",
    description: "الخيار الأفضل لرجال الأعمال والشركات الناشئة.",
    features: ["استشارات غير محدودة", "تحميل كافة النماذج", "مكالمة فيديو ١٥ دقيقة", "أولوية الرد"],
    icon: <Crown className="h-6 w-6 text-amber-400" />,
    color: "border-amber-500/50",
    popular: true
  },
  {
    id: "vip",
    name: "الباقة السيادية",
    price: "500",
    description: "تغطية قانونية كاملة شاملة التدقيق والمكالمات.",
    features: ["كل مميزات الاحترافية", "مكالمات فيديو غير محدودة", "تدقيق عقود يدوي", "مستشار خاص"],
    icon: <Shield className="h-6 w-6 text-emerald-400" />,
    color: "border-emerald-500/20"
  }
];

export default function PricingPage() {
  const router = useRouter();

  const handleSelect = (offerId: string) => {
    router.push(`/checkout?plan=${offerId}`);
  };

  return (
    <div className="container mx-auto px-4 py-20 max-w-6xl text-right" dir="rtl">
      <div className="text-center space-y-4 mb-16">
        <h1 className="text-4xl md:text-6xl font-black text-white">اختر خطتك <span className="text-primary">القانونية</span></h1>
        <p className="text-muted-foreground text-xl">استثمر في حمايتك القانونية مع باقات مرنة تناسب احتياجاتك.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {OFFERS.map((offer) => (
          <Card key={offer.id} className={`glass-card relative overflow-hidden flex flex-col ${offer.color} border-2`}>
            {offer.popular && (
              <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                الأكثر طلباً
              </div>
            )}
            <CardHeader className="pt-8">
              <div className="mb-4">{offer.icon}</div>
              <CardTitle className="text-2xl font-bold">{offer.name}</CardTitle>
              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-4xl font-black text-white">{offer.price}</span>
                <span className="text-muted-foreground">EGP</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{offer.description}</p>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              {offer.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSelect(offer.id)}
                className={`w-full h-12 rounded-xl font-bold transition-all ${offer.popular ? 'btn-primary' : 'glass hover:bg-white/10'}`}
              >
                اشترك الآن
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
