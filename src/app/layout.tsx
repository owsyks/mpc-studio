import type { Metadata } from "next";
import "./globals.css";
import "katex/dist/katex.min.css";
import Link from "next/link";
import { BookOpen, Layers, Cpu, Award, Library, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "MPC Studio — Outils Mathématiques pour la Cryptographie",
  description: "Plateforme universitaire d'apprentissage des mathématiques pour la cryptographie — Université Oran 1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <body className="h-full flex flex-col bg-background text-foreground antialiased selection:bg-primary/15 selection:text-primary">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-40 w-full border-b border-border bg-card/85 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight text-foreground transition-opacity hover:opacity-90">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground font-mono text-xs font-bold shadow-sm">
                  MPC
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-sm font-semibold">MPC Studio</span>
                  <span className="text-[10px] text-muted-foreground font-mono">Univ. Oran 1 • Ing 3</span>
                </div>
              </Link>

              <nav className="hidden md:flex items-center gap-1 text-xs font-medium">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
                >
                  <Layers className="h-3.5 w-3.5" />
                  Tableau de bord
                </Link>
                <Link
                  href="/modules"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  Cours & Leçons
                </Link>
                <Link
                  href="/practice"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
                >
                  <Cpu className="h-3.5 w-3.5" />
                  Exercices & IA
                </Link>
                <Link
                  href="/math-lab"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Math Lab
                </Link>
                <Link
                  href="/exam"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
                >
                  <Award className="h-3.5 w-3.5" />
                  Simulateur d'Examen
                </Link>
                <Link
                  href="/library"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
                >
                  <Library className="h-3.5 w-3.5" />
                  Bibliothèque PDF
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                NVIDIA NIM actif
              </span>
              <Link
                href="/practice"
                className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Résoudre un exercice
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">{children}</main>

        {/* Footer */}
        <footer className="border-t border-border bg-card/50 py-6 text-xs text-muted-foreground">
          <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">MPC Studio</span>
              <span>— Outils Mathématiques pour la Cryptographie</span>
            </div>
            <div>
              Source académique : Université Oran 1 - Es Senia • Faculté des sciences exactes et appliquées
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
