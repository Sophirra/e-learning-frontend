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
import { useEffect, useState } from "react";
import { DialogClose } from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { cn } from "@/lib/utils.ts";
import { QuestionGallery } from "@/components/complex/galleries/questionGallery.tsx";
import type { Question, QuizBrief } from "@/types.ts";
import {
  createQuiz as createQuizApi,
  getQuizQuestions,
  updateQuiz as updateQuizApi,
} from "@/api/api calls/apiQuizzes.ts";

export function CreateQuizPopup({
  classId,
  closeParent,
  editingQuiz,
}: {
  classId: string;
  closeParent?: (open: boolean) => void;
  editingQuiz?: QuizBrief;
}) {
  const [open, setOpen] = useState(false);
  const [questionIds, setQuestionIds] = useState<string[]>([]);
  const [name, setName] = useState<string>(editingQuiz?.name ?? "");
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
      closeParent && closeParent(false);
    } catch (e: any) {
      toast.error("Failed to create quiz: " + e.message);
    }
  }
  async function updateQuiz() {
    try {
      if (!editingQuiz) {
        toast.error("Editing quiz not found");
        setOpen(false);
        return;
      }
      if (name.trim().length == 0 || questionIds.length == 0) {
        toast.error("Quiz name and questions must be filled");
        return;
      }
      await updateQuizApi(editingQuiz.id, name, questionIds);
      setOpen(false);
      toast.success("Quiz saved successfully");
      closeParent && closeParent(false);
    } catch (e: any) {
      toast.error("Failed to update quiz: " + e.message);
    }
  }

  useEffect(() => {
    getQuestions();

    async function getQuestions() {
      if (editingQuiz) {
        try {
          const data = await getQuizQuestions(editingQuiz.id);
          setQuestionIds(
            data.map((q: Question) => q.id).filter((q) => q !== undefined),
          );
        } catch (e: any) {
          toast.error("Failed to fetch quiz questions: " + e.message);
        }
      }
    }
  }, [editingQuiz]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"} disabled={!classId}>
          {editingQuiz ? "Edit" : "Create"}
        </Button>
      </DialogTrigger>
      <DialogContent className={"min-w-fit max-h-4/5"}>
        <DialogHeader>
          <DialogTitle>
            {editingQuiz ? "Edit quiz" : "Create new quiz"}
          </DialogTitle>
          <DialogDescription>
            {editingQuiz
              ? "Editing quiz for student"
              : "Creating new quiz for student"}
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
          <Button
            onClick={() => (editingQuiz ? updateQuiz() : createQuiz())}
            variant={"outline"}
          >
            {editingQuiz ? "Save" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
