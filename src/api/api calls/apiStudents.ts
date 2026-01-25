import type { CourseBrief, Quiz, Student } from "@/types.ts";
import Api, { getUserId } from "@/api/api.ts";
import {
  mapApiCourseToCourseBrief,
  mapParticipationToCourseBrief,
} from "@/mappers/courseMappers.ts";
import type { ClassTileProps } from "@/components/complex/tiles/classTile.tsx";

/**
 * Fetches student details.
 *
 * @param {string} studentId - The unique identifier of the student.
 * @return {Promise<Object>} A promise that resolves to the student data.
 */
export async function getStudentById(studentId: string) {
  const { data } = await Api.get(`/api/students/${studentId}`);
  return data;
}

/**
 * Retrieves student data based on the provided student ID.
 *
 * @param {string} studentId - The unique identifier for the student.
 * @return {Promise<Student>} A promise that resolves to the student's data, including their name and a summary of their courses.
 */
export async function getStudentData(studentId: string): Promise<Student> {
  const { data } = await Api.get(`/api/students/${studentId}`);
  return { name: data.name, courses: data.coursesBrief };
}

/**
 * Fetches the list of courses associated with a specific student.
 *
 * @param {string | null} studentId - The unique identifier of the student.
 * @return {Promise<CourseBrief[]>} A promise that resolves to an array of course brief objects associated with the student.
 */
export async function getStudentCourses(
  studentId: string | null,
): Promise<CourseBrief[]> {
  if (!studentId) {
    return [];
  }

  const { data } = await Api.get(`/api/students/${studentId}/courses`);
  return data;
}

/**
 * Retrieves teacher's quizzes associated with a specific student, optionally filtered by a course ID.
 *
 * @param {string} teacherId - The ID of the teacher.
 * @param {string} studentId - The ID of the student.
 * @param {string} [courseId] - Optional parameter representing the ID of the course to filter quizzes.
 * @return {Promise<Quiz[]>} A promise that resolves to an array of quizzes for the specified student and teacher.
 */
export async function getTeacherQuizzesByStudent(
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

/**
 * Retrieves the list of course participation for a specific student.
 *
 * @param {string} studentId - The unique identifier of the student whose participations are to be fetched.
 * @return {Promise<CourseBrief[]>} A promise that resolves to an array of course brief objects representing the student's participations.
 */
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

/**
 * Retrieves a list of courses for a given student that are taught by the specific teacher.
 *
 * @param {string} studentId - The ID of the student.
 * @param {AbortSignal} [signal] - An optional signal to allow aborting the request.
 * @return {Promise<CourseBrief[]>} A promise that resolves to an array of CourseBrief.
 */
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

/**
 * Retrieves a list of classes for a given student within a specified date range.
 *
 * @param {string} studentId - The unique identifier of the student.
 * @param {string | null} preferredCourseId - The ID of a specific course.
 * @return {Promise<ClassTileProps[]>} A promise that resolves to an array of ClassTileProps representing the student's classes.
 */
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
