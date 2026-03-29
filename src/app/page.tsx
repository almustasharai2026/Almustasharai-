
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, 
  Calendar, 
  BrainCircuit, 
  ArrowLeft,
  Sparkles,
  Gavel,
  Scale
} from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Home() {
  const heroImg = PlaceHolderImages.find(img => img.id === "hero-bg");

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section - Ultra Modern */}
      <section className="relative min-h-[90vh] flex items-center pt-20">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center z-10">
          <div className="space-y-10 text-right">
            <Badge variant="secondary" className="px-4 py-1.5 rounded-full bg-accent/10 text-accent border-accent/20 animate-pulse">
              <Sparkles className="h-3.5 w-3.5 ml-2" />
              مستقبلك القانوني يبدأ هنا
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-black font-headline leading-tight tracking-tighter text-primary">
              العدالة <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-accent to-primary">
                بلمسة ذكاء
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
              أول منصة قانونية متكاملة تدمج الخبرة البشرية مع قوة الذكاء الاصطناعي لتوفير استشارات دقيقة، سريعة، وبخصوصية تامة.
            </p>
            <div className="flex flex-wrap gap-5 justify-end">
              <Link href="/auth/signup">
                <Button size="lg" className="rounded-2xl h-16 px-10 text-lg font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                  ابدأ مجاناً الآن
                </Button>
              </Link>
              <Link href="/bot">
                <Button size="lg" variant="outline" className="rounded-2xl h-16 px-10 text-lg border-2 hover:bg-accent/5">
                  تحدث مع البوت الذكي
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center gap-8 justify-end pt-8 opacity-60">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">10K+</p>
                <p className="text-xs">استشارة ناجحة</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">500+</p>
                <p className="text-xs">خبير قانوني</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">99%</p>
                <p className="text-xs">نسبة الدقة</p>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-10 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-full blur-[100px] group-hover:opacity-100 transition-opacity opacity-70" />
            <div className="relative glass p-4 rounded-[2.5rem] shadow-2xl border-white/40 dark:border-white/10 rotate-2 group-hover:rotate-0 transition-all duration-700">
              <div className="absolute top-10 -left-10 glass p-6 rounded-3xl animate-bounce [animation-duration:3s]">
                <Scale className="h-10 w-10 text-accent" />
              </div>
              <div className="absolute bottom-20 -right-10 glass p-6 rounded-3xl animate-bounce [animation-duration:4s] [animation-delay:1s]">
                <Gavel className="h-10 w-10 text-primary" />
              </div>
              <Image 
                src={heroImg?.imageUrl || ""} 
                alt="Legal Tech" 
                width={800} 
                height={600}
                className="rounded-[2rem] object-cover shadow-inner"
                data-ai-hint="luxury legal office"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features - Premium Grid */}
      <section className="py-32 relative bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <h2 className="text-4xl font-black font-headline text-primary">لماذا "المستشار" هو الاختيار الأول؟</h2>
            <p className="text-lg text-muted-foreground">صممنا كل ميزة لتمنحك القوة والسرعة والأمان الذي تفتقده في الحلول التقليدية.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard 
              icon={<ShieldCheck className="h-10 w-10 text-accent" />}
              title="تشفير عسكري"
              description="استشاراتك وبياناتك محمية بتقنيات تشفير تضمن خصوصيتك المطلقة ولا يمكن لأحد الوصول إليها."
            />
            <FeatureCard 
              icon={<Calendar className="h-10 w-10 text-accent" />}
              title="جدولة ذكية"
              description="احجز موعدك مع أفضل الخبراء في ثوانٍ، نظامنا يضمن لك الوصول لأفضل تخصص لمشكلتك."
            />
            <FeatureCard 
              icon={<BrainCircuit className="h-10 w-10 text-accent" />}
              title="ذكاء Gemini Pro"
              description="تحليل فوري للمستندات والقضايا باستخدام أحدث نماذج الذكاء الاصطناعي العالمية."
            />
          </div>
        </div>
      </section>

      {/* Modern CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="relative glass p-12 md:p-24 rounded-[3rem] overflow-hidden text-center space-y-8 border-none">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-90 -z-10" />
            <h2 className="text-4xl md:text-6xl font-black text-white font-headline">جاهز للجيل القادم من المحاماة؟</h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">انضم الآن واحصل على استشارتك الأولى مجاناً مع البوت الذكي.</p>
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 h-16 px-12 rounded-2xl text-xl font-bold">
                أنشئ حسابك الآن
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="glass p-10 rounded-[2rem] hover:-translate-y-3 transition-all duration-500 border-none group">
      <div className="p-5 bg-accent/10 rounded-[1.5rem] w-fit mb-8 group-hover:bg-accent group-hover:text-white transition-colors duration-500">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-primary mb-4">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
