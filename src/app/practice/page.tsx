"use client";

import React, { useState, useRef } from "react";
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
  Send,
  Loader2,
  Eye,
  Award,
  Sparkles,
  Check,
  ChevronDown,
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
      const topicType = currentExercise.sheet?.includes("1")
        ? "group-proof"
        : currentExercise.id?.includes("5")
        ? "element-order"
        : currentExercise.id?.includes("6")
        ? "modular-units"
        : "modular-inverse";

      const res = await fetch("/api/exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: topicType, difficulty }),
      });
      const generated = await res.json();
      if (generated && generated.id) {
        setExercises((prev) => [generated, ...prev]);
        handleSelectExercise(generated);
      }
    } catch (err) {
      console.error("Erreur de génération", err);
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
      {/* 1. Left Column: Exercise Statement & Guidance */}
      <div className="w-full lg:w-1/2 border-r border-border/80 overflow-y-auto p-6 sm:p-8 space-y-6">
        {/* Selector Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/20">
              {currentExercise.sheet || "Exercice Paramétré"}
            </span>
            <span className="text-xs font-mono text-muted-foreground">
              Difficulté : <span className="text-foreground font-semibold">{currentExercise.difficulty}</span>
            </span>
          </div>

          <button
            disabled={isGenerating}
            onClick={() => handleGenerateVariation("Medium")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/15 hover:bg-primary/25 text-primary text-xs font-medium transition-all shadow-sm disabled:opacity-50 border border-primary/30"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isGenerating ? "animate-spin" : ""}`} />
            <span>Générer une variation</span>
          </button>
        </div>

        {/* Quick Switcher Chips */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-mono text-muted-foreground uppercase">Choisir un exercice du programme :</div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {exercises.map((ex, idx) => (
              <button
                key={ex.id || idx}
                onClick={() => handleSelectExercise(ex)}
                className={`shrink-0 px-3 py-1 rounded-lg text-xs font-mono border transition-all ${
                  ex.id === currentExercise.id
                    ? "border-primary bg-primary text-white font-bold shadow-md shadow-primary/20"
                    : "border-border/70 bg-card/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                Ex {ex.exerciseNumber || idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Statement Box */}
        <div className="rounded-2xl border border-border/80 bg-card/70 p-6 shadow-sm space-y-3 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
            <span className="font-bold text-foreground">ÉNONCÉ OFFICIEL</span>
            {currentExercise.sourcePdf && (
              <span className="flex items-center gap-1 text-primary">
                <FileText className="h-3.5 w-3.5" />
                {currentExercise.sourcePdf} (p. {currentExercise.sourcePage})
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-serif font-bold text-foreground">
            {currentExercise.title}
          </h1>

          <div className="prose prose-invert max-w-none text-sm text-foreground/90 leading-relaxed pt-2 bg-muted/30 p-4 rounded-xl border border-border/70">
            <MathRenderer content={currentExercise.statement} />
          </div>
        </div>

        {/* Progressive Hints */}
        <div className="rounded-2xl border border-border/80 bg-card/70 p-6 shadow-sm space-y-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Indices Pédagogiques Progressifs
            </h2>
            <span className="text-xs font-mono text-muted-foreground bg-muted/60 px-2.5 py-0.5 rounded-full border border-border/60">
              {hintLevel} / {currentExercise.hints?.length || 3} révélés
            </span>
          </div>

          {hintLevel === 0 && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              Bloqué sur la démarche ? Débloquez les indices progressifs sans être pénalisé sur votre note finale.
            </p>
          )}

          <div className="space-y-2.5">
            {currentExercise.hints?.slice(0, hintLevel).map((hint: string, hIdx: number) => (
              <div
                key={hIdx}
                className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-foreground leading-relaxed space-y-1 animate-in fade-in"
              >
                <div className="font-semibold text-amber-300 font-mono text-[11px]">
                  Indice {hIdx + 1} :
                </div>
                <div className="text-amber-100/90">
                  <MathRenderer content={hint} />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border/70">
            {hintLevel < (currentExercise.hints?.length || 3) ? (
              <button
                onClick={() => setHintLevel((prev) => prev + 1)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-medium transition-colors border border-amber-500/30"
              >
                <Lightbulb className="h-3.5 w-3.5" /> Révéler l&apos;indice suivant ({hintLevel + 1})
              </button>
            ) : (
              <span className="text-xs text-muted-foreground">Tous les indices ont été révélés.</span>
            )}

            <button
              onClick={() => setShowSolution(!showSolution)}
              className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1.5 transition-colors"
            >
              <Eye className="h-3.5 w-3.5" />
              {showSolution ? "Masquer la solution" : "Consulter la solution officielle"}
            </button>
          </div>

          {showSolution && (
            <div className="p-4 rounded-xl border border-border/80 bg-muted/40 text-xs space-y-2 animate-in fade-in">
              <div className="font-semibold text-foreground font-serif text-sm">Solution officielle rédigée :</div>
              {currentExercise.solution?.steps?.map((step: string, sIdx: number) => (
                <div key={sIdx} className="leading-relaxed text-foreground/90 py-0.5">
                  <MathRenderer content={step} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Right Column: Student Workspace & AI Grading */}
      <div className="w-full lg:w-1/2 overflow-y-auto p-6 sm:p-8 space-y-6 bg-muted/10">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-serif font-bold text-foreground flex items-center gap-2">
            <Cpu className="h-4 w-4 text-primary" />
            Votre Espace de Démonstration
          </h2>
          <span className="text-xs font-mono text-muted-foreground">
            Saisie Manuscrite ou Clavier
          </span>
        </div>

        {/* OCR Image Upload Card */}
        <div className="rounded-2xl border border-dashed border-border/80 bg-card/60 p-5 space-y-3 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground flex items-center gap-2">
              <Camera className="h-4 w-4 text-primary" />
              Scanner une copie manuscrite (NVIDIA Vision)
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 bg-muted/60 hover:bg-muted text-xs font-medium text-foreground transition-colors"
            >
              <Upload className="h-3.5 w-3.5" /> Choisir une photo
            </button>
          </div>

          {uploadedImage && (
            <div className="pt-3 border-t border-border/70 flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-36 h-28 rounded-xl border border-border/80 overflow-hidden bg-black/40 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={uploadedImage}
                  alt="Manuscrit"
                  style={{ transform: `rotate(${imageRotation}deg)` }}
                  className="w-full h-full object-cover transition-transform"
                />
              </div>

              <div className="space-y-2.5 flex-1 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setImageRotation((r) => (r + 90) % 360)}
                    className="px-2.5 py-1 rounded bg-muted hover:bg-muted/80 text-[11px] flex items-center gap-1 border border-border/60"
                  >
                    <RotateCw className="h-3 w-3" /> Pivoter 90°
                  </button>
                  {isTranscribing && (
                    <span className="text-primary flex items-center gap-1 animate-pulse font-medium">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Transcription NVIDIA Vision en cours...
                    </span>
                  )}
                </div>

                {ambiguities.length > 0 && (
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]">
                    <span className="font-semibold">Symboles ambigus :</span> {ambiguities.join(", ")}
                  </div>
                )}

                <button
                  onClick={() => setOcrConfirmed(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    ocrConfirmed
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-primary text-white hover:bg-primary/90"
                  }`}
                >
                  {ocrConfirmed ? "✓ Transcription confirmée par l'étudiant" : "Confirmer la transcription"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mathematical Notation Quick Toolbar */}
        <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-card/60 border border-border/80">
          {[
            { label: "x⁻¹", math: "x^{-1}" },
            { label: "e", math: "e" },
            { label: "∈", math: " \\in " },
            { label: "∀", math: " \\forall " },
            { label: "∃", math: " \\exists " },
            { label: "≡", math: " \\equiv " },
            { label: "Ker", math: "\\ker(f)" },
            { label: "Im", math: "\\mathrm{Im}(f)" },
            { label: "Z/nZ", math: "\\mathbb{Z}/n\\mathbb{Z}" },
            { label: "pgcd", math: "\\gcd(a, n)" },
            { label: "φ(n)", math: "\\varphi(n)" },
            { label: "Matrice 3x3", math: "\\begin{pmatrix} 1 & a & c \\\\ 0 & 1 & b \\\\ 0 & 0 & 1 \\end{pmatrix}" },
          ].map((sym, sIdx) => (
            <button
              key={sIdx}
              onClick={() => insertMathSnippet(sym.math)}
              className="px-2.5 py-1 rounded-md bg-muted/60 hover:bg-muted text-xs font-mono border border-border/60 text-foreground transition-colors"
            >
              {sym.label}
            </button>
          ))}
        </div>

        {/* Text Area for Solution */}
        <div className="rounded-2xl border border-border/80 bg-card/70 p-5 shadow-sm space-y-3 backdrop-blur-md">
          <label className="text-xs font-mono font-semibold uppercase text-muted-foreground flex items-center justify-between">
            <span>Votre Démonstration (Texte & LaTeX) :</span>
            <span className="text-[11px] text-muted-foreground">Markdown & KaTeX supportés</span>
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
            className="w-full text-xs sm:text-sm font-mono rounded-xl border border-border/80 bg-background/80 p-3.5 focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
          />

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setStudentInput("")}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Effacer la copie
            </button>

            <button
              disabled={isEvaluating || !studentInput.trim()}
              onClick={handleEvaluateSubmission}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold shadow-md shadow-primary/25 hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Évaluation par l'IA...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" /> Soumettre & Corriger selon le Barème
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Preview */}
        {studentInput.trim() && (
          <div className="rounded-2xl border border-border/80 bg-card/70 p-5 shadow-sm space-y-2 backdrop-blur-md">
            <span className="text-xs font-mono font-semibold uppercase text-muted-foreground">
              Aperçu KaTeX de votre copie :
            </span>
            <div className="p-4 rounded-xl bg-muted/30 text-xs sm:text-sm leading-relaxed border border-border/60">
              <MathRenderer content={studentInput} />
            </div>
          </div>
        )}

        {/* Evaluation Results Card */}
        {evaluationResult && (
          <div className="rounded-2xl border border-border/80 bg-card/70 p-6 shadow-sm space-y-5 animate-in fade-in backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-border/70 pb-4">
              <div>
                <span className="text-xs font-mono font-semibold uppercase text-primary">
                  RÉSULTAT DE LA CORRECTION OFFICIELLE
                </span>
                <h3 className="text-2xl font-serif font-bold text-foreground mt-0.5">
                  Note : {evaluationResult.totalScore} / {evaluationResult.maxScore} Pts
                </h3>
              </div>
              <div className="h-12 w-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-mono font-extrabold text-base border border-primary/30">
                {Math.round((evaluationResult.totalScore / evaluationResult.maxScore) * 100)}%
              </div>
            </div>

            {/* Feedback message */}
            {evaluationResult.feedback && (
              <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 text-xs text-foreground/90 leading-relaxed">
                <span className="font-semibold text-primary">Avis du professeur examinateur : </span>
                {evaluationResult.feedback}
              </div>
            )}

            {/* Step by Step correctness */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-mono font-semibold uppercase text-muted-foreground">
                Analyse critère par critère :
              </h4>
              {evaluationResult.stepAnalysis?.map((step: any, idx: number) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                    step.status === "correct"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-foreground"
                      : step.status === "partial"
                      ? "border-amber-500/30 bg-amber-500/10 text-foreground"
                      : "border-destructive/30 bg-destructive/10 text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    {step.status === "correct" && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                    {step.status === "partial" && <AlertCircle className="h-4 w-4 text-amber-400" />}
                    {step.status === "incorrect" && <AlertCircle className="h-4 w-4 text-rose-400" />}
                    <span>{step.step}</span>
                  </div>
                  <div className="text-muted-foreground text-[11px] leading-relaxed pl-6">{step.comment}</div>
                </div>
              ))}
            </div>

            {/* Missing elements */}
            {evaluationResult.missingElements?.length > 0 && (
              <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs space-y-1.5">
                <div className="font-semibold text-amber-300">
                  Éléments ou justifications manquantes :
                </div>
                <ul className="list-disc list-inside text-[11px] text-amber-200/90 space-y-0.5">
                  {evaluationResult.missingElements.map((m: string, mIdx: number) => (
                    <li key={mIdx}>{m}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
