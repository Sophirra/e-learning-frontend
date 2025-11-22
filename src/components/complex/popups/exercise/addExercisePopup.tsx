import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { CreateExercisePopup } from "@/components/complex/popups/exercise/createExercisePopup.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { CopyExercisePopup } from "@/components/complex/popups/exercise/copyExercisePopup.tsx";
import { useState } from "react";

export function AddExercisePopup({
  classId,
  buttonOutline,
  extendedName,
}: {
  classId: string;
  buttonOutline?: boolean;
  extendedName?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={buttonOutline ? "outline" : "ghost"}
          disabled={!classId}
        >
          <icons.Plus />
          {extendedName ? "Add new exercise" : "Add"}
        </Button>
      </DialogTrigger>
      <DialogContent className={"sm:max-w-[425px]"}>
        <DialogHeader>
          <DialogTitle>Assign exercise to class</DialogTitle>
          <DialogDescription>
            You can copy or create a new assignment
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
          <CopyExercisePopup classId={classId} closeParent={setOpen} />
          <CreateExercisePopup classId={classId} closeParent={setOpen} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
