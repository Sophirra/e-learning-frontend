import { useEffect, useState } from "react";
import CourseFilter from "@/components/complex/courseFilter.tsx";
import { useUser } from "@/features/user/UserContext.tsx";
import type { Exercise } from "@/api/types.ts";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { getExercises } from "@/api/apiCalls.ts";
import Summary from "@/components/complex/summaries/summary.tsx";
import { LoadingTile } from "@/components/complex/tiles/loadingTile.tsx";
import { getUserId } from "@/api/api.ts";
import { cn } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button.tsx";

export function ExerciseGallery({
  selected,
  setSelected,
}: {
  enableSelect: boolean;
  selected?: Exercise | null;
  setSelected?: (exercise: Exercise) => void;
}) {
  const { user } = useUser();
  const userId = getUserId();
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    fetchExercises();
  }, [selectedStudentId, selectedCourseId]);

  async function fetchExercises() {
    if (!userId) {
      return;
    }
    try {
      const data = await getExercises(
        userId,
        user?.activeRole,
        selectedStudentId ? selectedStudentId : undefined,
        selectedCourseId ? selectedCourseId : undefined,
      );
      setExercises(data);
      console.log("set quizzes: ", data);
    } catch (e) {
      console.error("Error fetching quizzes:", e);
    }
  }
  return (
    <div className="flex flex-col gap-4">
      <CourseFilter
        student={user?.activeRole == "student"}
        setSelectedStudentId={setSelectedStudentId}
        selectedStudentId={selectedStudentId}
        setSelectedCourseId={setSelectedCourseId}
        selectedCourseId={selectedCourseId}
        setupClassButton={false}
      />
      <Summary
        label={"Quizzes"}
        labelIcon={icons.Quiz}
        canHide={user?.activeRole === "teacher"}
      >
        {exercises.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-150 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
            {exercises.map((exercise) => (
              <Button
                variant={"ghost"}
                className={cn(
                  "shadow-md flex flex-col gap-1 h-1/1 items-start ",
                  selected?.id === exercise.id && "bg-slate-200",
                )}
                onClick={() => setSelected && setSelected(exercise)}
              >
                <h3 className="text-lg font-bold truncate">{exercise.name}</h3>
                <p className={"text-sm text-gray-800 font-semibold"}>
                  {exercise.instruction}
                </p>
                <p className="text-m text-gray-500 font-medium">
                  {exercise.status}
                </p>
              </Button>
            ))}
          </div>
        ) : (
          <LoadingTile text={"No exercises found"} />
        )}
      </Summary>
      <div />
    </div>
  );
}
