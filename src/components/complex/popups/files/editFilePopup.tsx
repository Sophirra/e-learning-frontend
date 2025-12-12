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
import { FilterDropdown } from "@/components/complex/filterDropdown.tsx";
import { NewTagPopup } from "@/components/complex/popups/files/newTagPopup.tsx";
import { toast } from "sonner";
import { Label } from "@/components/ui/label.tsx";
import { getAvailableTags, updateFileData } from "@/api/api calls/apiFiles.ts";

export function EditFilePopup({
  file,
  onFileUpdated,
}: {
  file: FileData;
  onFileUpdated?: () => void;
}) {
  const [load, setLoad] = useState<boolean>(false);
  const initialTags = file.tags ? file.tags : [];
  const [nameError, setNameError] = useState<boolean>(false);
  const [newFileName, setNewFileName] = useState<string>(file.fileName);
  const [newTags, setNewTags] = useState<FileTag[]>(initialTags);
  const [open, setOpen] = useState<boolean>(false);

  const [availableTags, setAvailableTags] = useState<FileTag[]>([]);

  async function updateFile() {
    try {
      await updateFileData(file.id, {
        fileName: newFileName,
        tags: newTags,
      });
      toast.success("File updated successfully");
      setOpen(false);
      onFileUpdated?.();
    } catch (error: any) {
      toast.error("Failed to update file");
    }
  }

  useEffect(() => {
    async function fetchAvailableTags() {
      if (load || open) {
        const res = await getAvailableTags();
        setAvailableTags(res);
        setLoad(false);
        if (open && file.tags) {
          const fileTagIds = file.tags.map((t) => t.id);
          const syncedTags = res.filter((tag) => fileTagIds.includes(tag.id));
          setNewTags(syncedTags);
        }
      }
    }
    fetchAvailableTags();
  }, [load, open, file.tags]);

  function resetChanges() {
    setNewFileName(file.fileName);
    setNewTags(initialTags);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (open) {
          setLoad(true);
          resetChanges();
        }
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
          <Label>File name</Label>
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
          <div className={"flex flex-row flex-wrap gap-2 pt-2"}>
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
            {availableTags.length > 0 && (
              <FilterDropdown
                key={`${open}-${availableTags.length}-${newTags
                  .map((t) => t.id)
                  .sort()
                  .join(",")}`}
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
                }}
                defaultValues={newTags.map((tag) => tag.id)}
                className={"w-1/1"}
              ></FilterDropdown>
            )}
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
