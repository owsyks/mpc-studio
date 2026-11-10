import { NextRequest, NextResponse } from "next/server";
import { NvidiaAIService, ChatMessage } from "@/lib/nvidia-ai";
import { RagService } from "@/lib/rag-service";

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
        maxTokens: 1800,
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
      // Fallback message when NVIDIA_API_KEY is not set or network issue
      return NextResponse.json({
        reply: `**Note du Tuteur MPC :** L'inférence NVIDIA NIM a renvoyé : *${aiErr.message}*.

Pour activer les réponses complètes en direct du modèle Llama 3.1 70B via NVIDIA NIM, assurez-vous d'avoir configuré \`NVIDIA_API_KEY\` dans vos variables d'environnement.

En attendant, voici les points essentiels du cours pour votre question :
- Consultez le document [${retrievedChunks[0]?.chunk.sourcePdf || "cours-mpc-partie1.pdf"}, Page ${retrievedChunks[0]?.chunk.page || 5}] : *${retrievedChunks[0]?.chunk.title || "Notion de groupe"}*.
- Les propriétés fondamentales : fermeture, associativité, neutre $e$, et existence de l'inverse $x^{-1}$.`,
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
