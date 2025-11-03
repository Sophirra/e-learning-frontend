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
import {
  checkTagName,
  getAvailableTags,
  updateFileData,
} from "@/api/apiCalls.ts";
import { Label } from "@radix-ui/react-label";
import {
  createTag as apiCreateTag,
  checkTagName as apiCheckTagName,
} from "@/api/apiCalls.ts";

export function newTagPopup({
  setTagOnCreation,
}: {
  setTagOnCreation?: (tag: FileTag) => void;
}) {
  const userId = getUserId();
  const [nameError, setNameError] = useState<boolean>(false);
  const [tagName, setTagName] = useState<string>("");
  const [shareOption, setShareOption] = useState<boolean>(true);

  function createTag() {
    //should return tag id to create new tag for onCreation
    const newTag: FileTag = apiCreateTag(tagName, shareOption);
    setTagOnCreation(newTag);
  }

  function checkTagName(tagName: string) {
    //zwraca boolean
    return apiCheckTagName(tagName);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>
          <icons.Plus />
          New tag
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new tag</DialogTitle>
        </DialogHeader>
        <div className={"flex flex-col gap-4"}>
          <Label>Tag name</Label>
          <Input
            id={"tagname"}
            onChange={(e) => {
              const newName = e.target.value;
              setTagName(newName);
              if (newName.trim() === "") {
                setNameError(true);
              } else {
                if (checkTagName(newName)) {
                  setNameError(true);
                }
                setNameError(false);
              }
            }}
            className={cn(nameError ? "border-red-300" : "")}
          ></Input>
          <Label>Share with other users?</Label>
          <Input
            type={"checkbox"}
            id={"share"}
            onChange={(e) => setShareOption(!e.target.checked)}
          ></Input>
        </div>
        <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
          <DialogClose>
            <Button>Cancel</Button>
          </DialogClose>
          <Button
            variant={"outline"}
            disabled={nameError}
            onSelect={() => {
              createTag();
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
