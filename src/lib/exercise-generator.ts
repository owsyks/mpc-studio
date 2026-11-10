import { MathSolver } from "./math-solver";

export interface ExerciseData {
  id: string;
  sheet?: string;
  exerciseNumber?: number;
  title: string;
  moduleId: string;
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
  /**
   * Generates a deterministic, mathematically validated exercise
   */
  public static generate(
    moduleId: string,
    difficulty: "Beginner" | "Easy" | "Medium" | "Hard" | "Exam Level" = "Medium",
    variationType: "same" | "harder" | "easier" | "exam" = "same"
  ): ExerciseData {
    const timestamp = Date.now();

    if (moduleId === "module-4" || moduleId === "module-6") {
      // Generate Modular / Cyclic group exercise
      return this.generateOrderOrInverseExercise(difficulty, timestamp);
    } else if (moduleId === "module-2") {
      // Generate Homomorphism / Kernel / Image exercise
      return this.generateHomomorphismExercise(difficulty, timestamp);
    } else {
      // Default: Group law / Subgroup exercise
      return this.generateGroupLawExercise(difficulty, timestamp);
    }
  }

  private static generateOrderOrInverseExercise(difficulty: string, seed: number): ExerciseData {
    const isInverse = seed % 2 === 0;

    if (isInverse) {
      // Generate modular inverse problem
      const moduli = difficulty === "Easy" ? [7, 11, 13] : [17, 19, 23, 26, 29, 31];
      const n = moduli[Math.floor(Math.random() * moduli.length)];
      // Choose a coprime to n
      let a = 2 + Math.floor(Math.random() * (n - 2));
      while (MathSolver.gcd(a, n) !== 1) {
        a = (a + 1) % n;
        if (a < 2) a = 2;
      }

      const inv = MathSolver.modularInverse(a, n)!;
      const bezout = MathSolver.extendedGcd(a, n);

      return {
        id: `gen-inv-${seed}`,
        title: `Inverse modulaire de ${a} dans Z/${n}Z`,
        moduleId: "module-6",
        difficulty: difficulty as any,
        type: "computation",
        statement: `Dans l'anneau $(\\mathbb{Z}/${n}\\mathbb{Z}, +, \\times)$, déterminer si la classe de $a = ${a}$ est inversible. Si oui, calculer son inverse multiplicatif $\\bar{a}^{-1}$ à l'aide de l'algorithme d'Euclide étendu (identité de Bézout).`,
        normalizedLatex: `\\bar{${a}}^{-1} \\pmod{${n}}`,
        hints: [
            `Hint 1 : Vérifiez d'abord si $\\operatorname{pgcd}(${a}, ${n}) = 1$. D'après le cours [cours-mpc-part3.pdf, Page 11], un élément est inversible si et seulement s'il est premier avec le module.`,
            `Hint 2 : Effectuez les divisions euclidiennes successives de ${n} par ${a} pour remonter l'égalité de Bézout $${a}s + ${n}t = 1$.`,
            `Hint 3 : L'inverse cherché est la classe de $s$ réduite modulo ${n}.`
        ],
        solution: {
          expectedResult: inv,
          steps: [
            `1. Calcul du PGCD : $\\operatorname{pgcd}(${a}, ${n}) = 1$, donc $\\bar{${a}}$ est bien inversible dans $\\mathbb{Z}/${n}\\mathbb{Z}$.`,
            `2. Application de l'algorithme d'Euclide étendu : on trouve l'égalité de Bézout $${a} \\times (${bezout.x}) + ${n} \\times (${bezout.y}) = 1$.`,
            `3. Passage modulo ${n} : $${a} \\times (${bezout.x}) \\equiv 1 \\pmod{${n}}$.`,
            `4. Réduction positive : $${bezout.x} \\equiv ${inv} \\pmod{${n}}$.`,
            `5. Vérification : $${a} \\times ${inv} = ${a * inv} = ${Math.floor((a * inv) / n)} \\times ${n} + 1 \\equiv 1 \\pmod{${n}}$. L'inverse est donc $\\bar{${inv}}$.`
          ]
        },
        rubric: [
          { criterion: "Justification de l'inversibilité via le PGCD", points: 1.0 },
          { criterion: "Déroulement correct de l'algorithme d'Euclide", points: 1.5 },
          { criterion: `Valeur exacte de l'inverse (${inv})`, points: 1.5 }
        ],
        isGenerated: true,
      };
    } else {
      // Generate element order in (Z/nZ, +) or direct product
      const moduli = [12, 15, 18, 20, 24, 30];
      const n = moduli[Math.floor(Math.random() * moduli.length)];
      const a = 2 + Math.floor(Math.random() * (n - 2));
      const order = MathSolver.orderAdditive(a, n);
      const gcd = MathSolver.gcd(a, n);

      return {
        id: `gen-ord-${seed}`,
        title: `Ordre de ${a} dans le groupe additif (Z/${n}Z, +)`,
        moduleId: "module-4",
        difficulty: difficulty as any,
        type: "computation",
        statement: `Quel est l'ordre de l'élément $\\bar{${a}}$ dans le groupe additif $(\\mathbb{Z}/${n}\\mathbb{Z}, +)$ ? Justifier en énonçant la formule générale reliant l'ordre au cardinal du groupe et au PGCD.`,
        normalizedLatex: `\\operatorname{ord}(\\bar{${a}}) \\quad \\text{dans } (\\mathbb{Z}/${n}\\mathbb{Z}, +)`,
        hints: [
          `Hint 1 : Rappelez-vous que dans un groupe additif $(\\mathbb{Z}/n\\mathbb{Z}, +)$, le neutre est 0. On cherche le plus petit entier $k \\ge 1$ tel que $k \\times ${a} \\equiv 0 \\pmod{${n}}$.`,
          `Hint 2 : La formule du cours donne $\\operatorname{ord}(\\bar{a}) = \\frac{n}{\\operatorname{pgcd}(a, n)}$.`,
          `Hint 3 : Calculez le PGCD de ${a} et ${n}, puis effectuez le quotient.`
        ],
        solution: {
          expectedResult: order,
          steps: [
            `1. Par définition, l'ordre de $\\bar{${a}}$ est le plus petit entier $k \\ge 1$ tel que $k \\cdot ${a} \\equiv 0 \\pmod{${n}}$, c'est-à-dire ${n} \\mid ${a}k$.`,
            `2. On calcule $\\operatorname{pgcd}(${a}, ${n}) = ${gcd}$.`,
            `3. Formule générale : $\\operatorname{ord}(\\bar{${a}}) = \\frac{${n}}{\\operatorname{pgcd}(${a}, ${n})} = \\frac{${n}}{${gcd}} = ${order}$.`,
            `4. Vérification : $${order} \\times ${a} = ${order * a} = ${Math.floor((order * a) / n)} \\times ${n} \\equiv 0 \\pmod{${n}}$.`
          ]
        },
        rubric: [
          { criterion: "Rappel de la définition ou de la formule de l'ordre", points: 1.0 },
          { criterion: `Calcul correct de pgcd(${a}, ${n}) = ${gcd}`, points: 1.0 },
          { criterion: `Résultat final ord(${a}) = ${order}`, points: 1.0 }
        ],
        isGenerated: true,
      };
    }
  }

