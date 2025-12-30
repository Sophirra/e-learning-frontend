import Api from "@/api/api.ts";
import type { Course, CourseWidget, PagedResult } from "@/types.ts";

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
  pageSize: number;
  pageNumber: number;
  categories?: string[];
  levels?: string[];
  languages?: string[];
  priceFrom?: number;
  priceTo?: number;
  teacherId?: string;
  query?: string;
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