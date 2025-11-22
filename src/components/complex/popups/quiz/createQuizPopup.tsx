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
import { DialogClose } from "@radix-ui/react-dialog";
import { toast } from "sonner";

export function CreateQuizPopup({
  classId,
  closeParent,
}: {
  classId: string;
  closeParent: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  function createQuiz() {
    try {
      //create quiz with questions ids, name and class id
      setOpen(false);
      closeParent(false);
    } catch (e: any) {
      toast.error("Failed to create quiz: " + e.message);
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"} disabled={!classId}>
          Create
        </Button>
      </DialogTrigger>
      <DialogContent className={"sm:max-w-[425px]"}>
        <DialogHeader>
          <DialogTitle>Create new quiz</DialogTitle>
          <DialogDescription>
            {"Creating new quiz for student"}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
          <DialogClose>
            <Button>Cancel</Button>
          </DialogClose>
          <Button onClick={() => createQuiz()}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
