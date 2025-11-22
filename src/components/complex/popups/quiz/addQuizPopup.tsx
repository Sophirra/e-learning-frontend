import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { useState } from "react";
import { CreateQuizPopup } from "@/components/complex/popups/quiz/createQuizPopup.tsx";
import { CopyQuizPopup } from "@/components/complex/popups/quiz/copyQuizPopup.tsx";

export function AddQuizPopup({ classId }: { classId: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} disabled={!classId}>
          <icons.Plus />
          {"Add"}
        </Button>
      </DialogTrigger>
      <DialogContent className={"sm:max-w-[425px]"}>
        <DialogHeader>
          <DialogTitle>Assign quiz to class</DialogTitle>
          <DialogDescription>
            You can copy or create a new quiz
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
          <CopyQuizPopup classId={classId} closeParent={setOpen} />
          <CreateQuizPopup classId={classId} closeParent={setOpen} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
