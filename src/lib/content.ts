import curriculumFr from "@/data/curriculum.json";
import curriculumEn from "@/data/curriculum-en.json";
import exercisesFr from "@/data/exercises.json";
import exercisesEn from "@/data/exercises-en.json";
import examFr from "@/data/exam.json";
import examEn from "@/data/exam-en.json";

export function getCurriculum(language: "fr" | "en" = "fr") {
  return language === "en" ? curriculumEn : curriculumFr;
}

export function getExercises(language: "fr" | "en" = "fr") {
  return language === "en" ? exercisesEn : exercisesFr;
}

export function getExam(language: "fr" | "en" = "fr") {
  return language === "en" ? examEn : examFr;
}

export function getModule(moduleId: string, language: "fr" | "en" = "fr") {
  const list = getCurriculum(language);
  return list.find((m) => m.id === moduleId);
}

export function getLesson(moduleId: string, lessonId: string, language: "fr" | "en" = "fr") {
  const mod = getModule(moduleId, language);
  return mod?.lessons.find((l) => l.id === lessonId);
}
