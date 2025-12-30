import type {CourseBrief, Quiz, Student} from "@/types.ts";
import Api, { getUserId } from "@/api/api.ts";
import {
  mapApiCourseToCourseBrief,
  mapParticipationToCourseBrief,
} from "@/mappers/courseMappers.ts";
import type {ClassTileProps} from "@/components/complex/tiles/classTile.tsx";

/**
 * get student data - fill in details based on id
 * @param studentId
 */
export async function getStudentById(studentId: string) {
  const res = await Api.get(`/api/students/${studentId}`);
  return res.data;
}

export async function getStudentData(studentId: string): Promise<Student> {
  const res = await Api.get(`/api/students/${studentId}`);
  return { name: res.data.name, courses: res.data.coursesBrief };
}

export async function getStudentCourses(
  studentId: string | null,
): Promise<CourseBrief[]> {
  if (!studentId) {
    return [];
  }

  const res = await Api.get(`/api/students/${studentId}/courses`);
  return res.data;
}

export async function getStudentWithTeacherQuizzes(
  teacherId: string,
  studentId: string,
  courseId?: string,
): Promise<Quiz[]> {
  if (!studentId) {
    return [];
  }

  const { data } = await Api.get(
    `/api/teacher/${teacherId}/students/${studentId}/quizzes`,
    {
      params: {
        courseId: courseId ?? undefined,
      },
    },
  );

  return data;
}

export async function getStudentParticipations(
  studentId: string,
): Promise<CourseBrief[]> {
  if (!studentId) {
    return [];
  }

  const { data } = await Api.get<CourseBrief[]>(
    `/api/students/${studentId}/participations`,
  );

  return data
    .map(mapParticipationToCourseBrief)
    .filter((c: any): c is CourseBrief => !!c);
}

export async function getStudentCoursesWithSpecificTeacher(
  studentId: string,
  signal?: AbortSignal,
): Promise<CourseBrief[]> {
  const teacherId = getUserId();
  if (!studentId || !teacherId) {
    return [];
  }

  const { data } = await Api.get<CourseBrief[]>(
    `/api/teacher/${teacherId}/students/${studentId}/courses`,
    { signal },
  );

  return (data ?? [])
    .map((c: any) => mapApiCourseToCourseBrief(c))
    .filter((c: CourseBrief | null): c is CourseBrief => !!c);
}

export async function getStudentClasses(
  studentId: string,
  preferredCourseId: string | null,
): Promise<ClassTileProps[]> {
  if (!studentId) {
    return [];
  }

  const from = new Date();
  from.setDate(from.getDate() - 30);
  const to = new Date();
  to.setDate(to.getDate() + 14);

  const params: any = {
    from: from.toISOString(),
    to: to.toISOString(),
  };

  if (preferredCourseId) {
    params.participationIds = preferredCourseId;
  }

  const { data } = await Api.get<ClassTileProps[]>(
    `/api/students/${studentId}/classes`,
    { params },
  );

  return data;
}