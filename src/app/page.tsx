
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
  CheckCircle2
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
      {/* Decorative Background Elements */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full -z-10" />

      {/* Hero Section */}
      <div className="text-center space-y-8 max-w-4xl w-full mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-primary/20 text-primary text-sm font-bold mb-4">
          <Sparkles className="h-4 w-4" />
          مستقبلك القانوني يبدأ هنا مع الذكاء الاصطناعي
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-tight">
          العدالة أصبحت <span className="text-gradient">أذكى، أسرع، وأسهل</span>
        </h1>
        
        <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
          منصة "المستشار AI" تعيد تعريف الاستشارات القانونية. حلول فورية، دقة متناهية، وخصوصية مطلقة في كوكب قانوني متطور.
        </p>

        {/* Action Box */}
        <div className="max-w-3xl mx-auto mt-12 glass p-2 rounded-[2rem] shadow-2xl border-white/10 group focus-within:border-primary/50 transition-all">
          <div className="flex items-center gap-2">
            <Input 
              placeholder="اكتب سؤالك القانوني هنا... (مثلاً: كيف أؤسس شركة في مصر؟)" 
              className="border-none bg-transparent text-xl h-16 focus-visible:ring-0 placeholder:text-muted-foreground/50 text-right"
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

        {/* Feature Tags */}
        <div className="flex flex-wrap justify-center gap-4 mt-8 opacity-80">
          <FeatureTag icon={<ShieldCheck className="h-4 w-4" />} label="تشفير سيادي" />
          <FeatureTag icon={<Cpu className="h-4 w-4" />} label="تحليل ذكي" />
          <FeatureTag icon={<Globe className="h-4 w-4" />} label="دعم دولي" />
        </div>
      </div>

      {/* Main Features Grid */}
      <section className="w-full max-w-6xl grid md:grid-cols-3 gap-6 pt-10">
        <FeatureCard 
          icon={<Gavel className="h-8 w-8 text-blue-400" />}
          title="استشارات فورية"
          description="احصل على إجابات قانونية دقيقة في ثوانٍ معدودة عبر خبرائنا الرقميين."
        />
        <FeatureCard 
          icon={<Briefcase className="h-8 w-8 text-cyan-400" />}
          title="إدارة العقود"
          description="صياغة وتدقيق العقود القانونية المعقدة بأعلى معايير الجودة."
        />
        <FeatureCard 
          icon={<Scale className="h-8 w-8 text-emerald-400" />}
          title="دعم قضائي"
          description="تحليل المواقف القانونية بناءً على أحدث السوابق القضائية المتاحة."
        />
      </section>

      {/* Trust Section */}
      <section className="mt-32 w-full max-w-5xl glass-card p-12 rounded-[3rem] text-center space-y-8">
        <h2 className="text-3xl font-bold">لماذا يختارنا المحترفون؟</h2>
        <div className="grid md:grid-cols-4 gap-8">
          <StatBox icon={<CheckCircle2 className="h-6 w-6" />} label="دقة قانونية" value="99%" />
          <StatBox icon={<CheckCircle2 className="h-6 w-6" />} label="توفير للوقت" value="85%" />
          <StatBox icon={<CheckCircle2 className="h-6 w-6" />} label="خصوصية" value="100%" />
          <StatBox icon={<CheckCircle2 className="h-6 w-6" />} label="تكلفة أقل" value="70%" />
        </div>
      </section>
    </div>
  );
}

function FeatureTag({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full glass border-white/5 text-sm font-medium hover:bg-white/10 transition-colors">
      <span className="text-primary">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="glass-card p-8 rounded-[2rem] space-y-4 hover:translate-y-[-5px] transition-all group">
      <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-all">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function StatBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-center text-primary mb-2">{icon}</div>
      <p className="text-3xl font-black text-white">{value}</p>
      <p className="text-sm text-muted-foreground font-bold">{label}</p>
    </div>
  );
}
