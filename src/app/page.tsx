
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Briefcase,
  Gavel,
  Gift,
  CreditCard,
  Video,
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [prompt, setPrompt] = useState("");
  const router = useRouter();

  const handleStart = () => {
    if (prompt.trim()) {
      router.push(`/bot?query=${encodeURIComponent(prompt)}`);
    } else {
      router.push("/bot");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center pt-32 pb-20 px-4 overflow-hidden">
      
      {/* Soft Ambient Light */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-white/[0.02] blur-[150px] rounded-full -z-10" />

      {/* Hero Section */}
      <div className="text-center space-y-12 max-w-5xl w-full mb-32 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass border-white/10 text-white/60 text-xs font-black mb-6">
          <Gift className="h-4 w-4 text-white" />
          هدية ترحيبية ٥٠ جنيه رصيد مجاني عند الانضمام
        </div>
        
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white leading-[0.9] text-gradient">
          العدالة برؤية <br />مستقبلية
        </h1>
        
        <p className="text-lg md:text-xl text-white/40 font-medium max-w-2xl mx-auto leading-relaxed">
          منصة "المستشار AI" تعيد تعريف الاستشارات القانونية. دقة لا تضاهى، بساطة مطلقة، وخصوصية سيادية كاملة.
        </p>

        {/* Central Action Area */}
        <div className="max-w-4xl mx-auto mt-20 p-2 glass rounded-[2.5rem] focus-within:ring-1 ring-white/20 transition-all">
          <div className="flex items-center gap-4 p-2">
            <Input 
              placeholder="اكتب استفسارك القانوني هنا..." 
              className="border-none bg-transparent text-xl h-14 focus-visible:ring-0 placeholder:text-white/10 text-right"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            />
            <Button 
              onClick={handleStart}
              className="h-14 w-14 rounded-2xl btn-primary shrink-0"
            >
              <ArrowRight className="h-6 w-6 rotate-180" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-8 mt-12">
          <Link href="/pricing" className="flex items-center gap-2 text-white/40 hover:text-white transition-all text-sm font-bold">
             <CreditCard className="h-4 w-4" /> الباقات والأسعار
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <Link href="/consultants" className="flex items-center gap-2 text-white/40 hover:text-white transition-all text-sm font-bold">
             <Video className="h-4 w-4" /> مكالمات مرئية مباشرة
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <section className="w-full max-w-7xl grid md:grid-cols-3 gap-8 px-4">
        <FeatureCard 
          icon={<Gavel className="h-8 w-8 text-white/80" />}
          title="استشارات ذكية"
          description="تحليل عميق لموقفك القانوني بناءً على أحدث التشريعات والسوابق."
        />
        <FeatureCard 
          icon={<ShieldCheck className="h-8 w-8 text-white/80" />}
          title="خصوصية سيادية"
          description="بياناتك مشفرة ومحمية ببروتوكولات أمان عالمية لضمان السرية."
        />
        <FeatureCard 
          icon={<Briefcase className="h-8 w-8 text-white/80" />}
          title="مكتبة النماذج"
          description="أكثر من ٢٥٠ نموذجاً قانونياً جاهزاً للتخصيص والتحميل الفوري."
        />
      </section>

      {/* Trust Banner */}
      <section className="mt-40 w-full max-w-5xl glass-card p-20 rounded-[4rem] text-center border-white/[0.03]">
        <h2 className="text-4xl font-black mb-12 text-white/90">بنينا نظاماً تثق به</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="space-y-2">
            <p className="text-4xl font-black text-white">٩٩٪</p>
            <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">دقة قانونية</p>
          </div>
          <div className="space-y-2">
            <p className="text-4xl font-black text-white">٠.٥ث</p>
            <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">سرعة استجابة</p>
          </div>
          <div className="space-y-2">
            <p className="text-4xl font-black text-white">١٠٠٪</p>
            <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">أمان تام</p>
          </div>
          <div className="space-y-2">
            <p className="text-4xl font-black text-white">٧٥٪</p>
            <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">توفير تكاليف</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="glass-card p-12 rounded-[3rem] space-y-6 group border-white/[0.02]">
      <div className="h-16 w-16 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/[0.05] shadow-inner group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-black text-white/90">{title}</h3>
      <p className="text-white/40 leading-relaxed text-sm font-medium">{description}</p>
      <div className="flex items-center gap-2 text-white/20 text-xs font-bold pt-4 group-hover:text-white transition-all cursor-pointer">
        اكتشف المزيد <ChevronRight className="h-4 w-4" />
      </div>
    </div>
  );
}
