"use client";

import React, { useState, use, useRef, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BookOpen,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Cpu,
  FileText,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Send,
  Loader2,
  ExternalLink,
  Layers,
  Award,
  Lightbulb,
  Check,
  MessageSquare,
  Maximize2,
} from "lucide-react";
import { MathRenderer } from "@/components/math/MathRenderer";
import { useLanguage } from "@/lib/i18n";
import { getCurriculum } from "@/lib/content";

interface PageProps {
  params: Promise<{
    moduleId: string;
    lessonId: string;
  }>;
}

export default function LessonPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { moduleId, lessonId } = resolvedParams;
  const { language, t } = useLanguage();

  const curriculumData = getCurriculum(language);
  const currentModule = curriculumData.find((m) => m.id === moduleId);
  if (!currentModule) return notFound();

  const currentLesson = currentModule.lessons.find((l) => l.id === lessonId);
  if (!currentLesson) return notFound();

  // Find previous and next lessons
  const lessonIndex = currentModule.lessons.findIndex((l) => l.id === lessonId);
  const prevLesson = lessonIndex > 0 ? currentModule.lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < currentModule.lessons.length - 1 ? currentModule.lessons[lessonIndex + 1] : null;

  // Active Tab: "theory" | "method" | "proof" | "traps" | "quiz"
  const [activeTab, setActiveTab] = useState<"theory" | "method" | "proof" | "traps" | "quiz">("theory");

  // State for progressive proof reveal
  const [revealedSteps, setRevealedSteps] = useState<number>(1);
  // State for quiz
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // State for AI Tutor drawer
  const [isTutorOpen, setIsTutorOpen] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([
    {
      role: "assistant",
      content: language === "en"
        ? `Hello! I am your NVIDIA NIM AI Tutor for **"${currentLesson.title}"**. Feel free to ask me to clarify a concept, calculate intermediate steps, or test your exam readiness.`
        : `Bonjour ! Je suis votre tuteur NVIDIA NIM pour la leçon **"${currentLesson.title}"**. Posez-moi une question sur une étape de calcul, demandez un exemple supplémentaire ou faites-vous interroger sur les notions d'examen.`,
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Auto-scroll chat drawer whenever messages update or loading state changes
  useEffect(() => {
    if (isTutorOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isAiLoading, isTutorOpen]);

  const proofSteps = currentLesson.content.workedExample?.steps || [];
  const stepByStepMethods = (currentLesson.content as any).stepByStepMethod || [];
  const examPitfalls = (currentLesson.content as any).examPitfalls || [];
  const detailedTheory = (currentLesson.content as any).detailedTheory || "";

  const handleSendMessage = async (textToSend?: string) => {
    const message = textToSend || inputMessage;
    if (!message.trim() || isAiLoading) return;

    if (!isTutorOpen) setIsTutorOpen(true);

    const newMessages = [...chatMessages, { role: "user", content: message }];
    setChatMessages(newMessages);
    if (!textToSend) setInputMessage("");
    setIsAiLoading(true);

    try {
      const res = await fetch("/api/tutor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          context: {
            moduleId: currentModule.id,
            lessonTitle: currentLesson.title,
            explanationStyle: "pedagogical",
            language,
          },
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setChatMessages([...newMessages, { role: "assistant", content: data.reply }]);
      } else {
        setChatMessages([
          ...newMessages,
          {
            role: "assistant",
            content: language === "en"
              ? "An error occurred while communicating with the assistant. Please retry."
              : "Une erreur est survenue lors de la communication avec l'assistant. Veuillez réessayer.",
          },
        ]);
      }
    } catch (e: any) {
      setChatMessages([
        ...newMessages,
        {
          role: "assistant",
          content: language === "en"
            ? `Connection error to AI service: ${e.message}`
            : `Erreur de connexion au service AI : ${e.message}`,
        },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const askTutorAboutStep = (stepTitle: string) => {
    const prompt = language === "en"
      ? `Can you explain the following step for "${currentLesson.title}" in detail: "${stepTitle}" with a concrete example and exam traps?`
      : `Peux-tu m'expliquer en détail l'étape suivante pour ${currentLesson.title} : "${stepTitle}" avec un exemple concret et les pièges d'examen ?`;
    handleSendMessage(prompt);
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* 1. Left Sidebar: Curriculum Navigation */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-border/80 bg-card/40 backdrop-blur-md p-4 overflow-y-auto">
        <Link
          href="/modules"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Tous les modules
        </Link>

        <div className="text-[11px] font-mono font-semibold uppercase text-primary tracking-wider mb-2">
          {currentModule.title}
        </div>

        <nav className="space-y-1">
          {currentModule.lessons.map((lesson, idx) => {
            const isActive = lesson.id === currentLesson.id;
            return (
              <Link
                key={lesson.id}
                href={`/modules/${currentModule.id}/${lesson.id}`}
                className={`flex items-start gap-2.5 p-2.5 rounded-lg text-xs transition-all duration-150 ${
                  isActive
                    ? "bg-primary/20 text-primary font-semibold border border-primary/30 shadow-sm"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <span className="font-mono text-[11px] opacity-70 mt-0.5">
                  {idx + 1}.
                </span>
                <div className="flex-1 leading-snug">
                  <div>{lesson.title}</div>
                  <div className={`text-[10px] mt-0.5 ${isActive ? "text-primary/80" : "text-muted-foreground/80"}`}>
                    PDF p. {lesson.sourcePage}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Source info */}
        <div className="mt-auto pt-6 border-t border-border/70 text-[11px] text-muted-foreground space-y-2">
          <div className="font-semibold text-foreground flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-primary" />
            <span>Document source Oran 1 :</span>
          </div>
          <div className="bg-muted/40 p-2 rounded border border-border/60 text-[10px] font-mono">
            {currentLesson.sourcePdf} (Page {currentLesson.sourcePage})
          </div>
          <Link
            href={`/library?doc=${currentLesson.sourcePdf}&page=${currentLesson.sourcePage}`}
            className="text-primary hover:text-primary/80 text-xs font-medium inline-flex items-center gap-1 pt-1"
          >
            Ouvrir la page du PDF original &rarr;
          </Link>
        </div>
      </aside>

      {/* 2. Center: Interactive Textbook Lesson Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 max-w-5xl mx-auto space-y-8">
        {/* Lesson Breadcrumb & Header */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-muted-foreground">
            <Link href="/modules" className="hover:text-primary transition-colors">Modules</Link>
            <span>/</span>
            <span>{currentModule.title}</span>
            <span>/</span>
            <span className="text-primary font-semibold">Leçon {currentLesson.order}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground tracking-tight">
            {currentLesson.title}
          </h1>

          {/* Objectives Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {currentLesson.objectives.map((obj, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 text-xs bg-muted/60 text-foreground px-3 py-1 rounded-full border border-border/70"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                {obj}
              </span>
            ))}
          </div>
        </div>

        {/* Tab Selector Bar */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-card border border-border/80 overflow-x-auto shadow-sm">
          <button
            onClick={() => setActiveTab("theory")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === "theory"
                ? "bg-primary text-white shadow-md shadow-primary/25"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>{t("lesson.tab.theory")}</span>
          </button>

          <button
            onClick={() => setActiveTab("method")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === "method"
                ? "bg-primary text-white shadow-md shadow-primary/25"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>{t("lesson.tab.method")}</span>
            {stepByStepMethods.length > 0 && (
              <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
                {stepByStepMethods.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("proof")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === "proof"
                ? "bg-primary text-white shadow-md shadow-primary/25"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t("lesson.tab.proof")}</span>
          </button>

          <button
            onClick={() => setActiveTab("traps")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === "traps"
                ? "bg-primary text-white shadow-md shadow-primary/25"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>{t("lesson.tab.traps")}</span>
          </button>

          {currentLesson.quiz && currentLesson.quiz.length > 0 && (
            <button
              onClick={() => setActiveTab("quiz")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === "quiz"
                  ? "bg-primary text-white shadow-md shadow-primary/25"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <Award className="h-3.5 w-3.5" />
              <span>{t("lesson.tab.quiz")}</span>
            </button>
          )}
        </div>

        {/* TAB 1: COURS & THEORIE DETAILLEE */}
        {activeTab === "theory" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Section 1: Intuition */}
            <section className="rounded-xl border border-border/80 bg-card/70 p-6 shadow-sm">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-primary font-mono mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> {t("lesson.intuition.title")}
              </h2>
              <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                {currentLesson.content.intuition}
              </p>
            </section>

            {/* Section 2: Définition Formelle Officielle */}
            <section className="rounded-xl border border-border/80 bg-card/70 p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-blue-400 font-mono flex items-center gap-2">
                  <BookOpen className="h-4 w-4" /> {t("lesson.formal.title")}
                </h2>
                <span className="text-[11px] font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded border border-border/60">
                  {currentLesson.sourcePdf} • p. {currentLesson.sourcePage}
                </span>
              </div>

              <div className="text-sm text-foreground/90 leading-relaxed bg-muted/40 p-5 rounded-lg border border-border/80">
                <MathRenderer content={currentLesson.content.formalDefinition} />
              </div>
            </section>

            {/* Section 3: Explication Théorique Approfondie */}
            {detailedTheory && (
              <section className="rounded-xl border border-border/80 bg-card/70 p-6 shadow-sm space-y-4">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" /> Explication Mathématique Détaillée
                </h2>
                <div className="prose prose-invert max-w-none text-sm text-foreground/90 leading-relaxed space-y-3">
                  <MathRenderer content={detailedTheory} />
                </div>
              </section>
            )}

            {/* Section 4: Décryptage des Notations */}
            {currentLesson.content.notationGuide && (
              <section className="rounded-xl border border-border/80 bg-card/70 p-6 shadow-sm">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono mb-4">
                  Symboles & Notations Mathématiques
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentLesson.content.notationGuide.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-card border border-border shadow-xs">
                      <div className="font-mono text-xs text-primary font-bold bg-muted/60 px-2.5 py-1.5 rounded-lg border border-border shrink-0">
                        <MathRenderer content={`$${item.symbol}$`} />
                      </div>
                      <div className="text-xs text-foreground/90 leading-relaxed pt-1">
                        <MathRenderer content={item.meaning} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* TAB 2: METHODE PAS A PAS D'EXAMEN */}
        {activeTab === "method" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/25 flex items-start gap-3">
              <Layers className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <p className="font-semibold text-foreground text-sm">{t("lesson.method.title")}</p>
                <p className="text-muted-foreground mt-0.5">
                  {t("lesson.method.desc")}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {stepByStepMethods.map((m: any, idx: number) => (
                <div key={idx} className="rounded-xl border border-border/80 bg-card/70 p-6 space-y-4 shadow-sm hover:border-primary/40 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20 text-primary font-mono text-xs font-bold border border-primary/30">
                        {m.stepNumber || idx + 1}
                      </div>
                      <h3 className="text-base font-semibold text-foreground">
                        {m.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => askTutorAboutStep(m.title)}
                      className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium self-start sm:self-auto"
                    >
                      <Sparkles className="h-3 w-3" /> {t("lesson.method.ai")} &rarr;
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2 p-3.5 rounded-lg bg-muted/40 border border-border/70">
                      <div className="font-semibold text-foreground flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Objectif & Démarche :</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {m.goal}
                      </p>
                      <div className="mt-2 text-foreground/90 whitespace-pre-line leading-relaxed">
                        <MathRenderer content={m.procedure} />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-950 dark:text-emerald-200">
                        <div className="font-bold flex items-center gap-1.5 mb-1.5 text-emerald-950 dark:text-emerald-300 text-xs">
                          <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>{language === "en" ? "Oran 1 Exam Writing Tip:" : "Astuce de Rédaction d'Oran 1 :"}</span>
                        </div>
                        <div className="text-[12px] leading-relaxed text-emerald-950 dark:text-emerald-200 font-medium">
                          <MathRenderer content={m.examTip || ""} />
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-950 dark:text-rose-200">
                        <div className="font-bold flex items-center gap-1.5 mb-1.5 text-rose-950 dark:text-rose-300 text-xs">
                          <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
                          <span>{language === "en" ? "Frequent Exam Trap to Avoid:" : "Piège classique à éviter :"}</span>
                        </div>
                        <div className="text-[12px] leading-relaxed text-rose-950 dark:text-rose-200 font-medium">
                          <MathRenderer content={m.commonTrap || m.pitfallToAvoid || ""} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DEMONSTRATION COMPLETE GUIDEE */}
        {activeTab === "proof" && currentLesson.content.workedExample && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="rounded-xl border border-border/80 bg-card/70 p-6 space-y-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
                <div>
                  <span className="text-xs font-mono font-semibold uppercase text-amber-400">
                    {t("lesson.proof.title")}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-foreground mt-1">
                    {currentLesson.content.workedExample.statement}
                  </h3>
                </div>

                <div className="text-xs font-mono text-muted-foreground bg-muted/60 px-3 py-1 rounded-full border border-border/60 shrink-0">
                  {language === "en" ? "Step" : "Étape"} {Math.min(revealedSteps, proofSteps.length)} / {proofSteps.length}
                </div>
              </div>

              {/* Progressive proof steps */}
              <div className="space-y-4">
                {proofSteps.slice(0, revealedSteps).map((step, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-muted/30 border border-border/80 space-y-2 animate-in fade-in duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-primary">
                        {step.step}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {language === "en" ? "Justification verified" : "Justification validée"}
                      </span>
                    </div>
                    <div className="text-sm text-foreground/90 leading-relaxed">
                      <MathRenderer content={step.detail} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Reveal controls */}
              <div className="pt-2 flex items-center justify-between border-t border-border/60">
                {revealedSteps < proofSteps.length ? (
                  <button
                    onClick={() => setRevealedSteps(revealedSteps + 1)}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white shadow-sm shadow-primary/25 hover:bg-primary/90 transition-all"
                  >
                    <span>{t("lesson.proof.reveal")} ({revealedSteps + 1} / {proofSteps.length})</span>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                    <CheckCircle2 className="h-4 w-4" />
                    {t("lesson.proof.completed")}
                  </div>
                )}

                {revealedSteps > 1 && (
                  <button
                    onClick={() => setRevealedSteps(1)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t("lesson.proof.reset")}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PIEGES D'EXAMEN */}
        {activeTab === "traps" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <p className="font-bold text-rose-950 dark:text-rose-200 text-sm">{t("lesson.traps.title")}</p>
                <p className="text-rose-900/90 dark:text-rose-200/90 mt-0.5 font-medium">
                  {t("lesson.traps.desc")}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {examPitfalls.map((trap: string, idx: number) => (
                <div key={idx} className="p-4 rounded-xl bg-card border border-border/80 flex items-start gap-3 shadow-sm">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                    <MathRenderer content={trap} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: QUIZ D'AUTO-EVALUATION */}
        {activeTab === "quiz" && currentLesson.quiz && currentLesson.quiz.length > 0 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {currentLesson.quiz.map((q, qIdx) => (
              <div key={qIdx} className="rounded-xl border border-border/80 bg-card/70 p-6 shadow-sm space-y-4">
                <h3 className="text-sm sm:text-base font-semibold text-foreground">
                  Question : <MathRenderer content={q.question} />
                </h3>

                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedQuizOption === optIdx;
                    const isCorrect = optIdx === q.answer;
                    let optionStyle = "border-border/80 bg-muted/30 text-foreground hover:bg-muted/60";

                    if (quizSubmitted) {
                      if (isCorrect) {
                        optionStyle = "border-emerald-500 bg-emerald-500/15 text-emerald-950 dark:text-emerald-200 font-bold";
                      } else if (isSelected && !isCorrect) {
                        optionStyle = "border-rose-500 bg-rose-500/15 text-rose-950 dark:text-rose-200 font-semibold";
                      } else {
                        optionStyle = "opacity-50 border-border/40 text-muted-foreground";
                      }
                    } else if (isSelected) {
                      optionStyle = "border-primary bg-primary/15 text-primary font-medium";
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={quizSubmitted}
                        onClick={() => setSelectedQuizOption(optIdx)}
                        className={`w-full text-left p-3.5 rounded-lg border text-xs sm:text-sm transition-all flex items-center justify-between ${optionStyle}`}
                      >
                        <MathRenderer content={opt} />
                        {quizSubmitted && isCorrect && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        )}
                        {quizSubmitted && isSelected && !isCorrect && (
                          <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {!quizSubmitted ? (
                  <button
                    disabled={selectedQuizOption === null}
                    onClick={() => setQuizSubmitted(true)}
                    className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white shadow-sm shadow-primary/25 hover:bg-primary/90 disabled:opacity-50 transition-all"
                  >
                    Valider la réponse
                  </button>
                ) : (
                  <div className="p-3.5 rounded-lg bg-muted/40 border border-border/80 text-xs space-y-1">
                    <div className="font-semibold text-foreground flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      <span>Explication détaillée :</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Inline AI Assistant Card */}
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 sm:p-6 space-y-4 shadow-sm backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/20 text-primary border border-primary/30">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  {language === "en" ? "Ask AI Tutor about this lesson" : "Une question sur cette leçon ?"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {language === "en"
                    ? "NVIDIA NIM answers your questions with exact Oran 1 proofs and citations."
                    : "L'IA NVIDIA NIM répond avec les démonstrations exactes et citations du cours d'Oran 1."}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsTutorOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold self-start sm:self-auto transition-colors"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>{language === "en" ? "Open Full Chat Drawer" : "Ouvrir le panneau complet"}</span>
            </button>
          </div>

          {/* Quick prompt chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={() => handleSendMessage(language === "en" ? `Explain the core theorem of "${currentLesson.title}" step by step.` : `Explique-moi le théorème central de "${currentLesson.title}" pas-à-pas.`)}
              className="text-xs bg-card hover:bg-muted px-3 py-1.5 rounded-lg border border-border text-foreground transition-colors"
            >
              ✨ {language === "en" ? "Explain core theorem" : "Expliquer le théorème central"}
            </button>
            <button
              onClick={() => handleSendMessage(language === "en" ? `Give me a classic exam counter-example for "${currentLesson.title}".` : `Donne-moi un contre-exemple d'examen classique pour "${currentLesson.title}".`)}
              className="text-xs bg-card hover:bg-muted px-3 py-1.5 rounded-lg border border-border text-foreground transition-colors"
            >
              ⚠️ {language === "en" ? "Classic counter-example" : "Contre-exemple classique"}
            </button>
            <button
              onClick={() => handleSendMessage(language === "en" ? `Ask me a quick oral exam question on "${currentLesson.title}".` : `Pose-moi une question type examen pour tester ma compréhension.`)}
              className="text-xs bg-card hover:bg-muted px-3 py-1.5 rounded-lg border border-border text-foreground transition-colors"
            >
              🎯 {language === "en" ? "Test my understanding" : "Tester ma compréhension"}
            </button>
          </div>

          {/* Direct Input Field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2 pt-1"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={language === "en" ? "Type your question here (e.g. How to prove associativity for this law?)..." : "Tapez votre question ici (ex: Comment rédiger la clôture de la loi ?)..."}
              className="flex-1 bg-card border border-border rounded-xl px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
            />
            <button
              type="submit"
              disabled={isAiLoading || !inputMessage.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold disabled:opacity-50 transition-all shadow-md shadow-primary/25"
            >
              {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span>{language === "en" ? "Ask" : "Poser"}</span>
            </button>
          </form>
        </div>

        {/* Bottom Navigation: Previous / Next Lesson */}
        <div className="pt-6 border-t border-border/80 flex items-center justify-between">
          {prevLesson ? (
            <Link
              href={`/modules/${currentModule.id}/${prevLesson.id}`}
              className="inline-flex items-center gap-2 rounded-lg border border-border/80 bg-card px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <div className="text-left">
                <div className="text-[10px] text-muted-foreground">{t("lesson.prev")}</div>
                <div className="text-foreground">{prevLesson.title}</div>
              </div>
            </Link>
          ) : <div />}

          {nextLesson && (
            <Link
              href={`/modules/${currentModule.id}/${nextLesson.id}`}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-medium text-white shadow-sm shadow-primary/25 hover:bg-primary/90 transition-all"
            >
              <div className="text-right">
                <div className="text-[10px] text-white/80">{t("lesson.next")}</div>
                <div className="text-white font-semibold">{nextLesson.title}</div>
              </div>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Floating Action Button to toggle AI Tutor drawer when closed */}
      {!isTutorOpen && (
        <button
          onClick={() => setIsTutorOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/40 border border-white/20 transition-all hover:scale-105"
        >
          <Cpu className="h-4 w-4 text-emerald-300" />
          <span className="text-xs font-semibold">{t("lesson.tutor.title")}</span>
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      )}

      {/* 3. Right: Collapsible NVIDIA NIM AI Copilot Drawer */}
      <div
        className={`fixed top-16 bottom-0 right-0 z-50 flex flex-col border-l border-border bg-card shadow-2xl transition-all duration-300 ${
          isTutorOpen ? "w-[360px] sm:w-[420px] translate-x-0" : "w-0 translate-x-full pointer-events-none"
        }`}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-card shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Cpu className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-foreground">{t("lesson.tutor.title")}</div>
              <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                NVIDIA NIM • RAG Oran 1
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsTutorOpen(false)}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground text-xs transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Suggestion Chips */}
        <div className="p-3 border-b border-border/60 bg-muted/20 shrink-0 space-y-1.5">
          <span className="text-[10px] font-mono uppercase text-muted-foreground">{t("lesson.tutor.chips")}</span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => handleSendMessage(language === "en" ? "Explain the 4 group axioms with a classic counter-example." : "Explique-moi les 4 axiomes avec un contre-exemple classique.")}
              className="text-[11px] bg-card hover:bg-muted px-2.5 py-1 rounded-lg border border-border/80 text-muted-foreground hover:text-foreground text-left transition-colors"
            >
              {t("lesson.tutor.chip1")}
            </button>
            <button
              onClick={() => handleSendMessage(language === "en" ? "What is the #1 trap to avoid on this topic during exams?" : "Quel est le piège n°1 à éviter sur cette leçon à l'examen ?")}
              className="text-[11px] bg-card hover:bg-muted px-2.5 py-1 rounded-lg border border-border/80 text-muted-foreground hover:text-foreground text-left transition-colors"
            >
              {t("lesson.tutor.chip2")}
            </button>
            <button
              onClick={() => handleSendMessage(language === "en" ? "Ask me a question to test my understanding of this lesson." : "Pose-moi une question pour tester ma maîtrise.")}
              className="text-[11px] bg-card hover:bg-muted px-2.5 py-1 rounded-lg border border-border/80 text-muted-foreground hover:text-foreground text-left transition-colors"
            >
              {t("lesson.tutor.chip3")}
            </button>
          </div>
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl text-xs leading-relaxed ${
                msg.role === "assistant"
                  ? "bg-muted/50 border border-border/80 text-foreground"
                  : "bg-primary text-white ml-6 shadow-sm shadow-primary/20"
              }`}
            >
              <div className="text-[10px] font-mono mb-1 opacity-70">
                {msg.role === "assistant" ? "NVIDIA NIM Copilot" : (language === "en" ? "You" : "Vous")}
              </div>
              <MathRenderer content={msg.content} />
            </div>
          ))}
          {isAiLoading && (
            <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>{t("lesson.tutor.loading")}</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar - ALWAYS PINNED & VISIBLE AT THE BOTTOM */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 border-t border-border bg-card shrink-0 flex gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={t("lesson.tutor.placeholder")}
            className="flex-1 bg-muted/40 border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
          />
          <button
            type="submit"
            disabled={isAiLoading || !inputMessage.trim()}
            className="p-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-sm"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
