import { useCallback, useEffect, useState } from "react";
import { Content } from "@/components/ui/content.tsx";
import { useUser } from "@/lib/user/UserContext.tsx";
import { NavigationBar } from "@/components/complex/bars/navigationBar.tsx";
import CourseFilter from "@/components/complex/courseFilter.tsx";
import ExerciseTile from "@/components/complex/tiles/exerciseTile.tsx";
import { ExerciseDetailsSummary } from "@/components/complex/summaries/exercisePageSummaries/exerciseDetailsSummary.tsx";
import { ExerciseAttachedFilesSummary } from "@/components/complex/summaries/exercisePageSummaries/exerciseAttachedFilesSummary.tsx";
import { ExerciseSolutionSummary } from "@/components/complex/summaries/exercisePageSummaries/exerciseSolutionSummary.tsx";
import { ExerciseGradeSummary } from "@/components/complex/summaries/exercisePageSummaries/exerciseGradeSummary.tsx";
import { getUserId } from "@/api/api.ts";
import { LoadingTile } from "@/components/complex/tiles/loadingTile.tsx";
import type { Exercise } from "@/types.ts";
import { getExercises } from "@/api/api calls/apiExercises.ts";
import { toast } from "sonner";

export function ExercisePage() {
  const { user } = useUser();
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(
    null,
  );
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const activeRole = user?.activeRole;

  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;

    const fetchExercises = async () => {
      try {
        const data = await getExercises(
          userId,
          activeRole,
          selectedCourseId !== null ? selectedCourseId : undefined,
          selectedStudentId !== null ? selectedStudentId : undefined,
        );
        setExercises(data);
      } catch (e: any) {
        toast.error("Error fetching exercises: " + e.message);
      }
    };

    fetchExercises().then();
  }, [activeRole, selectedCourseId, selectedStudentId]);

  const handleSelectExerciseId = useCallback((id: string | null) => {
    setSelectedExerciseId((prev) => (prev === id ? null : id));
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
          <div className="w-1/4 sticky top-0 self-start h-fit space-y-2">
            {exercises === null ||
            exercises === undefined ||
            exercises.length === 0 ? (
              <LoadingTile
                text={"No exercise available for the selected course."}
              />
            ) : (
              exercises.map((exercise) => (
                <ExerciseTile
                  exercise={exercise}
                  selectedExerciseId={selectedExerciseId}
                  setSelectedExerciseId={handleSelectExerciseId}
                />
              ))
            )}
          </div>

          <div className="w-3/4 space-y-8">
            {exercises.length !== 0 &&
            selectedExerciseId &&
            exercises.some((e) => e.id === selectedExerciseId) ? (
              <>
                <ExerciseDetailsSummary
                  exercise={
                    exercises.find((a) => a.id === selectedExerciseId) || null
                  }
                />
                <ExerciseAttachedFilesSummary
                  exercise={
                    exercises.find((a) => a.id === selectedExerciseId) || null
                  }
                />
                <ExerciseSolutionSummary
                  exercise={
                    exercises.find((a) => a.id === selectedExerciseId) || null
                  }
                />
                <ExerciseGradeSummary
                  exercise={
                    exercises.find((a) => a.id === selectedExerciseId) || null
                  }
                />
              </>
            ) : (
              <LoadingTile text={"Select an exercise to view its details."} />
            )}
          </div>
        </div>
      </Content>
    </div>
  );
}
