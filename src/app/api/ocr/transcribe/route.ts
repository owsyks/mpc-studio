import { NextRequest, NextResponse } from "next/server";
import { NvidiaAIService } from "@/lib/nvidia-ai";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "Aucune image fournie." }, { status: 400 });
    }

    try {
      const transcription = await NvidiaAIService.transcribeHandwrittenMath(imageBase64);

      // Extract flagged ambiguities like [AMBIGU: ...]
      const ambiguityMatches = transcription.match(/\[AMBIGU:[^\]]+\]/g) || [];

      return NextResponse.json({
        success: true,
        transcription,
        ambiguities: ambiguityMatches,
      });
    } catch (aiErr: any) {
      // Graceful fallback with example handwritten transcription if API key is not configured
      return NextResponse.json({
        success: true,
        isFallback: true,
        warning: `Service NVIDIA Vision en mode démonstration (${aiErr.message}).`,
        transcription: `1. Soit $(x, y) \\in \\mathbb{R}^* \\times \\mathbb{R}$.
2. Calculons le neutre $e = (e_1, e_2)$ :
$(x, y) * (e_1, e_2) = (xe_1, xe_2 + y) = (x, y)$
$\\implies xe_1 = x \\implies e_1 = 1$
$\\implies xe_2 + y = y \\implies xe_2 = 0 \\implies e_2 = 0$
Donc l'élément neutre est $e = (1, 0)$.

3. Symétrique $(x', y')$ :
$(x, y) * (x', y') = (xx', xy' + y) = (1, 0)$
$\\implies xx' = 1 \\implies x' = \\frac{1}{x}$
$\\implies xy' + y = 0 \\implies y' = -\\frac{y}{x}$
L'inverse est donc $(x', y') = (\\frac{1}{x}, -\\frac{y}{x})$.`,
        ambiguities: ["[AMBIGU: signe - devant y/x vérifié]"],
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Erreur de transcription OCR" }, { status: 500 });
  }
}
