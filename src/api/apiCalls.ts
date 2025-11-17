import Api, { getUserId } from "@/api/api.ts";
import type { ApiDayAvailability } from "@/components/complex/schedules/availabilityWeekSchedule.tsx";
import type {
  ClassWithStudentsDTO,
  Course,
  CourseBrief,
  CourseWidget, PagedResult,
  Teacher,
  TeacherAvailability,
  TeacherReview,
  FileData,
  FileFilter,
  FileTag, FileOwner,
} from "@/api/types.ts";
import type { Spectator } from "@/components/complex/popups/spectators/spectatorListPopup.tsx";
import type {Role} from "@/features/user/user.ts";
import {readPersistedRole} from "@/features/user/RolePersistence.ts";

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
 * Fetches a paginated and optionally filtered list of courses from the backend.
 *
 * Supports multiple optional filters such as category, level, language,
 * price range, teacher, and search query. Pagination parameters (`pageNumber`, `pageSize`)
 * can also be provided to control which subset of results is returned.
 *
 * Each provided filter will be serialized into query parameters and appended to the request URL.
 *
 * Example usage:
 * ```ts
 * const result = await getCourses({
 *   categories: ["Programming", "Mathematics"],
 *   levels: ["Beginner"],
 *   languages: ["English"],
 *   priceFrom: 50,
 *   priceTo: 200,
 *   query: "React",
 *   pageNumber: 1,
 *   pageSize: 5,
 * });
 *
 * @param filters - Optional filtering and pagination parameters.
 * @returns A promise resolving to a {@link PagedResult} containing a list of {@link CourseWidget} items.
 */

export const getCourses = async (filters?: {
  categories?: string[];
  levels?: string[];
  languages?: string[];
  priceFrom?: number;
  priceTo?: number;
  teacherId?: string;
  query?: string;
  pageNumber?: number;
  pageSize?: number;
}): Promise<PagedResult<CourseWidget>> => {
  const params = new URLSearchParams();


  filters?.categories?.forEach((c) => params.append("categories", c));
  filters?.levels?.forEach((l) => params.append("levels", l));
  filters?.languages?.forEach((lng) => params.append("languages", lng));

  if (typeof filters?.priceFrom === "number") params.set("priceFrom", String(filters.priceFrom));
  if (typeof filters?.priceTo === "number")   params.set("priceTo", String(filters.priceTo));
  if (filters?.teacherId)                     params.set("teacherId", filters.teacherId);
  if (filters?.query)                         params.set("query", filters.query);


  if (typeof filters?.pageNumber === "number") params.set("pageNumber", String(filters.pageNumber));
  if (typeof filters?.pageSize === "number")   params.set("pageSize", String(filters.pageSize));

  const queryString = params.toString();
  const url = `/api/courses${queryString ? `?${queryString}` : ""}`;

  const { data } = await Api.get<PagedResult<CourseWidget>>(url);
  return data ?? { items: [], totalCount: 0, page: 1, pageSize: 10 };
};



/**
 * Fetches all upcoming classes (within the next 14 days) for the currently authenticated user.
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
 *
 * @remarks
 * - The active role is persisted in cookies using the `activeRole` key.
 * - The API response is type-checked to handle both AxiosResponse and plain arrays.
 * - The `startTime` field is converted into a `Date` object for easier frontend handling.
 */
export const getCourseBriefs = async (): Promise<CourseBrief[]> => {

  const role: Role | undefined =
      typeof window !== "undefined" ? readPersistedRole() : undefined;


  if (!role) {
    console.warn("getCourseBriefs: no active role found in cookies");
    return [];
  }

  const url =
      role === "teacher"
          ? "/api/classes/upcoming-as-teacher"
          : "/api/classes/upcoming-as-student";

  try {
    const resp = await Api.get<CourseBrief[]>(url);


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
  } catch (err) {
    console.error("getCourseBriefs: error fetching data", err);
    return [];
  }
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
export const getFiles = async (filter?: FileFilter): Promise<PagedResult<FileData>> => {
  const params = new URLSearchParams();
  console.log("function params " + filter?.studentId);
  if (filter?.studentId) params.append("studentId", filter.studentId);
  if (filter?.courseId) params.append("courseId", filter.courseId);

  filter?.createdBy?.forEach(id => params.append("createdBy", id));
  filter?.type?.forEach(t => params.append("types", t));
  filter?.tagIds?.forEach(id => params.append("tags", id));

  if (filter?.page) params.append("page", String(filter.page));
  if (filter?.pageSize) params.append("pageSize", String(filter.pageSize));

  const res = await Api.get<PagedResult<FileData>>(
      `/api/user/files?${params.toString()}`,
  );

  return res.data;
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
  const { data } = await Api.get(`/api/user/files/tags`);
  return data;
}

export async function deleteFile(fileId: string) {

  await Api.delete(`/api/user/files?fileId=${fileId}`);
}

/**
 * Fetches all classes taught by the currently authenticated teacher (taken from JWT),
 * along with students enrolled to those classes/courses.
 *
 * Server endpoint:
 *   GET /api/teachers/classes-with-students
 *
 * Auth:
 *   Requires a valid JWT with the "Teacher" role. The teacher ID is resolved
 *   from the token (ClaimTypes.NameIdentifier) on the backend.
 *
 * @returns {Promise<ClassWithStudentsDTO[]>} List of classes with students.
 * @throws  Will rethrow any network or server error from Axios.
 */
export async function getTeacherClassesWithStudents(): Promise<ClassWithStudentsDTO[]> {
  const { data } = await Api.get<ClassWithStudentsDTO[]>("/api/teacher/classes-with-students");
  return data ?? [];
}


export async function getUserFileTags(): Promise<FileTag[]> {
  const { data } = await Api.get<FileTag[]>("/api/user/files/tags");
  return data ?? [];
}

export async function getUserFileExtensions(): Promise<string[]> {
  const { data } = await Api.get<string[]>("/api/user/files/extensions");
  return data ?? [];
}

export async function getUserFileOwners(): Promise<FileOwner[]> {
  const { data } = await Api.get<FileOwner[]>("/api/user/files/owners");
  return data ?? [];
}

