import type { Metadata } from "next";
import "./globals.css";
import "katex/dist/katex.min.css";
import Link from "next/link";
import { BookOpen, Layers, Cpu, Award, Library, Sparkles, Menu, X, ArrowUpRight } from "lucide-react";
import HeaderNav from "@/components/navigation/HeaderNav";

export const metadata: Metadata = {
  title: "MPC Studio — Outils Mathématiques pour la Cryptographie | Univ. Oran 1",
  description: "Plateforme d'apprentissage complète des mathématiques pour la cryptographie — 3ème Année Ingénieur, Université Oran 1.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full dark">
      <body className="h-full flex flex-col bg-background text-foreground antialiased selection:bg-primary/25 selection:text-white">
        {/* Subtle Background Glows */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/10 blur-[130px] rounded-full" />
          <div className="absolute top-1/3 -right-40 w-[450px] h-[350px] bg-indigo-500/5 blur-[120px] rounded-full" />
        </div>

        {/* Global Navigation Header */}
        <HeaderNav />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col z-10 relative">{children}</main>

        {/* Modern Academic Footer */}
        <footer className="border-t border-border/80 bg-card/60 backdrop-blur-md py-8 text-xs text-muted-foreground z-10 relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-mono text-xs font-bold shadow-sm">
                MPC
              </div>
              <div>
                <p className="font-semibold text-foreground">MPC Studio — Université Oran 1 Ahmed Ben Bella</p>
                <p className="text-[11px] text-muted-foreground">
                  Département d'Informatique • 3ème Année Ingénieur • Outils Mathématiques pour la Cryptographie
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5 text-xs">
              <Link href="/modules" className="hover:text-primary transition-colors">
                6 Modules de Cours
              </Link>
              <Link href="/practice" className="hover:text-primary transition-colors">
                10 Exercices TD & Générateur
              </Link>
              <Link href="/math-lab" className="hover:text-primary transition-colors">
                6 Outils Math Lab
              </Link>
              <Link href="/exam" className="hover:text-primary transition-colors">
                Examen Officiel 2025 (16 Pts)
              </Link>
              <Link href="/library" className="hover:text-primary transition-colors">
                7 Documents Originaux
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
