"use client";

import React, { useState, use } from "react";
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
  XCircle,
  Sparkles,
  Send,
  Loader2,
  ExternalLink,
} from "lucide-react";
import curriculumData from "@/data/curriculum.json";
import { MathRenderer } from "@/components/math/MathRenderer";

interface PageProps {
  params: Promise<{
    moduleId: string;
    lessonId: string;
  }>;
}

export default function LessonPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { moduleId, lessonId } = resolvedParams;

  const currentModule = curriculumData.find((m) => m.id === moduleId);
  if (!currentModule) return notFound();

  const currentLesson = currentModule.lessons.find((l) => l.id === lessonId);
  if (!currentLesson) return notFound();

  // Find previous and next lessons
  const lessonIndex = currentModule.lessons.findIndex((l) => l.id === lessonId);
  const prevLesson = lessonIndex > 0 ? currentModule.lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < currentModule.lessons.length - 1 ? currentModule.lessons[lessonIndex + 1] : null;

  // State for progressive proof reveal
  const [revealedSteps, setRevealedSteps] = useState<number>(1);
  // State for quiz
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  // State for collapsible AI Tutor drawer
  const [isTutorOpen, setIsTutorOpen] = useState<boolean>(true);
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([
    {
      role: "assistant",
      content: `Bonjour ! Je suis votre tuteur NVIDIA NIM pour la leçon **"${currentLesson.title}"**. N'hésitez pas à me demander de réexpliquer une définition, de détailler un calcul ou de vous tester avec une question d'entraînement.`,
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  const proofSteps = currentLesson.content.workedExample?.steps || [];

  const handleSendMessage = async (textToSend?: string) => {
    const message = textToSend || inputMessage;
    if (!message.trim() || isAiLoading) return;

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
            content: "Une erreur est survenue lors de la communication avec l'assistant. Veuillez réessayer.",
          },
        ]);
      }
    } catch (e: any) {
      setChatMessages([
        ...newMessages,
        {
          role: "assistant",
          content: `Erreur de connexion au service AI : ${e.message}`,
        },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* 1. Left Sidebar: Curriculum Navigation */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-border bg-card/60 p-4 overflow-y-auto">
        <Link
          href="/modules"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Tous les modules
        </Link>

        <div className="text-xs font-mono font-semibold uppercase text-primary tracking-wider mb-2">
          {currentModule.title}
        </div>

        <nav className="space-y-1">
          {currentModule.lessons.map((lesson, idx) => {
            const isActive = lesson.id === currentLesson.id;
            return (
              <Link
                key={lesson.id}
                href={`/modules/${currentModule.id}/${lesson.id}`}
                className={`flex items-start gap-2.5 p-2 rounded-md text-xs transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground font-medium shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span className="font-mono text-[11px] opacity-70 mt-0.5">
                  {idx + 1}.
                </span>
                <div className="flex-1 leading-snug">
                  <div>{lesson.title}</div>
                  <div className={`text-[10px] ${isActive ? "text-primary-foreground/75" : "text-muted-foreground"}`}>
                    PDF p. {lesson.sourcePage}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Source info */}
        <div className="mt-auto pt-6 border-t border-border text-[11px] text-muted-foreground space-y-1">
          <div className="font-semibold text-foreground">Document source :</div>
          <div className="flex items-center gap-1">
            <FileText className="h-3 w-3 text-primary" />
            <span>{currentLesson.sourcePdf}</span>
          </div>
          <div>Page {currentLesson.sourcePage}</div>
          <Link
            href={`/library?doc=${currentLesson.sourcePdf}&page=${currentLesson.sourcePage}`}
            className="text-primary hover:underline inline-flex items-center gap-1 pt-1"
          >
            Ouvrir la page originale &rarr;
          </Link>
        </div>
      </aside>

      {/* 2. Center: Interactive Textbook Lesson Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 max-w-4xl mx-auto space-y-10">
        {/* Lesson Header */}
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-1">
            <span>{currentModule.title}</span>
            <span>•</span>
            <span>Leçon {currentLesson.order}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
            {currentLesson.title}
          </h1>

          {/* Objectives & Prerequisites Pills */}
          <div className="mt-4 flex flex-wrap gap-2">
            {currentLesson.objectives.map((obj, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded border border-border"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                {obj}
              </span>
            ))}
          </div>
        </div>

        {/* Section 1: Intuition */}
        <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-primary font-mono mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> 1. Intuition & Idée Fondamentale
          </h2>
          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            {currentLesson.content.intuition}
          </p>
        </section>

        {/* Section 2: Formal Definition */}
        <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-math-definition font-mono">
              2. Définition Formelle du Cours Universitaire
            </h2>
            <span className="text-[11px] font-mono text-muted-foreground">
              [Source : {currentLesson.sourcePdf}, p. {currentLesson.sourcePage}]
            </span>
          </div>

          <div className="prose prose-sm max-w-none text-foreground leading-relaxed bg-muted/40 p-4 rounded-md border border-border/80">
            <MathRenderer content={currentLesson.content.formalDefinition} />
          </div>
        </section>

        {/* Section 3: Notation Guide */}
        {currentLesson.content.notationGuide && (
          <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground font-mono mb-3">
              3. Décryptage des Symboles & Notations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentLesson.content.notationGuide.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded bg-muted/30 border border-border/60">
                  <div className="font-mono text-xs text-primary font-bold bg-card px-2 py-0.5 rounded border border-border shrink-0">
                    <MathRenderer content={`$${item.symbol}$`} />
                  </div>
                  <div className="text-xs text-muted-foreground leading-snug">
                    {item.meaning}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 4: Progressive Step-by-Step Proof Demo */}
        {currentLesson.content.workedExample && (
          <section className="rounded-lg border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-semibold uppercase text-math-theorem">
                  4. Démonstration Progressive Type TD
                </span>
                <h3 className="text-base font-serif font-bold text-foreground mt-0.5">
                  {currentLesson.content.workedExample.statement}
                </h3>
              </div>

              <div className="text-xs font-mono text-muted-foreground">
                Étape {Math.min(revealedSteps, proofSteps.length)} / {proofSteps.length}
              </div>
            </div>

            {/* Revealed Steps */}
            <div className="space-y-3 pt-2">
              {proofSteps.slice(0, revealedSteps).map((stepObj, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-border bg-muted/20 p-4 space-y-1.5 transition-all animate-in fade-in slide-in-from-top-1"
                >
                  <div className="text-xs font-mono font-semibold text-primary">
                    {stepObj.step}
                  </div>
                  <div className="text-xs sm:text-sm text-foreground leading-relaxed">
                    <MathRenderer content={stepObj.detail} />
                  </div>
                </div>
              ))}
            </div>

            {/* Controls for progressive proof */}
            <div className="pt-2 flex items-center justify-between border-t border-border">
              {revealedSteps < proofSteps.length ? (
                <button
                  onClick={() => setRevealedSteps((prev) => prev + 1)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium shadow-sm hover:bg-primary/90 transition-colors"
                >
                  Révéler l&apos;étape suivante &rarr;
                </button>
              ) : (
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> Démonstration complète terminée !
                </span>
              )}

              <button
                onClick={() => setRevealedSteps(revealedSteps === proofSteps.length ? 1 : proofSteps.length)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                {revealedSteps === proofSteps.length ? "Réinitialiser" : "Tout afficher"}
              </button>
            </div>
          </section>
        )}

        {/* Section 5: Comprehension Quiz */}
        {currentLesson.quiz && currentLesson.quiz.length > 0 && (
          <section className="rounded-lg border border-border bg-card p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4 text-primary" /> 5. Test de Compréhension Rapide
            </h2>

            {currentLesson.quiz.map((q, qIdx) => (
              <div key={qIdx} className="space-y-3">
                <div className="text-sm font-medium text-foreground">
                  <MathRenderer content={q.question} />
                </div>

                <div className="space-y-2">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = selectedQuizOption === oIdx;
                    const isCorrect = oIdx === q.answer;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => {
                          if (!quizSubmitted) setSelectedQuizOption(oIdx);
                        }}
                        className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm transition-all flex items-center justify-between ${
                          isSelected
                            ? "border-primary bg-primary/5 font-medium"
                            : "border-border hover:bg-muted/40"
                        } ${
                          quizSubmitted && isCorrect
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200"
                            : ""
                        } ${
                          quizSubmitted && isSelected && !isCorrect
                            ? "border-destructive bg-destructive/10 text-destructive"
                            : ""
                        }`}
                      >
                        <MathRenderer content={opt} />
                        {quizSubmitted && isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                        {quizSubmitted && isSelected && !isCorrect && (
                          <XCircle className="h-4 w-4 text-destructive" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {!quizSubmitted ? (
                  <button
                    disabled={selectedQuizOption === null}
                    onClick={() => setQuizSubmitted(true)}
                    className="mt-2 px-3 py-1.5 rounded bg-primary text-primary-foreground text-xs font-medium disabled:opacity-50"
                  >
                    Valider ma réponse
                  </button>
                ) : (
                  <div className="p-3 rounded bg-muted/60 text-xs text-muted-foreground space-y-1">
                    <div className="font-semibold text-foreground">Explication :</div>
                    <div>{q.explanation}</div>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Bottom Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-border">
          {prevLesson ? (
            <Link
              href={`/modules/${currentModule.id}/${prevLesson.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Leçon précédente : {prevLesson.title}
            </Link>
          ) : (
            <div />
          )}

          {nextLesson ? (
            <Link
              href={`/modules/${currentModule.id}/${nextLesson.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-primary text-primary-foreground text-xs font-medium shadow-sm hover:bg-primary/90"
            >
              Leçon suivante : {nextLesson.title} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <Link
              href="/practice"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-primary text-primary-foreground text-xs font-medium shadow-sm hover:bg-primary/90"
            >
              Passer aux exercices pratiques <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* 3. Right Panel: Collapsible Contextual AI Tutor */}
      <div
        className={`border-l border-border bg-card flex flex-col transition-all duration-300 ${
          isTutorOpen ? "w-80 lg:w-96" : "w-10"
        }`}
      >
        {/* Tutor Header Toggle */}
        <div className="p-3 border-b border-border flex items-center justify-between bg-muted/30">
          <button
            onClick={() => setIsTutorOpen(!isTutorOpen)}
            className="flex items-center gap-2 text-xs font-medium text-foreground hover:text-primary"
          >
            <Cpu className="h-4 w-4 text-primary" />
            {isTutorOpen && <span className="font-semibold">Tuteur NVIDIA NIM</span>}
          </button>
          {isTutorOpen && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
              Llama 3.1 70B
            </span>
          )}
        </div>

        {isTutorOpen && (
          <div className="flex-1 flex flex-col overflow-hidden p-3">
            {/* Quick Context Action Prompts */}
            <div className="mb-3 flex flex-wrap gap-1.5">
              {[
                "Explique plus simplement",
                "Donne un exemple",
                "Pourquoi est-ce vrai ?",
                "Pose-moi une question",
              ].map((prompt, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => handleSendMessage(prompt)}
                  className="text-[11px] px-2 py-1 rounded border border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg text-xs leading-relaxed ${
                    msg.role === "assistant"
                      ? "bg-muted/50 border border-border text-foreground"
                      : "bg-primary text-primary-foreground ml-4"
                  }`}
                >
                  <MathRenderer content={msg.content} />
                </div>
              ))}
              {isAiLoading && (
                <div className="p-2.5 rounded-lg bg-muted/40 text-xs text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                  <span>Réflexion du tuteur en cours...</span>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="mt-3 pt-2 border-t border-border flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Posez une question sur cette leçon..."
                className="flex-1 text-xs rounded-md border border-input bg-background px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                disabled={isAiLoading || !inputMessage.trim()}
                onClick={() => handleSendMessage()}
                className="p-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
