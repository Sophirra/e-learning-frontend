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
import type { Exercise, FileBrief } from "@/api/types.ts";
import { toast } from "sonner";
import { createExercise } from "@/api/apiCalls.ts";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";

export function CreateExercisePopup({
  classId,
  closeParent,
  editingExercise,
}: {
  classId: string;
  closeParent?: (open: false) => void;
  editingExercise?: Exercise;
}) {
  const [chosenFiles, setChosenFiles] = useState<FileBrief[]>(
    editingExercise?.files
      ? editingExercise.files.map(
          (f): FileBrief => ({
            id: f.id || "", //should never happen but lol
            name: f.name,
            path: f.path,
          }),
        )
      : [],
  );
  const [instructions, setInstructions] = useState<string>(
    editingExercise?.instruction || "",
  );
  async function addExercise() {
    if (chosenFiles.length == 0 && instructions.trim().length == 0) {
      toast.error("Exercise must have either instructions or a file attached.");
    } else {
      try {
        await createExercise(
          classId,
          instructions,
          chosenFiles ? chosenFiles.map((f) => f.id) : [],
        );
        toast.success("Exercise created successfully");
        closeParent && closeParent(false);
      } catch (e: any) {
        toast.error("Failed to create exercise: " + e.message);
      }
    }
  }
  function handleAddFile(newFile: FileBrief) {
    setChosenFiles([...chosenFiles, newFile]);
  }

  return (
    <Dialog>
      <DialogTrigger>
        {editingExercise ? (
          <Button variant={"link"} className={"w-300px"}>
            {editingExercise.name}:
          </Button>
        ) : (
          <Button variant={"outline"} disabled={!classId}></Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingExercise ? "Edit exercise" : "Create new exercise"}
          </DialogTitle>
          <DialogDescription>
            {editingExercise
              ? "Edit exercise details:"
              : "Add exercise details:"}
          </DialogDescription>
        </DialogHeader>
        <div className={"flex flex-col gap-4 pt-2"}>
          <Label>Instructions</Label>
          <Input
            id={"instructions"}
            type={"text"}
            onChange={(e) => setInstructions(e.target.value)}
            value={instructions}
            className={"w-full"}
          />
          <Label>Additional file (optional)</Label>
          <div className={"flex flex-row gap-4"}>
            {chosenFiles.length > 0 ? (
              chosenFiles.map((file) => (
                <Button
                  key={file.id}
                  variant={"outline"}
                  onClick={() =>
                    setChosenFiles(chosenFiles.filter((f) => f.id !== file.id))
                  }
                >
                  {file.name}
                  <icons.X />
                </Button>
              ))
            ) : (
              <p>No files added</p>
            )}
          </div>
          <div className={"flex flex-row gap-4"}>
            <ChooseFilePopup setChosenFile={handleAddFile} />
            <UploadFilePopup setChosenFile={handleAddFile} />
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
