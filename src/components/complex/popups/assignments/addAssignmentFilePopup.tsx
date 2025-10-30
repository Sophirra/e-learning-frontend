import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { ChooseFilePopup } from "@/components/complex/popups/files/chooseFilePopup.tsx";
import { UploadFilePopup } from "@/components/complex/popups/files/uploadFilePopup.tsx";
import { useState } from "react";
import type { FileData } from "@/api/types.ts";

export function AddAssignmentFilePopup(assignmentId?: string) {
  const [chosenFile, setChosenFile] = useState<FileData | null>(null);
  function handleAddAssignmentFile(file: FileData) {
    //TODO: backend magic - add file to existing assignment
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>
          Add
          <icons.Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new file to class</DialogTitle>
        </DialogHeader>
        <div className={"flex flex-row gap-4 pt-2"}>
          <ChooseFilePopup setChosenFile={setChosenFile} />
          <UploadFilePopup setChosenFile={setChosenFile} />
        </div>
        <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
          <DialogClose>
            <Button>Cancel</Button>
          </DialogClose>
          <Button
            variant={"outline"}
            disabled={!chosenFile}
            onSelect={() => {
              chosenFile && handleAddAssignmentFile(chosenFile);
            }}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
