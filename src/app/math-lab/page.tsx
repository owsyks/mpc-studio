"use client";

import React, { useState, useMemo } from "react";
import { Sparkles, Compass, CircleDot, Layers, ArrowRight, Grid } from "lucide-react";
import { MathSolver } from "@/lib/math-solver";
import { MathRenderer } from "@/components/math/MathRenderer";

export default function MathLabPage() {
  const [activeTab, setActiveTab] = useState<"cayley" | "cyclic" | "circle" | "cosets" | "homomorphism" | "matrix">("cayley");

  // State for Cayley table tool
  const [cayleyModulus, setCayleyModulus] = useState<number>(5);
  const [cayleyType, setCayleyType] = useState<"additive" | "multiplicative">("additive");

  // State for Cyclic Explorer
  const [cyclicModulus, setCyclicModulus] = useState<number>(12);
  const [cyclicElement, setCyclicElement] = useState<number>(9);

  // State for Modular Circle
  const [circleModulus, setCircleModulus] = useState<number>(10);
  const [circleMultiplier, setCircleMultiplier] = useState<number>(3);

  // State for Heisenberg Matrix Explorer
  const [m1, setM1] = useState({ x: 1, y: 2, z: 3 });
  const [m2, setM2] = useState({ x: 2, y: -1, z: 0 });

  // Compute Cayley Table
  const cayleyData = useMemo(() => {
    let elements: number[] = [];
    if (cayleyType === "additive") {
      elements = Array.from({ length: cayleyModulus }, (_, i) => i);
    } else {
      elements = MathSolver.invertibleElements(cayleyModulus);
    }

    const table: Record<number, Record<number, number>> = {};
    for (const a of elements) {
      table[a] = {};
      for (const b of elements) {
        table[a][b] =
          cayleyType === "additive"
            ? (a + b) % cayleyModulus
            : (a * b) % cayleyModulus;
      }
    }

    const neutral = cayleyType === "additive" ? 0 : 1;
    return { elements, table, neutral };
  }, [cayleyModulus, cayleyType]);

  // Compute Cyclic Orbit
  const cyclicOrbit = useMemo(() => {
    const orbit = MathSolver.cyclicSubgroup(cyclicElement, cyclicModulus, false);
    const order = MathSolver.orderAdditive(cyclicElement, cyclicModulus);
    const gcd = MathSolver.gcd(cyclicElement, cyclicModulus);
    return { orbit, order, gcd };
  }, [cyclicElement, cyclicModulus]);

  // Compute Matrix Product & Inverse
  const matrixProduct = useMemo(() => {
    return MathSolver.heisenbergProduct(m1, m2);
  }, [m1, m2]);

  const matrix1Inverse = useMemo(() => {
    return MathSolver.heisenbergInverse(m1);
  }, [m1]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-primary">
          <Sparkles className="h-4 w-4" />
          Laboratoire de Mathématiques Interactif
        </div>
        <h1 className="text-3xl font-serif font-bold text-foreground mt-1">
          Math Lab — Explorateur Algébrique
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-3xl">
          Visualisez concrètement les tables d&apos;opérations finies, les orbites cycliques, les congruences modulaires, les partitions en classes et les matrices de Heisenberg du cours.
        </p>
      </div>

      {/* Modern Tabs Bar */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-card border border-border/80 overflow-x-auto shadow-sm">
        {[
          { id: "cayley", label: "Table de Cayley (LCI)", icon: Grid },
          { id: "cyclic", label: "Groupe Cyclique & Ordre", icon: Compass },
          { id: "circle", label: "Cercle Modulaire Z/nZ", icon: CircleDot },
          { id: "cosets", label: "Classes & Quotients G/H", icon: Layers },
          { id: "homomorphism", label: "Morphismes (Ker & Im)", icon: ArrowRight },
          { id: "matrix", label: "Matrices de Heisenberg", icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-primary text-white shadow-md shadow-primary/25 font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Cayley Table */}
      {activeTab === "cayley" && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <h2 className="text-lg font-serif font-bold text-foreground">
                Explorateur de Table de Cayley
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Vérifiez la fermeture, l&apos;élément neutre et la symétrie de la table pour les groupes finis.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <label className="flex items-center gap-1.5 font-medium">
                Type :
                <select
                  value={cayleyType}
                  onChange={(e) => setCayleyType(e.target.value as any)}
                  className="rounded border border-input bg-background px-2 py-1"
                >
                  <option value="additive">Additif (Z/nZ, +)</option>
                  <option value="multiplicative">Multiplicatif ((Z/nZ)*, ×)</option>
                </select>
              </label>

              <label className="flex items-center gap-1.5 font-medium">
                Module n :
                <input
                  type="number"
                  min={2}
                  max={12}
                  value={cayleyModulus}
                  onChange={(e) => setCayleyModulus(Math.max(2, Math.min(12, parseInt(e.target.value) || 2)))}
                  className="w-16 rounded border border-input bg-background px-2 py-1 font-mono"
                />
              </label>
            </div>
          </div>

          {/* Cayley Grid */}
          <div className="overflow-x-auto pb-4">
            <table className="border-collapse text-center text-xs font-mono mx-auto">
              <thead>
                <tr>
                  <th className="p-2 border border-border bg-muted font-bold text-primary">
                    {cayleyType === "additive" ? "+" : "×"}
                  </th>
                  {cayleyData.elements.map((col) => (
                    <th key={col} className="p-2.5 border border-border bg-muted/60 font-semibold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cayleyData.elements.map((row) => (
                  <tr key={row}>
                    <th className="p-2.5 border border-border bg-muted/60 font-semibold">{row}</th>
                    {cayleyData.elements.map((col) => {
                      const val = cayleyData.table[row]?.[col];
                      const isNeutral = val === cayleyData.neutral;
                      return (
                        <td
                          key={col}
                          className={`p-2.5 border border-border transition-colors ${
                            isNeutral
                              ? "bg-primary/15 font-bold text-primary"
                              : "hover:bg-muted/40"
                          }`}
                        >
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-muted/20 p-4 rounded-lg border border-border">
            <div>
              <span className="font-semibold text-foreground">Élément Neutre :</span>{" "}
              <span className="font-mono text-primary font-bold">{cayleyData.neutral}</span> (surligné en bleu)
            </div>
            <div>
              <span className="font-semibold text-foreground">Commutativité :</span>{" "}
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">✓ Table symétrique</span>
            </div>
            <div>
              <span className="font-semibold text-foreground">Cardinal |G| :</span>{" "}
              <span className="font-mono">{cayleyData.elements.length} éléments</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Cyclic Group & Order */}
      {activeTab === "cyclic" && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <h2 className="text-lg font-serif font-bold text-foreground">
                Explorateur de Groupes Cycliques & Ordres
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Calculez l&apos;orbite de tout élément et retrouvez les questions de TD (ex : ordre de 9 dans Z/12Z).
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <label className="flex items-center gap-1.5 font-medium">
                Module n :
                <input
                  type="number"
                  min={2}
                  max={30}
                  value={cyclicModulus}
                  onChange={(e) => setCyclicModulus(parseInt(e.target.value) || 2)}
                  className="w-16 rounded border border-input bg-background px-2 py-1 font-mono"
                />
              </label>

              <label className="flex items-center gap-1.5 font-medium">
                Élément a :
                <input
                  type="number"
                  min={0}
                  max={cyclicModulus - 1}
                  value={cyclicElement}
                  onChange={(e) => setCyclicElement(parseInt(e.target.value) || 0)}
                  className="w-16 rounded border border-input bg-background px-2 py-1 font-mono"
                />
              </label>
            </div>
          </div>

          <div className="space-y-4">
            {/* Mathematical Summary Card */}
            <div className="rounded-lg bg-muted/30 p-4 border border-border text-xs sm:text-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">
                  <MathRenderer content={`Sous-groupe monogène $\\langle ${cyclicElement} \\rangle$ dans $(\\mathbb{Z}/${cyclicModulus}\\mathbb{Z}, +)$ :`} />
                </span>
                <span className="font-mono text-primary font-bold text-base">
                  Ordre = {cyclicOrbit.order}
                </span>
              </div>

              <div className="text-xs text-muted-foreground">
                <MathRenderer
                  content={`Formule du cours : $\\operatorname{ord}(a) = \\frac{n}{\\operatorname{pgcd}(a, n)} = \\frac{${cyclicModulus}}{\\operatorname{pgcd}(${cyclicElement}, ${cyclicModulus})} = \\frac{${cyclicModulus}}{${cyclicOrbit.gcd}} = ${cyclicOrbit.order}$.`}
                />
              </div>
            </div>

            {/* Orbit steps */}
            <div className="p-4 rounded-lg border border-border space-y-2">
              <div className="text-xs font-mono font-semibold uppercase text-muted-foreground">
                Éléments générés successivement :
              </div>
              <div className="flex flex-wrap gap-2">
                {cyclicOrbit.orbit.map((val, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center p-2 rounded bg-card border border-border text-xs font-mono min-w-10"
                  >
                    <span className="text-[10px] text-muted-foreground">{idx}·a</span>
                    <span className="font-bold text-foreground text-sm">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Modular Arithmetic Circle */}
      {activeTab === "circle" && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <h2 className="text-lg font-serif font-bold text-foreground">
                Cercle Arithmétique Modulaire
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Visualisez la géométrie des sauts modulaires et des orbites de multiplication.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <label className="flex items-center gap-1.5 font-medium">
                Module n :
                <input
                  type="number"
                  min={3}
                  max={30}
                  value={circleModulus}
                  onChange={(e) => setCircleModulus(parseInt(e.target.value) || 3)}
                  className="w-16 rounded border border-input bg-background px-2 py-1 font-mono"
                />
              </label>

              <label className="flex items-center gap-1.5 font-medium">
                Multiplicateur m :
                <input
                  type="number"
                  min={1}
                  max={circleModulus - 1}
                  value={circleMultiplier}
                  onChange={(e) => setCircleMultiplier(parseInt(e.target.value) || 1)}
                  className="w-16 rounded border border-input bg-background px-2 py-1 font-mono"
                />
              </label>
            </div>
          </div>

          {/* SVG Circle Canvas */}
          <div className="flex justify-center p-4">
            <svg width="340" height="340" className="overflow-visible">
              <circle cx="170" cy="170" r="130" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="2" />
              {/* Lines */}
              {Array.from({ length: circleModulus }, (_, i) => {
                const target = (i * circleMultiplier) % circleModulus;
                const angle1 = (2 * Math.PI * i) / circleModulus - Math.PI / 2;
                const angle2 = (2 * Math.PI * target) / circleModulus - Math.PI / 2;
                const x1 = 170 + 130 * Math.cos(angle1);
                const y1 = 170 + 130 * Math.sin(angle1);
                const x2 = 170 + 130 * Math.cos(angle2);
                const y2 = 170 + 130 * Math.sin(angle2);
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="hsl(var(--primary))"
                    strokeWidth="1.5"
                    strokeOpacity="0.5"
                  />
                );
              })}

              {/* Points */}
              {Array.from({ length: circleModulus }, (_, i) => {
                const angle = (2 * Math.PI * i) / circleModulus - Math.PI / 2;
                const x = 170 + 130 * Math.cos(angle);
                const y = 170 + 130 * Math.sin(angle);
                const textX = 170 + 150 * Math.cos(angle);
                const textY = 170 + 150 * Math.sin(angle);
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="4" fill="hsl(var(--primary))" />
                    <text
                      x={textX}
                      y={textY + 4}
                      textAnchor="middle"
                      className="text-[11px] font-mono font-bold fill-foreground"
                    >
                      {i}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      )}

      {/* Tab 4: Cosets & Quotients */}
      {activeTab === "cosets" && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-serif font-bold text-foreground">
              Classes d&apos;Équivalence & Partitionnement G/H
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Illustration du partitionnement d&apos;un groupe modulo un sous-groupe (Cours MPC Partie 2, page 7).
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <p className="text-foreground leading-relaxed">
              <MathRenderer content="Considérons le groupe $G = (\mathbb{Z}/12\mathbb{Z}, +)$ et le sous-groupe $H = 4\mathbb{Z}/12\mathbb{Z} = \{0, 4, 8\}$." />
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono">
              <div className="p-3 rounded-lg border border-primary bg-primary/10">
                <div className="font-bold text-primary mb-1">Classe 0 + H</div>
                <div className="text-foreground"><MathRenderer content="$\{0, 4, 8\}$" /></div>
              </div>
              <div className="p-3 rounded-lg border border-border bg-muted/40">
                <div className="font-bold text-foreground mb-1">Classe 1 + H</div>
                <div className="text-foreground"><MathRenderer content="$\{1, 5, 9\}$" /></div>
              </div>
              <div className="p-3 rounded-lg border border-border bg-muted/40">
                <div className="font-bold text-foreground mb-1">Classe 2 + H</div>
                <div className="text-foreground"><MathRenderer content="$\{2, 6, 10\}$" /></div>
              </div>
              <div className="p-3 rounded-lg border border-border bg-muted/40">
                <div className="font-bold text-foreground mb-1">Classe 3 + H</div>
                <div className="text-foreground"><MathRenderer content="$\{3, 7, 11\}$" /></div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/30 border border-border text-xs space-y-1">
              <div className="font-semibold text-foreground">Propriétés fondamentales vérifiées :</div>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                <li><MathRenderer content="Toutes les classes ont exactement la même taille : $|xH| = |H| = 3$." /></li>
                <li><MathRenderer content="Elles sont disjointes deux à deux et leur réunion reconstitue $\mathbb{Z}/12\mathbb{Z}$." /></li>
                <li><MathRenderer content="L'indice de $H$ dans $G$ est $[G:H] = 12 / 3 = 4$ classes (Théorème de Lagrange)." /></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Homomorphisms Ker & Im */}
      {activeTab === "homomorphism" && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-serif font-bold text-foreground">
              Morphismes de Groupes : Noyau (Ker) & Image (Im)
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              <MathRenderer content="Exemple de l'examen d'Oran 1 : $\varphi : (\mathbb{Z}, +) \to (\mathbb{R}^*, \times), n \mapsto (-1)^n$." />
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-lg border border-border bg-card space-y-2">
              <span className="font-mono text-primary font-bold"><MathRenderer content="Noyau $\ker \varphi$" /></span>
              <div className="text-muted-foreground">
                <p>Éléments envoyés sur le neutre d&apos;arrivée (1) :</p>
                <div className="pt-1">
                  <MathRenderer content="$$\ker \varphi = \{n \in \mathbb{Z} \mid (-1)^n = 1\} = 2\mathbb{Z} \quad \text{(entiers pairs)}$$" />
                </div>
              </div>
              <div className="p-2 rounded bg-amber-500/10 text-amber-800 dark:text-amber-300">
                <MathRenderer content="Puisque $\ker \varphi \neq \{0\}$, le morphisme N'EST PAS injectif." />
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card space-y-2">
              <span className="font-mono text-primary font-bold"><MathRenderer content="Image $\operatorname{Im} \varphi$" /></span>
              <div className="text-muted-foreground">
                <p><MathRenderer content="Valeurs atteintes dans $\mathbb{R}^*$ :" /></p>
                <div className="pt-1">
                  <MathRenderer content="$$\operatorname{Im} \varphi = \{-1, 1\}$$" />
                </div>
              </div>
              <div className="p-2 rounded bg-primary/10 text-primary">
                <MathRenderer content="C'est le sous-groupe d'ordre 2 engendré par -1 dans $(\mathbb{R}^*, \times)$." />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Heisenberg Matrix Explorer */}
      {activeTab === "matrix" && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-serif font-bold text-foreground">
              Groupe des Matrices de Heisenberg 3x3
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Calcul de produit et d&apos;inverse pour la famille de matrices de la Fiche TD 2, Exercice 2.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            {/* Input M1 */}
            <div className="p-4 rounded-lg border border-border bg-card space-y-3">
              <div className="font-semibold text-foreground">Matrice A = M(x, y, z) :</div>
              <div className="grid grid-cols-3 gap-2">
                <label>
                  x :
                  <input
                    type="number"
                    value={m1.x}
                    onChange={(e) => setM1({ ...m1, x: parseInt(e.target.value) || 0 })}
                    className="w-full rounded border border-input p-1 font-mono"
                  />
                </label>
                <label>
                  y :
                  <input
                    type="number"
                    value={m1.y}
                    onChange={(e) => setM1({ ...m1, y: parseInt(e.target.value) || 0 })}
                    className="w-full rounded border border-input p-1 font-mono"
                  />
                </label>
                <label>
                  z :
                  <input
                    type="number"
                    value={m1.z}
                    onChange={(e) => setM1({ ...m1, z: parseInt(e.target.value) || 0 })}
                    className="w-full rounded border border-input p-1 font-mono"
                  />
                </label>
              </div>

              <div className="p-2 rounded bg-muted/40 font-mono text-center">
                M({m1.x}, {m1.y}, {m1.z})
              </div>
            </div>

            {/* Input M2 */}
            <div className="p-4 rounded-lg border border-border bg-card space-y-3">
              <div className="font-semibold text-foreground">Matrice B = M(x&apos;, y&apos;, z&apos;) :</div>
              <div className="grid grid-cols-3 gap-2">
                <label>
                  x&apos; :
                  <input
                    type="number"
                    value={m2.x}
                    onChange={(e) => setM2({ ...m2, x: parseInt(e.target.value) || 0 })}
                    className="w-full rounded border border-input p-1 font-mono"
                  />
                </label>
                <label>
                  y&apos; :
                  <input
                    type="number"
                    value={m2.y}
                    onChange={(e) => setM2({ ...m2, y: parseInt(e.target.value) || 0 })}
                    className="w-full rounded border border-input p-1 font-mono"
                  />
                </label>
                <label>
                  z&apos; :
                  <input
                    type="number"
                    value={m2.z}
                    onChange={(e) => setM2({ ...m2, z: parseInt(e.target.value) || 0 })}
                    className="w-full rounded border border-input p-1 font-mono"
                  />
                </label>
              </div>

              <div className="p-2 rounded bg-muted/40 font-mono text-center">
                M({m2.x}, {m2.y}, {m2.z})
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-lg border border-primary/30 bg-primary/5 space-y-2">
              <span className="font-semibold text-primary font-mono">Produit Matriciel A × B :</span>
              <div className="font-mono text-foreground">
                <MathRenderer content={`$$M(${matrixProduct.x}, ${matrixProduct.y}, ${matrixProduct.z})$$`} />
              </div>
              <p className="text-[11px] text-muted-foreground">
                <MathRenderer
                  content={`Formule : $M(x+x', y+y', z+z'+xy') = M(${m1.x}+${m2.x}, ${m1.y}+${m2.y}, ${m1.z}+${m2.z}+${m1.x}\\times${m2.y})$.`}
                />
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30 space-y-2">
              <span className="font-semibold text-foreground font-mono">Matrice Inverse A⁻¹ :</span>
              <div className="font-mono text-foreground">
                <MathRenderer content={`$$M(${matrix1Inverse.x}, ${matrix1Inverse.y}, ${matrix1Inverse.z})$$`} />
              </div>
              <p className="text-[11px] text-muted-foreground">
                <MathRenderer
                  content={`Formule : $M(-x, -y, -z+xy) = M(-${m1.x}, -${m1.y}, -${m1.z}+${m1.x}\\times${m1.y})$.`}
                />
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
