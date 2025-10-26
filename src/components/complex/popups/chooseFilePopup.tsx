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
import { FileGallery } from "@/components/complex/fileGallery.tsx";
import { useState } from "react";
import type { FileData } from "@/api/types.ts";

export function ChooseFilePopup({
  setChosenFile,
}: {
  setChosenFile: (file: FileData | null) => void;
}) {
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  function addFileToAssignment(file: FileData) {
    setChosenFile(file);
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Choose file</Button>
      </DialogTrigger>
      <DialogContent className={"min-w-fit"}>
        <DialogHeader>
          <DialogTitle>Choose file from library</DialogTitle>
        </DialogHeader>
        <div className={"flex flex-col gap-4 pt-2"}>
          <FileGallery setSelectedFileProp={setSelectedFile} />
          <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
            <DialogClose>
              <Button>Cancel</Button>
            </DialogClose>
            <Button
              variant={"outline"}
              onSelect={() => {
                //TODO: investigate
                selectedFile && addFileToAssignment(selectedFile);
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
