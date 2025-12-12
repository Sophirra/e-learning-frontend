import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import Summary from "@/components/complex/summaries/summary.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useUser } from "@/features/user/UserContext.tsx";
import type { Exercise } from "@/api/types.ts";
import { CreateExercisePopup } from "@/components/complex/popups/exercise/createExercisePopup.tsx";
import { toast } from "sonner";
import { submitSolution } from "@/api/api calls/apiExercises.ts";

export function ExerciseDetailsSummary({
  exercise,
}: {
  exercise: Exercise | null;
}) {
  const { user } = useUser();

  return (
    <Summary
      label={exercise?.name || "Untitled Exercise"}
      labelIcon={icons.Clipboard}
      canHide={false}
      customButton={() =>
        user?.activeRole === "student" ? (
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={async () => {
              if (exercise?.id != null) {
                try {
                  await submitSolution(exercise.id);
                  toast.success("Exercise submitted!");
                } catch (error) {
                  toast.error("Error submitting exercise.");
                  console.error("Submit error:", error);
                }
              }

              console.log("Submitting exercise:", exercise?.id);
            }}
          >
            Submit
            <icons.Send className="w-4 h-4" />
          </Button>
        ) : user?.activeRole === "teacher" ? (
          exercise?.status !== "Unsolved" ? (
            <Button variant="ghost" disabled={true}>
              <icons.Edit />
              Edit
            </Button>
          ) : (
            <CreateExercisePopup
              selectedExercise={exercise === null ? undefined : exercise}
              editing={true}
            />
          )
        ) : (
          // When teacher is in edit mode
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => {
              console.log("Submitting exercise:", exercise?.id);
            }}
          >
            Save
            <icons.Save className="w-4 h-4" />
          </Button>
        )
      }
    >
      <div className="flex flex-col gap-2 p-2 text-xs font-light ml-2 pl-2">
        {exercise?.instruction ? (
          <Label className="font-light">{exercise.instruction}</Label>
        ) : (
          <Label className="font-light">
            No instructions provided for this exercise.
          </Label>
        )}
      </div>
    </Summary>
  );
}
