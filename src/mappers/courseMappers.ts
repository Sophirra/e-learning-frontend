// src/utils/mappers/courseMappers.ts
import type { ClassBrief } from "@/api/types.tsx";

export function toDateOrNow(value: unknown): Date {
  try {
    if (!value) return new Date();
    const d = new Date(String(value));
    return isNaN(d.getTime()) ? new Date() : d;
  } catch {
    return new Date();
  }
}

export function mapParticipationToCourseBrief(p: any): ClassBrief | null {
  const courseId = p?.courseId ?? p?.CourseId ?? "";
  const courseName = p?.courseName ?? p?.CourseName ?? "";
  const teacherId = p?.teacherId ?? p?.TeacherId ?? "";

  if (!courseId || !courseName) return null;

  return {
    courseId,
    courseName,
    teacherId,
    startTime: toDateOrNow(p?.startTime),
  };
}

export function mapApiCourseToCourseBrief(
  c: any,
  fallbackTeacherId?: string,
): ClassBrief | null {
  const courseId = c?.id ?? c?.courseId ?? "";
  const courseName = c?.name ?? c?.courseName ?? "";
  const teacherId = c?.teacherId ?? fallbackTeacherId ?? "";

  if (!courseId || !courseName) return null;

  return {
    courseId,
    courseName,
    teacherId,
    startTime: toDateOrNow(c?.startTime),
  };
}
