import type {
  ClassBrief,
  ClassBriefDto,
  ClassSchedule,
  FileProps,
  LinkProps,
  Role,
} from "@/types.ts";
import Api, { getUserId } from "@/api/api.ts";

/**
 * Fetches a list of brief class details based on the active role of the user.
 *
 * @param {Role | undefined} activeRole - The active role of the user, either "teacher" or "student".
 * @returns {Promise<ClassBrief[]>} A promise that resolves to an array of `ClassBrief` objects
 *                                  with the `startTime` property converted to JavaScript Date objects.
 */
export const getClassBriefs = async (
  activeRole: Role | undefined,
): Promise<ClassBrief[]> => {
  if (!activeRole) return [];

  const url =
    activeRole === "teacher"
      ? `/api/classes/upcoming-as-teacher`
      : `/api/classes/upcoming-as-student`;

  const { data, status } = await Api.get<ClassBrief[]>(url);

  if (status === 200) return [];
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((c) => ({
    ...c,
    startTime: new Date(c.startTime),
  }));
};

/**
 * Fetches the upcoming classes for the currently authenticated teacher within the specified date range.
 *
 * @param {string} startParam - The start date and time for the range.
 * @param {string} endParam - The end date and time for the range.
 * @return {Promise<ClassSchedule[]>} A promise that resolves to an array of class schedules for the teacher.
 */
export async function getTeacherUpcomingClasses(
  startParam: string,
  endParam: string,
): Promise<ClassSchedule[]> {
  const teacherId = getUserId();
  if (!teacherId) {
    return [];
  }

  const { data } = await Api.get<ClassSchedule[]>(
    `/api/teacher/${teacherId}/upcoming-classes`,
    {
      params: {
        start: startParam,
        end: endParam,
      },
    },
  );

  return data ?? [];
}

/**
 * Retrieves the timeline of classes for a given student within a specified time range.
 *
 * @param {string} studentId - The unique identifier of the student.
 * @param {string | null} preferredCourseId - The optional course ID to filter the timeline by a specific course.
 * @return {Promise<ClassBriefDto[]>} A promise that resolves to an array of class brief details.
 */
export async function getStudentTimeline(
  studentId: string,
  preferredCourseId: string | null,
): Promise<ClassBriefDto[]> {
  if (!studentId) {
    return [];
  }

  const from = new Date();
  from.setDate(from.getDate() - 30);
  const to = new Date();
  to.setDate(to.getDate() + 30);

  const params: any = {
    from: from.toISOString(),
    to: to.toISOString(),
  };

  if (preferredCourseId) {
    params.participationIds = preferredCourseId;
  }

  const { data } = await Api.get<ClassBriefDto[]>(
    `/api/students/${studentId}/timeline`,
    { params },
  );

  return data ?? [];
}

/**
 * Adds a link to a specific class.
 *
 * @param {string} classId - The ID of the class to which the link will be added.
 * @param {string} link - The URL of the link to add.
 * @param {boolean} isMeeting - Indicates whether the link is a meeting link or not.
 * @return {Promise<void>} A promise that resolves when the link is successfully added.
 */
export async function addClassLink(
  classId: string,
  link: string,
  isMeeting: boolean,
): Promise<void> {
  await Api.post(`/api/classes/${classId}/links`, {
    link,
    isMeeting,
  });
}

/**
 * Retrieves a list of links associated with a specific class.
 *
 * @param {string} classId - The unique identifier of the class.
 * @return {Promise<LinkProps[]>} A promise that resolves with an array of link properties.
 */
export async function getClassLinks(classId: string): Promise<LinkProps[]> {
  if (!classId) {
    return Promise.reject("No classId provided");
  }

  const { data } = await Api.get(`/api/classes/${classId}/links`);

  return data;
}

/**
 * Fetches the files associated with a specific class.
 *
 * @param {string} classId - The unique identifier of the class.
 * @return {Promise<FileProps[]>} A promise that resolves to an array of file properties.
 */
export async function getClassFiles(classId: string): Promise<FileProps[]> {
  if (!classId) {
    return Promise.reject("No classId provided");
  }

  const { data } = await Api.get(`/api/classes/${classId}/files`);

  return data;
}

/**
 * Removes a class link by its unique identifier.
 *
 * @param {string} linkId - The unique identifier of the class link.
 * @return {Promise<void>} A promise that resolves when the class link has been successfully removed.
 */
export async function removeClassLink(linkId: string) {
  await Api.delete(`/api/classes/links/${linkId}`);
}

/**
 * Sets up the first class of a course for a student of a set variant (language and level)
 *
 * @param {string} courseId - The ID of the course to associate the class with.
 * @param {string} startTime - The start time of the class in ISO 8601 format.
 * @param {string} languageId - The ID of the language associated with the class.
 * @param {string} levelId - The ID of the level associated with the class.
 * @return {Promise<void>} A promise that resolves when the class setup is complete.
 */
export async function setupFirstClass(
  courseId: string,
  startTime: string,
  languageId: string,
  levelId: string,
): Promise<void> {
  await Api.post(`/api/classes`, {
    courseId,
    startTime,
    languageId,
    levelId,
  });
}

/**
 * Sets up the next class of an already attended class.
 *
 * @param {string} startTime - The start time of the class to be scheduled.
 * @param {string} courseId - The identifier of the course for which the class is being set up.
 * @return {Promise<void>} A promise that resolves when the class is successfully set up.
 */
export async function setupNextClass(
  startTime: string,
  courseId: string,
): Promise<void> {
  await Api.post(`/api/classes/`, {
    courseId,
    startTime,
  });
}
