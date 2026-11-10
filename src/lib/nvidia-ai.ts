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
    return process.env.NVIDIA_TUTOR_MODEL || "google/gemma-4-31b-it";
  }

  public static getGradingModel(): string {
    return process.env.NVIDIA_GRADING_MODEL || "google/gemma-4-31b-it";
  }

  public static getVisionModel(): string {
    return process.env.NVIDIA_VISION_MODEL || "meta/llama-3.2-90b-vision-instruct";
  }

  /**
   * Execute chat completion with retry and backoff
   */
  public static async chatCompletion(options: NvidiaCompletionOptions): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error(
        "NVIDIA_API_KEY non configurée. Veuillez renseigner votre clé API NVIDIA NIM dans le fichier .env.local."
      );
    }

    const baseUrl = this.getBaseUrl();
    const model = options.model || this.getTutorModel();
    const url = `${baseUrl}/chat/completions`;

    const body = {
      model,
      messages: options.messages,
      temperature: options.temperature ?? 0.2,
      max_tokens: Math.min(options.maxTokens ?? 1000, 1200),
      stream: false,
    };

    let attempts = 0;
    const maxAttempts = 2;
    let lastError: Error | null = null;

    while (attempts < maxAttempts) {
      try {
        attempts++;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 22000); // 22s timeout per request

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
            parsedMsg = errObj.error?.message || errText;
          } catch (_) {}

          if (response.status === 429 || response.status >= 500) {
            // Transient error, backoff
            await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempts) * 1000));
            continue;
          }

          throw new Error(`Erreur NVIDIA NIM (${response.status}): ${parsedMsg}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (!content) {
          throw new Error("Réponse vide reçue de l'API NVIDIA NIM.");
        }

        return content;
      } catch (err: any) {
        lastError = err;
        if (err.name === "AbortError") {
          throw new Error("Délai d'attente dépassé (timeout) pour l'API NVIDIA NIM.");
        }
        if (attempts >= maxAttempts) {
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempts) * 1000));
      }
    }

    throw lastError || new Error("Échec de communication avec l'API NVIDIA NIM après plusieurs tentatives.");
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
