
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Scale, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Globe, 
  Cpu, 
  Briefcase,
  Gavel,
  CheckCircle2,
  Gift,
  CreditCard,
  Video
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
    <div className="relative min-h-screen flex flex-col items-center pt-32 pb-20 px-4">
      {/* Dynamic Background Elements */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[150px] rounded-full -z-10 animate-pulse" />

      {/* Replit-Inspired Hero Section */}
      <div className="text-center space-y-10 max-w-5xl w-full mb-32 animate-in fade-in slide-in-from-bottom-12 duration-1000">
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-primary/30 text-primary text-sm font-black mb-6 bg-primary/5">
          <Gift className="h-5 w-5 animate-bounce" />
          سجل الآن واحصل على ٥٠ جنيه رصيد مجاني فوراً!
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-tight">
          العدالة في <span className="text-gradient">عصر الذكاء</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-3xl mx-auto leading-relaxed opacity-80">
          منصة "المستشار AI" هي الجيل القادم من الاستشارات القانونية. تحليل فوري، مكتبة نماذج شاملة، ومكالمات فيديو مباشرة مع النخبة.
        </p>

        {/* Central Action Bar (Replit Style) */}
        <div className="max-w-4xl mx-auto mt-16 glass-cosmic p-3 rounded-[2.5rem] shadow-[0_0_50px_rgba(59,130,246,0.2)] border-white/10 group focus-within:border-primary/50 transition-all">
          <div className="flex items-center gap-4">
            <Input 
              placeholder="اكتب استشارتك هنا.. (مثلاً: أريد صياغة عقد عمل احترافي)" 
              className="border-none bg-transparent text-2xl h-18 focus-visible:ring-0 placeholder:text-muted-foreground/30 text-right font-medium"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            />
            <Button 
              onClick={handleStart}
              className="h-16 w-16 rounded-3xl btn-primary shrink-0 shadow-2xl"
            >
              <ArrowRight className="h-8 w-8 rotate-180" />
            </Button>
          </div>
        </div>

        {/* Dynamic Badges */}
        <div className="flex flex-wrap justify-center gap-6 mt-12">
          <Link href="/pricing" className="flex items-center gap-3 px-6 py-3 rounded-2xl glass hover:bg-primary/20 transition-all group">
             <CreditCard className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
             <span className="font-bold text-sm">عرض الباقات</span>
          </Link>
          <Link href="/consultants" className="flex items-center gap-3 px-6 py-3 rounded-2xl glass hover:bg-emerald-500/20 transition-all group border-emerald-500/10">
             <Video className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform" />
             <span className="font-bold text-sm">مكالمات مباشرة</span>
          </Link>
        </div>
      </div>

      {/* Innovation Grid */}
      <section className="w-full max-w-7xl grid md:grid-cols-3 gap-8 px-4">
        <InnovationCard 
          icon={<Gavel className="h-10 w-10 text-blue-400" />}
          title="استشارات فائقة الدقة"
          description="خوارزميات متطورة تحلل موقفك القانوني بناءً على آلاف السوابق القضائية في ثوانٍ."
        />
        <InnovationCard 
          icon={<Video className="h-10 w-10 text-emerald-400" />}
          title="غرف محادثة مرئية"
          description="تواصل مباشر وآمن عبر مكالمات الفيديو والصوت مع نخبة المستشارين الموثقين."
        />
        <InnovationCard 
          icon={<Briefcase className="h-10 w-10 text-amber-400" />}
          title="أرشيف النماذج الذكي"
          description="أكثر من ٢٥٠ نموذجاً قانونياً محققاً قابلاً للتخصيص والتحميل بصيغة PDF و Word."
        />
      </section>

      {/* Metrics Section */}
      <section className="mt-40 w-full max-w-6xl glass-card p-16 rounded-[4rem] text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
        <h2 className="text-4xl font-black mb-16">لماذا نحن في المقدمة؟</h2>
        <div className="grid md:grid-cols-4 gap-12">
          <StatBox label="دقة قانونية" value="99.9%" />
          <StatBox label="سرعة الاستجابة" value="0.5s" />
          <StatBox label="خصوصية سيادية" value="100%" />
          <StatBox label="توفير التكاليف" value="75%" />
        </div>
      </section>
    </div>
  );
}

function InnovationCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="glass-card p-10 rounded-[3rem] space-y-6 hover:translate-y-[-10px] transition-all duration-500 group border-white/5 hover:border-primary/40">
      <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-all shadow-inner">
        {icon}
      </div>
      <h3 className="text-2xl font-black text-white">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-lg">{description}</p>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-3">
      <p className="text-5xl font-black text-white tracking-tighter">{value}</p>
      <p className="text-sm text-primary font-bold uppercase tracking-widest">{label}</p>
    </div>
  );
}
