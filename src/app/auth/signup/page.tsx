
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Scale, ShieldCheck, Gift } from "lucide-react";
import { useState } from "react";
import { useAuth, useFirestore } from "@/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const handleSignup = async () => {
    if (!auth || !db || !email || !password || !fullName) {
      toast({ variant: "destructive", title: "بيانات ناقصة", description: "يرجى تعبئة كافة الحقول." });
      return;
    }
    
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: fullName });

      // Create user profile in Firestore with initial 50 EGP bonus
      await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        email: email,
        fullName: fullName,
        balance: 50, // WELCOME BONUS
        languagePreference: "ar",
        dateJoined: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });

      toast({
        title: "مبروك! تم إنشاء الحساب",
        description: "لقد حصلت على ٥٠ جنيه رصيد ترحيبي مجاناً.",
      });
      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "خطأ في التسجيل",
        description: error.message || "حدث خطأ أثناء إنشاء الحساب.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-10rem)] py-12 px-4">
      <Card className="w-full max-w-md glass-card border-none rounded-[2rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
        <CardHeader className="space-y-4 text-center pt-10">
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-primary/20 rounded-2xl flex items-center justify-center shadow-inner">
              <Scale className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-black text-white">انضم للمستقبل</CardTitle>
            <CardDescription className="text-lg">احصل على استشارتك الأولى بذكاء.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 text-right pb-10">
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center gap-4 animate-bounce mt-4">
             <Gift className="h-8 w-8 text-emerald-500 shrink-0" />
             <p className="text-xs text-emerald-500 font-black leading-tight">سجل الآن واحصل على ٥٠ جنيه رصيد مجاني في محفظتك فوراً!</p>
          </div>

          <div className="space-y-2 mt-6">
            <Label htmlFor="full-name">الاسم الكامل</Label>
            <Input 
              id="full-name" 
              placeholder="بيشوي سامي" 
              className="glass border-white/10 h-14 rounded-xl text-lg pr-4"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com" 
              className="glass border-white/10 h-14 rounded-xl text-lg pr-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input 
              id="password" 
              type="password" 
              className="glass border-white/10 h-14 rounded-xl text-lg pr-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <Button 
            className="w-full btn-primary h-16 rounded-2xl text-xl font-black mt-4 shadow-xl shadow-primary/20"
            onClick={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? "جاري الإنشاء..." : "ابدأ رحلتك الآن"}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-6 border-t border-white/5 pt-8 bg-white/5">
          <div className="text-sm text-center text-muted-foreground">
            لديك حساب بالفعل؟{" "}
            <Link href="/auth/login" className="text-primary font-bold hover:underline">سجل دخولك</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
