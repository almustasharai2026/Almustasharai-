
import { Scale, Users, Shield, Target } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <div className="text-center space-y-6 mb-16">
        <h1 className="text-4xl lg:text-5xl font-headline font-bold text-primary">About Almustasharai</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Pioneering the future of legal consultations through technology and expertise.
        </p>
      </div>

      <div className="prose prose-lg max-w-none text-muted-foreground space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Target className="h-6 w-6 text-accent" />
            Our Mission
          </h2>
          <p>
            Almustasharai was founded with a clear mission: to democratize access to high-quality legal advice. We believe that everyone deserves professional legal guidance that is accessible, affordable, and secure. Our platform bridges the gap between those in need of legal help and the experts who can provide it.
          </p>
        </section>

        <section className="grid md:grid-cols-3 gap-8 pt-8">
          <div className="space-y-3 p-6 bg-card rounded-2xl border shadow-sm text-center">
            <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-bold text-primary">Expert Network</h3>
            <p className="text-sm">We vet every consultant on our platform to ensure they meet our rigorous standards of expertise.</p>
          </div>
          <div className="space-y-3 p-6 bg-card rounded-2xl border shadow-sm text-center">
            <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-bold text-primary">Absolute Privacy</h3>
            <p className="text-sm">Legal matters are sensitive. We use end-to-end encryption for all our communications.</p>
          </div>
          <div className="space-y-3 p-6 bg-card rounded-2xl border shadow-sm text-center">
            <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
              <Scale className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-bold text-primary">Modern Approach</h3>
            <p className="text-sm">Our AI-powered matching and seamless online interface make legal consultations effortless.</p>
          </div>
        </section>

        <section className="space-y-4 pt-12">
          <h2 className="text-2xl font-bold text-primary">Our Story</h2>
          <p>
            Founded in 2024, Almustasharai started as a small initiative to help local entrepreneurs navigate the complex legal landscape. Today, it has grown into a comprehensive platform serving diverse legal needs—from family law to corporate governance across the region.
          </p>
        </section>
      </div>
    </div>
  );
}
