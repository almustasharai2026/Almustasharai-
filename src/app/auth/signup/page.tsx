
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Scale, ShieldCheck } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-10rem)] py-12">
      <Card className="w-full max-w-md shadow-lg border-muted">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <Scale className="h-12 w-12 text-accent" />
          </div>
          <CardTitle className="text-2xl font-headline font-bold text-primary">Join Almustasharai</CardTitle>
          <CardDescription>Start your legal consultation journey today</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first-name">First Name</Label>
              <Input id="first-name" placeholder="John" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Last Name</Label>
              <Input id="last-name" placeholder="Doe" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" />
          </div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground bg-muted p-3 rounded-lg">
            <ShieldCheck className="h-4 w-4 text-accent shrink-0" />
            <span>By clicking sign up, you agree to our Terms and Privacy Policy. Your data is encrypted.</span>
          </div>
          <Button className="w-full bg-primary hover:bg-primary/90 py-6 text-lg">Create Account</Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t pt-6">
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-accent font-medium hover:underline">Login instead</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
