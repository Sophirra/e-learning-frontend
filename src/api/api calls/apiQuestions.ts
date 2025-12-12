import type { Answer, Question, QuestionCategory } from "@/api/types.ts";
import Api from "@/api/api.ts";
import type {ErrorResponse} from "react-router-dom";

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