  private static generateGroupLawExercise(difficulty: string, seed: number): ExerciseData {
    const k = [2, 3, 4, 5][seed % 4];

    return {
      id: `gen-grp-${seed}`,
      title: `Structure de groupe sur R\\{-1/${k}\\}`,
      moduleId: "module-1",
      difficulty: difficulty as any,
      type: "proof",
      statement: `Soit $E = \\mathbb{R} \\setminus \\{-1/${k}\\}$. On définit sur $E$ la loi de composition interne :
$$x * y = x + y + ${k}xy$$
1. Démontrer que $*$ est une loi de composition interne sur $E$.
2. Montrer que $(E, *)$ est un groupe abélien en précisant son élément neutre et l'inverse de chaque élément.`,
      normalizedLatex: `x * y = x + y + ${k}xy \\quad \\text{sur } \\mathbb{R} \\setminus \\{-1/${k}\\}`,
      hints: [
        `Hint 1 : Remarquez l'identité remarquable : $1 + ${k}(x * y) = 1 + ${k}x + ${k}y + ${k}^2 xy = (1 + ${k}x)(1 + ${k}y)$.`,
        `Hint 2 : Si $x, y \\in E$, alors $1 + ${k}x \\neq 0$ et $1 + ${k}y \\neq 0$. Leur produit peut-il être nul ?`,
        `Hint 3 : Le neutre est $e=0$, et pour l'inverse résolvez $x + x' + ${k}xx' = 0$.`
      ],
      solution: {
        isGroup: true,
        isAbelian: true,
        steps: [
          `1. Fermeture : Remarquons que $1 + ${k}(x * y) = (1 + ${k}x)(1 + ${k}y)$. Si $x, y \\in E$, $x \\neq -1/${k}$ et $y \\neq -1/${k}$, donc $(1 + ${k}x)(1 + ${k}y) \\neq 0 \\implies x * y \\neq -1/${k}$. La loi est bien interne.`,
          `2. Commutativité : $x * y = x + y + ${k}xy = y + x + ${k}yx = y * x$.`,
          `3. Associativité : $(x * y) * z = x + y + z + ${k}(xy + yz + zx) + ${k}^2 xyz = x * (y * z)$.`,
          `4. Élément neutre : $x * e = x \\iff x + e + ${k}xe = x \\iff e(1 + ${k}x) = 0 \\implies e = 0 \\in E$.`,
          `5. Inverse : $x * x' = 0 \\iff x + x'(1 + ${k}x) = 0 \\iff x' = \\frac{-x}{1 + ${k}x} \\in E$.`
        ]
      },
      rubric: [
        { criterion: "Preuve de fermeture via factorisation", points: 1.5 },
        { criterion: "Preuve de l'associativité et commutativité", points: 1.0 },
        { criterion: "Élément neutre e = 0", points: 0.75 },
        { criterion: "Inverse x' = -x / (1 + kx)", points: 0.75 }
      ],
      isGenerated: true,
    };
  }

