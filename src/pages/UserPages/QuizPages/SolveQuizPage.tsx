import { Button } from "@/components/ui/button.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { useState } from "react";
import { cn } from "@/lib/utils.ts";
import { useParams } from "react-router-dom";
import { NavigationBar } from "@/components/complex/navigationBar.tsx";
import { Content } from "@/components/ui/content.tsx";
import type { Answer, Quiz } from "@/api/types.ts";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import Summary from "@/components/complex/summaries/summary.tsx";

export function SolveQuizPage() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState<Quiz>({
    id: quizId || "",
    name: "Sample Quiz",
    classId: "1",
    courseId: "1",
    courseName: "Test course",
    teacherId: "1",
    studentId: "1",
    questions: [
      {
        id: "1",
        content: "This is a sample question",
        categoryId: "1",
        categoryName: "Category A",
        answers: [
          { id: "1", content: "Answer 1", selected: false },
          { id: "2", content: "Answer 2", selected: false },
          { id: "3", content: "Answer 3", selected: false },
        ],
        answered: false,
      },
      {
        id: "2",
        content:
          "This is a second question. A very very very loooooooooooooooooooooooooooooooooooooong question.",
        categoryId: "1",
        categoryName: "Category A",
        answers: [
          { id: "1", content: "Answer 1", selected: false },
          { id: "2", content: "Answer 2", selected: false },
          { id: "3", content: "Answer 3", selected: false },
        ],
        answered: false,
      },
    ],
    isMultipleChoice: false,
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleAnswerSelect = (answerId: string | undefined) => {
    console.log("Selected answer:", answerId);
    const updatedQuestions = [...quiz.questions];
    const currentQuestion = updatedQuestions[currentQuestionIndex];

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
    currentQuestion.isAnswered = currentQuestion.answers.some(
      (answer: Answer) => answer.selected,
    );
    console.log("Updated question:", currentQuestion);

    setQuiz({ ...quiz, questions: updatedQuestions });
    console.log("Updated quiz:", quiz);
  };

  const handleNavigateQuestion = (direction: "prev" | "next") => {
    const newIndex =
      direction === "prev"
        ? currentQuestionIndex - 1
        : currentQuestionIndex + 1;
    setCurrentQuestionIndex(newIndex);
  };

  const handleSubmitQuiz = () => {
    // Tutaj logika wysyłania odpowiedzi
    const answers = quiz.questions.map((question) => ({
      questionId: question.id,
      selectedAnswers: question.answers
        .filter((answer: Answer) => answer.selected)
        .map((answer: Answer) => answer.id),
    }));

    console.log("Submitting answers:", answers);
  };

  const currentQuestion = quiz.questions[currentQuestionIndex];

  function submitQuizButton(disabled: boolean) {
    return (
      <Button variant="ghost" disabled={disabled} onClick={handleSubmitQuiz}>
        <icons.Send />
        Submit
      </Button>
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
            submitQuizButton(!quiz.questions.every((q) => q.isAnswered))
          }
        >
          <div className="grid grid-cols-[200px_1fr] gap-6">
            {/* Lista pytań */}
            <div className="space-y-2">
              <ScrollArea className="h-[calc(100vh-200px)]">
                {quiz.questions.map((question, index) => (
                  <Button
                    key={question.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      currentQuestionIndex === index && "bg-secondary",
                    )}
                    onClick={() => setCurrentQuestionIndex(index)}
                  >
                    {question.isAnswered ? (
                      <icons.CheckCircle />
                    ) : (
                      <icons.Circle />
                    )}
                    Question {index + 1}
                  </Button>
                ))}
              </ScrollArea>
            </div>

            {/* Zawartość pytania */}
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
                    disabled={
                      currentQuestionIndex === quiz.questions.length - 1
                    }
                  >
                    Next
                    <icons.ChevronRight />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Opis lub obrazek */}
              <div className="space-y-4">
                {currentQuestion.description && (
                  <p className="text-gray-600">{currentQuestion.description}</p>
                )}
                {currentQuestion.imageUrl && (
                  <img
                    src={currentQuestion.imageUrl}
                    alt={currentQuestion.title}
                    className="max-w-full rounded-lg"
                  />
                )}
              </div>

              {/* Odpowiedzi */}
              <div className="space-y-3">
                {currentQuestion.answers.map((answer: Answer) => (
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
