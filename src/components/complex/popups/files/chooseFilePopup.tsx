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
import { FileGallery } from "@/components/complex/galleries/fileGallery.tsx";
import { useState } from "react";
import type { FileBrief } from "@/types.ts";

export function ChooseFilePopup({
  setChosenFile,
}: {
  setChosenFile: (file: FileBrief) => void;
}) {
  const [selectedFile, setSelectedFile] = useState<FileBrief | undefined>();
  const [open, setOpen] = useState(false);
  function addFileToAssignment(file: FileBrief) {
    setChosenFile(file);
    console.log(file);
    setOpen(false);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Choose file</Button>
      </DialogTrigger>
      <DialogContent className={"min-w-fit"}>
        <DialogHeader>
          <DialogTitle>Choose file from library</DialogTitle>
        </DialogHeader>
        <div className={"flex flex-col gap-4 pt-2"}>
          <FileGallery setSelectedFileParent={setSelectedFile} />
          <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
            <DialogClose>
              <Button>Cancel</Button>
            </DialogClose>
            <Button
              variant={"outline"}
              onClick={() => {
                console.log("adding file to assignment");
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
