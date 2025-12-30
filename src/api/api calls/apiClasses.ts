import type {
  ClassBrief,
  ClassBriefDto,
  ClassSchedule,
  FileProps,
  LinkProps, Role,
} from "@/types.ts";
import Api, { getUserId } from "@/api/api.ts";
import type { ErrorResponse } from "react-router-dom";

/**
 * Fetches all upcoming classes (within the next 14 days) for the currently
 * authenticated user.
 *
 * The user's active role is automatically read from cookies (`activeRole`) to determine
 * which API endpoint should be called:
 *
 * - `/api/classes/upcoming-as-teacher`   when the stored role is **teacher**.
 * - `/api/classes/upcoming-as-student`   when the stored role is **student**.
 *
 * Each returned object includes:
 * - `courseId`   unique identifier of the course.
 * - `courseName`   name of the course.
 * - `startTime`   class start date and time (converted from an ISO string to a native `Date`).
 * - `teacherId`   identifier of the teacher assigned to the course.
 *
 * @returns {Promise<CourseBrief[]>} A promise resolving to a list of upcoming classes.
 * If no role is found in cookies or the API returns no data, an empty array is returned.
 * @param {Role | undefined} activeRole - The current user's role, determining which endpoint to query.
 * @returns {Promise<ClassBrief[]>} A promise resolving to a list of upcoming classes.
 * @param {Role | undefined} activeRole - The current user's role, determining
 * which endpoint to query.
 * @returns {Promise<CourseBrief[]>} A promise resolving to a list of upcoming
 * classes.
 *
 * @remarks
 * - The active role is persisted in cookies using the `activeRole` key.
 * - The API response is type-checked to handle both AxiosResponse and plain arrays.
 * - The `startTime` field is converted into a `Date` object for easier frontend handling.
 */
// export const getCourseBriefs = async (): Promise<CourseBrief[]> => {
//
//   const role: Role | undefined =
//       typeof window !== "undefined" ? readPersistedRole() : undefined;
//
//
//   if (!role) {
//     console.warn("getCourseBriefs: no active role found in cookies");
//     return [];
//   }
//
//   const url =
//       role === "teacher"
//           ? "/api/classes/upcoming-as-teacher"
//           : "/api/classes/upcoming-as-student";
//
//   try {
//     const resp = await Api.get<CourseBrief[]>(url);

export const getClassBriefs = async (
  activeRole: Role | undefined,
): Promise<ClassBrief[]> => {
  if (!activeRole) return [];

  const url =
    activeRole === "teacher"
      ? `/api/classes/upcoming-as-teacher`
      : `/api/classes/upcoming-as-student`;

  const resp = await Api.get<ClassBrief[]>(url);

  const status = (resp as any)?.status;
  const arr: unknown = (resp as any)?.data ?? resp;

  if (status === 204 || !arr) return [];

  if (!Array.isArray(arr)) {
    console.warn("getClassBriefs: unexpected response shape", resp);
    return [];
  }

  return arr.map((c) => ({
    ...c,
    startTime: new Date(c.startTime),
  }));
};

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

  return data;
}

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

  return data;
}

export async function getClassBrief(classId: string): Promise<ClassBriefDto> {
  if (!classId) {
    return Promise.reject("No classId provided");
  }

  const { data } = await Api.get<ClassBriefDto>(`/api/classes/${classId}`);

  return data;
}

export async function addClassLink(
  classId: string,
  link: string,
  isMeeting: boolean,
) {
  const res = await Api.post(`/api/classes/${classId}/links`, {
    link,
    isMeeting,
  });
  if (res.status === 200 || res.status === 201) return;
  else throw res.data as ErrorResponse;
}

export async function getClassLinks(classId: string): Promise<LinkProps[]> {
  if (!classId) {
    return Promise.reject("No classId provided");
  }

  const { data } = await Api.get(`/api/classes/${classId}/links`);

  return data;
}

export async function getClassFiles(classId: string): Promise<FileProps[]> {
  if (!classId) {
    return Promise.reject("No classId provided");
  }

  const { data } = await Api.get(`/api/classes/${classId}/files`);

  return data;
}

export async function removeClassLink(linkId: string) {
  const res = await Api.delete(`/api/classes/links/${linkId}`);
  if (res.status === 200 || res.status === 204) return;
  else throw res.data as ErrorResponse;
}

export async function setupFirstClass(
  startTime: string,
  courseId: string,
  languageId: string,
  levelId: string,
) {
  const res = await Api.post(`/api/classes`, {
    courseId,
    startTime,
    languageId,
    levelId,
  });
  if (res.status === 201 || res.status === 200) return;
  else throw res.data as ErrorResponse;
}

export async function setupNextClass(startTime: string, courseId: string) {
  const res = await Api.post(`/api/classes/`, {
    courseId,
    startTime,
  });
  if (res.status === 201 || res.status === 200) return;
  else throw res.data as ErrorResponse;
}
