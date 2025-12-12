import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useState } from "react";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { toast } from "sonner";

import { createQuestionCategory } from "@/api/api calls/apiQuestions.ts";

export function CreateQuestionCategoryPopup({
  resetLoading,
}: {
  resetLoading: () => void;
}) {
  const [name, setName] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  async function apiAddCategory(name: string) {
    try {
      await createQuestionCategory(name);
      toast.success("Category created successfully");
      resetLoading();
      setOpen(false);
    } catch (error: any) {
      toast.error("Failed to create category: ", error.message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"} className={"text-right"}>
          <icons.Plus />
          Create new
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new category</DialogTitle>
          <DialogDescription>
            Add a new categorise for your questions.
          </DialogDescription>
        </DialogHeader>
        <div className={"flex flex-col gap-4 pt-2"}>
          <div className={"flex flex-row gap-4"}>
            <Label className={"w-20"}>Name:</Label>
            <Input
              key={"link"}
              type={"text"}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
            <DialogClose>
              <Button>Cancel</Button>
            </DialogClose>
            <Button
              variant={"outline"}
              onClick={async () => {
                console.log("creating..");
                await apiAddCategory(name);
              }}
              disabled={name.trim().length == 0}
            >
              Create
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
