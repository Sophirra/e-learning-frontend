import Api, { getUserId } from "@/api/api.ts";
import type { ApiDayAvailability } from "@/components/complex/schedules/availabilityWeekSchedule.tsx";
import type {
  ClassBrief,
  ClassWithStudentsDTO,
  Course,
  CourseBrief,
  CourseWidget,
  PagedResult,
  FileData,
  FileFilter,
  FileTag,
  Question,
  Teacher,
  TeacherAvailability,
  TeacherReview,
  FileOwner,
  Quiz,
  Answer,
  QuizBrief,
  QuestionCategory,
  QuizSolution,
  Student,
} from "@/api/types.ts";
import { readPersistedRole } from "@/features/user/RolePersistence.ts";
import type { Spectator } from "@/components/complex/popups/spectators/spectatorListPopup.tsx";
import type { Role } from "@/features/user/user.ts";
import type { ExerciseBrief } from "@/pages/UserPages/HomePage.tsx";
import type { ExerciseBrief } from "@/pages/UserPages/AssignmentPage.tsx";
import type { ClassSchedule } from "@/components/complex/schedules/schedule.tsx";
import type { ClassBriefDto } from "@/features/calendar/teacherCalendar.tsx";
import type { StudentBrief } from "@/components/complex/courseFilter.tsx";
import {
  mapApiCourseToCourseBrief,
  mapParticipationToCourseBrief,
} from "@/mappers/courseMappers.ts";
import type { ErrorResponse } from "react-router-dom";
import { useUser } from "@/features/user/UserContext.tsx";
import type {
  AssignmentTask,
  QuizTask,
} from "@/components/complex/summaries/assignmentSummary.tsx";

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

  if (typeof filters?.priceFrom === "number")
    params.set("priceFrom", String(filters.priceFrom));
  if (typeof filters?.priceTo === "number")
    params.set("priceTo", String(filters.priceTo));
  if (filters?.teacherId) params.set("teacherId", filters.teacherId);
  if (filters?.query) params.set("query", filters.query);

  if (typeof filters?.pageNumber === "number")
    params.set("pageNumber", String(filters.pageNumber));
  if (typeof filters?.pageSize === "number")
    params.set("pageSize", String(filters.pageSize));

  const queryString = params.toString();
  const url = `/api/courses${queryString ? `?${queryString}` : ""}`;

  const { data } = await Api.get<PagedResult<CourseWidget>>(url);
  return data ?? { items: [], totalCount: 0, page: 1, pageSize: 10 };
};

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
    console.warn("getCourseBriefs: unexpected response shape", resp);
    return [];
  }

  return arr.map((c) => ({
    ...c,
    startTime: new Date(c.startTime),
  }));
};
//   } catch (err) {
//     console.error("getCourseBriefs: error fetching data", err);
//     return [];
//   }
// };

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
export const getFiles = async (
  filter?: FileFilter,
): Promise<PagedResult<FileData>> => {
  const params = new URLSearchParams();
  if (filter?.studentId) params.append("studentId", filter.studentId);
  if (filter?.courseId) params.append("courseId", filter.courseId);

  filter?.createdBy?.forEach((id) => params.append("createdBy", id));
  filter?.type?.forEach((t) => params.append("types", t));
  filter?.tagIds?.forEach((id) => params.append("tags", id));

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
  const userId = getUserId();
  const { data } = await Api.get(`/api/tags/by-user/${userId}`); //TODO?? robione na czuja
  return data;
}

export async function createNewTag(name: string) {
  const res = await Api.post("/api/tags", { name });
  if (res.status === 201 || res.status === 200 || res.status === 204)
    return res.data;
  else return res.data as ErrorResponse;
}

