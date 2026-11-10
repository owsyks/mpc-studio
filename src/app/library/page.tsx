"use client";

import React, { useState } from "react";
import {
  Library,
  FileText,
  Search,
  ExternalLink,
  ChevronRight,
  Eye,
  CheckCircle2,
  AlertCircle,
  Copy,
  BookOpen,
} from "lucide-react";
import courseKbData from "@/data/course_kb.json";
import duplicateData from "@/data/duplicate_detection.json";
import { MathRenderer } from "@/components/math/MathRenderer";

export default function LibraryPage() {
  const documents = [
    {
      id: "cours1",
      filename: "cours-mpc-partie1.pdf",
      title: "Notes de cours : Partie 1",
      type: "Cours Magistral",
      author: "S. Fourour (Université Oran 1)",
      pages: 12,
      topics: ["Notion de groupe", "Sous-groupes", "Sous-groupes de (Z, +)", "Morphismes de groupes", "Noyau et Image"],
      path: "/courses/cours-mpc-partie1.pdf",
    },
    {
      id: "cours2",
      filename: "cours-mpc-partie2 (1).pdf",
      title: "Notes de cours : Partie 2",
      type: "Cours Magistral",
      author: "S. Fourour (Université Oran 1)",
      pages: 10,
      topics: ["Sous-groupes distingués", "Relations d'équivalence", "Classes modulo H", "Groupes quotients G/H", "Groupes monogènes et cycliques"],
      path: "/courses/cours-mpc-partie2 (1).pdf",
    },
    {
      id: "cours3",
      filename: "cours-mpc-part3.pdf",
      title: "Notes de cours : Partie 3",
      type: "Cours Magistral",
      author: "S. Fourour (Université Oran 1)",
      pages: 11,
      topics: ["Structure des cycliques", "Théorème de Lagrange", "Théorème d'Euler & Fermat", "Z/nZ", "Éléments inversibles", "Bézout"],
      path: "/courses/cours-mpc-part3.pdf",
    },
    {
      id: "td1",
      filename: "fiche-td-1.pdf",
      title: "Fiche TD 1 (9 Exercices)",
      type: "Travaux Dirigés",
      author: "Département d'informatique",
      pages: 2,
      topics: ["LCI", "Groupes affines", "Intervalle ]-1, 1[", "Isomorphismes", "Stabilisateurs", "Morphismes usuels"],
      path: "/courses/fiche-td-1.pdf",
    },
    {
      id: "td2p1",
      filename: "fiche-td-2-P1.pdf",
      title: "Fiche TD 2 (Partie 1 - Ex 1 à 4)",
      type: "Travaux Dirigés (Originale)",
      author: "Département d'informatique",
      pages: 1,
      topics: ["Image réciproque de sous-groupe distingué", "Matrices de Heisenberg", "Centre Z(G)", "Intersection de sous-groupes"],
      path: "/courses/fiche-td-2-P1.pdf",
    },
    {
      id: "td2rev",
      filename: "fiche-td-2-révisée.pdf",
      title: "Fiche TD 2 Révisée (Ex 1 à 9)",
      type: "Travaux Dirigés (Révisée Complète)",
      author: "Département d'informatique",
      pages: 2,
      topics: ["Heisenberg", "Ordre de 9 dans Z/12Z", "Ordre de x²", "Groupes d'exposant 2", "Groupe des inversibles (Z/20Z)*"],
      path: "/courses/fiche-td-2-révisée.pdf",
    },
    {
      id: "test",
      filename: "test-Ing3-corrigé.pdf",
      title: "Test Ing 3 Corrigé Officiel",
      type: "Examen Corrigé",
      author: "Département d'informatique (21 déc 2025)",
      pages: 2,
      topics: ["Propriétés de sous-groupes", "Inverse de g", "Matrices de GL2(R)", "Groupe R*+ x R", "Morphismes complexes et additifs"],
      path: "/courses/test-Ing3-corrigé.pdf",
    },
  ];

  const [selectedDoc, setSelectedDoc] = useState<any>(documents[0]);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Search filtered results
  const searchResults = searchQuery.trim().length > 1
    ? courseKbData.filter(
        (chunk: any) =>
          chunk.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chunk.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chunk.keywords?.some((k: string) => k.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-primary">
          <Library className="h-4 w-4" />
          Bibliothèque Académique Officielle
        </div>
        <h1 className="text-3xl font-serif font-bold text-foreground mt-1">
          Documents Sources & Polycopiés Universitaires
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-3xl">
          Les 7 documents officiels de l&apos;Université Oran 1 (cours, fiches TD 1 & 2 et épreuve d&apos;examen corrigée). Chaque notion dans l&apos;application renvoie fidèlement à sa page d&apos;origine.
        </p>
      </div>

      {/* Duplicate detection notification banner */}
      <div className="rounded-lg border border-border bg-muted/40 p-4 text-xs space-y-1.5">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Rapport d&apos;Analyse & Détection des Doublons (TD2 P1 vs TD2 Révisée) :
        </div>
        <p className="text-muted-foreground leading-relaxed">
          {duplicateData.resolution}. Les exercices 1 à 4 sont rigoureusement identiques entre <code>fiche-td-2-P1.pdf</code> et <code>fiche-td-2-révisée.pdf</code>. La version révisée ajoute les exercices 5 à 9.
        </p>
      </div>

      {/* Search Input across course knowledge base */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un théorème, une formule ou un concept (ex : Lagrange, Bézout, Heisenberg, sous-groupe)..."
          className="w-full rounded-lg border border-input bg-card pl-9 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
        />
      </div>

      {/* Search Results if any */}
      {searchResults.length > 0 && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
          <div className="text-xs font-mono font-semibold uppercase text-primary">
            {searchResults.length} Extrait(s) du cours trouvé(s) :
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {searchResults.slice(0, 6).map((res: any) => (
              <div
                key={res.id}
                className="p-3 rounded-lg border border-border bg-card text-xs space-y-1 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center justify-between font-semibold text-foreground">
                  <span>{res.title}</span>
                  <span className="font-mono text-[10px] text-primary">
                    {res.sourcePdf} (p. {res.page})
                  </span>
                </div>
                <div className="text-muted-foreground line-clamp-2 text-[11px]">
                  {res.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Document List & PDF Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: 7 Documents Cards */}
        <div className="space-y-3">
          <h2 className="text-xs font-mono font-semibold uppercase text-muted-foreground">
            Documents Disponibles (7)
          </h2>

          <div className="space-y-2.5">
            {documents.map((doc) => {
              const isSelected = selectedDoc.id === doc.id;
              return (
                <button
                  key={doc.id}
                  onClick={() => {
                    setSelectedDoc(doc);
                    setSelectedPage(1);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col gap-1.5 ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-card hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground uppercase">
                      {doc.type}
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {doc.pages} pages
                    </span>
                  </div>

                  <div className="font-semibold text-sm text-foreground">
                    {doc.title}
                  </div>

                  <div className="text-xs font-mono text-primary flex items-center gap-1">
                    <FileText className="h-3 w-3" /> {doc.filename}
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {doc.topics.slice(0, 3).map((t, idx) => (
                      <span key={idx} className="text-[10px] bg-muted/60 px-1.5 py-0.5 rounded text-muted-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Embedded PDF Viewer */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
              <div>
                <span className="text-xs font-mono font-semibold uppercase text-primary">
                  DOCUMENT ACTIF
                </span>
                <h3 className="text-base font-serif font-bold text-foreground">
                  {selectedDoc.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={selectedDoc.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-border bg-muted/60 hover:bg-muted text-xs font-medium text-foreground transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Ouvrir en plein écran
                </a>
              </div>
            </div>

            {/* Embedded Iframe Viewer */}
            <div className="w-full h-[620px] rounded-lg border border-border overflow-hidden bg-muted/20">
              <iframe
                src={`${selectedDoc.path}#page=${selectedPage}`}
                title={selectedDoc.title}
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
