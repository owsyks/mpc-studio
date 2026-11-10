"use client";

import Link from "next/link";
import { BookOpen, FileText, ArrowRight, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { getCurriculum } from "@/lib/content";

export default function ModulesPage() {
  const { language, t } = useLanguage();
  const curriculumData = getCurriculum(language);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 w-full space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="text-xs font-mono font-semibold uppercase tracking-wider text-primary flex items-center gap-2">
          <BookOpen className="h-4 w-4" /> {language === "en" ? "Official University Curriculum • Oran 1" : "Programme Universitaire Officiel • Oran 1"}
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-foreground tracking-tight">
          {language === "en" ? "Syllabus & Detailed Lessons" : "Syllabus & Leçons Détaillées"}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
          {language === "en"
            ? "Access the 6 modules of mathematical tools for cryptography with in-depth explanations, step-by-step exam writing methods, traps, and quizzes."
            : "Accédez aux 6 modules d'outils mathématiques pour la cryptographie avec explications approfondies, protocoles pas-à-pas, pièges d'examen et quiz d'auto-évaluation."}
        </p>
      </div>

      {/* Modules List */}
      <div className="space-y-8">
        {curriculumData.map((module, idx) => (
          <div
            key={module.id}
            id={module.id}
            className="rounded-2xl border border-border/80 bg-card/70 shadow-sm overflow-hidden backdrop-blur-md"
          >
            {/* Module Banner */}
            <div className="border-b border-border/80 bg-gradient-to-r from-card via-muted/30 to-card p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-muted-foreground">
                  <span className="font-bold text-primary">MODULE 0{idx + 1}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5 bg-muted/60 px-2.5 py-0.5 rounded-full border border-border/60">
                    <FileText className="h-3 w-3 text-primary" />
                    <span>{module.sourcePdf} (Pages {module.sourcePages.join(", ")})</span>
                  </span>
                  <span>•</span>
                  <span>{module.lessons.length} {language === "en" ? "Lessons" : "Leçons"}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                  {module.title}
                </h2>

                <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
                  {module.shortDescription}
                </p>
              </div>

              <Link
                href={`/modules/${module.id}/${module.lessons[0].id}`}
                className="shrink-0 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-xs font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary/90 gap-2 active:scale-95"
              >
                <span>{language === "en" ? "Start Module" : "Commencer le module"}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Lessons List in this Module */}
            <div className="divide-y divide-border/60">
              {module.lessons.map((lesson, lIdx) => (
                <div
                  key={lesson.id}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors group"
                >
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-muted/80 text-foreground font-mono text-xs font-bold border border-border/70">
                        {lIdx + 1}
                      </span>
                      <Link
                        href={`/modules/${module.id}/${lesson.id}`}
                        className="text-base font-semibold text-foreground group-hover:text-primary transition-colors"
                      >
                        {lesson.title}
                      </Link>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted/70 text-muted-foreground border border-border/60">
                        PDF p. {lesson.sourcePage}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {lesson.content.intuition}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {lesson.objectives.slice(0, 2).map((obj, oIdx) => (
                        <span
                          key={oIdx}
                          className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted/50 px-2.5 py-0.5 rounded-md border border-border/50"
                        >
                          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                          <span>{obj}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <Link
                      href={`/modules/${module.id}/${lesson.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 bg-card hover:bg-muted/60 text-xs font-medium text-foreground transition-all group-hover:border-primary/40"
                    >
                      <span>{language === "en" ? "Study Lesson" : "Consulter"}</span>
                      <ArrowRight className="h-3 w-3 text-primary group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
