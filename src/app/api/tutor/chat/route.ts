import { NextRequest, NextResponse } from "next/server";
import { NvidiaAIService, ChatMessage } from "@/lib/nvidia-ai";
import { RagService } from "@/lib/rag-service";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Format de messages invalide." }, { status: 400 });
    }

    const userLastMessage = messages[messages.length - 1]?.content || "";
    const moduleId = context?.moduleId;
    const lessonTitle = context?.lessonTitle;
    const exerciseStatement = context?.exerciseStatement;
    const explanationStyle = context?.explanationStyle || "rigorous";

    // 1. Course RAG Retrieval
    const query = `${userLastMessage} ${lessonTitle || ""} ${exerciseStatement || ""}`;
    const retrievedChunks = RagService.retrieve(query, moduleId, 3);
    const ragContext = RagService.formatContextForPrompt(retrievedChunks);
    const language = context?.language || "fr";

    // 2. Build pedagogical system prompt
    const isEn = language === "en";
    const systemPrompt = isEn
      ? `You are the official NVIDIA NIM AI tutor for "Mathematical Tools for Cryptography" at University of Oran 1 (Es Senia).
Active context:
- Module: ${moduleId || "Algebra for Cryptography"}
- Active Lesson: ${lessonTitle || "General Concepts"}
${exerciseStatement ? `- Exercise: ${exerciseStatement}` : ""}
- Explanation Style: ${explanationStyle}
- Language: STRICTLY ENGLISH.

${ragContext}

Pedagogical Directives:
1. Always ground your mathematical definitions and proofs in University of Oran 1 course notes (cours-mpc-partie1, partie2, partie3, TD sheets).
2. When giving examples, provide concrete algebraic objects (e.g. $(\\mathbb{Z}/n\\mathbb{Z}, +)$, $(\\mathbb{R}^*, \\times)$, $\\mathrm{GL}_2(\\mathbb{R})$, permutations $S_n$) with complete verification of properties.
3. If the user asks for a step-by-step solution, provide every mathematical derivation with clear justifications.
4. Format all mathematical expressions using KaTeX ($...$ for inline, $$...$$ for display blocks).
5. Always respond directly, warmly and rigorously in English.`
      : `Tu es le tuteur officiel NVIDIA NIM de MPC Studio pour le module "Outils Mathématiques pour la Cryptographie" (Université Oran 1 - Es Senia, Département d'informatique, 3ème Année Ingénieur).
Contexte actif :
- Module : ${moduleId || "Algèbre pour la cryptographie"}
- Leçon active : ${lessonTitle || "Généralités"}
${exerciseStatement ? `- Exercice en cours : ${exerciseStatement}` : ""}
- Style d'explication demandé : ${explanationStyle}
- Langue : STRICTEMENT FRANÇAIS.

${ragContext}

Directives pédagogiques :
1. Respecte scrupuleusement les définitions, théorèmes et notations du cours de l'Université d'Oran 1 (cours-mpc-partie1, 2, 3, fiches TD 1 et 2 révisées).
2. Pour les exemples, donne des structures algébriques concrètes (ex: $(\\mathbb{Z}/n\\mathbb{Z}, +)$, $(\\mathbb{R}^*, \\times)$, $\\mathrm{GL}_2(\\mathbb{R})$) avec vérification rigoureuse des axiomes.
3. Si l'étudiant demande un exemple ou une solution pas-à-pas, détaille chaque étape de calcul avec justification.
4. Formate TOUTES les formules mathématiques en KaTeX ($...$ pour l'inline, $$...$$ pour les blocs).
5. Réponds directement avec bienveillance et haute rigueur mathématique.`;

    const chatMessages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...messages.slice(-8), // Keep recent history
    ];

    try {
      const reply = await NvidiaAIService.chatCompletion({
        messages: chatMessages,
        temperature: 0.2,
        maxTokens: 1000,
      });

      return NextResponse.json({
        reply,
        sources: retrievedChunks.map((r) => ({
          pdf: r.chunk.sourcePdf,
          page: r.chunk.page,
          title: r.chunk.title,
        })),
      });
    } catch (aiErr: any) {
      console.warn("NVIDIA NIM live call failed, generating dynamic course RAG response:", aiErr.message);

      const topChunk = retrievedChunks[0]?.chunk;
      const lowerQuery = userLastMessage.toLowerCase();
      const isExampleQuery = lowerQuery.includes("example") || lowerQuery.includes("exemple") || lowerQuery.includes("show") || lowerQuery.includes("montre");
      const isTrapQuery = lowerQuery.includes("trap") || lowerQuery.includes("piège") || lowerQuery.includes("erreur");

      let fallbackReply = "";

      if (isEn) {
        if (isExampleQuery) {
          fallbackReply = `### 📘 Step-by-Step Worked Example — ${lessonTitle || "Group Theory"}
*(Referencing University of Oran 1 course notes: **${topChunk?.sourcePdf || "cours-mpc-partie1.pdf"}**, Page ${topChunk?.page || 4})*

Let's study a concrete, standard exam example: **The set $G = \\mathbb{R} \\setminus \\{1\\}$ equipped with the internal law $x * y = x + y - xy$**.

#### Step 1: Internal Law (Closure)
Let $x, y \\in G$. We must verify that $x * y \\in G$, meaning $x * y \\neq 1$.
$$x * y - 1 = x + y - xy - 1 = (x - 1) - y(x - 1) = (x - 1)(1 - y) = -(x - 1)(y - 1)$$
Since $x \\neq 1$ and $y \\neq 1$, $(x - 1)(y - 1) \\neq 0$, so $x * y - 1 \\neq 0 \\implies x * y \\neq 1$.
**Conclusion:** $*$ is an internal composition law on $G$.

#### Step 2: Associativity
For all $x, y, z \\in G$:
$$(x * y) * z = (x + y - xy) * z = (x + y - xy) + z - (x + y - xy)z = x + y + z - xy - xz - yz + xyz$$
By symmetry of this expression with respect to $x, y, z$, we obtain $x * (y * z) = (x * y) * z$.
**Conclusion:** The law $*$ is associative.

#### Step 3: Identity Element ($e$)
We look for $e \\in G$ such that for all $x \\in G$, $x * e = x$:
$$x + e - xe = x \\iff e(1 - x) = 0$$
Since this must hold for any $x \\in G$ (including $x \\neq 1$), we must have $e = 0$.
Since $0 \\in \\mathbb{R} \\setminus \\{1\\}$, **the identity element is $e = 0$**.

#### Step 4: Symmetrical Element (Inverse)
For a given $x \\in G$, we seek $x' \\in G$ such that $x * x' = e = 0$:
$$x + x' - xx' = 0 \\iff x'(1 - x) = -x \\iff x' = \\frac{-x}{1 - x} = \\frac{x}{x - 1}$$
Since $x \\neq 1$, $x'$ is well-defined in $\\mathbb{R}$. Furthermore, $x' \\neq 1$ because $\\frac{x}{x - 1} = 1 \\implies x = x - 1 \\implies 0 = -1$ (impossible).
Therefore $x' \\in G$.

#### Final Conclusion
$(G, *)$ is an **abelian group**, whose identity is $0$ and whose inverse for any $x$ is $x^{-1} = \\frac{x}{x - 1}$.`;
        } else if (isTrapQuery) {
          fallbackReply = `### ⚠️ Classical Exam Traps for ${lessonTitle || "This Topic"}
*(Official Oran 1 Examination Insights)*

1. **Forgetting Closure (Stabilité):**
   Students frequently jump directly to calculating the neutral element $e$ without first showing that $\\forall x, y \\in G, \\; x * y \\in G$. At Oran 1, correctors deduct points if closure is omitted.
2. **Checking the Set Belonging of $e$ and $x^{-1}$:**
   Finding a candidate $e$ is not enough; you must explicitly verify that $e$ belongs to the set (e.g. $e \\neq 0$ or $e \\neq 1$).
3. **Associativity Calculation Shortcuts:**
   Never write "obviously associative". You must write both expansions $(x * y) * z$ and $x * (y * z)$ and equate them.`;
        } else {
          fallbackReply = `### 📚 Course Reference & Explanation — ${lessonTitle || topChunk?.title || "Course Theory"}
*(University of Oran 1 — **${topChunk?.sourcePdf || "cours-mpc-partie1.pdf"}**, Page ${topChunk?.page || 1})*

${topChunk?.content ? topChunk.content.slice(0, 700) : "A algebraic structure $(G, *)$ is a group if it satisfies closure, associativity, existence of a unique identity element, and existence of a symmetric inverse for all elements."}

**Exam Rigor Checklist:**
- State all quantifiers clearly: $\\forall x, y \\in G$.
- Always verify that the neutral element $e$ and inverse $x'$ belong to $G$.
- Use standard KaTeX notation in your write-up.`;
        }
      } else {
        if (isExampleQuery) {
          fallbackReply = `### 📘 Exemple Type Examen Résolu Pas-à-Pas — ${lessonTitle || "Théorie des Groupes"}
*(Référence polycopié officiel Université Oran 1 : **${topChunk?.sourcePdf || "cours-mpc-partie1.pdf"}**, Page ${topChunk?.page || 4})*

Étudions un exemple d'examen classique : **L'ensemble $G = \\mathbb{R} \\setminus \\{1\\}$ muni de la loi interne $x * y = x + y - xy$**.

#### Étape 1 : Loi de composition interne (Stabilité)
Soient $x, y \\in G$. Vérifions que $x * y \\in G$, c'est-à-dire que $x * y \\neq 1$.
$$x * y - 1 = x + y - xy - 1 = (x - 1) - y(x - 1) = (x - 1)(1 - y) = -(x - 1)(y - 1)$$
Comme $x \\neq 1$ et $y \\neq 1$, on a $(x - 1)(y - 1) \\neq 0$, donc $x * y - 1 \\neq 0 \\implies x * y \\neq 1$.
**Conclusion :** La loi $*$ est bien interne dans $G$.

#### Étape 2 : Associativité
Pour tous $x, y, z \\in G$ :
$$(x * y) * z = (x + y - xy) * z = (x + y - xy) + z - (x + y - xy)z = x + y + z - xy - xz - yz + xyz$$
Par symétrie de cette expression par rapport à $x, y, z$, on a $x * (y * z) = (x * y) * z$.
**Conclusion :** La loi $*$ est associative.

#### Étape 3 : Élément neutre ($e$)
On cherche $e \\in G$ tel que pour tout $x \\in G$, $x * e = x$ :
$$x + e - xe = x \\iff e(1 - x) = 0$$
Comme cette égalité doit être vraie pour tout $x \\in G$ (en particulier $x \\neq 1$), on en déduit $e = 0$.
Or $0 \\in \\mathbb{R} \\setminus \\{1\\}$, donc **l'élément neutre est $e = 0$**.

#### Étape 4 : Symétrique ($x'$)
Pour $x \\in G$, on cherche $x' \\in G$ tel que $x * x' = e = 0$ :
$$x + x' - xx' = 0 \\iff x'(1 - x) = -x \\iff x' = \\frac{-x}{1 - x} = \\frac{x}{x - 1}$$
Puisque $x \\neq 1$, $x'$ est bien défini. De plus $x' \\neq 1$ car $\\frac{x}{x - 1} = 1 \\implies x = x - 1 \\implies 0 = -1$ (impossible).
Donc $x' \\in G$.

#### Conclusion Finale
$(G, *)$ est un **groupe abélien**, d'élément neutre $0$ et de symétrique $x^{-1} = \\frac{x}{x - 1}$.`;
        } else if (isTrapQuery) {
          fallbackReply = `### ⚠️ Pièges Classiques d'Examen pour ${lessonTitle || "cette notion"}
*(Conseils méthodologiques des correcteurs d'Oran 1)*

1. **Oublier la stabilité (loi interne) :**
   Les étudiants passent souvent directement au calcul du neutre sans vérifier que $\\forall x, y \\in G, \\; x * y \\in G$. À l'examen d'Oran 1, les correcteurs sanctionnent systématiquement cette omission.
2. **Appartenance du neutre et du symétrique à l'ensemble :**
   Trouver une formule pour $e$ ou $x^{-1}$ ne suffit pas : il faut prouver qu'ils appartiennent à l'ensemble $G$ (ex: vérifier le dénominateur ou l'exclusion de $1$).
3. **Rédaction de l'associativité :**
   Ne jamais écrire "immédiat" ou "évident". Il faut expliciter les deux calculs $(x*y)*z$ et $x*(y*z)$ et constater leur égalité.`;
        } else {
          fallbackReply = `### 📚 Référence & Définition du Cours Oran 1 — ${lessonTitle || topChunk?.title || "Théorie"}
*(Université Oran 1 — **${topChunk?.sourcePdf || "cours-mpc-partie1.pdf"}**, Page ${topChunk?.page || 1})*

${topChunk?.content ? topChunk.content.slice(0, 700) : "Rappel des 4 axiomes fondamentaux d'un groupe $(G, *)$ : loi de composition interne (stabilité), associativité, existence d'un élément neutre unique, et existence d'un inverse ou symétrique pour chaque élément."}

**Points clés de rédaction pour l'examen :**
- Quantificateurs rigoureux : $\\forall x, y \\in G$.
- Justification de l'unicité de l'élément neutre.
- Vérification que tout dénominateur ne s'annule pas sur $G$.`;
        }
      }

      return NextResponse.json({
        reply: fallbackReply,
        sources: retrievedChunks.map((r) => ({
          pdf: r.chunk.sourcePdf,
          page: r.chunk.page,
          title: r.chunk.title,
        })),
        isFallback: true,
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Erreur interne du serveur" }, { status: 500 });
  }
}
