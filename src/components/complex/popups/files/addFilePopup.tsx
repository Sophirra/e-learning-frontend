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

export function AddFilePopup(classId?: string) {
  const [chosenFile, setChosenFile] = useState<FileData | null>(null);
  function handleAddFile(file: FileData) {
    //TODO: backend magic - if classId, associate file to class
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>
          <icons.Plus />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new file</DialogTitle>
        </DialogHeader>
        <div className={"flex flex-row justify-center gap-4 pt-2"}>
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
              chosenFile && handleAddFile(chosenFile);
            }}
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
