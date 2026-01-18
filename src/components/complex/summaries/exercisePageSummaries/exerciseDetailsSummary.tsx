import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import Summary from "@/components/complex/summaries/summary.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useUser } from "@/lib/user/UserContext.tsx";
import type { Exercise } from "@/types.ts";
import { CreateExercisePopup } from "@/components/complex/popups/exercise/createExercisePopup.tsx";
import { toast } from "sonner";
import { submitSolution } from "@/api/api calls/apiExercises.ts";
import { Dialog, DialogClose } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export function ExerciseDetailsSummary({
  exercise,
}: {
  exercise: Exercise | null;
}) {
  const { user } = useUser();

  function ConfirmPopup() {
    const [open, setOpen] = useState(false);
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            disabled={
              exercise?.status === "Submitted" || exercise?.status === "Graded"
            }
            variant="ghost"
            className="flex items-center gap-2"
          >
            Submit
            <icons.Send className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>Submitting exercise.</DialogHeader>
          <DialogDescription>
            Are you sure you want to submit this exercise? You will not be able
            to edit it afterwards.
          </DialogDescription>
          <DialogFooter>
            <DialogClose>Cancel</DialogClose>
            <Button
              onClick={async () => {
                if (exercise?.id != null) {
                  try {
                    await submitSolution(exercise.id);
                    toast.success("Exercise submitted!");
                    setOpen(false);
                  } catch (error) {
                    toast.error("Error submitting exercise.");
                    console.error("Submit error:", error);
                  }
                }
                console.log("Submitting exercise:", exercise?.id);
              }}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Summary
      label={exercise?.name || "Untitled Exercise"}
      labelIcon={icons.Clipboard}
      canHide={false}
      customButton={() =>
        user?.activeRole === "student" ? (
          <ConfirmPopup />
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
        ) : null
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
