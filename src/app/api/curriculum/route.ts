import { NextResponse } from "next/server";
import curriculumData from "@/data/curriculum.json";

export async function GET() {
  return NextResponse.json(curriculumData);
}
