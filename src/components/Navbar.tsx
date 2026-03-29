
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Scale, Menu, BrainCircuit, Sun, Moon, Languages, User, LayoutDashboard, FileText } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useUser } from "@/firebase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user } = useUser();
  const [isArabic, setIsArabic] = useState(true);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const toggleLanguage = () => {
    setIsArabic(!isArabic);
    document.documentElement.dir = !isArabic ? "rtl" : "ltr";
    document.documentElement.lang = !isArabic ? "ar" : "en";
  };

  const isAdmin = user?.email === "bishoysamy390@gmail.com";

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-headline font-bold text-primary text-xl tracking-tight">
          <Scale className="h-6 w-6 text-accent" />
          <span>{isArabic ? "المستشار" : "Almustashar"}</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/consultants" className="text-sm font-medium hover:text-accent transition-colors">
            {isArabic ? "المستشارون" : "Consultants"}
          </Link>
          <Link href="/match" className="text-sm font-medium hover:text-accent transition-colors flex items-center gap-1">
            <BrainCircuit className="h-4 w-4" /> {isArabic ? "المطابقة الذكية" : "AI Match"}
          </Link>
          <Link href="/templates" className="text-sm font-medium hover:text-accent transition-colors flex items-center gap-1">
            <FileText className="h-4 w-4" /> {isArabic ? "النماذج" : "Templates"}
          </Link>
          <Link href="/bot" className="text-sm font-medium hover:text-accent transition-colors">
            {isArabic ? "البوت القانوني" : "Legal Bot"}
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <Button variant="ghost" size="icon" onClick={toggleLanguage}>
            <Languages className="h-5 w-5" />
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" /> {isArabic ? "حسابي" : "My Account"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" /> {isArabic ? "لوحة التحكم" : "Dashboard"}
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center gap-2 text-primary font-bold">
                      <Scale className="h-4 w-4" /> {isArabic ? "إدارة المنصة" : "Admin Panel"}
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.location.href = "/dashboard"}>
                  {isArabic ? "تسجيل الخروج" : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Link href="/auth/login" className="hidden sm:inline-flex">
                <Button variant="ghost" size="sm">{isArabic ? "دخول" : "Login"}</Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="bg-primary hover:bg-primary/90">{isArabic ? "اشترك" : "Sign Up"}</Button>
              </Link>
            </div>
          )}
          
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 text-right">
                <DropdownMenuItem asChild><Link href="/consultants">{isArabic ? "المستشارون" : "Consultants"}</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/match">{isArabic ? "المطابقة الذكية" : "AI Match"}</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/templates">{isArabic ? "النماذج" : "Templates"}</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/bot">{isArabic ? "البوت" : "Bot"}</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
