import { Button } from "@/components/ui/button.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils.ts";
import { useNavigate, useParams } from "react-router-dom";
import { NavigationBar } from "@/components/complex/navigationBar.tsx";
import { Content } from "@/components/ui/content.tsx";
import type { Answer, Quiz, Question, QuizSolution } from "@/api/types.ts";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import Summary from "@/components/complex/summaries/summary.tsx";
import { toast } from "sonner";
import {
  getQuizQuestions,
  getQuiz as getQuizApi,
  submitQuiz,
} from "@/api/apiCalls.ts";
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

export function SolveQuizPage() {
  const navigate = useNavigate();
  const { quizId } = useParams();
  if (!quizId) {
    toast.error("Quiz not found");
    return <div>Quiz not found</div>;
  }
  const [quiz, setQuiz] = useState<Quiz>({
    id: quizId || "",
    name: "Sample Quiz",
    classId: "1",
    courseId: "1",
    courseName: "Test course",
    teacherId: "1",
    studentId: "1",
    isMultipleChoice: false,
    maxScore: 10,
  });
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      content: "This is a sample question",
      categories: [
        {
          id: "1",
          name: "Category A",
        },
        {
          id: "2",
          name: "Category B",
        },
      ],
      answers: [
        { id: "1", content: "Answer 1" },
        { id: "2", content: "Answer 2" },
        { id: "3", content: "Answer 3" },
      ],
    },
    {
      id: "2",
      content:
        "This is a second question. A very very very loooooooooooooooooooooooooooooooooooooong question.",
      categories: [
        {
          id: "2",
          name: "Category B",
        },
        {
          id: "3",
          name: "Category C",
        },
      ],
      answers: [
        { id: "1", content: "Answer 1" },
        { id: "2", content: "Answer 2" },
        { id: "3", content: "Answer 3" },
      ],
    },
  ]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleAnswerSelect = (answerId: string | undefined) => {
    console.log("Selected answer:", answerId);
    const updatedQuestions = [...questions];
    const currentQuestion = updatedQuestions[currentQuestionIndex];

    if (!currentQuestion.answers) {
      toast.error("No answers found");
    } else {
      if (quiz.isMultipleChoice) {
        // Dla multiple choice możemy zaznaczyć wiele odpowiedzi
        const answerIndex = currentQuestion.answers.findIndex(
          (a: Answer) => a.id === answerId,
        );
        console.log("Answer index:", answerIndex);
        currentQuestion.answers[answerIndex].selected =
          !currentQuestion.answers[answerIndex].selected;
        console.log("Updated answer:", currentQuestion.answers[answerIndex]);
      } else {
        // Dla single choice odznaczamy wszystkie inne odpowiedzi
        const isCurrentlySelected = currentQuestion.answers.find(
          (a: Answer) => a.id === answerId,
        )?.selected;
        console.log("Is currently selected:", isCurrentlySelected);
        currentQuestion.answers = currentQuestion.answers.map(
          (answer: Answer) => ({
            ...answer,
            selected: answer.id === answerId ? !isCurrentlySelected : false,
          }),
        );
        console.log("Updated answers:", currentQuestion.answers);
      }

      // Oznacz pytanie jako odpowiedziane, jeśli jakakolwiek odpowiedź jest zaznaczona
      currentQuestion.answered = currentQuestion.answers.some(
        (answer: Answer) => answer.selected,
      );
      console.log("Updated question:", currentQuestion);

      setQuestions(updatedQuestions);
    }
  };

  const handleNavigateQuestion = (direction: "prev" | "next") => {
    const newIndex =
      direction === "prev"
        ? currentQuestionIndex - 1
        : currentQuestionIndex + 1;
    setCurrentQuestionIndex(newIndex);
  };

  async function handleSubmitQuiz() {
    console.log("running submit quiz");
    if (!quizId) {
      toast.error("Quiz id not found");
      return;
    }
    const solution: QuizSolution = {
      quizId: quizId,
      answers: questions.map((question: Question) => ({
        questionId: question.id!,
        selectedAnswerIds: (question.answers || [])
          .filter((answer: Answer) => answer.selected)
          .map((answer: Answer) => answer.id!),
      })),
    };
    try {
      const result = await submitQuiz(solution);
      toast.success("Scored " + result + "/" + quiz.maxScore);
      navigate("/quizzes");
    } catch (e) {
      toast.error("Something went wrong");
      console.log(e);
    }
  }

  const currentQuestion = questions[currentQuestionIndex];

  //TODO: odkomentować jak będzie backend
  // useEffect(() => {
  //   getQuiz(quizId);
  //   getQuestions(quizId);
  //   async function getQuiz(id: string){
  //     const data = await getQuizApi(id);
  //     setQuiz(data)
  //   }
  //   async function getQuestions(id: string){
  //     const data = await getQuizQuestions(id)
  //     setQuestions(data)
  //   }
  // })

  function submitQuizButton(onSubmit: () => void, disabled: boolean) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"ghost"} disabled={disabled}>
            <icons.Send />
            Submit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit quiz</DialogTitle>
            <DialogDescription>Are you sure?</DialogDescription>
          </DialogHeader>
          <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
            <DialogClose className={"flex flex-row gap-4 sm:justify-center"}>
              <Button>Cancel</Button>
              <Button
                variant={"outline"}
                onClick={async () => {
                  console.log("in button");
                  await onSubmit();
                }}
              >
                Confirm
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />
      <Content>
        <Summary
          label={"Quiz " + quiz.name}
          labelIcon={icons.Quiz}
          customButton={() =>
            submitQuizButton(
              handleSubmitQuiz,
              !questions.every((q) => q.answered),
            )
          }
        >
          <div className="grid grid-cols-[200px_1fr] gap-6">
            {/* Lista pytań */}
            <div className="space-y-2">
              <ScrollArea className="h-[calc(100vh-200px)]">
                {questions.map((question, index) => (
                  <Button
                    key={question.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      currentQuestionIndex === index && "bg-secondary",
                    )}
                    onClick={() => setCurrentQuestionIndex(index)}
                  >
                    {question.answered ? (
                      <icons.CheckCircle />
                    ) : (
                      <icons.Circle />
                    )}
                    Question {index + 1}
                  </Button>
                ))}
              </ScrollArea>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-start">
                  {currentQuestionIndex + 1 + ". " + currentQuestion.content}
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleNavigateQuestion("prev")}
                    disabled={currentQuestionIndex === 0}
                  >
                    <icons.ChevronLeft />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleNavigateQuestion("next")}
                    disabled={currentQuestionIndex === questions.length - 1}
                  >
                    Next
                    <icons.ChevronRight />
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                {currentQuestion.content && (
                  <p className="text-gray-600">{currentQuestion.content}</p>
                )}
              </div>
              <div className="space-y-3">
                {currentQuestion.answers &&
                  currentQuestion.answers.map((answer: Answer) => (
                    <div
                      key={answer.id}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-lg border",
                        answer.selected && "border-primary bg-primary/5",
                      )}
                      onClick={() => handleAnswerSelect(answer.id)}
                    >
                      <input
                        type="checkbox"
                        checked={answer.selected}
                        onChange={() => handleAnswerSelect(answer.id)}
                        className="h-4 w-4"
                      />
                      <div>{answer.content}</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </Summary>
      </Content>
    </div>
  );
}