export async function deleteFile(fileId: string) {
  await Api.delete(`/api/user/files?fileId=${fileId}`);
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
export async function addExerciseGrade( //TODO: check
  assignmentId: string,
  grade: number,
  comments?: string,
): Promise<void> {
  await Api.post("/api/assignments/grade", { assignmentId, grade, comments });
}
/**
 * Gets all teacher/student quizzes to display in the gallery
 * @param studentId
 * @param courseId
 * @param searchQuery
 */
export async function getQuizzes(
  studentId?: string,
  courseId?: string,
  // multichoice?: boolean,
  searchQuery?: string,
  classId?: string,
): Promise<QuizBrief[]> {
  const params = new URLSearchParams();
  studentId && params.append("studentId", studentId);
  courseId && params.append("courseId", courseId);
  // multichoice && params.append("multichoice", String(multichoice));
  searchQuery && params.append("searchQuery", searchQuery);
  classId && params.append("classId", classId);

  const res = await Api.get(
    `/api/quizzes/${params ? `?${params.toString()}` : ""}`,
  );

  if (res.status === 204 || !res.data) return [];

  return res.data;
}

/**
 * get student data - fill in details based on id
 * @param studentId
 */
export async function getStudentById(studentId: string) {
  const res = await Api.get(`/api/students/${studentId}`);
  return res.data;
}

/**
 * get quiz data without questions to display in details
 * @param quizId
 */
export async function getQuiz(quizId: string): Promise<Quiz> {
  const res = await Api.get(`/api/quizzes/${quizId}`);
  return res.data;
}

/**
 * get quiz questions with answers - for solving. Do not include data about
 * the correctness of answers.
 * @param quizId
 */
export async function getQuizQuestions(quizId: string): Promise<Question[]> {
  const res = await Api.get(`/api/quizzes/${quizId}/questions`); //TODO: ustawić link
  return res.data;
}

/**
 * send user solution to the quiz - based on quiz id. Answers contain question id
 * and an array of selected answers' ids
 * @param solution
 */
export async function submitQuiz(solution: QuizSolution): Promise<number> {
  const res = await Api.post(
    `/api/quizzes/${solution.quizId}/solution`,
    solution,
  );
  if (res.status === 201) return res.data;
  else throw res.data as ErrorResponse;
}

/**
 * get teacher question categories for filtering and editing questions.
 * Get ALL created categories, even if unused
 */
export async function getUserCategories(): Promise<QuestionCategory[]> {
  const res = await Api.get(`/api/quizzes/user/categories`);
  return res.data;
}

/**
 * get teacher's questions to display in the gallery. Do not include answers
 * @param categoryIds
 */
export async function getUserQuestions(
  categoryIds?: string[],
): Promise<Question[]> {
  const params = new URLSearchParams();
  categoryIds?.forEach((categoryId: string) =>
    params.append("categories", categoryId),
  );
  const res = await Api.get(
    `/api/quizzes/user/questions${params.toString() ? `?${params.toString()}` : ""}`,
  );
  return res.data;
}

/**
 * get full question with answers. Will be displayed to teacher - include
 * correctness of answers.
 * @param questionId
 */
export async function getFullQuestion(questionId: string): Promise<Question> {
  const res = await Api.get(`/api/quizzes/question/${questionId}/full`);
  return res.data;
}

/**
 * create a new category (while editing/creating a question)
 * @param categoryName
 */
export async function createQuestionCategory(
  categoryName: string,
): Promise<QuestionCategory> {
  const res = await Api.post("/api/quizzes/question/category", {
    name: categoryName,
  });
  if (res.status === 200) {
    return res.data;
  } else throw res.data as ErrorResponse;
}
/**
 * Create new question.
 * @param content
 * @param answers
 * @param categoryIds
 */
export async function createQuestion(
  content: string,
  answers: Answer[],
  categoryIds: string[],
): Promise<Question> {
  const res = await Api.post("/api/quizzes/question", {
    content,
    answers,
    categoryIds,
  });
  if (res.status === 200) {
    return res.data;
  }
  throw res.data as ErrorResponse;
}

/**
 * update already created question - all data is replaced - not checked was
 * modified (but can be)
 * @param questionId
 * @param content
 * @param answers
 * @param categoryIds
 */
export async function updateQuestion(
  questionId: string,
  content: string,
  answers: Answer[],
  categoryIds: string[],
): Promise<Question> {
  const res = await Api.put(`/api/quizzes/question/${questionId}`, {
    content,
    answers,
    categoryIds,
  });
  if (res.status === 200) {
    return res.data;
  }
  throw res.data as ErrorResponse;
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

export async function getStudentUnsolvedExercises(
  studentId: string,
): Promise<ExerciseBrief[]> {
  if (!studentId) {
    return [];
  }

  const { data } = await Api.get<ExerciseBrief[]>(
    `/api/exercises/unsolved-by-user/${studentId}`,
  );

  return data;
}

export async function getStudentWithTeacherExercises(
  teacherId: string,
  studentId: string,
  courseId?: string,
): Promise<AssignmentTask[]> {
  if (!studentId) {
    return [];
  }

  const { data } = await Api.get<AssignmentTask[]>(
    `/api/teacher/${teacherId}/students/${studentId}/exercises`,
    {
      params: {
        courseId: courseId ?? undefined,
      },
    },
  );

  return data;
}

export async function getStudentWithTeacherQuizzes(
  teacherId: string,
  studentId: string,
  courseId?: string,
): Promise<QuizTask[]> {
  if (!studentId) {
    return [];
  }

  const { data } = await Api.get<QuizTask[]>(
    `/api/teacher/${teacherId}/students/${studentId}/quizzes`,
    {
      params: {
        courseId: courseId ?? undefined,
      },
    },
  );

  return data;
}

export async function getExercises(
  userId: string,
  activeRole: string | null,
  preferredCourseId: string | null,
  preferredStudentId?: string | null,
): Promise<ExerciseBrief[]> {
  if (!userId) {
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

  const { data } = await Api.get<ExerciseBrief[]>(endpoint, {
    params: {
      courseId: preferredCourseId,
      studentId: preferredStudentId ?? undefined,
    },
  });

  return data;
}

export async function getTeacherUpcomingClasses(
  teacherId: string,
  startParam: string,
  endParam: string,
): Promise<ClassSchedule[]> {
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

export async function getTeacherCourses(
  teacherId: string,
): Promise<ClassBrief[]> {
  if (!teacherId) {
    return [];
  }

  const { data } = await Api.get<ClassBrief[]>(
    `/api/teacher/${teacherId}/courses`,
  );

  return (data ?? [])
    .map((c: any) => mapApiCourseToCourseBrief(c, teacherId))
    .filter((c: ClassBrief | null): c is ClassBrief => !!c);
}

export async function getStudentParticipations(
  studentId: string,
): Promise<ClassBrief[]> {
  if (!studentId) {
    return [];
  }

  const { data } = await Api.get<ClassBrief[]>(
    `/api/students/${studentId}/participations`,
  );

  return data
    .map(mapParticipationToCourseBrief)
    .filter((c: any): c is ClassBrief => !!c);
}

export async function getStudentCoursesWithSpecificTeacher(
  studentId: string,
  teacherId: string,
  signal?: AbortSignal,
): Promise<ClassBrief[]> {
  if (!studentId || !teacherId) {
    return [];
  }

  const { data } = await Api.get<ClassBrief[]>(
    `/api/teacher/${teacherId}/students/${studentId}/courses`,
    { signal },
  );

  return (data ?? [])
    .map((c: any) => mapApiCourseToCourseBrief(c, teacherId))
    .filter((c: ClassBrief | null): c is ClassBrief => !!c);
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

export async function getClassBrief(classId: string): Promise<ClassBriefDto> {
  if (!classId) {
    return Promise.reject("No classId provided");
  }

  const { data } = await Api.get<ClassBriefDto>(`/api/classes/${classId}`);

  return data;
}
