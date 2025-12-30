// src/utils/mappers/courseMappers.ts
import type { CourseBrief } from "@/types.ts";

export function toDateOrNow(value: unknown): Date {
  try {
    if (!value) return new Date();
    const d = new Date(String(value));
    return isNaN(d.getTime()) ? new Date() : d;
  } catch {
    return new Date();
  }
}

export function mapParticipationToCourseBrief(p: any): CourseBrief | null {
  const id = p?.courseId ?? p?.CourseId ?? "";
  const name = p?.courseName ?? p?.CourseName ?? "";

  if (!id || !name) return null;

  return {
    id,
    name,
  };
}

export function mapApiCourseToCourseBrief(c: any): CourseBrief | null {
  const id = c?.id ?? c?.courseId ?? "";
  const name = c?.name ?? c?.courseName ?? "";

  if (!id || !name) return null;

  return {
    id,
    name,
  };
}
