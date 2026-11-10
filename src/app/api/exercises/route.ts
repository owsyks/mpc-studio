import { NextRequest, NextResponse } from "next/server";
import exercisesData from "@/data/exercises.json";
import { ExerciseGenerator } from "@/lib/exercise-generator";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const moduleId = searchParams.get("moduleId");
  const topic = searchParams.get("topic") || undefined;
  const action = searchParams.get("action");
  const difficulty = searchParams.get("difficulty") || "Medium";
  const language = (searchParams.get("language") || "fr") as "fr" | "en";

  if (action === "generate") {
    const generated = ExerciseGenerator.generate(
      moduleId || "module-1",
      difficulty as any,
      topic,
      language
    );
    return NextResponse.json(generated);
  }

  let filtered = exercisesData;
  if (moduleId) {
    filtered = filtered.filter((ex: any) => ex.moduleId === moduleId);
  }

  return NextResponse.json(filtered);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { moduleId, topic, difficulty, language } = body;

    const generated = ExerciseGenerator.generate(
      moduleId || "module-1",
      (difficulty as any) || "Medium",
      topic,
      language || "fr"
    );

    return NextResponse.json(generated);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erreur lors de la génération de l'exercice" },
      { status: 500 }
    );
  }
}
