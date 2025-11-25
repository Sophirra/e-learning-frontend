import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import Summary from "@/components/complex/summaries/summary.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import type { Mode } from "@/pages/UserPages/ExercisePage.tsx";
import { useUser } from "@/features/user/UserContext.tsx";
import type { Exercise } from "@/api/types.ts";

export function ExerciseTitle({
  exercise,
  pageMode,
  setPageMode,
}: {
  exercise: Exercise | null;
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
            onClick={() => {
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
            onClick={() => {
              console.log("Submitting exercise:", exercise?.id);
              setPageMode("edit");
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
