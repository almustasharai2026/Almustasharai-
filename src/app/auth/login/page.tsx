
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Scale } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-10rem)] py-12">
      <Card className="w-full max-w-md shadow-lg border-muted">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <Scale className="h-12 w-12 text-accent" />
          </div>
          <CardTitle className="text-2xl font-headline font-bold text-primary">Login to Almustasharai</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@example.com" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="text-xs text-accent hover:underline">Forgot password?</Link>
            </div>
            <Input id="password" type="password" />
          </div>
          <Button className="w-full bg-primary hover:bg-primary/90 py-6 text-lg">Sign In</Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t pt-6">
          <div className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-accent font-medium hover:underline">Create an account</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
