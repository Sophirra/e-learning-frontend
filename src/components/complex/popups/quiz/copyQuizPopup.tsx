import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  Dialog,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { QuizGallery } from "@/components/complex/galleries/quizGallery.tsx";
import { useState } from "react";
import type { QuizBrief } from "@/api/types.ts";
import { toast } from "sonner";

import { copyQuiz as copyQuizApi } from "@/api/api calls/apiQuizzes.ts";

export function CopyQuizPopup({
  classId,
  closeParent,
}: {
  classId: string;
  closeParent: (open: boolean) => void;
}) {
  const [selectedQuizBrief, setSelectedQuizBrief] = useState<QuizBrief | null>(
    null,
  );
  const [open, setOpen] = useState(false);
  async function copyQuiz() {
    try {
      if (!selectedQuizBrief) {
        toast.error("No quiz selected");
        return;
      } else {
        await copyQuizApi(selectedQuizBrief.id, classId);
        setOpen(false);
        closeParent(false);
        toast.success("Quiz copied successfully");
      }
    } catch (e: any) {
      toast.error("Failed to create quiz: " + e.message);
    }
  }
  console.log(selectedQuizBrief);
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        setSelectedQuizBrief(null);
      }}
    >
      <DialogTrigger>
        <Button variant={"outline"}>Copy quiz</Button>
      </DialogTrigger>
      <DialogContent className={"min-w-fit max-h-4/5"}>
        <DialogHeader>
          <DialogTitle>Choose quiz to copy from library</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className={"flex flex-col gap-4 pt-2"}>
          <QuizGallery
            enableSelect={true}
            selected={selectedQuizBrief}
            setSelected={setSelectedQuizBrief}
          />
          <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
            <DialogClose>
              <Button>Cancel</Button>
            </DialogClose>
            <Button
              variant={"outline"}
              onClick={() => copyQuiz()}
              disabled={!selectedQuizBrief}
            >
              Confirm
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
