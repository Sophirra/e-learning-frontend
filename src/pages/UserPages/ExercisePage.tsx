import { useCallback, useEffect, useState } from "react";
import { Content } from "@/components/ui/content.tsx";
import { useUser } from "@/features/user/UserContext.tsx";
import { NavigationBar } from "@/components/complex/navigationBar.tsx";
import CourseFilter from "@/components/complex/courseFilter.tsx";
import ExerciseTile from "@/components/complex/exerciseTile.tsx";
import { ExerciseTitle } from "@/components/complex/summaries/exercisePageSummaries/exerciseTitle.tsx";
import { ExerciseAttachedFilesSummary } from "@/components/complex/summaries/exercisePageSummaries/exerciseAttachedFilesSummary.tsx";
import { ExerciseSolutionSummary } from "@/components/complex/summaries/exercisePageSummaries/exerciseSolutionSummary.tsx";
import { ExerciseGradeSummary } from "@/components/complex/summaries/exercisePageSummaries/exerciseGradeSummary.tsx";
import { getUserId } from "@/api/api.ts";
import { getExercises } from "@/api/apiCalls.ts";
import { LoadingTile } from "@/components/complex/loadingTile.tsx";
import type { Exercise } from "@/api/types.ts";

export type Role = "teacher" | "student";
export type Mode = "view" | "edit";

export function ExercisePage() {
  const { user } = useUser();
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<
    string | null
  >(null);
  const [pageMode, setAssignmentPageMode] = useState<Mode>("view");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const activeRole = user?.activeRole ?? null;

  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;

    const fetchExercises = async () => {
      const data = await getExercises(
        userId,
        activeRole,
        selectedCourseId,
        selectedStudentId,
      );
      setExercises(data);
    };

    fetchExercises().then();
  }, [activeRole, selectedCourseId, selectedStudentId]);

  const handleSelectAssignmentId = useCallback((id: string | null) => {
    setSelectedAssignmentId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div className="bg-white h-screen">
      <NavigationBar />
      <Content>
        <CourseFilter
          student={user?.activeRole == "student"}
          setSelectedStudentId={setSelectedStudentId}
          selectedStudentId={selectedStudentId}
          setSelectedCourseId={setSelectedCourseId}
          selectedCourseId={selectedCourseId}
          setupClassButton={false}
        />
        <div className="flex flex-row gap-8 p-4">
          {/*overflow-y-auto">*/}
          <div className="w-1/4 sticky top-0 self-start h-fit space-y-2">
            {exercises === null ||
            exercises === undefined ||
            exercises.length === 0 ? (
              <LoadingTile
                text={"No exercise available for the selected course."}
              />
            ) : (
              exercises.map((assignment) => (
                <ExerciseTile
                  exercise={assignment}
                  selectedExerciseId={selectedAssignmentId}
                  setSelectedExerciseId={handleSelectAssignmentId}
                />
              ))
            )}
          </div>

          <div className="w-3/4 space-y-8">
            {exercises.length !== 0 &&
            selectedAssignmentId &&
            exercises.some((e) => e.id === selectedAssignmentId) ? (
              <>
                <ExerciseTitle
                  exercise={
                    exercises.find((a) => a.id === selectedAssignmentId) || null
                  }
                  pageMode={pageMode}
                  setPageMode={setAssignmentPageMode}
                />
                <ExerciseAttachedFilesSummary
                  exercise={
                    exercises.find((a) => a.id === selectedAssignmentId) || null
                  }
                  pageMode={pageMode}
                />
                <ExerciseSolutionSummary
                  assignment={
                    exercises.find((a) => a.id === selectedAssignmentId) || null
                  }
                />
                <ExerciseGradeSummary
                  exercise={
                    exercises.find((a) => a.id === selectedAssignmentId) || null
                  }
                />
              </>
            ) : (
              <LoadingTile text={"Select an assignment to view its details."} />
            )}
          </div>
        </div>
      </Content>
    </div>
  );
}
