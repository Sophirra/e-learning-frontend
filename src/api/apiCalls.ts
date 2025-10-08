import Api from "@/api/api.ts";
import type { ApiDayAvailability } from "@/components/complex/weekSchedule.tsx";
import type {
    Course, CourseBrief, CourseWidget,
    Teacher,
    TeacherAvailability,
    TeacherReview,
} from "@/api/types.ts";

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
    courseId: string
): Promise<TeacherAvailability[]> => {
    const { data } = await Api.get<TeacherAvailability[]>(
        `/api/courses/${courseId}/teacher/availability`
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
    courseId: string
): Promise<ApiDayAvailability[]> => {
    const { data } = await Api.get<ApiDayAvailability[]>(
        `/api/courses/${courseId}/teacher/availability`
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
    teacherId: string
): Promise<TeacherReview[]> => {
    const { data } = await Api.get<TeacherReview[]>(
        `/api/teacher/${teacherId}/reviews`
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
    teacherId: string
): Promise<TeacherAvailability[]> => {
    const { data } = await Api.get<TeacherAvailability[]>(
        `/api/teacher/${teacherId}/availability`
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
 * Fetches all upcoming in 14 days classes for the currently authenticated user from the API.
 *
 * The API endpoint `/api/classes/upcoming` automatically determines whether the user
 * is a **teacher** or **student** based on their JWT roles and returns only the relevant classes.
 *
 * Each item includes:
 * - `courseId` – the unique identifier of the course.
 * - `courseName` – the name of the course.
 * - `startTime` – the class start date and time (converted from ISO string to `Date`).
 * - `teacherId` – the identifier of the teacher assigned to the course.
 *
 * @returns {Promise<CourseBrief[]>} A promise that resolves to a list of upcoming classes.
 *
 * @remarks
 * The returned `startTime` field is converted from an ISO 8601 string
 * to a native JavaScript `Date` object for easier date manipulation in the frontend.
 */

export const getCourseBriefs = async (): Promise<CourseBrief[]> => {
    const { data } = await Api.get<CourseBrief[]>(`/api/classes/upcoming`);

    return data.map((c) => ({
        ...c,
        startTime: new Date(c.startTime),
    }));
};
