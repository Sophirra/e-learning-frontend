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
import { UploadFilePopup } from "@/components/complex/popups/uploadFilePopup.tsx";
import { useState } from "react";
import { ChooseFilePopup } from "@/components/complex/popups/chooseFilePopup.tsx";
import type { FileData } from "@/api/types.ts";

export function AddAssignmentPopup() {
  const [chosenFile, setChosenFile] = useState<FileData | null>(null);
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={"outline"}>Add new assignment</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new assignment</DialogTitle>
          <DialogDescription>Choose class and task type</DialogDescription>
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
            <Button variant={"outline"}>Create</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
