import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useEffect, useState } from "react";
import { useUser } from "@/lib/user/UserContext.tsx";
import type { Answer, Question, QuestionCategory } from "@/types.ts";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Input } from "@/components/ui/input.tsx";
import { toast } from "sonner";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { FilterDropdown } from "@/components/complex/filterDropdown.tsx";
import { CreateQuestionCategoryPopup } from "@/components/complex/popups/quiz/questions/createQuestionCategoryPopup.tsx";
import {
  createQuestion,
  getFullQuestion,
  getUserCategories,
  updateQuestion,
} from "@/api/api calls/apiQuestions.ts";

export function QuestionDetailsPopup({
  questionBrief,
  enableSelect = false,
  selected,
  setSelected,
}: {
  questionBrief?: Question;
  enableSelect?: boolean;
  selected?: boolean;
  setSelected?: (selected: boolean) => void;
}) {
  // console.log("select:", selected);
  const { user } = useUser();
  const [load, setLoad] = useState(false);
  const [editing, setEditing] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const [question, setQuestion] = useState<Question>(
    questionBrief
      ? questionBrief
      : { content: "", categories: [], answers: [] },
  );
  const [newContent, setNewContent] = useState<string>(
    questionBrief ? questionBrief.content : "",
  );
  const [newCategories, setNewCategories] = useState<QuestionCategory[]>(
    questionBrief ? questionBrief.categories || [] : [],
  );
  const [newAnswers, setNewAnswers] = useState<Answer[]>(
    questionBrief ? questionBrief.answers || [] : [],
  );
  const [availableCategories, setAvailableCategories] = useState<
    QuestionCategory[]
  >([]);

  async function handleConfirm() {
    if (newContent.trim() === "") {
      toast.error("Question content cannot be empty");
      return;
    }
    if (newAnswers.length === 0) {
      toast.error("Question must have one answer");
      return;
    }
    if (!newAnswers.some((answer) => answer.correct)) {
      toast.error("At least one answer must be correct");
      return;
    }
    if (!questionBrief) {
      try {
        const output = await createQuestion(
          newContent,
          newAnswers,
          newCategories.map((category) => category.id),
        );
        setQuestion(output);
        setEditing(false);
        toast.success("Question created");
      } catch (Error: any) {
        toast.error("Error while creating question");
      }
    } else if (!question.id) {
      toast.error("Question id missing");
    } else {
      try {
        const output = await updateQuestion(
          question.id,
          newContent,
          newAnswers,
          newCategories.map((category) => category.id),
        );
        setQuestion(output);
        setEditing(false);
        toast.success("Question updated");
      } catch (Error: any) {
        toast.error("Error while updating question");
      }
    }
  }

  function handleAddAnswer() {
    const newAnswer: Answer = {
      id: crypto.randomUUID(), // temporary id so new answers fit structure
      content: "",
      // correct: false,
    };
    setNewAnswers([...newAnswers, newAnswer]);
  }

  function handleDeleteAnswer(answerId: string) {
    const updatedAnswers = newAnswers.filter(
      (answer) => answer.id !== answerId,
    );
    setNewAnswers(updatedAnswers);
  }

  function handleAnswerContentChange(answerId: string, content: string) {
    const updatedAnswers = newAnswers.map((answer) =>
      answer.id === answerId ? { ...answer, content } : answer,
    );
    setNewAnswers(updatedAnswers);
  }

  function handleAnswerCorrectChange(answerId: string, correct: boolean) {
    const updatedAnswers = newAnswers.map((answer) =>
      answer.id === answerId ? { ...answer, correct } : answer,
    );
    setNewAnswers(updatedAnswers);
  }
  async function resetQuestion() {
    if (!questionBrief) {
      setOpen(false);
    } else {
      if (!question.id) {
        toast.error("no question id, could not revert");
        return;
      }
      try {
        const questionData = await getFullQuestion(question.id);
        setQuestion(questionData);
        setNewContent(questionData.content);
        setNewCategories(questionData.categories || []);
        setNewAnswers(questionData.answers || []);
        setEditing(false);
      } catch (error) {
        toast.error("Error resetting question.");
      }
    }
  }

  useEffect(() => {
    async function getQuestionDetails() {
      if (load && question) {
        if (!question.id)
          toast.error("No question id found. Cannot download data.");
        else {
          const questionData = await getFullQuestion(question.id);
          setQuestion(questionData);
          setNewContent(questionData.content);
          setNewCategories(questionData.categories || []);
          setNewAnswers(questionData.answers || []);
          setLoad(false);

          console.log("categories: ", newCategories);
          if (!questionData.answers) {
            toast.error("No answers returned");
          }
        }
      }
    }
    async function getCategories() {
      if (load) {
        const categoriesData = await getUserCategories();
        setAvailableCategories(categoriesData);
      }
    }
    getCategories();
    if (questionBrief) {
      getQuestionDetails();
    }
  }, [load]);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setLoad(true);
        setOpen(!open);
        if (!open) {
          if (!questionBrief) {
            setQuestion({
              content: "",
              categories: [],
              answers: [],
            });
            setEditing(true);
          } else {
            setEditing(false);
          }
          setNewContent(question.content);
          setNewCategories(question.categories || []);
          setNewAnswers(question.answers || []);
        }
      }}
    >
      <DialogTrigger asChild>
        {questionBrief ? (
          <Button
            disabled={user?.activeRole !== "teacher"}
            variant={"ghost"}
            className="shadow-md flex flex-col gap-1 h-1/1 items-start "
            onClick={() => {
              if (selected !== undefined && setSelected) {
                setSelected(!selected);
              } else {
                setLoad(true);
                setOpen(true);
              }
            }}
          >
            <div className={"flex flex-col gap-1"}>
              <h3 className="text-lg font-bold truncate">{question.content}</h3>
              <div className={"flex flex-row gap-2 "}>
                {question.categories.map((category) => (
                  <p
                    key={category.id}
                    className="text-m text-gray-500 font-medium"
                  >
                    {category.name}
                  </p>
                ))}
              </div>
            </div>
            {enableSelect && (
              <div> {selected ? <icons.Check /> : <icons.Circle />}</div>
            )}
          </Button>
        ) : (
          <Button
            disabled={user?.activeRole !== "teacher"}
            variant={"ghost"}
            onClick={() => {
              setLoad(true);
              setOpen(true);
            }}
          >
            <icons.Plus />
            Create new
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Question details</DialogTitle>
          {/*<DialogDescription>{question.content}</DialogDescription>*/}
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Label>Question:</Label>
          <Input
            type="text"
            value={newContent}
            disabled={!editing}
            className="w-full"
            aria-multiline={"true"}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <Label>Categories:</Label>
          <div className={"flex flex-row gap-2"}>
            {newCategories.length > 0 ? (
              newCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={"default"}
                  size="sm"
                  disabled={!editing}
                >
                  {category.name}
                </Button>
              ))
            ) : (
              <span className="text-gray-500 text-sm">No categories found</span>
            )}
          </div>
          {editing && (
            <div className={"flex flex-row gap-2 text-right"}>
              <FilterDropdown
                placeholder={"Question categories"}
                emptyMessage={"Add to category"}
                label={"Add to category:"}
                reset={false}
                items={availableCategories.map((category) => {
                  return { name: category.name, value: category.id };
                })}
                onSelectionChange={(selectedCategories) => {
                  const selectedIds = selectedCategories.map((c) => c.value);
                  const updatedCategories = availableCategories.filter((c) =>
                    selectedIds.includes(c.id),
                  );
                  setNewCategories(updatedCategories);
                }}
                // const updatedCategories = [...newCategories];
                // for (const cat of selectedCategories) {
                //   if (!updatedCategories.some((c) => c.id === cat.value)) {
                //     const fullCategory = availableCategories.find(
                //       (c) => c.id === cat.value,
                //     );
                //     if (fullCategory) {
                //       updatedCategories.push(fullCategory);
                //     }
                //   }
                // }
                // setNewCategories(updatedCategories);
                defaultValues={newCategories.map((cat) => cat.id)}
              />
              <CreateQuestionCategoryPopup resetLoading={() => setLoad(true)} />
            </div>
          )}

          <Label>Answers:</Label>
          {newAnswers.map((answer) => (
            <div
              key={answer.id || crypto.randomUUID()}
              className="flex flex-row gap-2 items-center rounded"
            >
              <Checkbox
                checked={answer.correct}
                disabled={!editing}
                onCheckedChange={(checked) =>
                  handleAnswerCorrectChange(answer.id!, checked as boolean)
                }
                className="data-[state=checked]:bg-green-300 data-[state=checked]:border-green-300"
              />
              <Input
                type="text"
                value={answer.content}
                onChange={(e) =>
                  handleAnswerContentChange(answer.id!, e.target.value)
                }
                disabled={!editing}
                className="flex-1"
                placeholder="Treść odpowiedzi"
              />
              {editing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteAnswer(answer.id!)}
                >
                  <icons.Trash className="text-red-300" />
                </Button>
              )}
            </div>
          ))}
          {editing && (
            <Button onClick={handleAddAnswer} variant="outline" size="sm">
              <icons.Plus />
              Add new answer
            </Button>
          )}
        </div>

        <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
          {!editing && (
            <DialogClose>
              <Button>Cancel</Button>
            </DialogClose>
          )}
          {editing && (
            <Button
              onClick={() => {
                resetQuestion();
              }}
            >
              Discard
            </Button>
          )}
          <Button
            variant={"outline"}
            onClick={() => {
              if (!editing) {
                setEditing(true);
              } else {
                handleConfirm();
              }
            }}
            disabled={user?.activeRole !== "teacher"}
          >
            {editing ? (questionBrief ? "Create" : "Save") : "Edit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
