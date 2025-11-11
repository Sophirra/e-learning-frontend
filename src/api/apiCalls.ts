import Api from "@/api/api.ts";
import type { ApiDayAvailability } from "@/components/complex/schedules/availabilityWeekSchedule.tsx";
import type {
  ClassWithStudentsDTO,
  Course,
  ClassBrief,
  CourseWidget,
  Teacher,
  TeacherAvailability,
  TeacherReview,
  FileData,
  FileFilter,
  FileTag,
  Student,
  CourseBrief,
} from "@/api/types.ts";
import type { Spectator } from "@/components/complex/popups/spectators/spectatorListPopup.tsx";
import type { Role } from "@/features/user/user.ts";
import type { ExerciseBrief } from "@/pages/UserPages/HomePage.tsx";
import type { AssignmentBrief } from "@/pages/UserPages/AssignmentPage.tsx";
import type { ClassSchedule } from "@/components/complex/schedules/schedule.tsx";

/**
 * Fetches detailed course data by courseID.
 *
 * @param courseId - The unique identifier of the course.
 * @returns Promise resolving to a Course object.
 */
export const getCourseById = async (courseId: string): Promise<Course> => {
  const { data } = await Api.get<Course>(`/api/courses/${courseId}`);
  return data;
};

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
 * @param teacherId - The unique identifier of the teacher.
 * @returns Promise resolving to an array of TeacherAvailability objects.
 */
export const getTeacherAvailability = async (
  teacherId: string,
): Promise<TeacherAvailability[]> => {
  const { data } = await Api.get<TeacherAvailability[]>(
    `/api/teacher/${teacherId}/availability`,
  );

  /*const mapped: ApiDayAvailability[] = res.data.map((day) => ({
    day: day.day,
    timeslots: day.timeslots.map((slot) => ({
      timeFrom: slot.timeFrom.slice(0, 5),
      timeUntil: slot.timeUntil.slice(0, 5),
    })),
  }));*/

  return data ?? [];
};

/**
 * Fetches all available course categories.
 *
 * This endpoint retrieves a list of all course categories
 * that can be used for filtering or displaying courses.
 *
 * @returns Promise resolving to an array of category names (strings).
 */
export const getCourseCategories = async (): Promise<string[]> => {
  const { data } = await Api.get<{ name: string }[]>(`/api/courses/categories`);
  return data.map((c) => c.name);
};

/**
 * Fetches all available course levels (e.g., Beginner, Intermediate, Advanced).
 *
 * Useful for populating level filters or form selectors.
 *
 * @returns Promise resolving to an array of level names (strings).
 */
export const getCourseLevels = async (): Promise<string[]> => {
  const { data } = await Api.get<{ name: string }[]>(`/api/courses/levels`);
  return data.map((l) => l.name);
};

/**
 * Fetches all available languages used across courses.
 *
 * Used to populate language filters in course listings or search.
 *
 * @returns Promise resolving to an array of language names (strings).
 */
export const getCourseLanguages = async (): Promise<string[]> => {
  const { data } = await Api.get<{ name: string }[]>(`/api/courses/languages`);
  return data.map((l) => l.name);
};

/**
 * Fetches a filtered list of courses from the backend.
 *
 * Supports multiple optional filters such as category, level, language,
 * price range, teacher, and search query. Each provided filter
 * will be converted into a query parameter and appended to the request URL.
 *
 * Example usage:
 * ```ts
 * const courses = await getCourses({
 *   categories: ["Programming", "Mathematics"],
 *   levels: ["Beginner"],
 *   languages: ["English"],
 *   priceFrom: 50,
 *   priceTo: 200,
 *   query: "React",
 * });
 * ```
 *
 * @param filters - Optional filtering parameters (categories, levels, languages, etc.).
 * @returns Promise resolving to an array of Course objects.
 */
export const getCourses = async (filters?: {
  categories?: string[];
  levels?: string[];
  languages?: string[];
  priceFrom?: number;
  priceTo?: number;
  teacherId?: string;
  query?: string;
}): Promise<CourseWidget[]> => {
  const params = new URLSearchParams();

  // Append filters as query parameters if present
  filters?.categories?.forEach((c) => params.append("categories", c));
  filters?.levels?.forEach((l) => params.append("levels", l));
  filters?.languages?.forEach((lng) => params.append("languages", lng));
  if (typeof filters?.priceFrom === "number")
    params.append("priceFrom", String(filters.priceFrom));
  if (typeof filters?.priceTo === "number")
    params.append("priceTo", String(filters.priceTo));
  if (filters?.teacherId) params.append("teacherId", filters.teacherId);
  if (filters?.query) params.append("query", filters.query);

  const queryString = params.toString();
  const url = `/api/courses${queryString ? `?${queryString}` : ""}`;

  const { data } = await Api.get<CourseWidget[]>(url);
  return data ?? [];
};

