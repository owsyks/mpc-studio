/**
 * NVIDIA NIM AI Integration Service
 * Uses NVIDIA-hosted OpenAI-compatible chat completions API.
 * Base URL: https://integrate.api.nvidia.com/v1
 */

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>;
}

export interface NvidiaCompletionOptions {
  model?: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export class NvidiaAIService {
  private static getApiKey(): string | undefined {
    return process.env.NVIDIA_API_KEY;
  }

  private static getBaseUrl(): string {
    return process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1";
  }

  public static getTutorModel(): string {
    return process.env.NVIDIA_TUTOR_MODEL || "nvidia/nemotron-3.5-bolt-e4b";
  }

  public static getGradingModel(): string {
    return process.env.NVIDIA_GRADING_MODEL || "nvidia/nemotron-3.5-bolt-e4b";
  }

  public static getVisionModel(): string {
    return process.env.NVIDIA_VISION_MODEL || "nvidia/nemotron-3.5-super-vl-120b-a12b";
  }

  /**
   * Execute chat completion with multi-model fallback chain and robust timeout handling
   */
  public static async chatCompletion(options: NvidiaCompletionOptions): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error(
        "NVIDIA_API_KEY non configurée. Veuillez renseigner votre clé API NVIDIA NIM dans le fichier .env.local."
      );
    }

    const baseUrl = this.getBaseUrl();
    const primaryModel = options.model || this.getTutorModel();
    // Fast, verified models on NVIDIA NIM with fallback
    const candidateModels = [
      primaryModel,
      "nvidia/nemotron-3.5-bolt-e4b",
      "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning",
      "google/gemma-4-31b-it",
    ].filter((m, idx, arr) => arr.indexOf(m) === idx);

    let lastError: Error | null = null;

    for (const currentModel of candidateModels) {
      const url = `${baseUrl}/chat/completions`;
      const body = {
        model: currentModel,
        messages: options.messages,
        temperature: options.temperature ?? 0.2,
        max_tokens: Math.min(options.maxTokens ?? 1000, 1200),
        stream: false,
      };

      try {
        const controller = new AbortController();
        // 25s per model attempt ensures fast response or quick failover
        const timeout = setTimeout(() => controller.abort(), 25000);

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          const errText = await response.text();
          let parsedMsg = errText;
          try {
            const errObj = JSON.parse(errText);
            parsedMsg = errObj.error?.message || errObj.detail || errText;
          } catch (_) {}

          console.warn(`[NVIDIA NIM] Model ${currentModel} returned ${response.status}: ${parsedMsg.slice(0, 100)}`);
          lastError = new Error(`NVIDIA NIM (${response.status}): ${parsedMsg}`);
          continue; // Try next candidate model
        }

        const data = await response.json();
        const choice = data.choices?.[0];
        let content = choice?.message?.content;
        if (!content && choice?.message?.reasoning_content) {
          content = choice.message.reasoning_content;
        }

        if (!content || typeof content !== "string" || content.trim().length === 0) {
          console.warn(`[NVIDIA NIM] Empty content from model ${currentModel}, trying fallback...`);
          lastError = new Error("Réponse vide reçue de l'API NVIDIA NIM.");
          continue;
        }

        return content;
      } catch (err: any) {
        console.warn(`[NVIDIA NIM] Error with model ${currentModel}:`, err.message);
        lastError = err;
        // Continue to next candidate model
      }
    }

    throw lastError || new Error("Échec de communication avec l'API NVIDIA NIM après essai des modèles disponibles.");
  }

  /**
   * OCR & Vision recognition for handwritten mathematical work
   */
  public static async transcribeHandwrittenMath(base64Image: string): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error("NVIDIA_API_KEY non configurée pour le service Vision.");
    }

    const visionModel = this.getVisionModel();
    const prompt = `Tu es un transcripteur expert en mathématiques universitaires et en OCR d'expressions manuscrites pour le cours "Outils Mathématiques pour la Cryptographie" (Université Oran 1).
Examine attentivement l'image manuscrite fournie et transcris fidèlement la solution de l'étudiant en LaTeX standardisé.

Règles impératives :
1. Préserve l'ordre des étapes de démonstration ligne par ligne.
2. Utilise du LaTeX rigoureux pour les équations, fractions, exposants, matrices, quantificateurs (\\forall, \\exists), et opérations (*, \\circ, \\equiv).
3. Si un symbole ou un mot est ambigu ou illisible, indique-le explicitement entre crochets avec [AMBIGU: ...].
4. Ne confonds pas la lettre 'x' avec le signe de multiplication '\\times' ou l'inconnue 'X'.
5. Renvoie UNIQUEMENT la transcription organisée, sans bavardage d'introduction.`;

    const messages: ChatMessage[] = [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          {
            type: "image_url",
            image_url: {
              url: base64Image.startsWith("data:") ? base64Image : `data:image/png;base64,${base64Image}`,
            },
          },
        ],
      },
    ];

    return await this.chatCompletion({
      model: visionModel,
      messages,
      temperature: 0.1,
      maxTokens: 2500,
    });
  }
}
