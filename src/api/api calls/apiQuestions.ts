import type { Answer, Question, QuestionCategory } from "@/types.ts";
import Api from "@/api/api.ts";

/**
 * Fetches the list of question categories associated with the user.
 *
 * @return {Promise<QuestionCategory[]>} A promise that resolves to an array of question categories.
 */
export async function getUserCategories(): Promise<QuestionCategory[]> {
  const res = await Api.get(`/api/quizzes/user/categories`);
  return res.data;
}

/**
 * Fetches user questions filtered by the provided category IDs, if any.
 *
 * @param {string[]} [categoryIds] An optional array of category IDs to filter the questions.
 * @return {Promise<Question[]>} A promise that resolves to an array of Question objects.
 */
export async function getUserQuestions(
  categoryIds?: string[],
): Promise<Question[]> {
  const params = new URLSearchParams();
  categoryIds?.forEach((categoryId: string) =>
    params.append("categories", categoryId),
  );
  const { data } = await Api.get(
    `/api/quizzes/user/questions${params.toString() ? `?${params.toString()}` : ""}`,
  );
  return data;
}

/**
 * Retrieves the full details of a specific question by its ID.
 *
 * @param {string} questionId - The unique identifier of the question.
 * @return {Promise<Question>} A promise that resolves to the full question details.
 */
export async function getFullQuestion(questionId: string): Promise<Question> {
  const { data } = await Api.get(`/api/quizzes/question/${questionId}/full`);
  return data;
}

/**
 * Creates a new question category with the specified name.
 *
 * @param {string} categoryName - The name of the question category.
 * @return {Promise<QuestionCategory>} A promise that resolves to the created QuestionCategory object.
 */
export async function createQuestionCategory(
  categoryName: string,
): Promise<QuestionCategory> {
  const { data } = await Api.post("/api/quizzes/question/category", {
    name: categoryName,
  });
  return data;
}

/**
 * Creates a new question.
 *
 * @param {string} content - The text content of the question.
 * @param {Answer[]} answers - An array of answers.
 * @param {string[]} categoryIds - An array of categories.
 * @return {Promise<Question>} A promise that resolves to the created question object.
 */
export async function createQuestion(
  content: string,
  answers: Answer[],
  categoryIds: string[],
): Promise<Question> {
  const { data } = await Api.post("/api/quizzes/question", {
    content,
    answers,
    categoryIds,
  });
  return data;
}

/**
 * Updates the details of a question.
 *
 * @param {string} questionId - The unique identifier of the question.
 * @param {string} content - The updated text content.
 * @param {Answer[]} answers - An array of updated answers.
 * @param {string[]} categoryIds - An array of updated categories.
 * @return {Promise<Question>} A promise that resolves to the updated question object.
 */
export async function updateQuestion(
  questionId: string,
  content: string,
  answers: Answer[],
  categoryIds: string[],
): Promise<Question> {
  const { data } = await Api.put(`/api/quizzes/question/${questionId}`, {
    content,
    answers,
    categoryIds,
  });
  return data;
}
