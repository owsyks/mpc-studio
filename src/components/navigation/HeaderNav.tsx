"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Layers, Cpu, Award, Library, Sparkles, Menu, X, ArrowRight, Sun, Moon } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";

export default function HeaderNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { href: "/dashboard", label: t("nav.dashboard"), icon: Layers },
    { href: "/modules", label: t("nav.courses"), icon: BookOpen },
    { href: "/practice", label: t("nav.practice"), icon: Cpu },
    { href: "/math-lab", label: t("nav.mathlab"), icon: Sparkles },
    { href: "/exam", label: t("nav.exam"), icon: Award },
    { href: "/library", label: t("nav.library"), icon: Library },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-600 text-white font-mono text-sm font-bold shadow-md shadow-primary/20 transition-transform group-hover:scale-105">
              MPC
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                MPC Studio
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {t("nav.subtitle")}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-medium">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-150 ${
                    isActive
                      ? "bg-primary/15 text-primary font-semibold border border-primary/25 shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right CTA, Language Switcher & Status */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Changer de thème"
            className="p-2 rounded-lg border border-border/80 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-500" />}
          </button>

          {/* Language Switcher */}
          <div className="flex items-center p-0.5 rounded-lg border border-border/80 bg-muted/40 text-xs font-mono">
            <button
              onClick={() => setLanguage("fr")}
              className={`px-2 py-1 rounded-md transition-all ${
                language === "fr"
                  ? "bg-primary text-white font-bold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              FR
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-2 py-1 rounded-md transition-all ${
                language === "en"
                  ? "bg-primary text-white font-bold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              EN
            </button>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{t("nav.status")}</span>
          </div>

          <Link
            href="/practice"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 text-xs font-medium text-white shadow-sm shadow-primary/25 hover:bg-primary/90 transition-all hover:gap-2 active:scale-95"
          >
            <span>{t("nav.train")}</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Mobile Hamburger Button & Quick Lang */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Changer de thème"
            className="p-1.5 rounded-lg border border-border/80 bg-card text-muted-foreground"
          >
            {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-500" />}
          </button>

          {/* Mobile Language Switcher */}
          <button
            onClick={() => setLanguage(language === "fr" ? "en" : "fr")}
            className="px-2 py-1 rounded-md border border-border/80 bg-card text-xs font-mono font-bold text-primary"
          >
            {language.toUpperCase()}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 focus:outline-none"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between mb-3 px-2 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>{t("nav.status")}</span>
            </div>
            <div className="flex items-center gap-1 font-mono">
              <button
                onClick={() => setLanguage("fr")}
                className={`px-1.5 py-0.5 rounded text-[11px] ${language === "fr" ? "bg-primary text-white" : "text-muted-foreground"}`}
              >
                FR
              </button>
              <span>/</span>
              <button
                onClick={() => setLanguage("en")}
                className={`px-1.5 py-0.5 rounded text-[11px] ${language === "en" ? "bg-primary text-white" : "text-muted-foreground"}`}
              >
                EN
              </button>
            </div>
          </div>
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-primary/20 text-primary font-semibold border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
