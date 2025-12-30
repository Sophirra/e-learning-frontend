import Api from "@/api/api.ts";
import type {ErrorResponse} from "react-router-dom";
import type { Question, Quiz, QuizBrief, QuizSolution } from "@/types.ts";

/**
 * Gets all teacher/student quizzes to display in the gallery
 * @param studentId
 * @param courseId
 * @param searchQuery
 * @param classId
 */
export async function getQuizzes(
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

  const res = await Api.get(
    `/api/quizzes/${params ? `?${params.toString()}` : ""}`,
  );

  if (res.status === 204 || !res.data) return [];

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
  const res = await Api.get(`/api/quizzes/${quizId}/questions`);
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

export async function createQuiz(
  name: string,
  questionIds: string[],
  classId: string,
) {
  const res = await Api.post("/api/quizzes", { name, questionIds, classId });
  if (res.status === 201 || res.status === 200) return;
  else throw res.data as ErrorResponse;
}

export async function copyQuiz(quizId: string, classId: string) {
  const res = await Api.post(`/api/quizzes/${quizId}/copy`, { classId });
  if (res.status === 201 || res.status === 200) return;
  else throw res.data as ErrorResponse;
}

export async function updateQuiz(
  quizId: string,
  name: string,
  questionIds: string[],
) {
  const res = await Api.put(`/api/quizzes/${quizId}`, { name, questionIds });
  if (res.status === 200 || res.status === 204) return;
  else throw res.data as ErrorResponse;
}