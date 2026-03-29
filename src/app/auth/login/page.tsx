
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Scale } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("bishoysamy390@gmail.com");
  const [password, setPassword] = useState("Bishoysamy2020");
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleLogin = async () => {
    if (!auth) return;
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك مرة أخرى في منصة المستشار.",
      });
      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);
      let message = "فشل تسجيل الدخول. تأكد من البيانات.";
      if (error.code === "auth/user-not-found") {
        message = "هذا الحساب غير موجود. يرجى إنشاء حساب أولاً.";
      } else if (error.code === "auth/wrong-password") {
        message = "كلمة المرور غير صحيحة.";
      }
      toast({
        variant: "destructive",
        title: "خطأ في الدخول",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-10rem)] py-12">
      <Card className="w-full max-w-md shadow-lg border-muted">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <Scale className="h-12 w-12 text-accent" />
          </div>
          <CardTitle className="text-2xl font-headline font-bold text-primary">تسجيل الدخول</CardTitle>
          <CardDescription>أدخل بياناتك للوصول إلى حسابك</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-right">
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
            <div className="flex items-center justify-between">
              <Link href="#" className="text-xs text-accent hover:underline">نسيت كلمة المرور؟</Link>
              <Label htmlFor="password">كلمة المرور</Label>
            </div>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button 
            className="w-full bg-primary hover:bg-primary/90 py-6 text-lg"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? "جاري الدخول..." : "دخول"}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t pt-6">
          <div className="text-sm text-center text-muted-foreground">
            ليس لديك حساب؟{" "}
            <Link href="/auth/signup" className="text-accent font-medium hover:underline">إنشاء حساب جديد</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
