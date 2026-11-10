"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Cpu,
  RefreshCw,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  Camera,
  RotateCw,
  Sliders,
  Send,
  Loader2,
  Eye,
  Award,
  BookOpen,
  Sparkles,
} from "lucide-react";
import exercisesData from "@/data/exercises.json";
import { MathRenderer } from "@/components/math/MathRenderer";

export default function PracticePage() {
  const [exercises, setExercises] = useState<any[]>(exercisesData);
  const [currentExercise, setCurrentExercise] = useState<any>(exercisesData[0]);
  const [studentInput, setStudentInput] = useState<string>("");
  const [hintLevel, setHintLevel] = useState<number>(0);
  const [showSolution, setShowSolution] = useState<boolean>(false);

  // OCR state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [ocrConfirmed, setOcrConfirmed] = useState<boolean>(false);
  const [ambiguities, setAmbiguities] = useState<string[]>([]);
  const [imageRotation, setImageRotation] = useState<number>(0);

  // Grading state
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<any | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Switch exercise
  const handleSelectExercise = (ex: any) => {
    setCurrentExercise(ex);
    setStudentInput("");
    setHintLevel(0);
    setShowSolution(false);
    setUploadedImage(null);
    setOcrConfirmed(false);
    setEvaluationResult(null);
  };

  // Generate another exercise
  const handleGenerateVariation = async (difficulty: string = "Medium") => {
    setIsGenerating(true);
    try {
      const res = await fetch(`/api/exercises?action=generate&moduleId=${currentExercise.moduleId}&difficulty=${difficulty}`);
      const newEx = await res.json();
      setExercises((prev) => [newEx, ...prev]);
      handleSelectExercise(newEx);
    } catch (e) {
      console.error("Erreur de génération", e);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Image Upload for OCR
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setUploadedImage(base64);
      setOcrConfirmed(false);
      setIsTranscribing(true);

      try {
        const res = await fetch("/api/ocr/transcribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64 }),
        });
        const data = await res.json();
        if (data.transcription) {
          setStudentInput(data.transcription);
          setAmbiguities(data.ambiguities || []);
        }
      } catch (err) {
        console.error("Erreur OCR", err);
      } finally {
        setIsTranscribing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Submit answer for AI grading & rubric evaluation
  const handleEvaluateSubmission = async () => {
    if (!studentInput.trim() || isEvaluating) return;
    setIsEvaluating(true);

    try {
      const res = await fetch("/api/grading/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentWork: studentInput,
          exercise: currentExercise,
          ocrConfirmed,
        }),
      });
      const data = await res.json();
      setEvaluationResult(data);
    } catch (err) {
      console.error("Erreur d'évaluation", err);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Math insertion buttons
  const insertMathSnippet = (snippet: string) => {
    setStudentInput((prev) => prev + snippet);
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
      {/* 1. Left Column: Exercise Statement & Pedagogical Guidance */}
      <div className="w-full lg:w-1/2 border-r border-border overflow-y-auto p-6 sm:p-8 space-y-6">
        {/* Selector & Generator Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary">
              {currentExercise.sheet || "Généré par IA"}
            </span>
            <span className="text-xs font-mono text-muted-foreground">
              Difficulté : {currentExercise.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={isGenerating}
              onClick={() => handleGenerateVariation("Medium")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isGenerating ? "animate-spin" : ""}`} />
              Générer un autre exercice
            </button>
          </div>
        </div>

        {/* Exercise Quick Switcher */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {exercises.map((ex, idx) => (
            <button
              key={ex.id || idx}
              onClick={() => handleSelectExercise(ex)}
              className={`shrink-0 px-2.5 py-1 rounded text-xs font-mono border transition-all ${
                ex.id === currentExercise.id
                  ? "border-primary bg-primary text-primary-foreground font-semibold"
                  : "border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              Ex {ex.exerciseNumber || idx + 1}
            </button>
          ))}
        </div>

        {/* Statement Box */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
            <span>ÉNONCÉ OFFICIEL</span>
            {currentExercise.sourcePdf && (
              <span className="flex items-center gap-1 text-primary">
                <FileText className="h-3 w-3" />
                {currentExercise.sourcePdf} (p. {currentExercise.sourcePage})
              </span>
            )}
          </div>

          <h1 className="text-xl font-serif font-bold text-foreground">
            {currentExercise.title}
          </h1>

          <div className="prose prose-sm max-w-none text-foreground leading-relaxed pt-2">
            <MathRenderer content={currentExercise.statement} />
          </div>
        </div>

        {/* Progressive Hints (Level 1, 2, 3) */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              Indices Pédagogiques Progressifs
            </h2>
            <span className="text-xs font-mono text-muted-foreground">
              {hintLevel} / {currentExercise.hints?.length || 3} révélés
            </span>
          </div>

          {hintLevel === 0 && (
            <p className="text-xs text-muted-foreground">
              Vous êtes bloqué ? Débloquez un indice sans perdre vos points d&apos;évaluation.
            </p>
          )}

          <div className="space-y-2.5">
            {currentExercise.hints?.slice(0, hintLevel).map((hint: string, hIdx: number) => (
              <div
                key={hIdx}
                className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 text-xs text-foreground leading-relaxed space-y-1"
              >
                <div className="font-semibold text-amber-800 dark:text-amber-300 font-mono text-[11px]">
                  Indice {hIdx + 1} :
                </div>
                <div>
                  <MathRenderer content={hint} />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            {hintLevel < (currentExercise.hints?.length || 3) ? (
              <button
                onClick={() => setHintLevel((prev) => prev + 1)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-muted hover:bg-muted/80 text-xs font-medium text-foreground transition-colors"
              >
                <Lightbulb className="h-3.5 w-3.5 text-amber-500" /> Révéler l&apos;indice suivant
              </button>
            ) : (
              <span className="text-xs text-muted-foreground">Tous les indices ont été révélés.</span>
            )}

            <button
              onClick={() => setShowSolution(!showSolution)}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              <Eye className="h-3.5 w-3.5" />
              {showSolution ? "Masquer la solution" : "Consulter la solution officielle"}
            </button>
          </div>

          {/* Worked Solution Drawer */}
          {showSolution && (
            <div className="p-4 rounded-lg border border-border bg-muted/40 text-xs space-y-2 animate-in fade-in">
              <div className="font-semibold text-foreground font-serif">Solution détaillée :</div>
              {currentExercise.solution?.steps?.map((step: string, sIdx: number) => (
                <div key={sIdx} className="leading-relaxed text-foreground">
                  <MathRenderer content={step} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Right Column: Student Workspace, OCR Handwriting Upload & AI Grading */}
      <div className="w-full lg:w-1/2 overflow-y-auto p-6 sm:p-8 space-y-6 bg-muted/10">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-serif font-bold text-foreground flex items-center gap-2">
            <Cpu className="h-4 w-4 text-primary" />
            Votre Espace de Démonstration
          </h2>
          <span className="text-xs font-mono text-muted-foreground">
            Saisie LaTeX ou Photo manuscrite
          </span>
        </div>

        {/* OCR Image Upload Card */}
        <div className="rounded-xl border border-dashed border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Camera className="h-3.5 w-3.5 text-primary" />
              Téléverser une copie manuscrite (OCR Vision)
            </span>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-border bg-muted/60 hover:bg-muted text-xs font-medium text-foreground transition-colors"
            >
              <Upload className="h-3 w-3" /> Choisir une photo
            </button>
          </div>

          {uploadedImage && (
            <div className="pt-2 border-t border-border flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-36 h-28 rounded border border-border overflow-hidden bg-black/5 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={uploadedImage}
                  alt="Manuscrit"
                  style={{ transform: `rotate(${imageRotation}deg)` }}
                  className="w-full h-full object-cover transition-transform"
                />
              </div>

              <div className="space-y-2 flex-1 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setImageRotation((r) => (r + 90) % 360)}
                    className="p-1 rounded bg-muted hover:bg-muted/80 text-[11px] flex items-center gap-1"
                  >
                    <RotateCw className="h-3 w-3" /> Pivoter 90°
                  </button>
                  {isTranscribing && (
                    <span className="text-primary flex items-center gap-1 animate-pulse">
                      <Loader2 className="h-3 w-3 animate-spin" /> Transcription en cours...
                    </span>
                  )}
                </div>

                {ambiguities.length > 0 && (
                  <div className="p-2 rounded bg-amber-500/10 text-amber-800 dark:text-amber-300 text-[11px]">
                    <span className="font-semibold">Symboles ambigus détectés :</span> {ambiguities.join(", ")}
                  </div>
                )}

                <button
                  onClick={() => setOcrConfirmed(true)}
                  className={`px-3 py-1 rounded text-xs font-medium ${
                    ocrConfirmed
                      ? "bg-emerald-600 text-white"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {ocrConfirmed ? "✓ Transcription confirmée par l'étudiant" : "Confirmer la transcription"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mathematical Notation Quick Toolbar */}
        <div className="flex flex-wrap gap-1.5 p-2 rounded-lg bg-card border border-border">
          {[
            { label: "x⁻¹", math: "x^{-1}" },
            { label: "e", math: "e = (1, 0)" },
            { label: "∈", math: " \\in " },
            { label: "∀", math: " \\forall " },
            { label: "∃", math: " \\exists " },
            { label: "≡", math: " \\equiv " },
            { label: "Ker", math: "\\ker \\varphi" },
            { label: "Im", math: "\\operatorname{Im} \\varphi" },
            { label: "Z/nZ", math: "\\mathbb{Z}/n\\mathbb{Z}" },
            { label: "pgcd", math: "\\operatorname{pgcd}(a, n)" },
            { label: "Matrice", math: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}" },
          ].map((sym, sIdx) => (
            <button
              key={sIdx}
              onClick={() => insertMathSnippet(sym.math)}
              className="px-2 py-1 rounded bg-muted/60 hover:bg-muted text-xs font-mono border border-border/60 text-foreground"
            >
              {sym.label}
            </button>
          ))}
        </div>

        {/* Text Area for Solution */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-2">
          <label className="text-xs font-mono font-semibold uppercase text-muted-foreground">
            Votre Démonstration (Texte & LaTeX) :
          </label>
          <textarea
            rows={8}
            value={studentInput}
            onChange={(e) => setStudentInput(e.target.value)}
            placeholder="Rédigez votre preuve étape par étape... Ex :
1. Stabilité par la loi : soient x, y dans G...
2. Associativité : (x * y) * z = ...
3. Élément neutre : e = ...
4. Symétrique : x⁻¹ = ..."
            className="w-full text-xs sm:text-sm font-mono rounded-md border border-input bg-background p-3 focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
          />

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setStudentInput("")}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Effacer
            </button>

            <button
              disabled={isEvaluating || !studentInput.trim()}
              onClick={handleEvaluateSubmission}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-primary-foreground text-xs font-medium shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Évaluation par l&apos;IA...
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" /> Soumettre & Noter selon le Barème
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Preview of Mathematical Rendering */}
        {studentInput.trim() && (
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-2">
            <span className="text-xs font-mono font-semibold uppercase text-muted-foreground">
              Aperçu KaTeX de votre copie :
            </span>
            <div className="p-3 rounded bg-muted/30 text-xs sm:text-sm leading-relaxed border border-border/60">
              <MathRenderer content={studentInput} />
            </div>
          </div>
        )}

        {/* Evaluation Results Card */}
        {evaluationResult && (
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-5 animate-in fade-in">
            {/* Score Banner */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <span className="text-xs font-mono font-semibold uppercase text-primary">
                  RÉSULTAT DE LA CORRECTION
                </span>
                <h3 className="text-xl font-serif font-bold text-foreground">
                  Score : {evaluationResult.totalScore} / {evaluationResult.maxScore} Pts
                </h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-mono font-bold">
                {Math.round((evaluationResult.totalScore / evaluationResult.maxScore) * 100)}%
              </div>
            </div>

            {/* Step by Step correctness */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-semibold uppercase text-muted-foreground">
                Analyse pas à pas des étapes :
              </h4>
              {evaluationResult.stepAnalysis?.map((step: any, idx: number) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border text-xs space-y-1 ${
                    step.status === "correct"
                      ? "border-emerald-500/30 bg-emerald-500/5 text-foreground"
                      : step.status === "partial"
                      ? "border-amber-500/30 bg-amber-500/5 text-foreground"
                      : "border-destructive/30 bg-destructive/5 text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-semibold">
                    {step.status === "correct" && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
                    {step.status === "partial" && <AlertCircle className="h-3.5 w-3.5 text-amber-600" />}
                    {step.status === "incorrect" && <AlertCircle className="h-3.5 w-3.5 text-destructive" />}
                    <span>{step.step}</span>
                  </div>
                  <div className="text-muted-foreground text-[11px]">{step.comment}</div>
                </div>
              ))}
            </div>

            {/* Missing elements if any */}
            {evaluationResult.missingElements?.length > 0 && (
              <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 text-xs space-y-1">
                <div className="font-semibold text-amber-900 dark:text-amber-200">
                  Éléments ou axiomes manquants :
                </div>
                <ul className="list-disc list-inside text-[11px] text-amber-800 dark:text-amber-300">
                  {evaluationResult.missingElements.map((m: string, mIdx: number) => (
                    <li key={mIdx}>{m}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Personalized Revision Recommendation */}
            {evaluationResult.revisionTopics && (
              <div className="p-3 rounded-lg border border-border bg-muted/40 text-xs space-y-1">
                <div className="font-semibold text-foreground">Recommandations de révision ciblées :</div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {evaluationResult.revisionTopics.map((topic: string, tIdx: number) => (
                    <span key={tIdx} className="px-2 py-0.5 rounded bg-card border border-border text-[11px] font-mono">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
