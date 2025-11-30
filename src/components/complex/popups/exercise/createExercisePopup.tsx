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
import { createExercise, updateExercise } from "@/api/apiCalls.ts";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";

export function CreateExercisePopup({
  classId,
  closeParent,
  editing = true,
  selectedExercise,
}: {
  classId?: string;
  closeParent?: (open: false) => void;
  editing?: boolean;
  selectedExercise?: Exercise;
}) {
  const [edit, setEdit] = useState(editing);
  const [chosenFiles, setChosenFiles] = useState<FileBrief[]>(
    selectedExercise?.files
      ? selectedExercise.files.map(
          (f): FileBrief => ({
            id: f.id || "", //should never happen but lol
            name: f.name,
            path: f.path,
          }),
        )
      : [],
  );
  const [instructions, setInstructions] = useState<string>(
    selectedExercise?.instruction || "",
  );
  async function addExercise() {
    if (!classId) {
      toast.error("No class found");
      return;
    }
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
  async function saveExercise() {
    if (!selectedExercise || !selectedExercise.id) {
      toast.error("No exercise found");
      return;
    }
    if (chosenFiles.length == 0 && instructions.trim().length == 0) {
      toast.error("Exercise must have either instructions or a file attached.");
    } else {
      try {
        await updateExercise(
          selectedExercise.id,
          instructions,
          chosenFiles ? chosenFiles.map((f) => f.id) : [],
        );
        toast.success("Exercise updated successfully");
        closeParent && closeParent(false);
      } catch (e: any) {
        toast.error("Failed to update exercise: " + e.message);
      }
    }
  }
  function handleAddFile(newFile: FileBrief) {
    setChosenFiles([...chosenFiles, newFile]);
  }

  return (
    <Dialog onOpenChange={() => setEdit(editing)}>
      <DialogTrigger>
        {selectedExercise ? (
          edit ? (
            <Button variant={"ghost"} disabled={!selectedExercise}>
              <icons.Edit />
              Edit
            </Button>
          ) : (
            <Button variant={"link"} className={"w-300px"}>
              {selectedExercise.name}:
            </Button>
          )
        ) : (
          <Button variant={"outline"} disabled={!classId}>
            Create new
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {edit
              ? selectedExercise
                ? "Create new exercise"
                : "Edit exercise"
              : "Exercise details"}
          </DialogTitle>
          <DialogDescription>
            {edit
              ? selectedExercise
                ? "Edit exercise details:"
                : "Add exercise details:"
              : "Instructions and files for the exercise:"}
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
            disabled={!edit}
          />
          <Label>Additional file (optional)</Label>
          <div className={"flex flex-row gap-4"}>
            {chosenFiles.length > 0 ? (
              chosenFiles.map((file) => (
                <Button
                  key={file.id}
                  variant={"outline"}
                  disabled={!edit}
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
            {edit && <ChooseFilePopup setChosenFile={handleAddFile} />}
            {edit && <UploadFilePopup setChosenFile={handleAddFile} />}
          </div>
          <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
            <DialogClose>
              <Button>{edit ? "Cancel" : "Close"}</Button>
            </DialogClose>
            {edit ? (
              selectedExercise ? (
                <Button variant={"outline"} onClick={() => saveExercise()}>
                  Save
                </Button>
              ) : (
                <Button variant={"outline"} onClick={() => addExercise()}>
                  Create
                </Button>
              )
            ) : (
              <Button variant={"outline"} onClick={() => setEdit(true)}>
                Edit
              </Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
