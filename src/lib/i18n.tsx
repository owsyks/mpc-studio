"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "fr" | "en";

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Navigation
    "nav.dashboard": "Tableau de bord",
    "nav.courses": "Cours & Leçons",
    "nav.practice": "Exercices & IA",
    "nav.mathlab": "Math Lab",
    "nav.exam": "Examen (16 Pts)",
    "nav.library": "Bibliothèque",
    "nav.train": "S'entraîner",
    "nav.status": "NVIDIA NIM Connecté",
    "nav.subtitle": "Univ. Oran 1 • Ing 3",

    // Home
    "home.badge": "Université Oran 1 Ahmed Ben Bella • 3ème Année Ingénieur",
    "home.title1": "Outils Mathématiques pour la",
    "home.title2": "Cryptographie",
    "home.subtitle": "Plateforme académique d'élite propulsée par NVIDIA NIM : cours universitaires officiels, protocoles de démonstration pas-à-pas, générateur d'exercices infini, OCR de copies manuscrites et simulateur d'examen officiel.",
    "home.cta.modules": "Explorer les 6 Modules",
    "home.cta.practice": "Exercices TD & OCR",
    "home.cta.exam": "Simulateur d'Examen (1h)",
    "home.stats.docs": "Documents officiels analysés",
    "home.stats.lessons": "Leçons avec méthodes pas-à-pas",
    "home.stats.math": "Moteur mathématique déterministe",
    "home.stats.nim": "Gemma 4 31B & Vision 90B",
    "home.curriculum.title": "Programme d'Examen Universitaire",
    "home.curriculum.heading": "Les 6 Piliers Fondamentaux du Cours",
    "home.curriculum.all": "Accéder au sommaire complet",
    "home.features.heading": "Conçu Spécifiquement pour Réussir l'Épreuve d'Oran 1",
    "home.features.f1.title": "Protocoles Pas-à-Pas",
    "home.features.f1.desc": "Chaque cours détaille les étapes exactes de rédaction : vérification de la fermeture, calcul du neutre bilatéral, inverse formel et tableaux de Cayley.",
    "home.features.f2.title": "OCR Vision & Correction IA",
    "home.features.f2.desc": "Prenez votre copie de TD en photo : NVIDIA Vision transcrit votre écriture en LaTeX et applique le barème officiel avec diagnostic précis.",
    "home.features.f3.title": "Examen Réel 2025 (16 Pts)",
    "home.features.f3.desc": "Chronomètre officiel 60 minutes avec le sujet officiel 2025 (4.25 + 4.25 + 7.5 Pts), correction intégrale et révision ciblée.",

    // Modules
    "modules.title": "Syllabus & Leçons Détaillées",
    "modules.subtitle": "Accédez aux 6 modules d'outils mathématiques pour la cryptographie avec explications approfondies, protocoles pas-à-pas, pièges d'examen et quiz d'auto-évaluation.",
    "modules.start": "Commencer le module",
    "modules.view": "Consulter la leçon",
    "modules.all": "Tous les modules",

    // Lesson Tabs
    "lesson.tab.theory": "1. Cours & Théorie",
    "lesson.tab.method": "2. Méthode Pas-à-Pas",
    "lesson.tab.proof": "3. Démonstration Guidée",
    "lesson.tab.traps": "4. Pièges d'Examen",
    "lesson.tab.quiz": "5. Quiz d'Évaluation",
    "lesson.intuition.title": "Intuition & Utilité en Cryptographie",
    "lesson.formal.title": "Définition Formelle du Cours Universitaire",
    "lesson.theory.title": "Explication Mathématique Détaillée",
    "lesson.notation.title": "Symboles & Notations Mathématiques",
    "lesson.method.title": "Protocole Méthodologique d'Examen",
    "lesson.method.desc": "Voici les étapes obligatoires à rédiger mot pour mot sur votre feuille d'examen pour garantir tous les points attribués par l'équipe pédagogique d'Oran 1.",
    "lesson.method.ai": "Demander une explication IA",
    "lesson.proof.title": "Exercice d'Application Type TD (Démonstration Intégrale)",
    "lesson.proof.reveal": "Révéler l'étape suivante",
    "lesson.proof.reset": "Réinitialiser les étapes",
    "lesson.proof.completed": "Démonstration complète révélée avec succès !",
    "lesson.traps.title": "Pièges Fréquents & Erreurs à Éviter",
    "lesson.traps.desc": "Ces erreurs sont celles qui coûtent le plus de points aux étudiants lors des examens d'Oran 1. Mémorisez-les pour votre copie !",
    "lesson.prev": "Leçon précédente",
    "lesson.next": "Leçon suivante",
    "lesson.tutor.title": "Tuteur NVIDIA NIM",
    "lesson.tutor.chips": "Suggestions rapides :",
    "lesson.tutor.chip1": "Contre-exemple d'axiome",
    "lesson.tutor.chip2": "Piège n°1 d'examen",
    "lesson.tutor.chip3": "Tester ma maîtrise",
    "lesson.tutor.placeholder": "Posez une question sur le cours...",
    "lesson.tutor.loading": "Le tuteur rédige une réponse pédagogique...",

    // Practice
    "practice.title": "Votre Espace de Démonstration",
    "practice.generate": "Générer une variation",
    "practice.switch": "Choisir un exercice du programme :",
    "practice.statement": "ÉNONCÉ OFFICIEL",
    "practice.hints": "Indices Pédagogiques Progressifs",
    "practice.hint.next": "Révéler l'indice suivant",
    "practice.hint.all": "Tous les indices ont été révélés.",
    "practice.solution.show": "Consulter la solution officielle",
    "practice.solution.hide": "Masquer la solution",
    "practice.ocr.title": "Scanner une copie manuscrite (NVIDIA Vision)",
    "practice.ocr.btn": "Choisir une photo",
    "practice.ocr.rotate": "Pivoter 90°",
    "practice.ocr.confirm": "Confirmer la transcription",
    "practice.ocr.confirmed": "✓ Transcription confirmée par l'étudiant",
    "practice.work.label": "Votre Démonstration (Texte & LaTeX) :",
    "practice.work.placeholder": "Rédigez votre preuve étape par étape... Ex :\n1. Stabilité par la loi : soient x, y dans G...\n2. Associativité : (x * y) * z = ...\n3. Élément neutre : e = ...\n4. Symétrique : x⁻¹ = ...",
    "practice.clear": "Effacer la copie",
    "practice.submit": "Soumettre & Corriger selon le Barème",
    "practice.evaluating": "Évaluation par l'IA...",
    "practice.preview": "Aperçu KaTeX de votre copie :",
    "practice.score.title": "RÉSULTAT DE LA CORRECTION OFFICIELLE",
    "practice.score.teacher": "Avis du professeur examinateur :",
    "practice.score.criteria": "Analyse critère par critère :",
    "practice.score.missing": "Éléments ou justifications manquantes :",

    // Math Lab
    "mathlab.title": "Math Lab — Explorateur Algébrique",
    "mathlab.subtitle": "Visualisez concrètement les tables d'opérations finies, les orbites cycliques, les congruences modulaires, les partitions en classes et les matrices de Heisenberg du cours.",
    "mathlab.tab.cayley": "Table de Cayley (LCI)",
    "mathlab.tab.cyclic": "Groupe Cyclique & Ordre",
    "mathlab.tab.circle": "Cercle Modulaire Z/nZ",
    "mathlab.tab.cosets": "Classes & Quotients G/H",
    "mathlab.tab.homo": "Morphismes (Ker & Im)",
    "mathlab.tab.heisenberg": "Matrices de Heisenberg",

    // Exam
    "exam.title": "Simulateur d'Examen Universitaire",
    "exam.subtitle": "Entraînez-vous dans les conditions réelles de l'Université Oran 1 : 60 minutes, barème exact de 16,0 points.",
    "exam.original": "Sujet Historique 2025 (16 Pts)",
    "exam.mock": "Examen Blanc Inédit (IA)",
    "exam.start": "Démarrer l'Examen Chronométré",
    "exam.timeLeft": "Temps Restant",
    "exam.submit": "Rendre la Copie & Obtenir la Note",
  },
  en: {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.courses": "Courses & Lessons",
    "nav.practice": "Practice & AI",
    "nav.mathlab": "Math Lab",
    "nav.exam": "Exam (16 Pts)",
    "nav.library": "PDF Library",
    "nav.train": "Practice Now",
    "nav.status": "NVIDIA NIM Connected",
    "nav.subtitle": "Oran 1 Univ. • Eng 3",

    // Home
    "home.badge": "University Oran 1 Ahmed Ben Bella • 3rd Year Engineering",
    "home.title1": "Mathematical Tools for",
    "home.title2": "Cryptography",
    "home.subtitle": "Elite academic platform powered by NVIDIA NIM: official university course notes, step-by-step proof protocols, infinite exercise generation, handwritten OCR grading, and official exam simulation.",
    "home.cta.modules": "Explore 6 Modules",
    "home.cta.practice": "Exercises & OCR",
    "home.cta.exam": "Simulate Exam (1h)",
    "home.stats.docs": "Official documents indexed",
    "home.stats.lessons": "Lessons with step-by-step methods",
    "home.stats.math": "Deterministic math engine",
    "home.stats.nim": "Gemma 4 31B & Vision 90B",
    "home.curriculum.title": "Official Exam Curriculum",
    "home.curriculum.heading": "The 6 Core Pillars of the Course",
    "home.curriculum.all": "View complete syllabus",
    "home.features.heading": "Designed Specifically to Excel in Oran 1 Exams",
    "home.features.f1.title": "Step-by-Step Proof Protocols",
    "home.features.f1.desc": "Every lesson details the exact exam writing steps: closure verification, two-sided identity solving, formal inverses, and Cayley tables.",
    "home.features.f2.title": "Vision OCR & AI Grading",
    "home.features.f2.desc": "Take a photo of your handwritten tutorial sheet: NVIDIA Vision transcribes your work to LaTeX and grades it against the official rubric.",
    "home.features.f3.title": "Real 2025 Exam (16 Pts)",
    "home.features.f3.desc": "Official 60-minute countdown with the actual 2025 exam sheet (4.25 + 4.25 + 7.5 Pts), comprehensive solutions, and weak-point analysis.",

    // Modules
    "modules.title": "Syllabus & Detailed Lessons",
    "modules.subtitle": "Access all 6 mathematical cryptography modules with in-depth explanations, step-by-step protocols, exam pitfalls, and self-assessment quizzes.",
    "modules.start": "Start module",
    "modules.view": "View lesson",
    "modules.all": "All modules",

    // Lesson Tabs
    "lesson.tab.theory": "1. Course & Theory",
    "lesson.tab.method": "2. Step-by-Step Method",
    "lesson.tab.proof": "3. Guided Proof",
    "lesson.tab.traps": "4. Exam Traps",
    "lesson.tab.quiz": "5. Assessment Quiz",
    "lesson.intuition.title": "Intuition & Cryptographic Importance",
    "lesson.formal.title": "Official Course Formal Definition",
    "lesson.theory.title": "In-Depth Mathematical Explanation",
    "lesson.notation.title": "Mathematical Notation & Symbols",
    "lesson.method.title": "Step-by-Step Exam Writing Protocol",
    "lesson.method.desc": "Here are the mandatory mathematical steps to write verbatim on your exam sheet to ensure maximum points from the Oran 1 grading board.",
    "lesson.method.ai": "Ask AI explanation",
    "lesson.proof.title": "Official Tutorial Application Exercise (Complete Proof)",
    "lesson.proof.reveal": "Reveal next step",
    "lesson.proof.reset": "Reset steps",
    "lesson.proof.completed": "Complete proof successfully revealed!",
    "lesson.traps.title": "Common Exam Traps & Pitfalls",
    "lesson.traps.desc": "These are the recurring mistakes where students lose the most points in Oran 1 examinations. Memorize them for your paper!",
    "lesson.prev": "Previous lesson",
    "lesson.next": "Next lesson",
    "lesson.tutor.title": "NVIDIA NIM AI Tutor",
    "lesson.tutor.chips": "Quick prompts:",
    "lesson.tutor.chip1": "Axiom counter-example",
    "lesson.tutor.chip2": "Top exam trap",
    "lesson.tutor.chip3": "Test my understanding",
    "lesson.tutor.placeholder": "Ask a question about this lesson...",
    "lesson.tutor.loading": "The tutor is drafting a pedagogical response...",

    // Practice
    "practice.title": "Your Demonstration Workspace",
    "practice.generate": "Generate variation",
    "practice.switch": "Choose a course exercise:",
    "practice.statement": "OFFICIAL PROBLEM STATEMENT",
    "practice.hints": "Progressive Pedagogical Hints",
    "practice.hint.next": "Reveal next hint",
    "practice.hint.all": "All hints have been revealed.",
    "practice.solution.show": "View official solution",
    "practice.solution.hide": "Hide solution",
    "practice.ocr.title": "Scan handwritten work (NVIDIA Vision)",
    "practice.ocr.btn": "Choose photo",
    "practice.ocr.rotate": "Rotate 90°",
    "practice.ocr.confirm": "Confirm transcription",
    "practice.ocr.confirmed": "✓ Transcription confirmed by student",
    "practice.work.label": "Your Proof (Text & LaTeX):",
    "practice.work.placeholder": "Write your step-by-step mathematical proof... E.g.:\n1. Closure under operation: let x, y in G...\n2. Associativity: (x * y) * z = ...\n3. Identity element: e = ...\n4. Inverses: x⁻¹ = ...",
    "practice.clear": "Clear paper",
    "practice.submit": "Submit & Grade with Official Rubric",
    "practice.evaluating": "Grading by AI...",
    "practice.preview": "KaTeX preview of your submission:",
    "practice.score.title": "OFFICIAL CORRECTION REPORT",
    "practice.score.teacher": "Examiner evaluation:",
    "practice.score.criteria": "Criterion-by-criterion analysis:",
    "practice.score.missing": "Missing elements or justifications:",

    // Math Lab
    "mathlab.title": "Math Lab — Algebraic Explorer",
    "mathlab.subtitle": "Interact with finite operation tables, cyclic orbits, modular clocks, coset partitions, and Heisenberg matrix groups from the course.",
    "mathlab.tab.cayley": "Cayley Table (Binary Op)",
    "mathlab.tab.cyclic": "Cyclic Group & Order",
    "mathlab.tab.circle": "Modular Circle Z/nZ",
    "mathlab.tab.cosets": "Cosets & Quotients G/H",
    "mathlab.tab.homo": "Homomorphisms (Ker & Im)",
    "mathlab.tab.heisenberg": "Heisenberg Matrices",

    // Exam
    "exam.title": "University Exam Simulator",
    "exam.subtitle": "Practice under authentic Oran 1 exam conditions: 60 minutes, exact 16.0 points rubric.",
    "exam.original": "Historic 2025 Exam (16 Pts)",
    "exam.mock": "AI Generated Mock Exam",
    "exam.start": "Start Timed Exam",
    "exam.timeLeft": "Time Remaining",
    "exam.submit": "Submit Exam & View Grade",
  },
};

const LanguageContext = createContext<I18nContextType>({
  language: "fr",
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("fr");

  useEffect(() => {
    const saved = localStorage.getItem("mpc_language") as Language;
    if (saved === "fr" || saved === "en") {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("mpc_language", lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations["fr"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
