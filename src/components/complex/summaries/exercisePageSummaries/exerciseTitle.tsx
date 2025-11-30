import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import Summary from "@/components/complex/summaries/summary.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import type { Exercise, Mode } from "@/pages/UserPages/ExercisePage.tsx";
import { useUser } from "@/features/user/UserContext.tsx";
import {submitSolution} from "@/api/apiCalls.ts";
import type {ExerciseBrief} from "@/api/types.ts";
import {toast} from "sonner";

export function ExerciseTitle({
  exercise,
  pageMode,
  setPageMode,
}: {
  exercise: ExerciseBrief | null;
  pageMode: Mode;
  setPageMode: (mode: Mode) => void;
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
                        toast.success("Zadanie zostało poprawnie wysłane!");
                    } catch (error) {
                        toast.error("Wysyłanie zadania nie powiodło się.");
                        console.error("Submit error:", error);
                    }
                }

                console.log("Submitting exercise:", exercise?.id);
            }}
          >
            Submit
            <icons.Send className="w-4 h-4" />
          </Button>
        ) : user?.activeRole === "teacher" && pageMode === "view" ? (
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={async () => {
                if (exercise?.id != null) {
                    try {
                        await submitSolution(exercise.id);
                        toast.success("Zadanie zostało poprawnie wysłane!");
                    } catch (error) {
                        toast.error("Wysyłanie zadania nie powiodło się.");
                        console.error("Submit error:", error);
                    }
                }

                console.log("Submitting exercise:", exercise?.id);
            }}
          >
            Edit exercise
            <icons.Pen className="w-4 h-4" />
          </Button>
        ) : (
          // When teacher is in edit mode
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => {
              console.log("Submitting exercise:", exercise?.id);
              setPageMode("view");
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
