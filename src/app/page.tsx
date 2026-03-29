
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Scale, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Globe, 
  Cpu, 
  Briefcase,
  Gavel,
  History
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UltimateCosmicHome() {
  const [prompt, setPrompt] = useState("");
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStart = () => {
    if (prompt.trim()) {
      router.push(`/bot?query=${encodeURIComponent(prompt)}`);
    } else {
      router.push("/bot");
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen flex flex-col items-center pt-24 pb-20 px-4 overflow-hidden">
      {/* Background Nebula Effects */}
      <div className="nebula-glow top-[-10%] left-[-5%]" />
      <div className="nebula-glow bottom-[10%] right-[-5%] bg-blue-500/5" />

      {/* Floating Top Banner */}
      <div className="w-full max-w-4xl mb-16 animate-in fade-in slide-in-from-top-4 duration-1000">
        <Link href="/auth/signup" className="group">
          <div className="glass-cosmic hover:bg-white/10 transition-all rounded-full p-2 px-6 flex items-center justify-between text-sm font-bold text-accent border-accent/20">
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4 animate-pulse" />
              لفترة محدودة: استشارة قانونية ذكية مجانية عند التسجيل اليوم.
            </span>
            <span className="underline group-hover:no-underline">انضم للكوكب الآن</span>
          </div>
        </Link>
      </div>

      {/* Supreme Hero Section */}
      <div className="text-center space-y-10 max-w-4xl w-full mb-24 relative z-10">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white drop-shadow-2xl">
          العدالة في عصر <span className="text-accent">الذكاء</span>
        </h1>
        <p className="text-2xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
          نظام قانوني استثنائي يحول قضاياك إلى حلول فورية بدقة كونية. ابدأ رحلتك مع المستشار ٤.
        </p>

        {/* Central Command Input (Replit-style Supreme) */}
        <div className="relative group max-w-3xl mx-auto mt-16">
          <div className="absolute -inset-1 bg-gradient-to-r from-accent to-orange-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
          <div className="relative flex items-center glass-cosmic rounded-[2.5rem] p-3 shadow-2xl focus-within:ring-2 ring-accent/50 transition-all">
            <div className="px-6 text-accent">
              <Sparkles className="h-8 w-8 animate-spin-slow" />
            </div>
            <Input 
              placeholder="صف قضيتك بكلمات بسيطة، وسيتولى النظام الباقي..." 
              className="border-none bg-transparent text-2xl h-20 focus-visible:ring-0 placeholder:text-white/20 text-right pr-4"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            />
            <Button 
              onClick={handleStart}
              className="h-16 w-16 rounded-[2rem] cosmic-gradient hover:scale-105 active:scale-95 shadow-xl transition-all"
            >
              <ArrowRight className="h-8 w-8 rotate-180" />
            </Button>
          </div>
        </div>

        {/* Dynamic Capability Chips */}
        <div className="flex flex-wrap justify-center gap-4 mt-12">
          <CapabilityBadge icon={<Scale className="h-4 w-4" />} label="استشارات فورية" />
          <CapabilityBadge icon={<ShieldCheck className="h-4 w-4" />} label="تشفير كوانتم" />
          <CapabilityBadge icon={<Cpu className="h-4 w-4" />} label="تحليل ذكاء اصطناعي" />
          <CapabilityBadge icon={<Globe className="h-4 w-4" />} label="تغطية دولية" />
        </div>
      </div>

      {/* Features Grid - Cosmic Cards */}
      <section className="w-full max-w-6xl grid md:grid-cols-3 gap-8 pt-10">
        <CosmicFeatureCard 
          icon={<Gavel className="h-8 w-8" />}
          title="قوة قضائية"
          description="تحليل السوابق القضائية وتوقع النتائج بدقة تفوق البشر."
        />
        <CosmicFeatureCard 
          icon={<Briefcase className="h-8 w-8" />}
          title="حلول تجارية"
          description="تأسيس الشركات وصياغة العقود المعقدة في ثوانٍ معدودة."
        />
        <CosmicFeatureCard 
          icon={<History className="h-8 w-8" />}
          title="أرشيف ذكي"
          description="حفظ وإدارة ملفاتك القانونية في سحابة آمنة ومشفرة بالكامل."
        />
      </section>

      {/* Innovation Section */}
      <section className="w-full max-w-6xl mt-32 relative">
        <div className="glass-cosmic rounded-[4rem] p-16 flex flex-col md:flex-row items-center gap-16 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-[100px] rounded-full" />
          <div className="flex-1 space-y-8 text-right relative z-10">
            <h2 className="text-5xl font-black leading-tight">اكتشف أفقاً جديداً <br/><span className="text-accent">للمحاماة الرقمية</span></h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              نحن لا نقدم مجرد نصائح، نحن نبني لك درعاً قانونياً ذكياً يتطور معك. استمتع بأقوى نظام حماية قانوني في المنطقة.
            </p>
            <Button size="lg" className="rounded-2xl h-16 px-10 cosmic-gradient font-black text-xl shadow-2xl">
              ابدأ تجربتك الاستثنائية
            </Button>
          </div>
          <div className="flex-1 relative group">
            <div className="absolute inset-0 bg-accent/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative glass-cosmic p-8 rounded-[3rem] border-2 border-accent/20 rotate-3 group-hover:rotate-0 transition-transform duration-700">
               <div className="h-64 w-full bg-gradient-to-br from-zinc-800 to-black rounded-2xl flex items-center justify-center">
                  <Cpu className="h-24 w-24 text-accent animate-pulse" />
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function CapabilityBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 px-5 py-2.5 rounded-full glass-cosmic text-sm font-bold border-white/5 hover:border-accent/30 transition-colors cursor-default">
      <span className="text-accent">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function CosmicFeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="glass-cosmic p-10 rounded-[3rem] space-y-6 hover:translate-y-[-10px] transition-all duration-500 group border-white/5 hover:border-accent/20">
      <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all shadow-lg">
        {icon}
      </div>
      <h3 className="text-2xl font-black text-white">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-lg">{description}</p>
    </div>
  );
}
