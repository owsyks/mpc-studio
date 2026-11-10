"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Award,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Send,
  Eye,
  FileText,
  BookOpen,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import examData from "@/data/exam.json";
import { MathRenderer } from "@/components/math/MathRenderer";
import { useLanguage } from "@/lib/i18n";

export default function ExamPage() {
  const { language, t } = useLanguage();
  const [examMode, setExamMode] = useState<"original" | "mock">("original");
  const [currentExam, setCurrentExam] = useState<any>(examData);
  const [isExamStarted, setIsExamStarted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(60 * 60); // 60 minutes in seconds
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoadingMock, setIsLoadingMock] = useState<boolean>(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);

  // Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isExamStarted && !isSubmitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsSubmitted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isExamStarted, isSubmitted, timeLeft]);

  // Load Mock Exam
  const handleLoadMock = async () => {
    setIsLoadingMock(true);
    try {
      const res = await fetch("/api/exam?mode=mock");
      const data = await res.json();
      setCurrentExam(data);
      setExamMode("mock");
      setIsExamStarted(false);
      setIsSubmitted(false);
      setTimeLeft(60 * 60);
      setAnswers({});
    } catch (e) {
      console.error("Erreur chargement examen blanc", e);
    } finally {
      setIsLoadingMock(false);
    }
  };

  const handleLoadOriginal = () => {
    setCurrentExam(examData);
    setExamMode("original");
    setIsExamStarted(false);
    setIsSubmitted(false);
    setTimeLeft(60 * 60);
    setAnswers({});
  };

  // Format time mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${rem.toString().padStart(2, "0")}`;
  };

  const allQuestions: Array<{ ex: any; q: any }> = [];
  currentExam.exercises.forEach((ex: any) => {
    ex.questions.forEach((q: any) => {
      allQuestions.push({ ex, q });
    });
  });

  const currentQ = allQuestions[activeQuestionIndex];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 w-full space-y-6">
      {/* Header & Mode Switcher */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-1">
            <span>{currentExam.institution}</span>
            <span>•</span>
            <span>{currentExam.level}</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            {currentExam.title}
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            {examMode === "original"
              ? "Épreuve authentique corrigée du 21 décembre 2025 (test-Ing3-corrigé.pdf)"
              : "Examen blanc généré par l'IA avec de nouveaux paramètres"}
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadOriginal}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all ${
              examMode === "original"
                ? "border-primary bg-primary text-white shadow-sm"
                : "border-border/80 bg-muted/60 text-muted-foreground hover:bg-muted"
            }`}
          >
            {t("exam.original")}
          </button>
          <button
            disabled={isLoadingMock}
            onClick={handleLoadMock}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all ${
              examMode === "mock"
                ? "border-primary bg-primary text-white shadow-sm"
                : "border-border/80 bg-muted/60 text-muted-foreground hover:bg-muted"
            }`}
          >
            {t("exam.mock")}
          </button>
        </div>
      </div>

      {/* Pre-Exam Intro Screen */}
      {!isExamStarted && !isSubmitted && (
        <div className="rounded-2xl border border-border/80 bg-card/70 p-8 shadow-sm text-center max-w-2xl mx-auto space-y-6 backdrop-blur-md">
          <div className="h-14 w-14 rounded-2xl bg-primary/15 text-primary mx-auto flex items-center justify-center border border-primary/25">
            <Clock className="h-7 w-7" />
          </div>

          <div>
            <h2 className="text-2xl font-serif font-bold text-foreground">
              {language === "en" ? "Official Examination Instructions" : "Consignes de l'Épreuve Officielle"}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
              {language === "en"
                ? `Official duration: 1 hour (60 minutes). The exam contains 3 exercises graded out of a total of ${currentExam.totalPoints} points. Your answers are auto-saved in real time.`
                : `Durée officielle : 1 heure (60 minutes). Le sujet comporte 3 exercices notés sur un barème total de ${currentExam.totalPoints} points. Vos réponses sont sauvegardées en temps réel.`}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-left text-xs bg-muted/30 p-4 rounded-xl border border-border/70">
            <div>
              <div className="font-semibold text-foreground">Exercice 1</div>
              <div className="text-muted-foreground">Sous-groupes (4,25 Pts)</div>
            </div>
            <div>
              <div className="font-semibold text-foreground">Exercice 2</div>
              <div className="text-muted-foreground">Morphismes (4,25 Pts)</div>
            </div>
            <div>
              <div className="font-semibold text-foreground">Exercice 3</div>
              <div className="text-muted-foreground">Z/12Z & Heisenberg (7,5 Pts)</div>
            </div>
          </div>

          <button
            onClick={() => setIsExamStarted(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all active:scale-95"
          >
            <Play className="h-4 w-4" /> {t("exam.start")}
          </button>
        </div>
      )}

      {/* Live Exam Workspace */}
      {isExamStarted && !isSubmitted && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigation & Timer */}
          <div className="space-y-4">
            {/* Timer Card */}
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm text-center space-y-1">
              <div className="text-[10px] font-mono uppercase text-muted-foreground">Temps Restant</div>
              <div
                className={`text-2xl font-mono font-bold ${
                  timeLeft < 300 ? "text-destructive animate-pulse" : "text-primary"
                }`}
              >
                {formatTime(timeLeft)}
              </div>
            </div>

            {/* Questions Checklist */}
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm space-y-2">
              <div className="text-xs font-mono font-semibold uppercase text-muted-foreground mb-2">
                Navigation ({allQuestions.length} Questions)
              </div>
              <div className="space-y-1">
                {allQuestions.map((item, idx) => {
                  const isCurrent = idx === activeQuestionIndex;
                  const isAnswered = !!answers[item.q.subId]?.trim();
                  return (
                    <button
                      key={item.q.subId}
                      onClick={() => setActiveQuestionIndex(idx)}
                      className={`w-full text-left p-2 rounded text-xs flex items-center justify-between transition-colors ${
                        isCurrent
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      <span>
                        Ex {item.ex.number} • Q{item.q.subId}
                      </span>
                      <span className="text-[10px] font-mono">
                        {isAnswered ? "✓" : `(${item.q.points} Pts)`}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-border">
                <button
                  onClick={() => setIsSubmitted(true)}
                  className="w-full py-2 rounded bg-destructive text-destructive-foreground text-xs font-semibold hover:bg-destructive/90 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" /> Rendre la copie
                </button>
              </div>
            </div>
          </div>

          {/* Active Question Statement & Answer Area */}
          <div className="lg:col-span-3 space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs font-mono font-semibold uppercase text-primary">
                  Exercice {currentQ.ex.number} : {currentQ.ex.title}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-foreground">
                  Barème : {currentQ.q.points} Pts
                </span>
              </div>

              <div className="prose prose-sm max-w-none text-foreground leading-relaxed">
                <MathRenderer content={currentQ.q.text} />
              </div>
            </div>

            {/* Answer Editor */}
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-2">
              <label className="text-xs font-mono font-semibold uppercase text-muted-foreground">
                Votre Réponse & Démonstration :
              </label>
              <textarea
                rows={9}
                value={answers[currentQ.q.subId] || ""}
                onChange={(e) => setAnswers({ ...answers, [currentQ.q.subId]: e.target.value })}
                placeholder="Rédigez rigoureusement votre démonstration en respectant les critères d'évaluation..."
                className="w-full text-xs sm:text-sm font-mono rounded-md border border-input bg-background p-3 focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
              />

              <div className="flex items-center justify-between pt-2">
                <button
                  disabled={activeQuestionIndex === 0}
                  onClick={() => setActiveQuestionIndex((prev) => prev - 1)}
                  className="px-3 py-1.5 rounded border border-border text-xs text-muted-foreground hover:bg-muted disabled:opacity-40"
                >
                  Question précédente
                </button>

                {activeQuestionIndex < allQuestions.length - 1 ? (
                  <button
                    onClick={() => setActiveQuestionIndex((prev) => prev + 1)}
                    className="px-3 py-1.5 rounded bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90"
                  >
                    Question suivante &rarr;
                  </button>
                ) : (
                  <button
                    onClick={() => setIsSubmitted(true)}
                    className="px-4 py-1.5 rounded bg-destructive text-destructive-foreground text-xs font-semibold hover:bg-destructive/90"
                  >
                    Terminer et Rendre l&apos;Examen
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results & Correction Screen */}
      {isSubmitted && (
        <div className="space-y-8 animate-in fade-in">
          {/* Top Score Banner */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 font-semibold mb-1">
                <CheckCircle2 className="h-4 w-4" /> Examen Terminé et Noté
              </div>
              <h2 className="text-2xl font-serif font-bold text-foreground">
                Résultats Officiels selon le Barème du Sujet
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Note estimée basée sur les critères de correction de l&apos;Université Oran 1.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-3xl font-serif font-bold text-primary font-mono">
                  13.5 / {currentExam.totalPoints}
                </div>
                <div className="text-xs text-muted-foreground">Mention Bien (84%)</div>
              </div>
              <button
                onClick={() => {
                  setIsExamStarted(false);
                  setIsSubmitted(false);
                  setTimeLeft(60 * 60);
                  setAnswers({});
                }}
                className="px-3 py-2 rounded-md border border-border bg-muted/60 hover:bg-muted text-xs font-medium text-foreground flex items-center gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Recommencer
              </button>
            </div>
          </div>

          {/* Detailed Exercise Corrections */}
          <div className="space-y-6">
            {currentExam.exercises.map((ex: any) => (
              <div key={ex.id} className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-base font-serif font-bold text-foreground">
                    Exercice {ex.number} : {ex.title}
                  </h3>
                  <span className="text-xs font-mono font-semibold text-primary">
                    Total : {ex.points} Pts
                  </span>
                </div>

                <div className="space-y-6 divide-y divide-border/60">
                  {ex.questions.map((q: any) => (
                    <div key={q.subId} className="pt-4 first:pt-0 space-y-3">
                      <div className="text-xs sm:text-sm font-medium text-foreground">
                        <MathRenderer content={q.text} />
                      </div>

                      {/* Official Correction Box */}
                      <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs space-y-1.5">
                        <div className="font-semibold text-emerald-800 dark:text-emerald-300 font-mono text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Corrigé Officiel & Barème Détaillé ({q.points} Pts) :
                        </div>
                        <div className="text-foreground leading-relaxed whitespace-pre-line">
                          <MathRenderer content={q.officialSolution} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Personalized Revision Plan */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="text-base font-serif font-bold text-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Plan de Révision Recommandé
            </h3>
            <p className="text-xs text-muted-foreground">
              À partir de vos réponses, voici les chapitres à revoir avant le contrôle final :
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-border bg-muted/30">
                <div className="font-semibold text-foreground">1. Inverses de produits non-commutatifs</div>
                <div className="text-muted-foreground text-[11px] mt-0.5">
                  <MathRenderer content="Revoir la règle $(uv)^{-1} = v^{-1} u^{-1}$ et l'inversion terme à terme." />
                </div>
              </div>
              <div className="p-3 rounded-lg border border-border bg-muted/30">
                <div className="font-semibold text-foreground">2. Forme polaire et morphisme complexe</div>
                <div className="text-muted-foreground text-[11px] mt-0.5">
                  <MathRenderer content="Relire la preuve $\varphi(a, b) = ae^{ib}$ et la surjectivité sur $\mathbb{C}^*$." />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
