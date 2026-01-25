import Api from "@/api/api.ts";
import type { Question, Quiz, QuizBrief, QuizSolution } from "@/types.ts";

/**
 * Retrieves a list of quizzes based on the specified role, filters, and search criteria.
 *
 * @param {string} role - The role of the user, either "teacher" or "student". Determines the endpoint.
 * @param {string} [studentId] - Optional ID of the student.
 * @param {string} [courseId] - Optional ID of the course.
 * @param {string} [searchQuery] - Optional search query to filter quizzes by title or description.
 * @param {string} [classId] - Optional ID of the class.
 * @return {Promise<QuizBrief[]>} A promise that resolves to an array of quiz summaries.
 */
export async function getQuizzes(
  role: string,
  studentId?: string,
  courseId?: string,
  searchQuery?: string,
  classId?: string,
): Promise<QuizBrief[]> {
  const params = new URLSearchParams();
  studentId && params.append("studentId", studentId);
  courseId && params.append("courseId", courseId);
  searchQuery && params.append("searchQuery", searchQuery);
  classId && params.append("classId", classId);

  let res;
  if (role == "teacher") {
    res = await Api.get(
      `/api/quizzes/teacher/${params ? `?${params.toString()}` : ""}`,
    );
  } else {
    res = await Api.get(
      `/api/quizzes/student/${params ? `?${params.toString()}` : ""}`,
    );
  }
  return res.data;
}

/**
 * Fetches a quiz by its unique identifier.
 *
 * @param {string} quizId - The unique identifier of the quiz.
 * @return {Promise<Quiz>} A promise that resolves to the quiz data.
 */
export async function getQuiz(quizId: string): Promise<Quiz> {
  const { data } = await Api.get(`/api/quizzes/${quizId}`);
  return data;
}

/**
 * Fetches the list of questions for a specific quiz.
 *
 * @param {string} quizId - The unique identifier of the quiz.
 * @return {Promise<Question[]>} A promise that resolves to an array of Question objects for the specified quiz.
 */
export async function getQuizQuestions(quizId: string): Promise<Question[]> {
  const { data } = await Api.get(`/api/quizzes/${quizId}/questions`);
  return data;
}

/**
 * Submits a quiz solution and returns a score.
 *
 * @param {QuizSolution} solution - Quiz ID and answers in a solution object.
 * @return {Promise<number>} A promise that resolves to the score received after submitting the solution.
 */
export async function submitQuiz(solution: QuizSolution): Promise<number> {
  const { data } = await Api.post(
    `/api/quizzes/${solution.quizId}/solution`,
    solution,
  );
  return data;
}

/**
 * Creates a new quiz.
 *
 * @param {string} name - The name of the quiz to be created.
 * @param {string[]} questionIds - An array of question IDs.
 * @param {string} classId - The ID of the class associated with the quiz.
 * @return {Promise<void>} A promise that resolves once the quiz has been successfully created.
 */
export async function createQuiz(
  name: string,
  questionIds: string[],
  classId: string,
) {
  await Api.post("/api/quizzes", { name, questionIds, classId });
}

/**
 * Copies an existing quiz to a specified class.
 *
 * @param {string} quizId - The unique identifier of the quiz.
 * @param {string} classId - The unique identifier of the class.
 * @return {Promise<void>} A promise that resolves when the quiz copy operation is completed.
 */
export async function copyQuiz(quizId: string, classId: string) {
  await Api.post(`/api/quizzes/${quizId}/copy`, { classId });
}

/**
 * Updates an existing quiz with a new name and a list of question IDs.
 *
 * @param {string} quizId - The unique identifier of the quiz.
 * @param {string} name - The new name for the quiz.
 * @param {string[]} questionIds - An array of question IDs.
 * @return {Promise<void>} A promise that resolves when the quiz update is successful.
 */
export async function updateQuiz(
  quizId: string,
  name: string,
  questionIds: string[],
): Promise<void> {
  await Api.put(`/api/quizzes/${quizId}`, { name, questionIds });
}
