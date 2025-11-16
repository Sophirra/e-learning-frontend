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
import { useEffect, useState } from "react";
import type { FileData, FileTag } from "@/api/types.ts";
import { Input } from "@/components/ui/input.tsx";
import { cn } from "@/lib/utils.ts";
import { getUserId } from "@/api/api.ts";
import { FilterDropdown } from "@/components/complex/filterDropdown.tsx";
import { getAvailableTags, updateFileData } from "@/api/apiCalls.ts";
import { NewTagPopup } from "@/components/complex/popups/files/newTagPopup.tsx";
import { toast } from "sonner";

export function EditFilePopup({ file }: { file: FileData }) {
  const userId = getUserId();
  const [load, setLoad] = useState<boolean>(false);
  const [tags] = useState<FileTag[]>(file.tags ? file.tags : []);
  const [nameError, setNameError] = useState<boolean>(false);
  const [newFileName, setNewFileName] = useState<string>(file.fileName);
  const [newTags, setNewTags] = useState<FileTag[]>(tags);
  const [open, setOpen] = useState<boolean>(false);

  //TODO: get available tags from backend
  const [availableTags, setAvailableTags] = useState<FileTag[]>([
    // { id: "1", name: "tag1", ownerId: userId || "" },
    // { id: "2", name: "tag2", ownerId: userId || "" },
  ]);

  async function updateFile() {
    const res = await updateFileData(file.id, {
      fileName: newFileName,
      tags: newTags,
    });
    if (res.status == 200) {
      toast.success("File updated successfully");
      setOpen(false);
    } else {
      toast.error("Failed to update file");
    }
  }

  // TODO: check if alright
  useEffect(() => {
    async function fetchAvailableTags() {
      if (load) {
        const res = await getAvailableTags();
        setAvailableTags(res);
        setLoad(false);
      }
    }
    fetchAvailableTags();
  }, [load]);

  function resetChanges() {
    setNewFileName(file.fileName);
    setNewTags(tags);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        setLoad(false);
        resetChanges();
      }}
    >
      <DialogTrigger asChild>
        <Button variant={"ghost"} onClick={() => setLoad(true)}>
          <icons.Edit />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit file {file.fileName}</DialogTitle>
        </DialogHeader>
        <div className={"flex flex-col gap-4"}>
          <Input
            id={"filename"}
            defaultValue={file.fileName}
            onChange={(e) => {
              const newName = e.target.value;
              setNewFileName(newName);
              if (newName.trim() === "") {
                setNameError(true);
              } else {
                setNameError(false);
              }
            }}
            className={cn(nameError ? "border-red-300" : "")}
          ></Input>
          <div className={"flex flex-row gap-4 pt-2"}>
            Tags:
            {newTags.length > 0 ? (
              newTags.map((tag) => (
                <div key={tag.id} className={"flex flex-row gap-2"}>
                  <Button variant={"default"} id={tag.id}>
                    {tag.name}
                  </Button>
                </div>
              ))
            ) : (
              <>No tags added yet</>
            )}
          </div>
          <div className={"flex flex-row gap-4 pt-2 items-end"}>
            <FilterDropdown
              placeholder={"file tags"}
              emptyMessage={"choose file tags"}
              label={"Available tags:"}
              reset={false}
              items={availableTags.map((tag) => {
                return { name: tag.name, value: tag.id };
              })}
              onSelectionChange={(selectedTags) => {
                const selectedIds = selectedTags.map((tag) => tag.value);
                const updatedTags = availableTags.filter((tag) =>
                  selectedIds.includes(tag.id),
                );
                setNewTags(updatedTags);
                console.log("new tags:", newTags);
              }}
              defaultValues={tags.map((tag) => tag.id)}
              className={"w-1/1"}
            ></FilterDropdown>
            <div className={"w-1/1 text-right"}>
              <NewTagPopup resetLoading={() => setLoad(true)} />
            </div>
          </div>
        </div>
        <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
          <DialogClose>
            <Button>Cancel</Button>
          </DialogClose>
          <Button
            variant={"outline"}
            disabled={nameError}
            onClick={() => {
              updateFile();
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
