import Api, {getUserId} from "@/api/api.ts";
import type {
    ApiDayAvailability,
    ClassWithStudentsDTO,
    CourseBrief,
    DayAvailability,
    StudentBrief,
    Teacher,
    TeacherAvailability,
    TeacherReview,
} from "@/types.ts";
import {mapApiCourseToCourseBrief,} from "@/mappers/courseMappers.ts";
import type {ErrorResponse} from "react-router-dom";

/**
 * Fetches teacher availability associated with a specific course.
 *
 * @param courseId - The unique identifier of the course.
 * @returns Promise resolving to an array of TeacherAvailability.
 */
export const getTeacherAvailabilityByCourseId = async (
  courseId: string,
): Promise<TeacherAvailability[]> => {
  const { data } = await Api.get<TeacherAvailability[]>(
    `/api/courses/${courseId}/teacher/availability`,
  );
  return data ?? [];
};

/**
 * Fetches formatted teacher availability data for a course
 * (used in scheduling views like WeekScheduleDialog).
 *
 * @param courseId - The course ID.
 * @returns Promise resolving to an array of ApiDayAvailability objects.
 */
export const getApiDayAvailability = async (
  courseId: string,
): Promise<ApiDayAvailability[]> => {
  const { data } = await Api.get<ApiDayAvailability[]>(
    `/api/courses/${courseId}/teacher/availability`,
  );
  return data ?? [];
};

/**
 * Fetches detailed teacher data by their unique identifier.
 *
 * @param teacherId - The unique identifier of the teacher.
 * @returns Promise resolving to a Teacher object.
 */
export const getTeacherById = async (teacherId: string): Promise<Teacher> => {
  const { data } = await Api.get<Teacher>(`/api/teacher/${teacherId}`);
  return data;
};

/**
 * Fetches all reviews associated with a given teacher.
 *
 * @param teacherId - The unique identifier of the teacher.
 * @returns Promise resolving to an array of TeacherReview objects.
 */
export const getTeacherReviews = async (
  teacherId: string,
): Promise<TeacherReview[]> => {
  const { data } = await Api.get<TeacherReview[]>(
    `/api/teacher/${teacherId}/reviews`,
  );
  return data ?? [];
};

/**
 * Fetches the weekly or daily availability of a teacher
 * by their unique identifier.
 *
 * @returns Promise resolving to an array of TeacherAvailability objects.
 */
export const getTeacherAvailability = async (): Promise<
  TeacherAvailability[]
> => {
  const teacherId = getUserId();
  const { data } = await Api.get<TeacherAvailability[]>(
    `/api/teacher/${teacherId}/availability`,
  );
  return data ?? [];
};

/**
 * Fetches all classes taught by the currently authenticated teacher (taken from JWT),
 * along with students enrolled to those classes/courses.
 *
 * Server endpoint:
 *   GET /api/teacher/classes-with-students
 *
 * Auth:
 *   Requires a valid JWT with the "Teacher" role. The teacher ID is resolved
 *   from the token (ClaimTypes.NameIdentifier) on the backend.
 *
 * @returns {Promise<ClassWithStudentsDTO[]>} List of classes with students.
 * @throws  Will rethrow any network or server error from Axios.
 */
export async function getTeacherClassesWithStudents(): Promise<
  ClassWithStudentsDTO[]
> {
  const { data } = await Api.get<ClassWithStudentsDTO[]>(
    "/api/teacher/classes-with-students",
  );
  return data ?? [];
}

export async function getTeacherStudents(
  teacherId: string,
): Promise<StudentBrief[]> {
  if (!teacherId) {
    return [];
  }

  const { data } = await Api.get<StudentBrief[]>(
    `/api/teacher/${teacherId}/students`,
  );

  return data ?? [];
}

export async function getTeacherCourses(
  teacherId: string,
): Promise<CourseBrief[]> {
  if (!teacherId) {
    return [];
  }

  const { data } = await Api.get<CourseBrief[]>(
    `/api/teacher/${teacherId}/courses`,
  );

  return (data ?? [])
    .map((c: any) => mapApiCourseToCourseBrief(c))
    .filter((c: CourseBrief | null): c is CourseBrief => !!c);
}

export async function getTeacherStudentsWithSpecificCourse(
  teacherId: string,
  courseId: string,
  signal?: AbortSignal,
): Promise<StudentBrief[]> {
  if (!teacherId || !courseId) {
    return [];
  }

  const { data } = await Api.get<StudentBrief[]>(
    `/api/teacher/${teacherId}/courses/${courseId}/students`,
    { signal },
  );

  return data;
}

export async function addAvailability(availability: ApiDayAvailability[]) {
  const teacherId = getUserId();
  const res = await Api.post(
    `/api/teacher/${teacherId}/availability`,
    availability,
  );
  if (res.status === 200 || res.status === 201 || res.status === 204) return;
  else throw res.data as ErrorResponse;
}
