import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { ChooseFilePopup } from "@/components/complex/popups/chooseFilePopup.tsx";
import { UploadFilePopup } from "@/components/complex/popups/uploadFilePopup.tsx";
import { useState } from "react";
import type { FileData } from "@/api/types.ts";

export function AddFilePopup() {
  const [chosenFile, setChosenFile] = useState<FileData | null>(null);
  function handleAddFile(file: FileData) {
    //TODO: backend magic
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>
          <icons.Plus />
          Add
        </Button>
      </DialogTrigger>
      <DialogHeader>
        <DialogTitle>Add new file to class</DialogTitle>
      </DialogHeader>
      <div className={"flex flex-col gap-4 pt-2"}>
        <ChooseFilePopup setChosenFile={setChosenFile} />
        <UploadFilePopup setChosenFile={setChosenFile} />
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
      </div>
    </Dialog>
  );
}
