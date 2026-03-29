
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ShieldCheck, 
  Calendar, 
  Video, 
  MessageSquare, 
  BrainCircuit, 
  ArrowRight,
  Gavel
} from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Home() {
  const heroImg = PlaceHolderImages.find(img => img.id === "hero-bg");

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-1000">
            <h1 className="text-4xl lg:text-6xl font-headline font-bold leading-tight">
              Expert Legal Advice, <br />
              <span className="text-accent">Whenever You Need It.</span>
            </h1>
            <p className="text-lg opacity-90 max-w-lg leading-relaxed">
              Connect with top-tier specialized legal consultants through our secure platform. Book consultations, manage your legal needs, and get AI-powered insights.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/consultants">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 px-8">
                  Browse Consultants
                </Button>
              </Link>
              <Link href="/match">
                <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10 px-8">
                  Get AI Match
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute -inset-4 bg-accent/20 rounded-3xl blur-3xl" />
            <div className="relative bg-card p-2 rounded-2xl shadow-2xl">
              <Image 
                src={heroImg?.imageUrl || ""} 
                alt="Legal consultations" 
                width={800} 
                height={500}
                className="rounded-xl object-cover"
                data-ai-hint="legal office"
              />
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-accent/10 to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-headline font-bold text-primary">Why Choose Almustasharai?</h2>
            <p className="text-muted-foreground">The digital bridge between you and the legal expertise you require.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<ShieldCheck className="h-8 w-8 text-accent" />}
              title="Secure & Private"
              description="Your data and consultations are protected with military-grade encryption."
            />
            <FeatureCard 
              icon={<Calendar className="h-8 w-8 text-accent" />}
              title="Easy Booking"
              description="Schedule appointments that fit your calendar with just a few clicks."
            />
            <FeatureCard 
              icon={<BrainCircuit className="h-8 w-8 text-accent" />}
              title="AI Matching"
              description="Let our AI find the perfect specialist for your specific legal case."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-3xl p-8 md:p-16 text-primary-foreground flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <h2 className="text-3xl font-headline font-bold">Ready to solve your legal issues?</h2>
              <p className="opacity-80">Join thousands of users who have found expert advice on our platform.</p>
            </div>
            <Link href="/auth/signup">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold px-10">
                Start Your Journey Now
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
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="pt-8 pb-8 flex flex-col items-center text-center space-y-4">
        <div className="p-3 bg-accent/10 rounded-2xl mb-2">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-primary">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
