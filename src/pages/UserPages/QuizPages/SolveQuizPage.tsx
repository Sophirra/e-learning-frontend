import { Button } from "@/components/ui/button.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Component, useEffect, useState } from "react";
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
import { LoadingTile } from "@/components/complex/LoadingTile.tsx";

export function SolveQuizPage() {
  const navigate = useNavigate();
  const { quizId } = useParams();
  if (!quizId) {
    toast.error("Quiz not found");
    return <div>Quiz not found</div>;
  }
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<Quiz>();
  // {
  // id: quizId || "",
  // name: "Sample Quiz",
  // classId: "1",
  // courseId: "1",
  // courseName: "Test course",
  // teacherId: "1",
  // studentId: "1",
  // isMultipleChoice: false,
  // maxScore: 10,
  // }
  const [questions, setQuestions] = useState<Question[]>([
    // {
    //   id: "1",
    //   content: "This is a sample question",
    //   categories: [
    //     {
    //       id: "1",
    //       name: "Category A",
    //     },
    //     {
    //       id: "2",
    //       name: "Category B",
    //     },
    //   ],
    //   answers: [
    //     { id: "1", content: "Answer 1" },
    //     { id: "2", content: "Answer 2" },
    //     { id: "3", content: "Answer 3" },
    //   ],
    // },
    // {
    //   id: "2",
    //   content:
    //     "This is a second question. A very very very loooooooooooooooooooooooooooooooooooooong question.",
    //   categories: [
    //     {
    //       id: "2",
    //       name: "Category B",
    //     },
    //     {
    //       id: "3",
    //       name: "Category C",
    //     },
    //   ],
    //   answers: [
    //     { id: "1", content: "Answer 1" },
    //     { id: "2", content: "Answer 2" },
    //     { id: "3", content: "Answer 3" },
    //   ],
    // },
  ]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [solution, setSolution] = useState<QuizSolution>({
    quizId: quizId,
    answers: [],
  });

  async function handleAnswerSelect(answerId: string | undefined) {
    if (!answerId || !quiz) return;
    console.log("solution: ", solution);
    const currentQuestion = questions[currentQuestionIndex];
    console.log(currentQuestion, questions);
    if (!currentQuestion.id) return;

    //TODO: naprawić - nie zmienia wybranej odpowiedzi jeśli jest już jakaś zaznaczona
    setSolution((prevSolution) => {
      const existingAnswerIndex = prevSolution.answers.findIndex(
        (a) => a.questionId === currentQuestion.id,
      );

      const newAnswers = [...prevSolution.answers];

      if (existingAnswerIndex >= 0) {
        // Pytanie już ma odpowiedzi
        const currentAnswerIds =
          newAnswers[existingAnswerIndex].selectedAnswerIds;
        if (quiz.isMultipleChoice) {
          // Multiple choice - toggle odpowiedzi
          if (currentAnswerIds.includes(answerId)) {
            newAnswers[existingAnswerIndex].selectedAnswerIds =
              currentAnswerIds.filter((id) => id !== answerId);
          } else {
            newAnswers[existingAnswerIndex].selectedAnswerIds = [
              ...currentAnswerIds,
              answerId,
            ];
          }
        } else {
          // Single choice - zamień na nową odpowiedź lub usuń jeśli ta sama
          if (currentAnswerIds.includes(answerId)) {
            newAnswers[existingAnswerIndex].selectedAnswerIds = [];
          } else {
            newAnswers[existingAnswerIndex].selectedAnswerIds = [answerId];
          }
        }
      } else {
        // Nowe pytanie - dodaj odpowiedź
        if (currentQuestion.id) {
          newAnswers.push({
            questionId: currentQuestion.id,
            selectedAnswerIds: [answerId],
          });
        }
      }

      return {
        ...prevSolution,
        answers: newAnswers,
      };
    });
  }

  async function handleNavigateQuestion(direction: "prev" | "next") {
    const newIndex =
      direction === "prev"
        ? currentQuestionIndex - 1
        : currentQuestionIndex + 1;
    setCurrentQuestionIndex(newIndex);
  }

  async function handleSubmitQuiz() {
    if (!quiz) return;
    console.log("running submit quiz");
    try {
      const result = await submitQuiz(solution);
      toast.success("Scored " + result + "/" + quiz.maxScore);
      navigate("/quizzes");
    } catch (e) {
      toast.error("Something went wrong");
      console.log(e);
    }
  }

  const isAnswerSelected = (
    questionId: string | undefined,
    answerId: string | undefined,
  ): boolean => {
    if (!questionId || !answerId) return false;
    const questionAnswer = solution.answers.find(
      (a) => a.questionId === questionId,
    );
    return questionAnswer?.selectedAnswerIds.includes(answerId) || false;
  };

  const isQuestionAnswered = (questionId: string | undefined): boolean => {
    if (!questionId) return false;
    const questionAnswer = solution.answers.find(
      (a) => a.questionId === questionId,
    );
    return (questionAnswer?.selectedAnswerIds.length || 0) > 0;
  };

  const currentQuestion = questions[currentQuestionIndex];

  //TODO: odkomentować jak będzie backend
  useEffect(() => {
    if (loading) {
      getQuiz(quizId).then;
      getQuestions(quizId);
      setLoading(false);
      console.log("set loading", loading);
    }
    async function getQuiz(id: string) {
      const data = await getQuizApi(id);
      setQuiz(data);
      console.log("set quiz", quiz);
    }
    async function getQuestions(id: string) {
      const data = await getQuizQuestions(id);
      setQuestions(data);
      console.log("set questions", questions);
    }
  }[quizId]);

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
                onClick={() => {
                  console.log("in button");
                  onSubmit();
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
        {loading || !quiz ? (
          <LoadingTile />
        ) : (
          <Summary
            label={"Quiz " + quiz.name}
            labelIcon={icons.Quiz}
            customButton={() =>
              submitQuizButton(
                handleSubmitQuiz,
                !questions.every((q) => isQuestionAnswered(q.id)),
              )
            }
          >
            {loading || !questions ? (
              <LoadingTile />
            ) : (
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
                        {isQuestionAnswered(question.id) ? (
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
                      {currentQuestionIndex +
                        1 +
                        ". " +
                        currentQuestion.content}
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
                            isAnswerSelected(currentQuestion.id, answer.id) &&
                              "border-primary bg-primary/5",
                          )}
                          onClick={() => handleAnswerSelect(answer.id)}
                        >
                          <input
                            type="checkbox"
                            checked={isAnswerSelected(
                              currentQuestion.id,
                              answer.id,
                            )}
                            onChange={() => handleAnswerSelect(answer.id)}
                            className="h-4 w-4"
                          />
                          <div>{answer.content}</div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </Summary>
        )}
      </Content>
    </div>
  );
}
