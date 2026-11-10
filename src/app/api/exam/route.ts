import { NextRequest, NextResponse } from "next/server";
import examData from "@/data/exam.json";
import { ExerciseGenerator } from "@/lib/exercise-generator";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("mode") || "original";

  if (mode === "mock") {
    // Generate fresh practice exam with similar distribution
    const ex1 = ExerciseGenerator.generate("module-1", "Exam Level");
    const ex2 = ExerciseGenerator.generate("module-2", "Exam Level");
    const ex3 = ExerciseGenerator.generate("module-6", "Exam Level");

    const mockExam = {
      id: `mock-exam-${Date.now()}`,
      title: "Examen Blanc IA — Outils Mathématiques pour la Cryptographie",
      institution: "Université Oran 1 — Simulateur d'Entraînement MPC Studio",
      level: "3ème Année Ingénieur",
      durationMinutes: 60,
      totalPoints: 16.0,
      isMock: true,
      exercises: [
        {
          id: "mock-1",
          number: 1,
          title: ex1.title,
          points: 4.25,
          questions: [
            {
              subId: "m1-1",
              text: ex1.statement,
              points: 4.25,
              officialSolution: ex1.solution.steps.join("\n\n"),
            },
          ],
        },
        {
          id: "mock-2",
          number: 2,
          title: ex2.title,
          points: 4.25,
          questions: [
            {
              subId: "m2-1",
              text: ex2.statement,
              points: 4.25,
              officialSolution: ex2.solution.steps.join("\n\n"),
            },
          ],
        },
        {
          id: "mock-3",
          number: 3,
          title: ex3.title,
          points: 7.5,
          questions: [
            {
              subId: "m3-1",
              text: ex3.statement,
              points: 7.5,
              officialSolution: ex3.solution.steps.join("\n\n"),
            },
          ],
        },
      ],
    };

    return NextResponse.json(mockExam);
  }

  // Return official historical exam
  return NextResponse.json(examData);
}
