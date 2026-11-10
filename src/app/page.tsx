import Link from "next/link";
import { BookOpen, Cpu, Award, Sparkles, Library, ArrowRight, CheckCircle2, ShieldCheck, Compass } from "lucide-react";
import { MathRenderer } from "@/components/math/MathRenderer";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative border-b border-border bg-gradient-to-b from-card to-background px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3.5 py-1 text-xs font-medium text-muted-foreground backdrop-blur mb-6">
            <span className="font-semibold text-primary">Université Oran 1 — Es Senia</span>
            <span>•</span>
            <span>3ème Année Ingénieur</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-foreground leading-[1.15]">
            Outils Mathématiques pour la Cryptographie
          </h1>

          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Plateforme académique complète propulsée par NVIDIA NIM : cours officiels structurés,
            démonstrations progressives, entraînement infini, OCR de manuscrits et simulateur d&apos;examen.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/modules"
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Explorer les 6 Modules
            </Link>

            <Link
              href="/practice"
              className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-card px-5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted gap-2"
            >
              <Cpu className="h-4 w-4" />
              S&apos;entraîner avec l&apos;IA
            </Link>

            <Link
              href="/exam"
              className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-card px-5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted gap-2"
            >
              <Award className="h-4 w-4" />
              Simuler l&apos;Examen (1h)
            </Link>
          </div>

          {/* Quick Stats Banner */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-border/80 pt-8 text-left">
            <div className="p-3">
              <div className="text-2xl font-bold font-mono text-primary">7</div>
              <div className="text-xs text-muted-foreground mt-0.5">Documents officiels indexés</div>
            </div>
            <div className="p-3">
              <div className="text-2xl font-bold font-mono text-primary">6</div>
              <div className="text-xs text-muted-foreground mt-0.5">Modules fondamentaux</div>
            </div>
            <div className="p-3">
              <div className="text-2xl font-bold font-mono text-primary">100%</div>
              <div className="text-xs text-muted-foreground mt-0.5">Vérification mathématique</div>
            </div>
            <div className="p-3">
              <div className="text-2xl font-bold font-mono text-primary">NVIDIA NIM</div>
              <div className="text-xs text-muted-foreground mt-0.5">Inférence Llama 3.1 70B & Vision</div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Overview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-mono font-semibold text-primary uppercase tracking-wider">Programme Officiel</div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mt-1">
              Les 6 Piliers du Cours Universitaire
            </h2>
          </div>
          <Link href="/modules" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
            Voir le programme détaillé <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              num: "01",
              title: "Groupes & Sous-groupes",
              desc: "Lois de composition interne, associativité, neutre, inverse, critères de sous-groupes (x * y⁻¹ ∈ H) et sous-groupes de (Z, +).",
              formula: "x * y^{-1} \\in H",
              href: "/modules#module-1",
            },
            {
              num: "02",
              title: "Morphismes de groupes",
              desc: "Homomorphismes, endomorphismes, isomorphismes, noyau (Ker), image (Im) et caractérisation de l'injectivité.",
              formula: "\\ker f = \\{e_1\\} \\iff f \\text{ injectif}",
              href: "/modules#module-2",
            },
            {
              num: "03",
              title: "Sous-groupes distingués & Quotients",
              desc: "Conjugaison g H g⁻¹ = H, relations d'équivalence, classes disjointes et construction du groupe quotient G/H.",
              formula: "g H g^{-1} = H \\implies G/H",
              href: "/modules#module-3",
            },
            {
              num: "04",
              title: "Groupes monogènes & Cycliques",
              desc: "Sous-groupes engendrés, ordre fini/infini, générateurs, isomorphismes avec Z/nZ et ordre dans un produit direct.",
              formula: "\\operatorname{ord}((g, h)) = \\operatorname{ppcm}(p, q)",
              href: "/modules#module-4",
            },
            {
              num: "05",
              title: "Théorèmes fondamentaux",
              desc: "Théorème de Lagrange (|H| divise |G|), ordre des éléments, théorème d'Euler et Petit Théorème de Fermat.",
              formula: "a^{\\varphi(n)} \\equiv 1 \\pmod n",
              href: "/modules#module-5",
            },
            {
              num: "06",
              title: "Congruences & Z/nZ",
              desc: "Anneau Z/nZ, éléments inversibles (Z/nZ)*, théorème de Bézout, diviseurs de zéro et corps Z/pZ pour p premier.",
              formula: "\\bar{a} \\text{ inversible} \\iff \\operatorname{pgcd}(a, n) = 1",
              href: "/modules#module-6",
            },
          ].map((m) => (
            <Link
              key={m.num}
              href={m.href}
              className="group relative flex flex-col justify-between rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground font-mono mb-3">
                  <span>MODULE {m.num}</span>
                  <Compass className="h-4 w-4 opacity-50 group-hover:text-primary group-hover:opacity-100 transition-all" />
                </div>
                <h3 className="text-lg font-serif font-semibold text-foreground group-hover:text-primary transition-colors">
                  {m.title}
                </h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {m.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-border/60">
                <div className="bg-muted/50 rounded px-2.5 py-1 text-center font-mono text-xs">
                  <MathRenderer content={`$${m.formula}$`} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="border-t border-border bg-muted/20 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
              Conçu pour l&apos;excellence académique
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
              Des outils sérieux sans gadgets superflus pour maîtriser les preuves et réussir vos examens.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded bg-primary/10 text-primary mb-4">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold font-serif text-foreground">Tuteur NVIDIA NIM RAG</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Connecté directement aux 7 PDFs du cours. Il cite précisément les pages du cours, vous guide avec des indices progressifs et ne donne pas la solution d&apos;un coup.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Citations exactes du PDF et numéro de page</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> 8 étapes pédagogiques par concept</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Indices de niveau 1, 2 et 3</li>
              </ul>
            </div>

            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded bg-primary/10 text-primary mb-4">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold font-serif text-foreground">Math Lab Interactif</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Visualisez la table de Cayley, les orbites de puissances, le cercle arithmétique modulaire, les classes selon un sous-groupe et les matrices de Heisenberg.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Table de Cayley interactive (neutre, inverses)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Cercle modulaire de Z/nZ</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Visualiseur de sous-groupes distingués</li>
              </ul>
            </div>

            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded bg-primary/10 text-primary mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold font-serif text-foreground">OCR & Correction Rigoureuse</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Photographiez votre copie manuscrite. Notre modèle de vision transcrit votre preuve en LaTeX, vous permet de confirmer, puis note selon le barème officiel du département.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Détection d&apos;ambiguïtés avant correction</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Identification du premier faux pas</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Recommandations ciblées de révision</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-serif font-bold text-foreground">Prêt pour votre examen d&apos;Ingénieur ?</h2>
        <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
          Commencez par le premier chapitre ou testez votre niveau directement sur le sujet d&apos;examen officiel corrigé.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/modules"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Commencer par le Module 1
          </Link>
          <Link
            href="/exam"
            className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-card px-4 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            Lancer l&apos;Examen Blanc (1h)
          </Link>
        </div>
      </section>
    </div>
  );
}
