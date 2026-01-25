import Api, { getUserId } from "@/api/api.ts";
import type {
  ApiDayAvailability,
  ClassWithStudentsDTO,
  CourseBrief,
  StudentBrief,
  Teacher,
  TeacherAvailability,
  TeacherReview,
} from "@/types.ts";
import { mapApiCourseToCourseBrief } from "@/mappers/courseMappers.ts";

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
 * Fetches detailed teacher data.
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
 * Fetches the weekly or daily availability of a teacher.
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
 * Fetches all classes taught by the current teacher
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

/**
 * Retrieves the list of students associated with a specific teacher.
 *
 * @param {string} teacherId - The unique identifier of the teacher.
 * @return {Promise<StudentBrief[]>} A promise that resolves to an array of student brief information.
 */
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

/**
 * Fetches the list of courses associated with a specific teacher.
 *
 * @param {string} teacherId - The unique identifier of the teacher.
 * @return {Promise<CourseBrief[]>} A promise that resolves to an array of course brief objects associated with the teacher.
 */
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

/**
 * Retrieves a list of students enrolled in a specific course taught by a given teacher.
 *
 * @param {string} teacherId - The unique identifier of the teacher.
 * @param {string} courseId - The unique identifier of the course.
 * @param {AbortSignal} [signal] - An optional AbortSignal object to allow cancellation of the request.
 * @return {Promise<StudentBrief[]>} A promise that resolves to an array of student brief details.
 */
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

/**
 * Adds availability data for the current user.
 *
 * @param {ApiDayAvailability[]} availability - An array of availability objects to be added.
 * @return {Promise<void>} A promise that resolves when the availability is successfully posted.
 */
export async function addAvailability(availability: ApiDayAvailability[]) {
  const teacherId = getUserId();
  await Api.post(`/api/teacher/${teacherId}/availability`, availability);
}