/**
 * Fetches all upcoming classes (within the next 14 days) for the currently authenticated user.
 *
 * Depending on the user's active role, this function calls the appropriate API endpoint:
 * - `/api/classes/upcoming-as-teacher`   when the user is a **teacher**.
 * - `/api/classes/upcoming-as-student`   when the user is a **student**.
 *
 * Each returned object includes:
 * - `courseId`   unique identifier of the course.
 * - `courseName`   name of the course.
 * - `startTime`   class start date and time (converted from ISO string to `Date`).
 * - `teacherId`   identifier of the teacher assigned to the course.
 *
 * @param {Role | undefined} activeRole - The current user's role, determining which endpoint to query.
 * @returns {Promise<ClassBrief[]>} A promise resolving to a list of upcoming classes.
 *
 * @remarks
 * The API automatically filters data based on the user's JWT roles.
 * The `startTime` field is converted from an ISO 8601 string into a native JavaScript `Date`
 * for easier handling of dates and times on the frontend.
 */
export const getClassBriefs = async (
  activeRole: Role | undefined,
): Promise<ClassBrief[]> => {
  if (!activeRole) return [];

  const url =
    activeRole === "teacher"
      ? `/api/classes/upcoming-as-teacher`
      : `/api/classes/upcoming-as-student`;

  const resp = await Api.get<ClassBrief[]>(url);

  // Jeśli API wrapper zwraca AxiosResponse   sprawdzamy status
  const status = (resp as any)?.status;
  const arr: unknown = (resp as any)?.data ?? resp;

  if (status === 204 || !arr) return [];

  if (!Array.isArray(arr)) {
    console.warn("getCourseBriefs: unexpected response shape", resp);
    return [];
  }

  return arr.map((c) => ({
    ...c,
    startTime: new Date(c.startTime),
  }));
};

/**
 * Fetches all spectators for the currently authenticated student from the API.
 *
 * The API endpoint `/api/spectators` returns users who are currently spectating
 * the logged-in student based on the JWT identity of the request.
 *
 * Each item includes:
 * - `id`   the unique identifier of the spectator.
 * - `email`   the email address of the spectator.
 * - `status`   optional spectatorship status (may be `null` if not specified).
 *
 * @returns {Promise<Spectator[]>} A promise that resolves to a list of spectators.
 */
export const getSpectators = async (): Promise<Spectator[]> => {
  const { data } = await Api.get<Spectator[]>("/api/spectators");
  return data;
};

/**
 * Removes a spectator relationship for the currently authenticated user.
 *
 * The API endpoint `/api/spectators` reads the **spectated user's ID** directly
 * from the JWT token (the logged-in user) and removes the specified spectator
 * identified by the provided `spectatorId` in the request body.
 *
 * On success, the API responds with:
 * - `204 No Content`   spectatorship successfully removed.
 *
 * On failure, it may respond with:
 * - `400 Bad Request`   when the `spectatorId` is missing or invalid.
 * - `401 Unauthorized`   when the token is invalid or expired.
 * - `404 Not Found`   when the spectatorship does not exist.
 *
 * @param {string} spectatorId - The unique identifier of the spectator (observer) to be removed.
 * @returns {Promise<void>} A promise that resolves when the operation completes successfully.
 */
export const removeSpectator = async (spectatorId: string): Promise<void> => {
  await Api.delete("/api/spectators", {
    data: { spectatorId },
  });
};

/**
 * Sends a request to add a new spectator for the currently authenticated student.
 *
 * The API endpoint `/api/spectators` creates a spectatorship relationship
 * between the logged-in student (derived from the JWT token) and the specified spectator.
 *
 * The request body must contain:
 * - `spectatorId`   the unique identifier of the user who will become a spectator.
 *
 * Possible server responses:
 * - **201 Created**   spectatorship successfully created.
 * - **400 Bad Request**   missing or invalid `spectatorId`.
 * - **401 Unauthorized**   JWT token is invalid or missing.
 * - **403 Forbidden**   the user is not a student.
 * - **404 Not Found**   spectator not found or relationship already exists.
 *
 * @param {string} spectatorId - The unique identifier (GUID) of the spectator to be added.
 * @returns {Promise<void>} Resolves when the spectator is successfully added.
 */
export const addSpectator = async (spectatorEmail: string): Promise<void> => {
  await Api.post("/api/spectators", { spectatorEmail });
};

/**
 * Sends a request to accept a pending spectator invitation using its unique token.
 *
 * The API endpoint `/api/spectators/invites/accept` validates the provided invitation token,
 * ensures the current user is the invited spectator, and finalizes the spectatorship relationship.
 *
 * The request body must contain:
 * - `token`   the secure invitation token received via email link.
 *
 * Possible server responses:
 * - **204 No Content**   invitation successfully accepted.
 * - **400 Bad Request**   missing or invalid `token` value.
 * - **401 Unauthorized**   user is not authenticated or JWT token is invalid.
 * - **403 Forbidden**   current user is not the invited spectator.
 * - **404 Not Found**   invitation not found.
 * - **409 Conflict**   invitation already accepted or expired.
 * - **500 Internal Server Error**   unexpected server error while accepting the invitation.
 *
 * @param {string} token - The secure token associated with the spectator invitation.
 * @returns {Promise<void>} Resolves when the invitation has been successfully accepted.
 */
