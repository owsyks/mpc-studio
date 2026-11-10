import Link from "next/link";
import { BookOpen, Cpu, Award, Sparkles, Library, ArrowRight, CheckCircle2, ShieldCheck, Compass, Layers, Zap } from "lucide-react";
import { MathRenderer } from "@/components/math/MathRenderer";

export default function HomePage() {
  const modules = [
    {
      id: "module-1",
      number: "01",
      title: "Groupes et Sous-groupes",
      desc: "Lois internes, axiomes, associativité, neutre, inverse, sous-groupes de (Z, +) et groupes de matrices.",
      source: "cours-mpc-partie1.pdf",
      color: "from-blue-500/20 to-indigo-500/5",
      border: "border-blue-500/30",
    },
    {
      id: "module-2",
      number: "02",
      title: "Morphismes de Groupes",
      desc: "Endomorphismes, isomorphismes, noyau Ker(f), image Im(f), critères d'injectivité et surjectivité.",
      source: "cours-mpc-partie2 (1).pdf",
      color: "from-indigo-500/20 to-purple-500/5",
      border: "border-indigo-500/30",
    },
    {
      id: "module-3",
      number: "03",
      title: "Sous-groupes Distingués & Quotients",
      desc: "Stabilité par conjugaison, classes d'équivalence, compatibilité de la loi et construction rigoureuse de G/H.",
      source: "cours-mpc-partie2 (1).pdf",
      color: "from-purple-500/20 to-pink-500/5",
      border: "border-purple-500/30",
    },
    {
      id: "module-4",
      number: "04",
      title: "Groupes Monogènes & Cycliques",
      desc: "Ordre d'un élément, générateurs, structure des groupes cycliques finis, isomorphisme avec Z/nZ.",
      source: "cours-mpc-part3.pdf",
      color: "from-emerald-500/20 to-teal-500/5",
      border: "border-emerald-500/30",
    },
    {
      id: "module-5",
      number: "05",
      title: "Théorèmes Fondamentaux",
      desc: "Théorème de Lagrange |G|=[G:H]|H|, divisibilité des ordres, Théorème d'Euler et Petit Théorème de Fermat.",
      source: "cours-mpc-part3.pdf",
      color: "from-amber-500/20 to-orange-500/5",
      border: "border-amber-500/30",
    },
    {
      id: "module-6",
      number: "06",
      title: "Congruences et Z/nZ",
      desc: "Classes de congruence, anneau Z/nZ, unités inversibles (Z/nZ)*, Algorithme d'Euclide étendu et Bézout.",
      source: "cours-mpc-part3.pdf",
      color: "from-rose-500/20 to-red-500/5",
      border: "border-rose-500/30",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative border-b border-border/80 bg-gradient-to-b from-card/80 via-background to-background px-4 py-20 sm:px-6 sm:py-28 lg:px-8 overflow-hidden">
        <div className="mx-auto max-w-5xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur shadow-sm">
            <span className="font-semibold">Université Oran 1 Ahmed Ben Bella</span>
            <span>•</span>
            <span className="text-primary-foreground/90 font-mono">3ème Année Ingénieur</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-foreground leading-[1.12]">
            Outils Mathématiques pour la <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-primary bg-clip-text text-transparent">Cryptographie</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Plateforme académique d'élite propulsée par NVIDIA NIM : cours universitaires officiels, protocoles de démonstration pas-à-pas, générateur d'exercices infini, OCR de copies manuscrites et simulateur d'examen officiel.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/modules"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] gap-2.5"
            >
              <BookOpen className="h-4 w-4" />
              <span>Explorer les 6 Modules</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/practice"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border/80 bg-card/80 px-6 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-muted/70 hover:border-border gap-2.5"
            >
              <Cpu className="h-4 w-4 text-primary" />
              <span>Exercices TD & OCR</span>
            </Link>

            <Link
              href="/exam"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 px-6 text-sm font-semibold text-amber-300 shadow-sm transition-all hover:bg-amber-500/20 gap-2.5"
            >
              <Award className="h-4 w-4 text-amber-400" />
              <span>Simulateur d'Examen (1h)</span>
            </Link>
          </div>

          {/* Quick Stats Grid */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-border/80 pt-10 text-left">
            <div className="p-4 rounded-xl bg-card/40 border border-border/60">
              <div className="text-3xl font-extrabold font-mono text-primary">7</div>
              <div className="text-xs text-muted-foreground mt-1">Documents officiels analysés & indexés</div>
            </div>
            <div className="p-4 rounded-xl bg-card/40 border border-border/60">
              <div className="text-3xl font-extrabold font-mono text-indigo-400">18</div>
              <div className="text-xs text-muted-foreground mt-1">Leçons avec méthodes pas-à-pas</div>
            </div>
            <div className="p-4 rounded-xl bg-card/40 border border-border/60">
              <div className="text-3xl font-extrabold font-mono text-emerald-400">100%</div>
              <div className="text-xs text-muted-foreground mt-1">Moteur mathématique déterministe</div>
            </div>
            <div className="p-4 rounded-xl bg-card/40 border border-border/60">
              <div className="text-xl font-bold font-mono text-foreground flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                NVIDIA NIM
              </div>
              <div className="text-xs text-muted-foreground mt-1">Gemma 4 31B & Vision 90B</div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Overview Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-mono font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
              <Layers className="h-3.5 w-3.5" /> Programme d'Examen Universitaire
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-foreground mt-2">
              Les 6 Piliers Fondamentaux du Cours
            </h2>
          </div>
          <Link
            href="/modules"
            className="text-xs font-semibold text-primary hover:text-primary/80 inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Accéder au sommaire complet</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod) => (
            <Link
              key={mod.id}
              href={`/modules#${mod.id}`}
              className={`group rounded-2xl border ${mod.border} bg-card/70 p-6 shadow-sm hover:shadow-xl transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-muted-foreground opacity-60">
                    MODULE {mod.number}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground bg-muted/60 px-2 py-0.5 rounded border border-border/60">
                    {mod.source}
                  </span>
                </div>

                <h3 className="text-lg font-serif font-bold text-foreground group-hover:text-primary transition-colors">
                  {mod.title}
                </h3>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {mod.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs text-primary font-medium">
                <span>Méthodes & Démonstrations</span>
                <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="border-t border-border/80 bg-card/30 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="text-xs font-mono font-semibold text-primary uppercase tracking-wider">
              Fonctionnalités Pédagogiques Avancées
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
              Conçu Spécifiquement pour Réussir l'Épreuve d'Oran 1
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-border/80 bg-card/70 p-6 space-y-3 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-bold">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Protocoles Pas-à-Pas</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Chaque cours détaille les étapes exactes de rédaction : vérification de la fermeture, calcul du neutre bilatéral, inverse formel et tableaux de Cayley.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card/70 p-6 space-y-3 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">OCR Vision & Correction IA</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Prenez votre feuille de TD en photo : NVIDIA Vision transcrit votre écriture en LaTeX et applique le barème officiel avec identification précise de la première erreur.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card/70 p-6 space-y-3 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Examen Réel 2025 (16 Pts)</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Chronodéclencheur 60 minutes avec le sujet officiel 2025 (4.25 + 4.25 + 7.5 Pts), correction intégrale et diagnostic des faiblesses.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
