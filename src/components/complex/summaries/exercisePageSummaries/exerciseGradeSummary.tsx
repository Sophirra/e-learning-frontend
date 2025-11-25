import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import Summary from "@/components/complex/summaries/summary.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useUser } from "@/features/user/UserContext.tsx";
import { GradeExercisePopup } from "@/components/complex/popups/exercise/gradeExercisePopup.tsx";
import type { Exercise } from "@/api/types.ts";

export function ExerciseGradeSummary({
  exercise,
}: {
  exercise: Exercise | null;
}) {
  const { user } = useUser();

  return (
    <Summary
      label={"Grades"}
      labelIcon={icons.PenTool}
      canHide={false}
      customButton={() =>
        user?.activeRole === "teacher" && exercise?.id ? (
          <GradeExercisePopup
            exerciseId={exercise.id}
            readyToGrade={!exercise.graded}
          />
        ) : null
      }
    >
      <div className="flex flex-col gap-2 p-2 text-xs font-normal ml-1">
        {exercise?.graded && exercise.grade !== undefined ? (
          <div className="flex flex-row gap-0 ml-2 mt-2">
            <Label className="mr-4">{exercise.grade}</Label>
            <Label className="font-light">{exercise?.comments}</Label>
          </div>
        ) : (
          <Label className="mt-2 ml-2 font-light">No grade yet.</Label>
        )}
      </div>
    </Summary>
  );
}
