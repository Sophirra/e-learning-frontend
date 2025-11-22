import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  Dialog,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";
import { toast } from "sonner";
import { copyExercise as copyExerciseApi } from "@/api/apiCalls.ts";

export function CopyExercisePopup({
  classId,
  closeParent,
}: {
  classId: string;
  closeParent: (open: boolean) => void;
}) {
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(
    null,
  );
  const [open, setOpen] = useState(false);
  async function copyExercise() {
    try {
      if (!selectedExerciseId) {
        toast.error("No quiz selected");
        return;
      } else {
        await copyExerciseApi(selectedExerciseId, classId);
        setOpen(false);
        closeParent(false);
        toast.success("Exercise copied successfully");
      }
    } catch (e: any) {
      toast.error("Failed to copy exercise: " + e.message);
    }
  }
  console.log(selectedExerciseId);
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        setSelectedExerciseId(null);
      }}
    >
      <DialogTrigger>
        <Button variant={"outline"}>Copy exercise</Button>
      </DialogTrigger>
      <DialogContent className={"min-w-fit max-h-4/5"}>
        <DialogHeader>
          <DialogTitle>Choose exercise to copy from library</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className={"flex flex-col gap-4 pt-2"}>
          Here will be assignment gallery
          <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
            <DialogClose>
              <Button>Cancel</Button>
            </DialogClose>
            <Button
              variant={"outline"}
              onClick={() => copyExercise()}
              disabled={!selectedExerciseId}
            >
              Confirm
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
