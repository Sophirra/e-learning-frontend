import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useState } from "react";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { toast } from "sonner";
import { addExerciseGrade } from "@/api/apiCalls.ts";

export function GradeExercisePopup({
  exerciseId,
  readyToGrade,
}: {
  exerciseId: string;
  readyToGrade: boolean;
}) {
  const [grade, setGrade] = useState<number>();
  const [comments, setComments] = useState<string>("");

  function apiAddGrade(exerciseId: string, grade: number, comments: string) {
    addExerciseGrade(exerciseId, grade, comments);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"} disabled={!readyToGrade}>
          <icons.Pen />
          Grade
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Grade exercise</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className={"flex flex-col gap-4 pt-2"}>
          <div className={"flex flex-row gap-4"}>
            <Label className={"w-20"}>Grade</Label>
            <Input
              key={"grade"}
              type={"number"}
              value={grade}
              onChange={(e) => setGrade(e.target.valueAsNumber)}
            />
          </div>
          <div className={"flex flex-row gap-4"}>
            <Label className={"w-20"}>Add comments (optional)</Label>
            <Input
              key={"comment"}
              type={"multiline"}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>

          <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
            <DialogClose asChild>
              <Button>Cancel</Button>
            </DialogClose>

            <DialogClose asChild>
              <Button
                  variant={"outline"}
                  onClick={() => {
                    if (grade != null) {
                      apiAddGrade(exerciseId, grade, comments);
                      toast.success("Grade added successfully.");
                    } else {
                      toast.error("Grade is not defined");
                    }
                  }}
                  disabled={grade == null}
              >
                Confirm
              </Button>
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
