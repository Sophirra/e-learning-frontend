import type { Exercise, ExerciseBrief, FileBrief } from "@/types.ts";
import Api, { getUserId } from "@/api/api.ts";
import type { ErrorResponse } from "react-router-dom";

/**
 * Uploads a solution file for a specific exercise.
 *
 * @param {string} exerciseId - The unique identifier of the exercise.
 * @param {File} file - The solution file to upload.
 * @returns {Promise<FileBrief>} A promise that resolves to a brief description of the uploaded file.
 */
export const uploadExerciseSolution = async (
  exerciseId: string,
  file: File,
): Promise<FileBrief> => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await Api.post(
    `/api/exercises/${exerciseId}/solution`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );

  return data as FileBrief;
};

/**
 * Submits a grade for an exercise along with optional comments.
 *
 * @param {string} assignmentId - The unique identifier for the exercise assignment.
 * @param {number} grade - The grade to be assigned.
 * @param {string} [comments] - Optional comments.
 * @return {Promise<void>} A promise that resolves when the grade has been successfully submitted.
 */
export async function addExerciseGrade(
  assignmentId: string,
  grade: number,
  comments?: string,
): Promise<void> {
  await Api.post("/api/exercises/grade", {
    assignmentId,
    grade,
    comments,
  });
}

/**
 * Retrieves a list of unsolved exercises for a specific student, optionally filtered by courses.
 *
 * @param {string[]} [courseIds] - An optional array of course IDs.
 * @param {string} [studentId] - An optional student ID.
 * @return {Promise<ExerciseBrief[]>} A promise that resolves to an array of unsolved exercises for the student.
 */
export async function getStudentUnsolvedExercises(
  courseIds?: string[],
  studentId?: string,
): Promise<ExerciseBrief[]> {
  if (!studentId) {
    studentId = getUserId() || undefined;
    if (!studentId) throw "No student id found";
  }
  const { data } = await Api.get(
    `/api/exercises/unsolved-by-user/${studentId}`,
    {
      params: {
        courseIds: courseIds ?? undefined,
      },
    },
  );

  return data;
}

/**
 * Fetches a list of exercises that are ready to be graded based on the provided student and course filters.
 *
 * @param {string[]} [studentIds] - An optional array of student IDs.
 * @param {string[]} [courseIds] - An optional array of course IDs.
 * @return {Promise<ExerciseBrief[]>} A promise that resolves to an array of ExerciseBrief objects representing the exercises ready to be graded.
 */
export async function getExercisesReadyToGrade(
  studentIds?: string[],
  courseIds?: string[],
): Promise<ExerciseBrief[]> {
  const { data } = await Api.get(`/api/teacher/exercises-to-grade`, {
    params: {
      studentIds: studentIds ?? undefined,
      courseIds: courseIds ?? undefined,
    },
  });

  return data;
}

/**
 * Retrieves exercises assigned by a specific teacher to a specific student, optionally filtered by a course.
 *
 * @param {string} teacherId - The unique identifier of the teacher.
 * @param {string} studentId - The unique identifier of the student.
 * @param {string} [courseId] - Optional unique identifier of the course.
 * @return {Promise<ExerciseBrief[]>} A promise that resolves to an array of exercise briefs assigned by the teacher to the student.
 */
export async function getStudentWithTeacherExercises(
  teacherId: string,
  studentId: string,
  courseId?: string,
): Promise<ExerciseBrief[]> {
  if (!studentId) {
    return [];
  }

  const { data } = await Api.get(
    `/api/teacher/${teacherId}/students/${studentId}/exercises`,
    {
      params: {
        courseId: courseId ?? undefined,
      },
    },
  );

  return data;
}

/**
 * Fetches a list of exercises based on the user's role and selected filters.
 *
 * @param {string} userId - The unique identifier of the user requesting exercises.
 * @param {string} [activeRole] - The role of the user, such as "student" or "teacher".
 * @param {string} [preferredCourseId] - An optional identifier for the preferred course.
 * @param {string} [preferredStudentId] - An optional identifier for a specific student, used only for teacher endpoint.
 * @return {Promise<Exercise[]>} A promise that resolves to an array of exercises.
 */
export async function getExercises(
  userId: string,
  activeRole?: string,
  preferredCourseId?: string,
  preferredStudentId?: string,
): Promise<Exercise[]> {
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

  const { data } = await Api.get(endpoint, {
    params: {
      courseId: preferredCourseId,
      studentId: preferredStudentId ?? undefined,
    },
  });

  return data;
}

/**
 * Creates a copy of the specified exercise for a given class.
 *
 * @param {string} exerciseId - The unique identifier of the exercise.
 * @param {string} classId - The unique identifier of the class.
 * @return {Promise<void>} A promise that resolves when the copy operation is successful, or rejects with an error response if it fails.
 */
export async function copyExercise(
  exerciseId: string,
  classId: string,
): Promise<void> {
  const res = await Api.post(`/api/exercises/${exerciseId}/copy`, { classId });
  if (res.status === 201 || res.status === 200) return;
  else throw res.data as ErrorResponse;
}

/**
 * Creates a new exercise for the specified class with given instructions and optional file attachments.
 *
 * @param {string} classId - The identifier of the class.
 * @param {string} instructions - The instructions for the exercise.
 * @param {string[]} [fileIds] - Optional array of file identifiers to attach to the exercise.
 * @return {Promise<void>} A promise that resolves once the exercise has been successfully created.
 */
export async function createExercise(
  classId: string,
  instructions: string,
  fileIds?: string[],
): Promise<void> {
  await Api.post("/api/exercises", {
    classId,
    instructions,
    fileIds,
  });
}

/**
 * Updates the details of an exercise by its ID.
 *
 * @param {string} exerciseId - The unique identifier of the exercise to update.
 * @param {string} instructions - The updated instructions for the exercise.
 * @param {string[]} [fileIds] - Optional array of file IDs associated with the exercise.
 * @return {Promise<void>} A promise that resolves when the exercise update is complete.
 */
export async function updateExercise(
  exerciseId: string,
  instructions: string,
  fileIds?: string[],
) {
  await Api.put(`/api/exercises/${exerciseId}`, {
    instructions,
    fileIds,
  });
}

/**
 * Fetches the list of exercises for a specific class.
 *
 * @param {string} classId - The unique identifier of the class.
 * @return {Promise<Exercise[]>} A promise that resolves to an array of exercises associated with the class.
 */
export async function getClassExercises(classId: string): Promise<Exercise[]> {
  if (!classId) {
    return Promise.reject("No classId provided");
  }

  const { data } = await Api.get(`/api/classes/${classId}/exercises`);

  return data;
}

/**
 * Submits the solution for a specified exercise.
 *
 * @param {string} exerciseId - The unique identifier of the exercise.
 * @return {Promise<void>} A promise that resolves when the solution is successfully submitted.
 */
export async function submitSolution(exerciseId: string): Promise<void> {
  await Api.post(`/api/exercises/${exerciseId}/submit`, {
    exerciseId,
  });
}
