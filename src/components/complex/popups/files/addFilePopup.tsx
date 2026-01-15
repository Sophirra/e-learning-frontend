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
import type { FileBrief } from "@/types.ts";
import { addFileToClass } from "@/api/api calls/apiFiles.ts";
import { toast } from "sonner";

export function AddFilePopup(classId?: string) {
  const [chosenFile, setChosenFile] = useState<FileBrief | null>(null);
  const [open, setOpen] = useState(false);

  async function handleAddFile(file: FileBrief) {
    if (!classId) {
      toast.error("Could not add file.");
    } else
      try {
        await addFileToClass(file.id, classId);
        toast.success("Added file to class.");
        setOpen(false);
      } catch (e: any) {
        toast.error("Could not add file: " + e.message);
      }
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        setChosenFile(null);
      }}
    >
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
        {chosenFile ? (
          <Button variant={"outline"} onClick={() => setChosenFile(null)}>
            File: {chosenFile.name}{" "}
          </Button>
        ) : (
          <div className={"flex flex-row justify-center gap-4 pt-2"}>
            <ChooseFilePopup setChosenFile={setChosenFile} />
            <UploadFilePopup setChosenFile={setChosenFile} />
          </div>
        )}
        <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
          <DialogClose>
            <Button>Cancel</Button>
          </DialogClose>
          <Button
            variant={"outline"}
            disabled={!chosenFile}
            onClick={() => {
              console.log("chosen file:", chosenFile);
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
