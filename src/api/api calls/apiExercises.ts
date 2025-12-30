import type { Exercise, ExerciseBrief, FileBrief } from "@/types.ts";
import Api, { getUserId } from "@/api/api.ts";
import type { ErrorResponse } from "react-router-dom";

export const uploadExerciseSolution = async (
  exerciseId: string,
  file: File,
): Promise<FileBrief> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await Api.post(
    `/api/exercises/${exerciseId}/solution`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );

  if (response.status === 200 || response.status === 201)
    return response.data as FileBrief;

  throw response.data as ErrorResponse;
};

/**
 * Adds a grade to an assignment.
 * @param assignmentId
 * @param grade
 * @param comments
 */
export async function addExerciseGrade(
  assignmentId: string,
  grade: number,
  comments?: string,
): Promise<void> {
  const res = await Api.post("/api/exercises/grade", {
    assignmentId,
    grade,
    comments,
  });
  if (res.status === 201 || res.status === 200) return;
  else throw res.data as ErrorResponse;
}

export async function getStudentUnsolvedExercises(
  courseIds?: string[],
  studentId?: string,
): Promise<ExerciseBrief[]> {
  if (!studentId) {
    studentId = getUserId() || undefined;
    if(!studentId) throw ("No student id found")
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

export async function copyExercise(exerciseId: string, classId: string) {
  const res = await Api.post(`/api/exercises/${exerciseId}/copy`, { classId });
  if (res.status === 201 || res.status === 200) return;
  else throw res.data as ErrorResponse;
}

export async function createExercise(
  classId: string,
  instructions: string,
  fileIds?: string[],
) {
  const res = await Api.post("/api/exercises", {
    classId,
    instructions,
    fileIds,
  });
  if (res.status === 201 || res.status === 200) return;
  else throw res.data as ErrorResponse;
}

export async function updateExercise(
  exerciseId: string,
  instructions: string,
  fileIds?: string[],
) {
  const res = await Api.put(`/api/exercises/${exerciseId}`, {
    instructions,
    fileIds,
  });
  if (res.status === 200 || res.status === 201 || res.status === 204) return;
  else throw res.data as ErrorResponse;
}

export async function getClassExercises(classId: string): Promise<Exercise[]> {
  if (!classId) {
    return Promise.reject("No classId provided");
  }

  const { data } = await Api.get(`/api/classes/${classId}/exercises`);

  return data;
}

export async function submitSolution(exerciseId: string) {
  const res = await Api.post(`/api/exercises/${exerciseId}/submit`, {
    exerciseId,
  });
  if (res.status === 200 || res.status === 204) return;
  else throw res.data as ErrorResponse;
}
