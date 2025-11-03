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
import { addAssignmentGrade } from "@/api/apiCalls.ts";

export function GradeAssignmentPopup({
  assignmentId,
  readyToGrade,
}: {
  assignmentId: string;
  readyToGrade: boolean;
}) {
  const [grade, setGrade] = useState<number>();
  const [comments, setComments] = useState<string>("");

  function apiAddGrade(assignmentId: string, grade: number, comments: string) {
    addAssignmentGrade(assignmentId, grade, comments);
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
          <DialogTitle>Grade assignment</DialogTitle>
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
            <DialogClose>
              <Button>Cancel</Button>
            </DialogClose>
            <Button
              variant={"outline"}
              onSelect={() => {
                if (grade != null) {
                  apiAddGrade(assignmentId, grade, comments);
                } else {
                  toast.error("Class id is not defined");
                }
              }}
              disabled={grade == null}
            >
              Confirm
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
