import { MathSolver } from "./math-solver";
import { NvidiaAIService } from "./nvidia-ai";

export interface ExerciseData {
  id: string;
  sheet?: string;
  exerciseNumber?: number;
  title: string;
  moduleId: string;
  topic?: string;
  sourcePdf?: string;
  sourcePage?: number;
  difficulty: "Beginner" | "Easy" | "Medium" | "Hard" | "Exam Level";
  type: "computation" | "proof" | "step-by-step" | "multiple-choice";
  statement: string;
  normalizedLatex: string;
  hints: string[];
  solution: {
    expectedResult?: any;
    steps: string[];
    isGroup?: boolean;
    isAbelian?: boolean;
  };
  rubric: Array<{ criterion: string; points: number }>;
  isGenerated?: boolean;
}

export class ExerciseGenerator {
  public static readonly MODULES = [
    {
      id: "module-1",
      title: "Module 1 — Groupes et Sous-groupes",
      topics: [
        { id: "group-law", name: "Loi de composition interne & Axiomes de groupe" },
        { id: "subgroup-criterion", name: "Critère de sous-groupe (x * y⁻¹ ∈ H)" },
        { id: "matrix-group", name: "Groupes de matrices (GL₂(ℝ), triangulaires)" },
      ],
    },
    {
      id: "module-2",
      title: "Module 2 — Morphismes de groupes",
      topics: [
        { id: "homomorphism-proof", name: "Vérification d'un morphisme f(xy) = f(x)f(y)" },
        { id: "kernel-image", name: "Calcul du Noyau (Ker f), Image (Im f) & Injectivité" },
      ],
    },
    {
      id: "module-3",
      title: "Module 3 — Sous-groupes distingués & Quotients",
      topics: [
        { id: "normal-subgroup", name: "Distinction de sous-groupe (gHg⁻¹ = H)" },
        { id: "quotient-group", name: "Structure de groupe quotient G/H & Ordre" },
      ],
    },
    {
      id: "module-4",
      title: "Module 4 — Groupes monogènes et cycliques",
      topics: [
        { id: "element-order", name: "Ordre d'un élément dans (ℤ/nℤ, +)" },
        { id: "direct-product-order", name: "Ordre dans un produit direct ℤ/aℤ × ℤ/bℤ" },
        { id: "generators", name: "Recherche des générateurs d'un groupe cyclique" },
      ],
    },
    {
      id: "module-5",
      title: "Module 5 — Théorèmes fondamentaux (Lagrange, Euler, Fermat)",
      topics: [
        { id: "lagrange", name: "Application du Théorème de Lagrange" },
        { id: "euler-totient", name: "Indicateur d'Euler φ(n) & Théorème d'Euler" },
        { id: "fermat-powers", name: "Petit Théorème de Fermat & Puissances modulaires" },
      ],
    },
    {
      id: "module-6",
      title: "Module 6 — Congruences et ℤ/nℤ",
      topics: [
        { id: "modular-inverse", name: "Inverse modulaire via Euclide étendu / Bézout" },
        { id: "linear-congruence", name: "Résolution d'équation ax ≡ b (mod n)" },
        { id: "modular-units", name: "Groupe des inversibles (ℤ/nℤ)ˣ & Diviseurs de zéro" },
      ],
    },
  ];

