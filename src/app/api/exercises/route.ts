import { NextRequest, NextResponse } from "next/server";
import exercisesData from "@/data/exercises.json";
import { ExerciseGenerator } from "@/lib/exercise-generator";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const moduleId = searchParams.get("moduleId");
  const action = searchParams.get("action");
  const difficulty = searchParams.get("difficulty") || "Medium";

  if (action === "generate") {
    const generated = ExerciseGenerator.generate(
      moduleId || "module-1",
      difficulty as any,
      "same"
    );
    return NextResponse.json(generated);
  }

  let filtered = exercisesData;
  if (moduleId) {
    filtered = filtered.filter((ex: any) => ex.moduleId === moduleId);
  }

  return NextResponse.json(filtered);
}
