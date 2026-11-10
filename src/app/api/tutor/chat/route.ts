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
    const systemPrompt = `Tu es le tuteur d'intelligence artificielle officiel de MPC Studio pour le module "Outils Mathématiques pour la Cryptographie" (Université Oran 1 - Es Senia, Faculté des sciences exactes et appliquées, Département d'informatique, 3ème Année Ingénieur).

Contexte actif :
- Module : ${moduleId || "Algèbre pour la cryptographie"}
- Leçon active : ${lessonTitle || "Généralités"}
${exerciseStatement ? `- Exercice en cours : ${exerciseStatement}` : ""}
- Style d'explication demandé : ${explanationStyle}
- Langue de réponse obligatoire : ${language === "en" ? "ENGLISH (Reply strictly in English, explaining concepts clearly, while citing Oran 1 course PDF pages and using KaTeX notation)" : "FRANÇAIS"}

${ragContext}

Directives pédagogiques impératives :
1. Respecte scrupuleusement les définitions, théorèmes et notations du cours de l'Université d'Oran 1 (cours-mpc-partie1, cours-mpc-partie2, cours-mpc-part3, fiches TD 1 et 2 révisée).
2. Lorsque tu cites une notion du cours, indique toujours le document source et la page si disponibles (ex: [cours-mpc-partie1.pdf, Page 5]).
3. Pour expliquer un concept :
   - Donne d'abord l'intuition ${language === "en" ? "in clear English" : "en français clair"}.
   - Énonce la définition formelle en LaTeX rigoureux ($...$ ou $$...$$).
   - Explique les symboles non triviaux.
   - Présente un exemple simple puis un exemple de niveau TD universitaire.
4. Si l'étudiant pose une question sur un exercice, NE DONNE PAS IMMÉDIATEMENT la réponse complète en mode guidé : donne des indices progressifs (Hint 1: notion, Hint 2: prochaine étape, etc.). Si l'étudiant demande explicitement la solution complète, présente une démonstration mathématique rigoureuse rédigée dans le style attendu aux examens.
5. Formate TOUTES les formules mathématiques en KaTeX ($...$ pour l'inline, $$...$$ pour les blocs).
6. Réponds avec bienveillance, clarté et haute rigueur mathématique dans la langue sélectionnée (${language.toUpperCase()}).`;

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
      console.warn("NVIDIA NIM call fell back to local RAG knowledge:", aiErr.message);

      const topChunk = retrievedChunks[0]?.chunk;
      const fallbackReply = language === "en"
        ? `### Course Reference & Explanation (${topChunk?.title || lessonTitle || "Course Theory"})
According to the University of Oran 1 course notes (**${topChunk?.sourcePdf || "cours-mpc-partie1.pdf"}**, Page ${topChunk?.page || 1}):

${topChunk?.content ? topChunk.content.slice(0, 500) + "..." : "A group $(G, *)$ must satisfy 4 fundamental axioms: closure, associativity, existence of an identity element $e$, and existence of an inverse for every element."}

**Key Step-by-Step Method:**
1. **Closure**: Verify that for all $x, y \\in G$, $x * y \\in G$.
2. **Associativity**: Check that $(x * y) * z = x * (y * z)$.
3. **Identity Element**: Solve $x * e = x$ and verify $e \\in G$.
4. **Symmetric / Inverse**: Solve $x * x' = e$ and verify $x' \\in G$.

*(Note: Live inference momentarily fell back to curated Oran 1 course notes. Please re-send if you require detailed customized steps).*`
        : `### Référence & Explication du Cours Oran 1 (${topChunk?.title || lessonTitle || "Théorie du cours"})
D'après les polycopiés officiels de l'Université Oran 1 (**${topChunk?.sourcePdf || "cours-mpc-partie1.pdf"}**, Page ${topChunk?.page || 1}) :

${topChunk?.content ? topChunk.content.slice(0, 500) + "..." : "Rappel des 4 axiomes fondamentaux d'un groupe $(G, *)$ : loi de composition interne (stabilité), associativité, existence d'un élément neutre unique $e$, et existence d'un inverse ou symétrique $x^{-1}$ pour chaque élément."}

**Méthode de démonstration type examen :**
1. **Loi interne (stabilité)** : Montrer que $\\forall x, y \\in G, \\; x * y \\in G$.
2. **Associativité** : Démontrer que $(x * y) * z = x * (y * z)$.
3. **Élément neutre** : Résoudre l'équation $x * e = x$ pour trouver $e \\in G$.
4. **Symétrique** : Résoudre $x * x' = e$ et prouver que $x' \\in G$.

*(Note : L'inférence directe a basculé sur la base de connaissances RAG du cours d'Oran 1 pour garantir une réponse immédiate sans blocage).*`;

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
