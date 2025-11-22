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
import { useState } from "react";
import { DialogClose } from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { cn } from "@/lib/utils.ts";
import { QuestionGallery } from "@/components/complex/galleries/questionGallery.tsx";
import { createQuiz as createQuizApi } from "@/api/apiCalls.ts";

export function CreateQuizPopup({
  classId,
  closeParent,
}: {
  classId: string;
  closeParent: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const [questionIds, setQuestionIds] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const [nameError, setNameError] = useState<boolean>(false);
  async function createQuiz() {
    try {
      if (name.trim().length == 0 || questionIds.length == 0) {
        toast.error("Quiz name and questions must be filled");
        return;
      }
      await createQuizApi(name, questionIds, classId);
      setOpen(false);
      toast.success("Quiz created successfully");
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
      <DialogContent className={"min-w-fit max-h-4/5"}>
        <DialogHeader>
          <DialogTitle>Create new quiz</DialogTitle>
          <DialogDescription>
            {"Creating new quiz for student"}
          </DialogDescription>
        </DialogHeader>
        <Label>Title</Label>
        <Input
          id={"title"}
          defaultValue={""}
          onChange={(e) => {
            const newName = e.target.value;
            setName(newName);
            if (newName.trim() === "") {
              setNameError(true);
            } else {
              setNameError(false);
            }
          }}
          className={cn(nameError ? "border-red-300" : "")}
        ></Input>
        <QuestionGallery
          enableSelect={true}
          selectedQuestionIds={questionIds}
          setSelectedQuestionIds={setQuestionIds}
        />
        <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
          <DialogClose>
            <Button>Cancel</Button>
          </DialogClose>
          <Button onClick={() => createQuiz()} variant={"outline"}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
