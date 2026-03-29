
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Scale, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/firebase";
import { initiateEmailSignUp } from "@/firebase/non-blocking-login";
import { useToast } from "@/hooks/use-toast";

export default function SignupPage() {
  const [email, setEmail] = useState("bishoysamy390@gmail.com");
  const [password, setPassword] = useState("Bishoysamy2020");
  const [fullName, setFullName] = useState("بيشوي سامي");
  const auth = useAuth();
  const { toast } = useToast();

  const handleSignup = () => {
    if (auth) {
      try {
        initiateEmailSignUp(auth, email, password);
        toast({
          title: "تم بدء إنشاء الحساب",
          description: "سيتم تحويلك تلقائياً عند اكتمال العملية.",
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "خطأ في التسجيل",
          description: error.message || "حدث خطأ غير متوقع",
        });
      }
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-10rem)] py-12">
      <Card className="w-full max-w-md shadow-lg border-muted">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <Scale className="h-12 w-12 text-accent" />
          </div>
          <CardTitle className="text-2xl font-headline font-bold text-primary">إنشاء حساب جديد</CardTitle>
          <CardDescription>ابدأ رحلتك مع منصة المستشار اليوم</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-right">
          <div className="space-y-2">
            <Label htmlFor="full-name">الاسم الكامل</Label>
            <Input 
              id="full-name" 
              placeholder="أدخل اسمك الكامل" 
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted p-3 rounded-lg">
            <ShieldCheck className="h-4 w-4 text-accent shrink-0" />
            <span>بالنقر على إنشاء حساب، فإنك توافق على الشروط وسياسة الخصوصية. بياناتك مشفرة بالكامل.</span>
          </div>
          <Button 
            className="w-full bg-primary hover:bg-primary/90 py-6 text-lg"
            onClick={handleSignup}
          >
            إنشاء حساب
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t pt-6">
          <div className="text-sm text-center text-muted-foreground">
            لديك حساب بالفعل؟{" "}
            <Link href="/auth/login" className="text-accent font-medium hover:underline">تسجيل الدخول</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
