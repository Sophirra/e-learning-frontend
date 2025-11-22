import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { UploadFilePopup } from "@/components/complex/popups/files/uploadFilePopup.tsx";
import { useState } from "react";
import { ChooseFilePopup } from "@/components/complex/popups/files/chooseFilePopup.tsx";
import type { FileData } from "@/api/types.ts";
import { toast } from "sonner";

export function CreateExercisePopup({
  classId,
  closeParent,
}: {
  classId: string;
  closeParent: (open: false) => void;
}) {
  const [chosenFile, setChosenFile] = useState<FileData | null>(null);
  function addExercise() {
    //TODO: backend magic - add exercise with optional file to class
    try {
      //TODO: backend magic - add exercise with optional file to class
      toast.success("Exercise created successfully");
      closeParent(false);
    } catch (e: any) {
      toast.error("Failed to create exercise: " + e.message);
    }
  }
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={"outline"} disabled={!classId}>
          Add new exercise
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new exercise</DialogTitle>
          <DialogDescription>Add exercise details:</DialogDescription>
        </DialogHeader>
        <div className={"flex flex-col gap-4 pt-2"}>
          <Label>Title</Label>
          <Input id={"title"} type={"text"} disabled={false} />
          <Label>Description</Label>
          <Input id={"descr"} type={"text"} />
          <Label>Additional file</Label>
          <div className={"flex flex-row gap-4"}>
            {chosenFile && <p>{chosenFile.fileName}</p>}
            <ChooseFilePopup setChosenFile={setChosenFile} />
            <UploadFilePopup setChosenFile={setChosenFile} />
          </div>
          <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
            <DialogClose>
              <Button>Cancel</Button>
            </DialogClose>
            <Button variant={"outline"} onClick={() => addExercise()}>
              Create
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
