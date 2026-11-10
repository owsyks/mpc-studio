import Link from "next/link";
import { BookOpen, FileText, ArrowRight, CheckCircle2 } from "lucide-react";
import curriculumData from "@/data/curriculum.json";
import { MathRenderer } from "@/components/math/MathRenderer";

export default function ModulesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full">
      <div className="mb-8">
        <div className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
          Université Oran 1 • OMC 3ème Année Ingénieur
        </div>
        <h1 className="text-3xl font-serif font-bold text-foreground mt-1">
          Programme d&apos;Étude Complet
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-3xl">
          Les 6 modules d&apos;outils mathématiques pour la cryptographie issus fidèlement des notes de cours et travaux dirigés officiels.
        </p>
      </div>

      <div className="space-y-8">
        {curriculumData.map((module, idx) => (
          <div
            key={module.id}
            id={module.id}
            className="rounded-xl border border-border bg-card shadow-sm overflow-hidden"
          >
            {/* Module Header */}
            <div className="border-b border-border bg-muted/40 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-1">
                  <span>MODULE 0{idx + 1}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3 text-primary" />
                    Source : {module.sourcePdf} (Pages {module.sourcePages.join(", ")})
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground">
                  {module.title}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                  {module.shortDescription}
                </p>
              </div>

              <Link
                href={`/modules/${module.id}/${module.lessons[0].id}`}
                className="shrink-0 inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 gap-1.5"
              >
                Commencer le module <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Lessons List in this Module */}
            <div className="divide-y divide-border/60">
              {module.lessons.map((lesson, lIdx) => (
                <div
                  key={lesson.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/20 transition-colors"
                >
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">
                        {idx + 1}.{lIdx + 1}
                      </span>
                      <Link
                        href={`/modules/${module.id}/${lesson.id}`}
                        className="text-sm sm:text-base font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        {lesson.title}
                      </Link>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
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
                          className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-muted/40 px-2 py-0.5 rounded"
                        >
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          {obj}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/modules/${module.id}/${lesson.id}`}
                    className="shrink-0 text-xs font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    Ouvrir la leçon <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