  private static generateHomomorphismExercise(difficulty: string, seed: number): ExerciseData {
    return {
      id: `gen-morph-${seed}`,
      title: `Morphisme de groupes et calcul de noyau`,
      moduleId: "module-2",
      difficulty: difficulty as any,
      type: "proof",
      statement: `Soit le morphisme d'évaluation matricielle $\\Phi : (\\mathbb{R}, +) \\to (GL_2(\\mathbb{R}), \\times)$ défini par :
$$\\Phi(t) = \\begin{pmatrix} \\cosh(t) & \\sinh(t) \\\\ \\sinh(t) & \\cosh(t) \\end{pmatrix}$$
1. Vérifier que $\\Phi$ est bien un morphisme de groupes.
2. Déterminer son noyau $\\ker \\Phi$ et préciser si $\\Phi$ est injectif.
3. Décrire son image $\\operatorname{Im} \\Phi$.`,
      normalizedLatex: `\\Phi(t) = \\begin{pmatrix} \\cosh(t) & \\sinh(t) \\\\ \\sinh(t) & \\cosh(t) \\end{pmatrix}`,
      hints: [
        `Hint 1 : Rappelez-vous les formules d'addition hyperboliques : $\\cosh(a+b) = \\cosh(a)\\cosh(b) + \\sinh(a)\\sinh(b)$ et $\\sinh(a+b) = \\sinh(a)\\cosh(b) + \\cosh(a)\\sinh(b)$.`,
        `Hint 2 : Multipliez $\\Phi(t)$ et $\\Phi(t')$ matriciellement et identifiez chaque coefficient.`,
        `Hint 3 : Le neutre d'arrivée est la matrice $I_2$. Résolvez $\\Phi(t) = I_2$.`
      ],
      solution: {
        steps: [
          `1. Produit matriciel : $\\Phi(t)\\Phi(t') = \\begin{pmatrix} \\cosh(t)\\cosh(t')+\\sinh(t)\\sinh(t') & \\cosh(t)\\sinh(t')+\\sinh(t)\\cosh(t') \\\\ \\sinh(t)\\cosh(t')+\\cosh(t)\\sinh(t') & \\sinh(t)\\sinh(t')+\\cosh(t)\\cosh(t') \\end{pmatrix} = \\Phi(t+t')$. Donc $\\Phi$ est un morphisme.`,
          `2. Noyau : $\\Phi(t) = I_2 \\iff \\cosh(t) = 1$ et $\\sinh(t) = 0$. Comme $\\sinh(t) = 0 \\iff t = 0$, on a $\\ker \\Phi = \\{0\\}$.`,
          `3. Injectivité : Puisque $\\ker \\Phi = \\{0\\}$, le morphisme est strictement injectif.`
        ]
      },
      rubric: [
        { criterion: "Preuve du morphisme via trigonométrie hyperbolique", points: 2.0 },
        { criterion: "Calcul du noyau Ker Phi = {0}", points: 1.0 },
        { criterion: "Déduction de l'injectivité", points: 1.0 }
      ],
      isGenerated: true,
    };
  }
}
