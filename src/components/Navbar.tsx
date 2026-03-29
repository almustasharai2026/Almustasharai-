
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Scale, Menu, Sun, Moon, Languages, User, LayoutDashboard, Sparkles, Lock, Gavel } from "lucide-react";
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
  }, []);

  if (!mounted) return null;

  const toggleLanguage = () => {
    setIsArabic(!isArabic);
    document.documentElement.dir = !isArabic ? "rtl" : "ltr";
  };

  const isAdmin = user?.email === "bishoysamy390@gmail.com";

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-7xl">
      <div className="glass-cosmic h-20 px-8 rounded-[2.5rem] flex items-center justify-between border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)]">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="bg-primary p-3 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:rotate-[360deg] transition-transform duration-1000">
            <Gavel className="h-6 w-6 text-white" />
          </div>
          <span className="font-black text-2xl tracking-tighter text-white">
            المستشار <span className="text-primary">AI</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-12">
          <NavLink href="/consultants" label={isArabic ? "الاستشارات" : "Consultants"} />
          <NavLink href="/templates" label={isArabic ? "النماذج" : "Templates"} />
          <NavLink href="/match" label={isArabic ? "المطابقة" : "Match"} />
          <Link href="/bot" className="flex items-center gap-3 bg-white/5 hover:bg-primary text-white px-8 py-3 rounded-2xl font-black transition-all border border-white/5 group">
            <Sparkles className="h-5 w-5 animate-pulse text-primary group-hover:text-white" />
            {isArabic ? "مركز القيادة" : "Agent 4"}
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-2xl h-12 w-12 glass hover:bg-white/10" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="h-5 w-5 text-primary" /> : <Moon className="h-5 w-5 text-primary" />}
          </Button>
          
          <Button variant="ghost" size="icon" className="rounded-2xl h-12 w-12 glass hover:bg-white/10" onClick={toggleLanguage}>
            <Languages className="h-5 w-5 text-primary" />
          </Button>

          <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block" />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="rounded-2xl h-12 gap-3 px-6 glass-cosmic border-primary/20 hover:bg-primary hover:text-white transition-all shadow-xl">
                  <User className="h-5 w-5" /> 
                  <span className="hidden sm:inline-block font-black text-sm">{isArabic ? "حسابي" : "Account"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 rounded-[2.5rem] p-4 glass-cosmic border-white/10 shadow-2xl mt-4">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer hover:bg-white/10">
                    <LayoutDashboard className="h-5 w-5 text-primary" /> {isArabic ? "لوحة التحكم" : "Dashboard"}
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center gap-4 p-4 rounded-2xl text-primary font-black cursor-pointer bg-primary/10 hover:bg-primary/20">
                      <Lock className="h-5 w-5" /> {isArabic ? "غرفة القيادة" : "Admin Panel"}
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-white/5 my-2" />
                <DropdownMenuItem onClick={() => window.location.href = "/auth/login"} className="text-red-500 p-4 rounded-2xl cursor-pointer hover:bg-red-500/10">
                  {isArabic ? "تسجيل الخروج" : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/signup">
              <Button className="rounded-2xl h-12 px-10 font-black cosmic-gradient hover:scale-105 shadow-2xl transition-all">
                {isArabic ? "ابدأ الآن" : "Launch"}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="text-sm font-black text-white/50 hover:text-primary transition-all uppercase tracking-widest">
      {label}
    </Link>
  );
}