  /**
   * Generates a truly original, mathematically rich exercise using NVIDIA NIM
   */
  public static async generateWithAI(
    moduleId: string = "module-1",
    difficulty: "Beginner" | "Easy" | "Medium" | "Hard" | "Exam Level" = "Medium",
    topic?: string,
    language: "fr" | "en" = "fr"
  ): Promise<ExerciseData> {
    const modObj = this.MODULES.find((m) => m.id === moduleId) || this.MODULES[0];
    const topObj = modObj.topics.find((t) => t.id === topic) || modObj.topics[0];

    const isEn = language === "en";
    const prompt = isEn
      ? `Generate a brand-new, mathematically rigorous university exercise for "Mathematical Tools for Cryptography" (University of Oran 1).
Module: ${modObj.title}
Topic: ${topObj.name}
Difficulty: ${difficulty}

STRICT CREATIVITY RULES:
1. DO NOT produce the overused trivial $x + y + kxy$ formula.
2. Select from diverse, exciting mathematical structures:
   - Permutation groups $S_n$ or alternating group $A_n$ (cycles, signature, order, Klein four-group $V_4$)
   - Matrix subgroups of $\\mathrm{GL}_2(\\mathbb{R})$ or $\\mathrm{SL}_2(\\mathbb{R})$ (unipotent, orthogonal, upper-triangular)
   - Affine groups $\\mathrm{Aff}(\\mathbb{R}) = \\{x \\mapsto ax+b \\mid a \\neq 0\\}$
   - Relativistic velocity addition $x*y = \\frac{x+y}{1+xy}$ on $(-1, 1)$
   - Complex roots of unity $\\mathbb{U}_n = \\{e^{2ik\\pi/n}\\}$
   - Kernels and images of group homomorphisms
   - Quotient groups $G/H$, Lagrange indices $[G : H]$
   - Discrete logarithm problems or cyclic generator counts via $\\phi(n)$
   - Extended Euclidean algorithm / Bézout identities, Chinese Remainder Theorem
3. Ground the concepts in University of Oran 1 course notes (cours-mpc-partie1, 2, 3).
4. Use standard KaTeX syntax ($...$ inline, $$...$$ display).
5. Output STRICTLY valid raw JSON without markdown code fences:
{
  "title": "Clear descriptive title",
  "statement": "Complete mathematical problem statement with numbered questions and KaTeX",
  "hints": ["Hint 1 with KaTeX", "Hint 2 with KaTeX"],
  "solution": {
    "steps": ["Step 1 derivation with KaTeX", "Step 2 derivation with KaTeX"]
  },
  "rubric": [
    {"criterion": "Grading criterion 1", "points": 2.0},
    {"criterion": "Grading criterion 2", "points": 2.0}
  ]
}`
      : `Génère un exercice universitaire inédit et mathématiquement rigoureux pour le cours officiel "Outils Mathématiques pour la Cryptographie" (Université Oran 1 - Es Senia, 3ème Année Ingénieur).
Module : ${modObj.title}
Thématique : ${topObj.name}
Difficulté : ${difficulty}

RÈGLES IMPÉRATIVES DE CRÉATIVITÉ :
1. NE RÉPÈTE PAS la loi basique $x + y + kxy$.
2. Choisis parmi des structures algébriques variées et stimulantes :
   - Groupes de permutations $S_n$ ou groupe alterné $A_n$ (décomposition en cycles disjoints, signature, groupe de Klein $V_4$)
   - Groupes de matrices dans $\\mathrm{GL}_2(\\mathbb{R})$ ou $\\mathrm{SL}_2(\\mathbb{R})$ (matrices unipotentes, triangulaires)
   - Groupe affine $\\mathrm{Aff}(\\mathbb{R}) = \\{x \\mapsto ax+b \\mid a \\neq 0\\}$
   - Loi de composition relativiste $x*y = \\frac{x+y}{1+xy}$ sur $]-1, 1[$
   - Racines $n$-ièmes de l'unité $\\mathbb{U}_n$ et sous-groupes finis de $\\mathbb{C}^*$
   - Calcul de noyau $\\ker(f)$ et image $\\operatorname{Im}(f)$ pour des morphismes non-triviaux
   - Groupes quotients $G/H$, classes d'équivalence et indice de Lagrange $[G : H]$
   - Ordre dans les produits directs $\\mathbb{Z}/a\\mathbb{Z} \\times \\mathbb{Z}/b\\mathbb{Z}$ et dénombrement des générateurs via $\\phi(n)$
   - Cryptosystèmes RSA/Diffie-Hellman : Théorème d'Euler, algorithme d'Euclide étendu et coefficients de Bézout, Théorème des Restes Chinois
3. Conforme aux cours et fiches TD de l'Université d'Oran 1.
4. Formate TOUTES les formules mathématiques en KaTeX ($...$ en ligne, $$...$$ en bloc).
5. Renvoie STRICTEMENT un JSON valide brut sans balises markdown :
{
  "title": "Titre explicite de l'exercice",
  "statement": "Énoncé complet et rigoureux avec questions numérotées en KaTeX",
  "hints": ["Indice 1 en KaTeX", "Indice 2 en KaTeX"],
  "solution": {
    "steps": ["Étape 1 de résolution détaillée en KaTeX", "Étape 2 de résolution détaillée en KaTeX"]
  },
  "rubric": [
    {"criterion": "Critère de notation 1", "points": 2.0},
    {"criterion": "Critère de notation 2", "points": 2.0}
  ]
}`;

    const rawResponse = await NvidiaAIService.chatCompletion({
      messages: [
        {
          role: "system",
          content: isEn
            ? "You are an expert algebra professor at University of Oran 1. Output strictly valid raw JSON without markdown fences."
            : "Tu es un professeur expert d'algèbre à l'Université d'Oran 1. Renvoie strictement du JSON brut sans balises markdown.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      maxTokens: 1100,
    });

    // Clean possible markdown code fences
    const cleaned = rawResponse
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    const parsed = JSON.parse(cleaned);
    const seed = Date.now();

    return {
      id: `gen-ai-${seed}`,
      title: parsed.title || `Exercice IA : ${topObj.name}`,
      moduleId,
      topic: topObj.id,
      sourcePdf:
        moduleId === "module-1"
          ? "cours-mpc-partie1.pdf"
          : moduleId.includes("2") || moduleId.includes("3")
          ? "cours-mpc-partie2 (1).pdf"
          : "cours-mpc-part3.pdf",
      sourcePage: 5,
      difficulty,
      type: "proof",
      statement: parsed.statement,
      normalizedLatex: parsed.statement.slice(0, 80),
      hints: Array.isArray(parsed.hints) && parsed.hints.length > 0
        ? parsed.hints
        : [isEn ? "Check the fundamental course definitions." : "Vérifiez les définitions fondamentales du cours."],
      solution: {
        steps: Array.isArray(parsed.solution?.steps) && parsed.solution.steps.length > 0
          ? parsed.solution.steps
          : [parsed.solution || (isEn ? "Full step-by-step derivation." : "Démonstration complète pas-à-pas.")],
      },
      rubric: Array.isArray(parsed.rubric) && parsed.rubric.length > 0
        ? parsed.rubric
        : [{ criterion: isEn ? "Mathematical rigor" : "Rigueur mathématique", points: 4.0 }],
      isGenerated: true,
    };
  }

  /**
   * Generates a deterministic, mathematically validated exercise for a chosen module & topic
   */
  public static generate(
    moduleId: string = "module-1",
    difficulty: "Beginner" | "Easy" | "Medium" | "Hard" | "Exam Level" = "Medium",
    topic?: string,
    language: "fr" | "en" = "fr"
  ): ExerciseData {
    const seed = Date.now() + Math.floor(Math.random() * 10000);

    let ex: ExerciseData;
    switch (moduleId) {
      case "module-1":
        ex = this.generateModule1(difficulty, topic, seed);
        break;
      case "module-2":
        ex = this.generateModule2(difficulty, topic, seed);
        break;
      case "module-3":
        ex = this.generateModule3(difficulty, topic, seed);
        break;
      case "module-4":
        ex = this.generateModule4(difficulty, topic, seed);
        break;
      case "module-5":
        ex = this.generateModule5(difficulty, topic, seed);
        break;
      case "module-6":
        ex = this.generateModule6(difficulty, topic, seed);
        break;
      default:
        ex = this.generateModule1(difficulty, topic, seed);
        break;
    }

    if (language === "en") {
      return this.translateToEnglish(ex);
    }
    return ex;
  }

  private static translateToEnglish(ex: ExerciseData): ExerciseData {
    const translateText = (txt: string) => {
      return txt
        .replace(/Soit\s+/gi, "Let ")
        .replace(/Soient\s+/gi, "Let ")
        .replace(/Montrer que\s+/gi, "Prove that ")
        .replace(/Montrez que\s+/gi, "Show that ")
        .replace(/Démontrer que\s+/gi, "Demonstrate that ")
        .replace(/Calculer\s+/gi, "Compute ")
        .replace(/Déterminer\s+/gi, "Determine ")
        .replace(/Vérifier que\s+/gi, "Verify that ")
        .replace(/Justifier\s+/gi, "Justify ")
        .replace(/Résoudre dans\s+/gi, "Solve in ")
        .replace(/l'ensemble\s+/gi, "the set ")
        .replace(/muni de la loi\s+/gi, "equipped with the law ")
        .replace(/est un sous-groupe de\s+/gi, "is a subgroup of ")
        .replace(/est un groupe\s+/gi, "is a group ")
        .replace(/élément neutre\s+/gi, "identity element ")
        .replace(/symétrique\s+/gi, "inverse element ")
        .replace(/loi interne\s+/gi, "internal law (closure) ")
        .replace(/associativité\s+/gi, "associativity ")
        .replace(/associative\s+/gi, "associative ")
        .replace(/morphisme de groupes\s+/gi, "group homomorphism ")
        .replace(/noyau\s+/gi, "kernel ")
        .replace(/image\s+/gi, "image ")
        .replace(/injectif\s+/gi, "injective ")
        .replace(/ordre de\s+/gi, "order of ")
        .replace(/théorème de Lagrange\s+/gi, "Lagrange's Theorem ")
        .replace(/petit théorème de Fermat\s+/gi, "Fermat's Little Theorem ")
        .replace(/théorème d'Euler\s+/gi, "Euler's Totient Theorem ");
    };

    return {
      ...ex,
      title: translateText(ex.title),
      statement: translateText(ex.statement),
      hints: ex.hints.map(translateText),
      solution: {
        ...ex.solution,
        steps: ex.solution.steps.map(translateText),
      },
      rubric: ex.rubric.map((r) => ({
        ...r,
        criterion: translateText(r.criterion),
      })),
    };
  }

  // --- MODULE 1: Groupes et Sous-groupes ---
  private static generateModule1(difficulty: string, topic: string | undefined, seed: number): ExerciseData {
    const archetype = seed % 4;

    if (archetype === 0 || topic === "matrix-group") {
      return {
        id: `gen-m1-mat-${seed}`,
        title: `Sous-groupe de matrices triangulaires unipotentes`,
        moduleId: "module-1",
        topic: "matrix-group",
        sourcePdf: "cours-mpc-partie1.pdf",
        sourcePage: 9,
        difficulty: difficulty as any,
        type: "proof",
        statement: `Soit l'ensemble de matrices réelles $2 \\times 2$ :
$$T = \\left\\{ M(a) = \\begin{pmatrix} 1 & a \\\\ 0 & 1 \\end{pmatrix} \\;\\middle|\\; a \\in \\mathbb{R} \\right\\}$$
1. Montrer que $T$ est non vide.
2. Démontrer que $T$ est un sous-groupe abélien de $(\\mathrm{GL}_2(\\mathbb{R}), \\times)$.`,
        normalizedLatex: `T = \\left\\{ \\begin{pmatrix} 1 & a \\\\ 0 & 1 \\end{pmatrix} \\right\\} \\le \\mathrm{GL}_2(\\mathbb{R})`,
        hints: [
          `Hint 1 : Vérifiez que pour $a = 0$, $M(0) = I_2 \\in T$.`,
          `Hint 2 : Calculez le produit $M(a) \\times M(b)^{-1}$ avec $M(b)^{-1} = M(-b)$.`,
          `Hint 3 : Vérifiez la commutativité $M(a)M(b) = M(b)M(a)$.`
        ],
        solution: {
          isGroup: true,
          isAbelian: true,
          steps: [
            `1. Non-vacuité : Pour $a = 0$, $M(0) = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix} = I_2 \\in T$, donc $T \\neq \\emptyset$.`,
            `2. Inverse d'un élément : $\\det(M(b)) = 1 \\neq 0$. Son inverse est $M(b)^{-1} = M(-b) = \\begin{pmatrix} 1 & -b \\\\ 0 & 1 \\end{pmatrix} \\in T$.`,
            `3. Stabilité par produit : Soient $M(a), M(b) \\in T$ :
$$M(a) \\times M(b)^{-1} = \\begin{pmatrix} 1 & a \\\\ 0 & 1 \\end{pmatrix} \\begin{pmatrix} 1 & -b \\\\ 0 & 1 \\end{pmatrix} = \\begin{pmatrix} 1 & a-b \\\\ 0 & 1 \\end{pmatrix} = M(a-b) \\in T$$
puisque $a - b \\in \\mathbb{R}$.`,
            `4. Commutativité : $M(a)M(b) = M(a+b) = M(b+a) = M(b)M(a)$. Donc $T$ est abélien.`
          ]
        },
        rubric: [
          { criterion: "Vérification de la non-vacuité (I₂ ∈ T)", points: 0.5 },
          { criterion: "Calcul de l'inverse M(b)⁻¹ = M(-b)", points: 1.0 },
          { criterion: "Application du critère de sous-groupe M(a)M(b)⁻¹ ∈ T", points: 1.5 },
          { criterion: "Preuve de commutativité", points: 1.0 }
        ],
        isGenerated: true,
      };
    }

    if (archetype === 1) {
      // Relativistic Velocity Addition Group on ]-1, 1[
      return {
        id: `gen-m1-vel-${seed}`,
        title: `Loi d'addition relativiste sur ]-1, 1[`,
        moduleId: "module-1",
        topic: "group-law",
        sourcePdf: "cours-mpc-partie1.pdf",
        sourcePage: 6,
        difficulty: difficulty as any,
        type: "proof",
        statement: `Soit l'intervalle ouvert $G = ]-1, 1[$. On définit l'opération :
$$x * y = \\frac{x + y}{1 + xy}$$
1. Montrer que $*$ est une loi de composition interne sur $G$ (prouver que $|x*y| < 1$).
2. Démontrer que $(G, *)$ est un groupe abélien en précisant le neutre $e$ et le symétrique $x'$ de tout $x \\in G$.`,
        normalizedLatex: `x * y = \\frac{x+y}{1+xy} \\quad \\text{sur } ]-1, 1[`,
        hints: [
          `Hint 1 : Calculez $1 - (x * y)^2 = \\frac{(1-x^2)(1-y^2)}{(1+xy)^2}$ pour prouver que $|x*y| < 1$.`,
          `Hint 2 : Le neutre $e$ satisfait $x * e = x \\iff \\frac{x+e}{1+xe} = x \\iff e(1-x^2) = 0$.`,
          `Hint 3 : Le symétrique $x'$ satisfait $x * x' = 0 \\iff x + x' = 0$.`
        ],
        solution: {
          isGroup: true,
          isAbelian: true,
          steps: [
            `1. Loi interne : Remarquons que $1 - (x*y) = \\frac{(1-x)(1-y)}{1+xy} > 0$ et $1 + (x*y) = \\frac{(1+x)(1+y)}{1+xy} > 0$. Donc $-1 < x*y < 1$, ce qui prouve la stabilité de $G$.`,
            `2. Associativité : $(x*y)*z = \\frac{x+y+z+xyz}{1+xy+xz+yz} = x*(y*z)$.`,
            `3. Commutativité : $x*y = \\frac{x+y}{1+xy} = \\frac{y+x}{1+yx} = y*x$.`,
            `4. Neutre : $\\frac{x+e}{1+xe} = x \\iff x+e = x+x^2 e \\iff e(1-x^2) = 0$. Comme $x \\in ]-1, 1[$, $1-x^2 \\neq 0$, donc $e = 0 \\in G$.`,
            `5. Symétrique : $\\frac{x+x'}{1+xx'} = 0 \\iff x+x' = 0 \\iff x' = -x \\in G$.`
          ]
        },
        rubric: [
          { criterion: "Preuve de fermeture |x*y| < 1", points: 1.5 },
          { criterion: "Associativité et commutativité", points: 1.0 },
          { criterion: "Élément neutre e = 0", points: 0.75 },
          { criterion: "Inverse x' = -x", points: 0.75 }
        ],
        isGenerated: true,
      };
    }

    if (archetype === 2) {
      // Klein Four-group in Permutation Group S4
      return {
        id: `gen-m1-klein-${seed}`,
        title: `Sous-groupe de Klein dans le groupe symétrique S₄`,
        moduleId: "module-1",
        topic: "subgroup-criterion",
        sourcePdf: "cours-mpc-partie1.pdf",
        sourcePage: 10,
        difficulty: difficulty as any,
        type: "proof",
        statement: `Dans le groupe symétrique $S_4$, considérons le sous-ensemble :
$$V = \\{ \\mathrm{id}, \\; (12)(34), \\; (13)(24), \\; (14)(23) \\}$$
1. Dresser la table de composition de $V$.
2. En déduire que $V$ est un sous-groupe abélien de $(S_4, \\circ)$. Quel est l'ordre de chaque élément ?`,
        normalizedLatex: `V = \\{ \\mathrm{id}, (12)(34), (13)(24), (14)(23) \\} \\le S_4`,
        hints: [
          `Hint 1 : Composez les transpositions disjointes, par exemple $(12)(34) \\circ (13)(24) = (14)(23)$.`,
          `Hint 2 : Remarquez que chaque élément non trivial est son propre inverse (ordre 2).`,
          `Hint 3 : Vérifiez la clôture : la table ne contient que des éléments de $V$.`
        ],
        solution: {
          isGroup: true,
          isAbelian: true,
          steps: [
            `1. Table de composition : Posons $\\sigma_1 = (12)(34)$, $\\sigma_2 = (13)(24)$, $\\sigma_3 = (14)(23)$.
On vérifie $\\sigma_1^2 = \\sigma_2^2 = \\sigma_3^2 = \\mathrm{id}$.
De plus, $\\sigma_1 \\sigma_2 = \\sigma_3 = \\sigma_2 \\sigma_1$, $\\sigma_2 \\sigma_3 = \\sigma_1 = \\sigma_3 \\sigma_2$, et $\\sigma_3 \\sigma_1 = \\sigma_2 = \\sigma_1 \\sigma_3$.`,
            `2. Sous-groupe : $V$ est non vide (contient $\\mathrm{id}$), stable par composition et chaque élément admet son propre inverse dans $V$. Donc $(V, \\circ)$ est un sous-groupe.`,
            `3. Ordre des éléments : $\\mathrm{ord}(\\mathrm{id}) = 1$, et $\\mathrm{ord}(\\sigma_1) = \\mathrm{ord}(\\sigma_2) = \\mathrm{ord}(\\sigma_3) = 2$. C'est le groupe de Klein $V_4 \\simeq \\mathbb{Z}/2\\mathbb{Z} \\times \\mathbb{Z}/2\\mathbb{Z}$.`
          ]
        },
        rubric: [
          { criterion: "Table de composition complète", points: 1.5 },
          { criterion: "Preuve du statut de sous-groupe", points: 1.5 },
          { criterion: "Détermination exacte des ordres", points: 1.0 }
        ],
        isGenerated: true,
      };
    }

    // Archetype 3: Rational group law on R \ {1}
    return {
      id: `gen-m1-grp-${seed}`,
      title: `Structure de groupe abélien sur ℝ \\ {1}`,
      moduleId: "module-1",
      topic: "group-law",
      sourcePdf: "cours-mpc-partie1.pdf",
      sourcePage: 6,
      difficulty: difficulty as any,
      type: "proof",
      statement: `Soit $E = \\mathbb{R} \\setminus \\{1\\}$. On définit la loi $*$ par :
$$x * y = x + y - xy$$
1. Prouver que $*$ est une loi de composition interne sur $E$.
2. Établir que $(E, *)$ est un groupe abélien en calculant l'élément neutre $e$ et l'inverse $x'$ de tout $x \\in E$.`,
      normalizedLatex: `x * y = x + y - xy \\quad \\text{sur } \\mathbb{R} \\setminus \\{1\\}`,
      hints: [
        `Hint 1 : Utilisez l'identité $1 - (x * y) = (1 - x)(1 - y)$.`,
        `Hint 2 : Comme $x \\neq 1$ et $y \\neq 1$, le produit $(1 - x)(1 - y) \\neq 0$.`,
        `Hint 3 : Le neutre satisfait $x * e = x \\iff e(1 - x) = 0$.`
      ],
      solution: {
        isGroup: true,
        isAbelian: true,
        steps: [
          `1. Stabilité (loi interne) : $1 - (x * y) = 1 - x - y + xy = (1 - x)(1 - y)$. Comme $x \\neq 1$ et $y \\neq 1$, $(1-x)(1-y) \\neq 0 \\implies x * y \\neq 1$. Donc $*$ est interne sur $E$.`,
          `2. Associativité : $(x * y) * z = x + y + z - xy - xz - yz + xyz = x * (y * z)$.`,
          `3. Commutativité : $x * y = x + y - xy = y + x - yx = y * x$.`,
          `4. Neutre : $x * e = x \\iff e(1 - x) = 0$. Comme $x \\neq 1$, $e = 0 \\in E$.`,
          `5. Inverse : $x * x' = 0 \\iff x'(1 - x) = -x \\iff x' = \\frac{x}{x - 1} \\in E$.`
        ]
      },
      rubric: [
        { criterion: "Preuve de fermeture via (1-x)(1-y) ≠ 0", points: 1.5 },
        { criterion: "Preuve de l'associativité et commutativité", points: 1.0 },
        { criterion: "Élément neutre e = 0", points: 0.75 },
        { criterion: "Inverse x' = x / (x - 1)", points: 0.75 }
      ],
      isGenerated: true,
    };
  }

  // --- MODULE 2: Morphismes de groupes ---
  private static generateModule2(difficulty: string, topic: string | undefined, seed: number): ExerciseData {
    const archetype = seed % 3;

    if (archetype === 1 || topic === "homomorphism-proof") {
      // Determinant Homomorphism from GL2 to R*
      return {
        id: `gen-m2-det-${seed}`,
        title: `Morphisme déterminant et sous-groupe spécial linéaire SL₂(ℝ)`,
        moduleId: "module-2",
        topic: "homomorphism-proof",
        sourcePdf: "cours-mpc-partie2 (1).pdf",
        sourcePage: 5,
        difficulty: difficulty as any,
        type: "proof",
        statement: `Soit l'application $\\det : (\\mathrm{GL}_2(\\mathbb{R}), \\times) \\to (\\mathbb{R}^*, \\times)$ qui à toute matrice $M$ associe son déterminant $\\det(M)$.
1. Montrer que $\\det$ est un morphisme de groupes.
2. Déterminer son noyau $\\ker(\\det)$ et identifier ce sous-groupe remarquable.
3. Le morphisme $\\det$ est-il injectif ? Est-il surjectif ? Justifier.`,
        normalizedLatex: `\\det : \\mathrm{GL}_2(\\mathbb{R}) \\to \\mathbb{R}^*, \\quad \\ker(\\det) = \\mathrm{SL}_2(\\mathbb{R})`,
        hints: [
          `Hint 1 : Utilisez la formule fondamentale du cours d'algèbre : $\\det(AB) = \\det(A) \\cdot \\det(B)$.`,
          `Hint 2 : Le neutre du groupe d'arrivée $(\\mathbb{R}^*, \\times)$ est 1. Résolvez $\\det(M) = 1$.`,
          `Hint 3 : Pour la surjectivité, pour tout $\\lambda \\in \\mathbb{R}^*$, construisez la matrice diagonale $\\begin{pmatrix} \\lambda & 0 \\\\ 0 & 1 \\end{pmatrix}$.`
        ],
        solution: {
          steps: [
            `1. Morphisme : Pour toutes matrices $A, B \\in \\mathrm{GL}_2(\\mathbb{R})$, la propriété multiplicative du déterminant donne :
$$\\det(A \\times B) = \\det(A) \\times \\det(B)$$
Donc $\\det$ est un morphisme du groupe multiplicatif des matrices inversibles vers $(\\mathbb{R}^*, \\times)$.`,
            `2. Noyau : $\\ker(\\det) = \\{M \\in \\mathrm{GL}_2(\\mathbb{R}) \\mid \\det(M) = 1\\}$.
Ce sous-groupe remarquable est appelé le **Groupe Spécial Linéaire**, noté $\\mathrm{SL}_2(\\mathbb{R})$.`,
            `3. Injectivité : $\\ker(\\det) \\neq \\{I_2\\}$ (par exemple $\\begin{pmatrix} -1 & 0 \\\\ 0 & -1 \\end{pmatrix} \\in \\ker(\\det)$). Donc $\\det$ n'est pas injectif.`,
            `4. Surjectivité : Pour tout $\\lambda \\in \\mathbb{R}^*$, considérons $M_\\lambda = \\begin{pmatrix} \\lambda & 0 \\\\ 0 & 1 \\end{pmatrix} \\in \\mathrm{GL}_2(\\mathbb{R})$. On a $\\det(M_\\lambda) = \\lambda \\times 1 - 0 = \\lambda$. Donc $\\det$ est surjectif.`
          ]
        },
        rubric: [
          { criterion: "Preuve de det(AB) = det(A)det(B)", points: 1.5 },
          { criterion: "Identification du noyau Ker = SL₂(ℝ)", points: 1.5 },
          { criterion: "Étude rigoureuse d'injectivité et surjectivité", points: 1.0 }
        ],
        isGenerated: true,
      };
    }

    if (archetype === 2) {
      // Conjugation Automorphism
      return {
        id: `gen-m2-conj-${seed}`,
        title: `Automorphisme intérieur par conjugaison`,
        moduleId: "module-2",
        topic: "homomorphism-proof",
        sourcePdf: "cours-mpc-partie2 (1).pdf",
        sourcePage: 6,
        difficulty: difficulty as any,
        type: "proof",
        statement: `Soit $(G, \\cdot)$ un groupe et soit un élément fixé $g \\in G$. On définit l'application de conjugaison $\\phi_g : G \\to G$ par :
$$\\phi_g(x) = g \\cdot x \\cdot g^{-1}$$
1. Montrer que $\\phi_g$ est un morphisme de groupes de $G$ dans $G$.
2. Déterminer son noyau $\\ker(\\phi_g)$. Que peut-on en déduire sur l'injectivité ?
3. Montrer que $\\phi_g$ est bijectif et préciser son application réciproque $(\\phi_g)^{-1}$.`,
        normalizedLatex: `\\phi_g(x) = gxg^{-1}, \\quad \\phi_g \\in \\mathrm{Aut}(G)`,
        hints: [
          `Hint 1 : Développez $\\phi_g(x) \\cdot \\phi_g(y) = (g x g^{-1})(g y g^{-1})$ et simplifiez $g^{-1}g$.`,
          `Hint 2 : Pour le noyau, résolvez $g x g^{-1} = e$.`,
          `Hint 3 : L'application inverse de la conjugaison par $g$ est la conjugaison par $g^{-1}$.`
        ],
        solution: {
          steps: [
            `1. Morphisme : Pour tous $x, y \\in G$ :
$$\\phi_g(x) \\cdot \\phi_g(y) = (g x g^{-1}) \\cdot (g y g^{-1}) = g x (g^{-1} g) y g^{-1} = g x e y g^{-1} = g (xy) g^{-1} = \\phi_g(xy)$$
Donc $\\phi_g$ est un endomorphisme de $G$.`,
            `2. Noyau : $\\ker(\\phi_g) = \\{x \\in G \\mid gxg^{-1} = e\\}$.
$$g x g^{-1} = e \\iff g x = e g = g \\iff x = g^{-1} g = e$$
Le noyau est réduit au neutre $\\ker(\\phi_g) = \\{e\\}$, donc $\\phi_g$ est injectif.`,
            `3. Bijectivité : L'application $\\phi_{g^{-1}}(y) = g^{-1} y (g^{-1})^{-1} = g^{-1} y g$ satisfait $(\\phi_g \\circ \\phi_{g^{-1}})(y) = y$ et $(\\phi_{g^{-1}} \\circ \\phi_g)(x) = x$. Donc $\\phi_g$ est un automorphisme de $G$ (automorphisme intérieur).`
          ]
        },
        rubric: [
          { criterion: "Preuve de morphisme via g⁻¹g = e", points: 1.5 },
          { criterion: "Calcul de Ker = {e} et injectivité", points: 1.5 },
          { criterion: "Preuve de surjectivité / bijectivité", points: 1.0 }
        ],
        isGenerated: true,
      };
    }

    const coeff = [2, 3, 5][seed % 3];
    return {
      id: `gen-m2-morph-${seed}`,
      title: `Morphisme exponentiel complexe et calcul de Ker & Im`,
      moduleId: "module-2",
      topic: "kernel-image",
      sourcePdf: "cours-mpc-partie2 (1).pdf",
      sourcePage: 4,
      difficulty: difficulty as any,
      type: "proof",
      statement: `Soit l'application $f : (\\mathbb{R}, +) \\to (\\mathbb{C}^*, \\times)$ définie par :
$$f(x) = e^{i \\cdot ${coeff}\\pi x}$$
1. Démontrer que $f$ est un morphisme de groupes.
2. Déterminer son noyau $\\ker(f)$ et son image $\\operatorname{Im}(f)$.
3. Le morphisme $f$ est-il injectif ? Est-il surjectif ? Justifier.`,
      normalizedLatex: `f(x) = e^{i \\cdot ${coeff}\\pi x}`,
      hints: [
        `Hint 1 : Utilisez les propriétés de l'exponentielle imaginaire : $e^{i(a+b)} = e^{ia}e^{ib}$.`,
        `Hint 2 : Le neutre de $(\\mathbb{C}^*, \\times)$ est 1. Résolvez $e^{i \\cdot ${coeff}\\pi x} = 1 = e^{i \\cdot 2k\\pi}$.`,
        `Hint 3 : Un morphisme est injectif si et seulement si son noyau est réduit au neutre de départ {0}.`
      ],
      solution: {
        steps: [
          `1. Morphisme : Pour tous $x, y \\in \\mathbb{R}$ :
$$f(x + y) = e^{i \\cdot ${coeff}\\pi (x+y)} = e^{i \\cdot ${coeff}\\pi x} \\cdot e^{i \\cdot ${coeff}\\pi y} = f(x) \\cdot f(y)$$
Donc $f$ est un morphisme du groupe additif $(\\mathbb{R}, +)$ vers le groupe multiplicatif $(\\mathbb{C}^*, \\times)$.`,
          `2. Noyau : $\\ker(f) = \\{x \\in \\mathbb{R} \\mid f(x) = 1\\}$.
$$e^{i \\cdot ${coeff}\\pi x} = 1 \\iff ${coeff}\\pi x \\equiv 0 \\pmod{2\\pi} \\iff ${coeff}x = 2k \\; (k \\in \\mathbb{Z}) \\iff x = \\frac{2k}{${coeff}}$$
Ainsi, $\\ker(f) = \\frac{2}{${coeff}}\\mathbb{Z}$.`,
          `3. Injectivité : $\\ker(f) = \\frac{2}{${coeff}}\\mathbb{Z} \\neq \\{0\\}$, donc $f$ n'est pas injectif.`,
          `4. Image : L'image est le cercle unité $\\mathbb{U} = \\{z \\in \\mathbb{C} \\mid |z| = 1\\} \\subsetneq \\mathbb{C}^*$, donc $f$ n'est pas surjectif.`
        ]
      },
      rubric: [
        { criterion: "Preuve de f(x+y) = f(x)f(y)", points: 1.5 },
        { criterion: `Calcul rigoureux de Ker(f) = (2/${coeff})ℤ`, points: 1.5 },
        { criterion: "Conclusion argumentée sur l'injectivité et surjectivité", points: 1.0 }
      ],
      isGenerated: true,
    };
  }

  // --- MODULE 3: Sous-groupes distingués & Quotients ---
  private static generateModule3(difficulty: string, topic: string | undefined, seed: number): ExerciseData {
    const n = [3, 4, 6][seed % 3];

    return {
      id: `gen-m3-dist-${seed}`,
      title: `Sous-groupes distingués et ordre du quotient`,
      moduleId: "module-3",
      topic: "normal-subgroup",
      sourcePdf: "cours-mpc-partie2 (1).pdf",
      sourcePage: 12,
      difficulty: difficulty as any,
      type: "proof",
      statement: `Soit $G = (\\mathbb{Z}/12\\mathbb{Z}, +)$ et soit $H = \\langle \\bar{${n}} \\rangle$ le sous-groupe engendré par la classe $\\bar{${n}}$.
1. Déterminer tous les éléments du sous-groupe $H$ et son ordre $|H|$.
2. Justifier sans calcul lourd pourquoi $H$ est distingué dans $G$.
3. Déterminer l'ordre du groupe quotient $G/H$ et lister ses classes d'équivalence.`,
      normalizedLatex: `H = \\langle \\bar{${n}} \\rangle \\trianglelefteq (\\mathbb{Z}/12\\mathbb{Z}, +)`,
      hints: [
        `Hint 1 : Calculez les multiples successifs de ${n} modulo 12 jusqu'à revenir à 0.`,
        `Hint 2 : Le groupe $(\\mathbb{Z}/12\\mathbb{Z}, +)$ est abélien. Que sait-on sur les sous-groupes d'un groupe abélien ?`,
        `Hint 3 : L'ordre du quotient est donné par le théorème de Lagrange : $|G/H| = |G| / |H| = 12 / |H|.`
      ],
      solution: {
        steps: [
          `1. Éléments de $H$ : Pour $n = ${n}$, les multiples modulo 12 sont $H = \\{${Array.from({ length: 12 / n }, (_, i) => (i * n) % 12).join(", ")}\\}$. L'ordre est $|H| = ${12 / n}$.`,
          `2. Caractère distingué : Le groupe $G = (\\mathbb{Z}/12\\mathbb{Z}, +)$ est abélien. D'après le cours [cours-mpc-partie2, Page 12], TOUT sous-groupe d'un groupe abélien est automatiquement distingué (car $\\forall g \\in G, \\forall h \\in H, \\; g + h - g = h \\in H$).`,
          `3. Ordre du quotient : Par le théorème de Lagrange, $|G/H| = \\frac{|G|}{|H|} = \\frac{12}{${12 / n}} = ${n}$.`,
          `4. Classes d'équivalence de $G/H$ : Les ${n}$ classes distinctes sont $\\bar{0} + H, \\bar{1} + H, \\dots, \\overline{${n - 1}} + H$.`
        ]
      },
      rubric: [
        { criterion: `Description exacte des éléments de H et cardinal |H| = ${12 / n}`, points: 1.5 },
        { criterion: "Justification du caractère distingué via la commutativité", points: 1.0 },
        { criterion: `Calcul de l'ordre du quotient |G/H| = ${n}`, points: 1.5 }
      ],
      isGenerated: true,
    };
  }

  // --- MODULE 4: Groupes monogènes et cycliques ---
  private static generateModule4(difficulty: string, topic: string | undefined, seed: number): ExerciseData {
    if (topic === "direct-product-order") {
      const a = [3, 4, 6][seed % 3];
      const b = [4, 5, 8][(seed + 1) % 3];
      const ordA = a;
      const ordB = b;
      const lcm = MathSolver.lcm(ordA, ordB);

      return {
        id: `gen-m4-prod-${seed}`,
        title: `Ordre dans le produit direct ℤ/${a}ℤ × ℤ/${b}ℤ`,
        moduleId: "module-4",
        topic: "direct-product-order",
        sourcePdf: "cours-mpc-part3.pdf",
        sourcePage: 6,
        difficulty: difficulty as any,
        type: "computation",
        statement: `Dans le groupe produit direct $G = (\\mathbb{Z}/${a}\\mathbb{Z} \\times \\mathbb{Z}/${b}\\mathbb{Z}, +)$, déterminer l'ordre de l'élément $g = (\\bar{1}, \\bar{1})$. Le groupe $G$ est-il cyclique ?`,
        normalizedLatex: `\\operatorname{ord}((\\bar{1}, \\bar{1})) \\quad \\text{dans } \\mathbb{Z}/${a}\\mathbb{Z} \\times \\mathbb{Z}/${b}\\mathbb{Z}`,
        hints: [
          `Hint 1 : Dans un groupe produit direct, l'ordre d'un élément $(x, y)$ est le PPCM des ordres de chaque composante : $\\operatorname{ord}((x,y)) = \\operatorname{ppcm}(\\operatorname{ord}(x), \\operatorname{ord}(y))$.`,
          `Hint 2 : Calculez $\\operatorname{ord}(\\bar{1})$ dans $\\mathbb{Z}/${a}\\mathbb{Z}$ et dans $\\mathbb{Z}/${b}\\mathbb{Z}$.`,
          `Hint 3 : Le groupe est cyclique ssi son ordre total $|G| = ${a} \\times ${b} = ${a * b}$ est égal à l'ordre maximal d'un élément, c'est-à-dire si $\\operatorname{pgcd}(${a}, ${b}) = 1$.`
        ],
        solution: {
          expectedResult: lcm,
          steps: [
            `1. Dans $(\\mathbb{Z}/${a}\\mathbb{Z}, +)$, $\\operatorname{ord}(\\bar{1}) = ${ordA}$.`,
            `2. Dans $(\\mathbb{Z}/${b}\\mathbb{Z}, +)$, $\\operatorname{ord}(\\bar{1}) = ${ordB}$.`,
            `3. Formule du cours : $\\operatorname{ord}((\\bar{1}, \\bar{1})) = \\operatorname{ppcm}(${ordA}, ${ordB}) = ${lcm}$.`,
            `4. Cyclicité : L'ordre total du groupe est $|G| = ${a} \\times ${b} = ${a * b}$. Comme $\\operatorname{ord}(g) = ${lcm}$ ${lcm === a * b ? "= |G|, le groupe est CYCLIQUE (isomorphe à ℤ/" + (a * b) + "ℤ)" : "< |G| = " + (a * b) + ", le groupe N'EST PAS CYCLIQUE car pgcd(" + a + ", " + b + ") ≠ 1"}.`
          ]
        },
        rubric: [
          { criterion: "Application de la formule du PPCM des ordres", points: 1.5 },
          { criterion: `Calcul exact de l'ordre = ${lcm}`, points: 1.5 },
          { criterion: "Conclusion justifiée sur la cyclicité du produit", points: 1.0 }
        ],
        isGenerated: true,
      };
    }

    // Default: Order in (Z/nZ, +)
    const moduli = [12, 16, 18, 20, 24, 30];
    const n = moduli[seed % moduli.length];
    const a = 2 + (seed % (n - 2));
    const gcd = MathSolver.gcd(a, n);
    const order = MathSolver.orderAdditive(a, n);

    return {
      id: `gen-m4-ord-${seed}`,
      title: `Ordre de ${a} dans le groupe additif (ℤ/${n}ℤ, +)`,
      moduleId: "module-4",
      topic: "element-order",
      sourcePdf: "cours-mpc-part3.pdf",
      sourcePage: 4,
      difficulty: difficulty as any,
      type: "computation",
      statement: `Déterminer l'ordre de la classe $\\bar{${a}}$ dans le groupe additif $(\\mathbb{Z}/${n}\\mathbb{Z}, +)$. Énoncer le théorème liant l'ordre au cardinal du groupe et au PGCD.`,
      normalizedLatex: `\\operatorname{ord}(\\bar{${a}}) \\pmod{${n}}`,
      hints: [
        `Hint 1 : L'ordre est le plus petit entier $k \\ge 1$ tel que $k \\cdot ${a} \\equiv 0 \\pmod{${n}}$.`,
        `Hint 2 : La formule du cours énonce $\\operatorname{ord}(\\bar{a}) = \\frac{n}{\\operatorname{pgcd}(a, n)}$.`,
        `Hint 3 : Calculez $\\operatorname{pgcd}(${a}, ${n})$.`
      ],
      solution: {
        expectedResult: order,
        steps: [
          `1. Par définition, l'ordre est le plus petit $k \\ge 1$ tel que ${n} \\mid ${a}k$.`,
          `2. On calcule le PGCD : $\\operatorname{pgcd}(${a}, ${n}) = ${gcd}$.`,
          `3. Formule : $\\operatorname{ord}(\\bar{${a}}) = \\frac{${n}}{\\operatorname{pgcd}(${a}, ${n})} = \\frac{${n}}{${gcd}} = ${order}$.`,
          `4. Vérification : $${order} \\times ${a} = ${order * a} = ${Math.floor((order * a) / n)} \\times ${n} \\equiv 0 \\pmod{${n}}$.`
        ]
      },
      rubric: [
        { criterion: "Énoncé de la formule de l'ordre d'un élément", points: 1.0 },
        { criterion: `Calcul du pgcd(${a}, ${n}) = ${gcd}`, points: 1.0 },
        { criterion: `Valeur finale ord = ${order}`, points: 2.0 }
      ],
      isGenerated: true,
    };
  }

  // --- MODULE 5: Théorèmes fondamentaux ---
  private static generateModule5(difficulty: string, topic: string | undefined, seed: number): ExerciseData {
    const primes = [7, 11, 13, 17, 19];
    const p = primes[seed % primes.length];
    const a = 2 + (seed % (p - 2));
    const power = p * 4 + 3;
    const rem = power % (p - 1);
    const expected = MathSolver.modularPower(a, rem, p);

    return {
      id: `gen-m5-fermat-${seed}`,
      title: `Calcul de puissance modulaire via Petit Théorème de Fermat`,
      moduleId: "module-5",
      topic: "fermat-powers",
      sourcePdf: "cours-mpc-part3.pdf",
      sourcePage: 9,
      difficulty: difficulty as any,
      type: "computation",
      statement: `Calculer le reste de la division euclidienne de $${a}^{${power}}$ par $${p}$.
Justifier rigoureusement les étapes à l'aide du Petit Théorème de Fermat.`,
      normalizedLatex: `${a}^{${power}} \\pmod{${p}}`,
      hints: [
        `Hint 1 : Le module ${p} est premier, et $\\operatorname{pgcd}(${a}, ${p}) = 1$.`,
        `Hint 2 : Le Petit Théorème de Fermat affirme que $a^{p-1} \\equiv 1 \\pmod p$, donc ici $${a}^{${p - 1}} \\equiv 1 \\pmod{${p}}$.`,
        `Hint 3 : Effectuez la division euclidienne de l'exposant ${power} par $(p - 1) = ${p - 1}$.`
      ],
      solution: {
        expectedResult: expected,
        steps: [
          `1. Conditions d'application : ${p} est un nombre premier, et ${a} n'est pas divisible par ${p} ($\\operatorname{pgcd}(${a}, ${p}) = 1$).`,
          `2. Petit Théorème de Fermat : $${a}^{${p}-1} = ${a}^{${p - 1}} \\equiv 1 \\pmod{${p}}$.`,
          `3. Réduction de l'exposant : Division euclidienne de l'exposant :
$$${power} = ${Math.floor(power / (p - 1))} \\times ${p - 1} + ${rem}$$`,
          `4. Simplification modulaire :
$$${a}^{${power}} = (${a}^{${p - 1}})^{${Math.floor(power / (p - 1))}} \\times ${a}^{${rem}} \\equiv 1^{${Math.floor(power / (p - 1))}} \\times ${a}^{${rem}} \\equiv ${a}^{${rem}} \\pmod{${p}}$$`,
          `5. Calcul direct final : $${a}^{${rem}} = ${Math.pow(a, rem)} \\equiv ${expected} \\pmod{${p}}$.`
        ]
      },
      rubric: [
        { criterion: "Justification des conditions du Petit Théorème de Fermat", points: 1.0 },
        { criterion: `Division euclidienne de l'exposant modulo ${p - 1}`, points: 1.5 },
        { criterion: `Résultat final exact (${expected})`, points: 1.5 }
      ],
      isGenerated: true,
    };
  }

  // --- MODULE 6: Congruences et ℤ/nℤ ---
  private static generateModule6(difficulty: string, topic: string | undefined, seed: number): ExerciseData {
    const moduli = difficulty === "Easy" ? [7, 11, 13] : [17, 19, 23, 26, 29, 31];
    const n = moduli[seed % moduli.length];
    let a = 2 + (seed % (n - 2));
    while (MathSolver.gcd(a, n) !== 1) {
      a = (a + 1) % n;
      if (a < 2) a = 2;
    }

    const inv = MathSolver.modularInverse(a, n)!;
    const bezout = MathSolver.extendedGcd(a, n);

    return {
      id: `gen-m6-inv-${seed}`,
      title: `Inverse modulaire de ${a} dans ℤ/${n}ℤ`,
      moduleId: "module-6",
      topic: "modular-inverse",
      sourcePdf: "cours-mpc-part3.pdf",
      sourcePage: 11,
      difficulty: difficulty as any,
      type: "computation",
      statement: `Dans l'anneau $(\\mathbb{Z}/${n}\\mathbb{Z}, +, \\times)$, prouver que la classe de $a = ${a}$ est inversible. Calculer son inverse multiplicatif $\\bar{a}^{-1}$ en détaillant l'algorithme d'Euclide étendu (Bézout).`,
      normalizedLatex: `\\bar{${a}}^{-1} \\pmod{${n}}`,
      hints: [
        `Hint 1 : Vérifiez d'abord si $\\operatorname{pgcd}(${a}, ${n}) = 1$. D'après le cours [cours-mpc-part3.pdf, Page 11], un élément est inversible ssi il est premier avec le module.`,
        `Hint 2 : Déroulez l'algorithme d'Euclide étendu pour trouver des coefficients entiers $u, v$ tels que $${a}u + ${n}v = 1$.`,
        `Hint 3 : L'inverse cherché est le reste modulo ${n}$ de $u$.`
      ],
      solution: {
        expectedResult: inv,
        steps: [
          `1. Inversibilité : $\\operatorname{pgcd}(${a}, ${n}) = 1$, donc la classe $\\bar{${a}}$ est inversible dans $(\\mathbb{Z}/${n}\\mathbb{Z})^\\times$.`,
          `2. Algorithme d'Euclide étendu : On obtient l'identité de Bézout :
$$${a} \\times (${bezout.x}) + ${n} \\times (${bezout.y}) = 1$$`,
          `3. Passage modulo ${n} :
$$${a} \\times (${bezout.x}) \\equiv 1 \\pmod{${n}}$$`,
          `4. Réduction positive : Comme $${bezout.x} \\equiv ${inv} \\pmod{${n}}$, l'inverse multiplicatif est $\\bar{${inv}}$.`,
          `5. Vérification : $${a} \\times ${inv} = ${a * inv} = ${Math.floor((a * inv) / n)} \\times ${n} + 1 \\equiv 1 \\pmod{${n}}$.`
        ]
      },
      rubric: [
        { criterion: "Vérification du PGCD = 1", points: 1.0 },
        { criterion: "Déroulement correct de l'algorithme de Bézout", points: 1.5 },
        { criterion: `Valeur exacte de l'inverse multiplicatif (${inv})`, points: 1.5 }
      ],
      isGenerated: true,
    };
  }
}
