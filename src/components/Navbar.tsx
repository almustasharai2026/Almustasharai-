
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Scale, Menu, BrainCircuit, Sun, Moon, Languages, User, LayoutDashboard, FileText, MessageSquare, Sparkles } from "lucide-react";
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

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem("app_lang");
    if (savedLang) {
      const isAr = savedLang === "ar";
      setIsArabic(isAr);
      document.documentElement.dir = isAr ? "rtl" : "ltr";
    }
  }, []);

  if (!mounted) return null;

  const toggleLanguage = () => {
    const newLang = !isArabic ? "ar" : "en";
    setIsArabic(!isArabic);
    localStorage.setItem("app_lang", newLang);
    document.documentElement.dir = !isArabic ? "rtl" : "ltr";
  };

  const isAdmin = user?.email === "bishoysamy390@gmail.com";

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-7xl">
      <div className="glass h-20 rounded-[1.5rem] px-6 flex items-center justify-between border-white/40 dark:border-white/10 shadow-2xl">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-primary p-2.5 rounded-2xl group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-primary/20">
            <Scale className="h-6 w-6 text-white" />
          </div>
          <span className="font-black font-headline text-2xl tracking-tighter text-primary">
            المستشار <span className="text-accent">AI</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-10">
          <NavLink href="/consultants" label={isArabic ? "المستشارون" : "Consultants"} />
          <NavLink href="/match" label={isArabic ? "المطابقة" : "AI Match"} icon={<BrainCircuit className="h-4 w-4" />} />
          <NavLink href="/templates" label={isArabic ? "النماذج" : "Templates"} icon={<FileText className="h-4 w-4" />} />
          <Link href="/bot" className="relative glass px-6 py-2.5 rounded-2xl font-black text-accent border-accent/20 hover:bg-accent hover:text-white transition-all duration-500 group">
            <Sparkles className="h-4 w-4 inline-block ml-2 group-hover:animate-spin" />
            {isArabic ? "البوت الذكي" : "Smart Bot"}
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-accent/10" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-primary" />}
          </Button>
          
          <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-accent/10" onClick={toggleLanguage}>
            <Languages className="h-5 w-5 text-accent" />
          </Button>

          <div className="h-6 w-px bg-border mx-2 hidden sm:block" />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" className="rounded-2xl h-12 gap-3 px-6 shadow-lg shadow-primary/20">
                  <User className="h-4 w-4" /> 
                  <span className="hidden sm:inline-block font-bold">{isArabic ? "حسابي" : "Account"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 rounded-[1.5rem] p-3 shadow-2xl border-white/20 glass" dir={isArabic ? "rtl" : "ltr"}>
                <div className="px-3 py-2 mb-2">
                  <p className="text-xs text-muted-foreground">أهلاً بك</p>
                  <p className="text-sm font-black truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-accent/10">
                    <LayoutDashboard className="h-4 w-4" /> {isArabic ? "لوحة التحكم" : "Dashboard"}
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center gap-3 p-3 rounded-xl text-accent font-black cursor-pointer hover:bg-accent/10">
                      <Scale className="h-4 w-4" /> {isArabic ? "إدارة المنصة" : "Admin Panel"}
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.location.href = "/auth/login"} className="flex items-center gap-3 p-3 rounded-xl text-red-500 cursor-pointer hover:bg-red-50">
                  {isArabic ? "تسجيل الخروج" : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" className="rounded-2xl h-12 font-bold">{isArabic ? "دخول" : "Login"}</Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="rounded-2xl h-12 px-8 font-black shadow-lg shadow-primary/20">{isArabic ? "اشترك" : "Join"}</Button>
              </Link>
            </div>
          )}
          
          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-2xl">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 rounded-[1.5rem] glass p-3 shadow-2xl" dir={isArabic ? "rtl" : "ltr"}>
                <DropdownMenuItem asChild><Link href="/consultants" className="p-3 rounded-xl">{isArabic ? "المستشارون" : "Consultants"}</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/match" className="p-3 rounded-xl">{isArabic ? "المطابقة الذكية" : "AI Match"}</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/templates" className="p-3 rounded-xl">{isArabic ? "النماذج" : "Templates"}</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/bot" className="p-3 rounded-xl font-black text-accent">{isArabic ? "البوت الذكي" : "Smart Bot"}</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, label, icon }: { href: string; label: string; icon?: React.ReactNode }) {
  return (
    <Link href={href} className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors relative group">
      {icon}
      {label}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}
