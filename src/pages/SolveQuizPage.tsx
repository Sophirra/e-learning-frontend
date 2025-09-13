import { Button } from "@/components/ui/button.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleCheckBig as Check,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils.ts";
import { useParams } from "react-router-dom";
import { NavigationBar } from "@/components/complex/navigationBar.tsx";
import type { Quiz } from "@/interfaces/QuizInterface.tsx";
import { Content } from "@/components/ui/content.tsx";

export function SolveQuizPage() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState<Quiz>({
    id: quizId || "",
    title: "Sample Quiz",
    questions: [
      {
        id: "1",
        title: "Question 1",
        description: "This is a sample question",
        answers: [
          { id: "1", text: "Answer 1", isSelected: false },
          { id: "2", text: "Answer 2", isSelected: false },
          { id: "3", text: "Answer 3", isSelected: false },
        ],
        isAnswered: false,
      },
    ],
    isMultipleChoice: false,
    tags: [],
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleAnswerSelect = (answerId: string) => {
    const updatedQuestions = [...quiz.questions];
    const currentQuestion = updatedQuestions[currentQuestionIndex];

    if (quiz.isMultipleChoice) {
      // Dla multiple choice możemy zaznaczyć wiele odpowiedzi
      const answerIndex = currentQuestion.answers.findIndex(
        (a) => a.id === answerId,
      );
      currentQuestion.answers[answerIndex].isSelected =
        !currentQuestion.answers[answerIndex].isSelected;
    } else {
      // Dla single choice odznaczamy wszystkie inne odpowiedzi
      const isCurrentlySelected = currentQuestion.answers.find(
        (a) => a.id === answerId,
      )?.isSelected;
      currentQuestion.answers = currentQuestion.answers.map((answer) => ({
        ...answer,
        isSelected: answer.id === answerId ? !isCurrentlySelected : false,
      }));
    }

    // Oznacz pytanie jako odpowiedziane, jeśli jakakolwiek odpowiedź jest zaznaczona
    currentQuestion.isAnswered = currentQuestion.answers.some(
      (answer) => answer.isSelected,
    );

    setQuiz({ ...quiz, questions: updatedQuestions });
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
        .filter((answer) => answer.isSelected)
        .map((answer) => answer.id),
    }));

    console.log("Submitting answers:", answers);
  };

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />
      <Content>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">{quiz.title}</h1>

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
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                    ) : (
                      <Circle className="h-4 w-4 mr-2" />
                    )}
                    Question {index + 1}
                  </Button>
                ))}
              </ScrollArea>
            </div>

            {/* Zawartość pytania */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {currentQuestion.title}
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleNavigateQuestion("prev")}
                    disabled={currentQuestionIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
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
                    <ChevronRight className="h-4 w-4 ml-1" />
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
                {currentQuestion.answers.map((answer) => (
                  <div
                    key={answer.id}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-lg border",
                      answer.isSelected && "border-primary bg-primary/5",
                    )}
                    onClick={() => handleAnswerSelect(answer.id)}
                  >
                    <input
                      type="checkbox"
                      checked={answer.isSelected}
                      onChange={() => handleAnswerSelect(answer.id)}
                      className="h-4 w-4"
                    />
                    <span className="flex-1">{answer.text}</span>
                  </div>
                ))}
              </div>

              {/* Submit button */}
              {currentQuestionIndex === quiz.questions.length - 1 && (
                <Button
                  className="w-full mt-6"
                  onClick={handleSubmitQuiz}
                  disabled={!quiz.questions.every((q) => q.isAnswered)}
                >
                  Submit Quiz
                </Button>
              )}
            </div>
          </div>
        </div>
      </Content>
    </div>
  );
}
