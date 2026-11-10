"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Cpu, Award, ArrowRight, CheckCircle2, AlertTriangle, Clock, RefreshCw, BarChart2 } from "lucide-react";
import { MathRenderer } from "@/components/math/MathRenderer";
import curriculumData from "@/data/curriculum.json";

export default function DashboardPage() {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [exerciseCount, setExerciseCount] = useState<number>(3);
  const [masteryScore, setMasteryScore] = useState<number>(68);

  useEffect(() => {
    // Read from localStorage if available
    const saved = localStorage.getItem("mpc_completed_lessons");
    if (saved) {
      try {
        setCompletedLessons(JSON.parse(saved));
      } catch (_) {}
    } else {
      // Default starting progress
      setCompletedLessons(["lesson-1-1", "lesson-1-2"]);
    }
  }, []);

  const totalLessons = curriculumData.reduce((acc, m) => acc + m.lessons.length, 0);
  const progressPercent = Math.round((completedLessons.length / totalLessons) * 100);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full">
      {/* Top Banner: Greeting & Continue Learning Action */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-1">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            Session d&apos;étude active • Université Oran 1
          </div>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            Bienvenue dans votre espace d&apos;étude MPC
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Reprenez votre entraînement là où vous vous étiez arrêté : Module 1, Leçon 3.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/modules/module-1/lesson-1-3"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 gap-1.5"
          >
            Reprendre : Sous-groupes & Critères <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/practice"
            className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-card px-4 text-xs font-medium text-foreground transition-colors hover:bg-muted gap-1.5"
          >
            <Cpu className="h-3.5 w-3.5" /> Exercice rapide
          </Link>
        </div>
      </div>

      {/* Grid: 3-column overview */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Study Flow */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Tracker Card */}
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-primary" />
                Progression Globale du Module OMC
              </h2>
              <span className="text-xs font-mono text-muted-foreground">
                {completedLessons.length} / {totalLessons} leçons ({progressPercent}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Modules summary chips */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {curriculumData.map((m, idx) => {
                const doneInMod = m.lessons.filter((l) => completedLessons.includes(l.id)).length;
                const isFinished = doneInMod === m.lessons.length && m.lessons.length > 0;
                return (
                  <div
                    key={m.id}
                    className={`p-2.5 rounded border text-xs ${
                      isFinished
                        ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-800 dark:text-emerald-300"
                        : "border-border bg-muted/30 text-muted-foreground"
                    }`}
                  >
                    <div className="font-semibold text-foreground truncate">
                      M{idx + 1}. {m.title}
                    </div>
                    <div className="text-[11px] font-mono mt-0.5">
                      {doneInMod} / {m.lessons.length} terminées
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommended Next Activities */}
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Activités recommandées aujourd&apos;hui
            </h2>

            <div className="space-y-3">
              <div className="flex items-start justify-between p-3.5 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary">
                      Leçon prioritaire
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      <MathRenderer content="Module 1 • Critères de sous-groupe condensé ($x * y^{-1} \in H$)" />
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Assimiler le critère à 1 point utilisé dans l&apos;Exercice 1 de l&apos;examen d&apos;Oran 1.
                  </p>
                </div>
                <Link
                  href="/modules/module-1/lesson-1-3"
                  className="shrink-0 text-xs font-medium text-primary hover:underline flex items-center gap-1"
                >
                  Étudier <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="flex items-start justify-between p-3.5 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400">
                      Entraînement TD
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      Fiche TD 1 • Exercice 2 (Groupe relativiste sur $]-1, 1[$)
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <MathRenderer content="Prouver la fermeture avec la factorisation $1 - (x*y) > 0$." />
                  </p>
                </div>
                <Link
                  href="/practice?ex=td1-ex2"
                  className="shrink-0 text-xs font-medium text-primary hover:underline flex items-center gap-1"
                >
                  Résoudre <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="flex items-start justify-between p-3.5 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-400">
                      Math Lab
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      <MathRenderer content="Visualiseur d'ordres et générateurs dans $\mathbb{Z}/20\mathbb{Z}$" />
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <MathRenderer content="Comprendre visuellement pourquoi $(\mathbb{Z}/20\mathbb{Z})^\times$ n'est pas cyclique." />
                  </p>
                </div>
                <Link
                  href="/math-lab"
                  className="shrink-0 text-xs font-medium text-primary hover:underline flex items-center gap-1"
                >
                  Explorer <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Weaknesses, Spaced Repetition & Exam Readiness */}
        <div className="space-y-6">
          {/* Exam Readiness Gauge */}
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
                Score de Maîtrise
              </h3>
              <Award className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-3xl font-serif font-bold text-foreground">{masteryScore}%</div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Calculé à partir des démonstrations vérifiées, quiz réussis et exercices résolus.
            </p>

            <div className="mt-4 pt-4 border-t border-border">
              <Link
                href="/exam"
                className="flex items-center justify-between w-full p-2.5 rounded bg-muted/60 hover:bg-muted text-xs font-medium text-foreground transition-colors"
              >
                <span>Sujet Officiel Ing 3 (1h)</span>
                <span className="text-[11px] font-mono text-primary font-semibold">16 Pts &rarr;</span>
              </Link>
            </div>
          </div>

          {/* Concepts needing revision */}
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono mb-3 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              Points à consolider
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200">
                <div className="font-semibold">Calcul d&apos;inverse matriciel et commutativité</div>
                <div className="text-[11px] mt-0.5 opacity-90">Attention à l&apos;inversion de produit : $(AB)^{-1} = B^{-1} A^{-1}$</div>
              </div>

              <div className="p-2.5 rounded bg-muted/60 border border-border text-foreground">
                <div className="font-semibold">Noyau et injectivité de morphismes</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  <MathRenderer content="Vérifier $\ker \varphi = \{e_1\}$ systématiquement" />
                </div>
              </div>

              <div className="p-2.5 rounded bg-muted/60 border border-border text-foreground">
                <div className="font-semibold">
                  <MathRenderer content="Algorithme d'Euclide étendu dans $\mathbb{Z}/n\mathbb{Z}$" />
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Remontée des restes pour Bézout</div>
              </div>
            </div>
          </div>

          {/* Quick link to Course PDFs */}
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm text-xs">
            <div className="font-semibold text-foreground mb-1">Bibliothèque du cours</div>
            <p className="text-muted-foreground text-[11px] mb-3">
              Consultez les 7 polycopiés scannés avec recherche rapide de théorèmes.
            </p>
            <Link
              href="/library"
              className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
            >
              Ouvrir la bibliothèque <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