export const acceptSpectatorInvite = async (token: string): Promise<void> => {
  await Api.post("/api/spectators/invites/accept", { token });
};

/**
 * Uploads a file for the currently authenticated user.
 *
 * The API endpoint `/api/user/files` accepts a multipart/form-data POST request
 * containing the file to be uploaded. The backend associates the file with the
 * authenticated user (based on their JWT identity) and stores it under `/uploads/users/{userId}/files/`.
 *
 * Request body (multipart/form-data):
 * - `file`   the file to upload.


 * @param {File} file - The file object selected by the user (from an `<input type="file">`).
 * @returns {Promise<any>} Resolves with the uploaded file metadata returned by the backend.
 */
export const uploadUserFile = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await Api.post("/api/user/files", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

/**
 * Fetches a filtered list of files from the backend.
 *
 * Supports multiple optional filters. Each provided filter
 * will be converted into a query parameter and appended to the request URL.
 * ```
 *
 * @param filters - Optional filtering parameters.
 * @returns Promise resolving to an array of Course objects.
 */
//TODO: modify according to backend (created based on getCourses)
export const getFiles = async (filters?: FileFilter): Promise<FileData[]> => {
  const params = new URLSearchParams();

  // Append filters as query parameters if present
  filters?.origin?.forEach((v) => params.append("origin", v));
  filters?.tags?.forEach((v) => params.append("tags", v));
  filters?.createdBy?.forEach((v) => params.append("createdBy", v));
  filters?.type?.forEach((v) => params.append("type", v));
  // if (filters?.userId) params.append("userId", filters.userId);
  // if (filters?.teacherId) params.append("teacherId", filters.teacherId);
  if (filters?.query) params.append("query", filters.query);

  const queryString = params.toString();
  const url = `/api/user/files${queryString ? `?${queryString}` : ""}`;

  const { data } = await Api.get<FileData[]>(url);
  return data ?? [];
};

/**
 * Updates the file data in the database.
 * @param fileId id of the file to update
 * @param data new file name and tags
 */
export function updateFileData(
  fileId: string,
  data: { fileName: string; tags: FileTag[] },
) {
  //TODO: send shit
}

/**
 * Gets the available tags for the current user.
 * @returns {Promise<FileTag[]>} A promise that resolves to an array of available tags.
 */
export async function getAvailableTags(): Promise<FileTag[]> {
  const { data } = await Api.get(`/api/files/tags`); //TODO?? robione na czuja
  return data;
}

export async function deleteFile(fileId: string) {
  //TODO: call delete file
  await Api.delete(`/api/user/files/${fileId}`); //TODO?? check
}

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

/**
 * Adds a grade to an assignment.
 * @param assignmentId
 * @param grade
 * @param comments
 */
export async function addAssignmentGrade( //TODO: check
  assignmentId: string,
  grade: number,
  comments?: string,
): Promise<void> {
  await Api.post("/api/assignments/grade", { assignmentId, grade, comments });
}

export async function getStudentData(studentId: string): Promise<Student> {
  const res = await Api.get(`/api/students/${studentId}`);
  return { name: res.data.name, courses: res.data.coursesBrief };
}

export async function getStudentCourses(
  studentId: string | null,
): Promise<CourseBrief[]> {
  if(!studentId) {
    return [];
  }

  const res = await Api.get(`/api/students/${studentId}/courses`);
  return res.data;
}

export async function getStudentUnsolvedExercises(studentId: string): Promise<ExerciseBrief[]> {
  if(!studentId) {
    return [];
  }

  const { data } = await Api.get<ExerciseBrief[]>(
    `/api/exercises/unsolved-by-user/${studentId}`,
  );

  return data;
}

export async function getExercises(userId: string, activeRole: string | null, preferredCourseId: string | null, preferredStudentId?: string | null): Promise<AssignmentBrief[]> {
  if(!userId) {
    return [];
  }

  let endpoint = "";

  if (activeRole === "student") {
    endpoint = `/api/students/${userId}/exercises`;
  } else if (activeRole === "teacher") {
    endpoint = `/api/teacher/${userId}/exercises`;
  } else {
    return [];
  }

  const { data } = await Api
    .get<AssignmentBrief[]>(endpoint, {
      params: {
        courseId: preferredCourseId,
        studentId: preferredStudentId ?? undefined,
      },
    })

  return data;
}

export async function getTeacherUpcomingClasses(teacherId: string, startParam: string, endParam: string): Promise<ClassSchedule[]> {
  if(!teacherId) {
    return [];
  }

  const { data } = await Api.get<ClassSchedule[]>(`/api/teacher/${teacherId}/upcoming-classes`, {
    params: {
      start: startParam,
      end: endParam,
    },
  })

  return data;
}