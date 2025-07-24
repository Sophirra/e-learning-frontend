import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Toggle } from "@/components/ui/toggle.tsx";
import { Tooltip } from "@/components/ui/tooltip.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils.ts";
import { NavigationHeader } from "@/components/complex/navigationHeader.tsx";
import { Content } from "@/components/ui/content.tsx";

/**
 * Represents an answer in a quiz question
 * @interface Answer
 * @property {string} id - Unique identifier for the answer
 * @property {string} text - The text content of the answer
 * @property {boolean} isCorrect - Indicates if this is a correct answer
 */
interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

/**
 * Represents a question in a quiz
 * @interface Question
 * @property {string} id - Unique identifier for the question
 * @property {string} title - The title of the question
 * @property {string} description - Detailed description of the question
 * @property {string} [imageUrl] - Optional URL for question image
 * @property {Answer[]} answers - List of possible answers
 * @property {boolean} isReady - Indicates if the question is complete and valid
 */
interface Question {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  answers: Answer[];
  isReady: boolean;
}

/**
 * Represents a complete quiz
 * @interface Quiz
 * @property {string} name - The name of the quiz
 * @property {string[]} tags - Categories or topics associated with the quiz
 * @property {boolean} isMultipleChoice - Whether multiple answers can be correct
 * @property {number} correctAnswersCount - Number of correct answers required
 * @property {Question[]} questions - List of questions in the quiz
 */
interface Quiz {
  name: string;
  tags: string[];
  isMultipleChoice: boolean;
  correctAnswersCount: number;
  questions: Question[];
}

/**
 * Component for creating and editing quizzes
 * Provides interface for managing quiz properties, questions, and answers
 * @component
 * @returns {JSX.Element} The rendered quiz creation page
 */
export function CreateQuizPage() {
  // Stan główny quizu
  const [quiz, setQuiz] = useState<Quiz>({
    name: "New Quiz",
    tags: [],
    isMultipleChoice: false,
    correctAnswersCount: 1,
    questions: [],
  });

  // Stany edycyjne
  const [isEditingName, setIsEditingName] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [newAnswerText, setNewAnswerText] = useState("");
  const [newTagText, setNewTagText] = useState("");
  const [availableTags, setAvailableTags] = useState<string[]>([]); // do pobrania z API
  const [isEditingQuestionTitle, setIsEditingQuestionTitle] = useState(false);

  // Sprawdzanie gotowości pytania
  /**
   * Validates if a question meets all requirements
   * @param {Question} question - The question to validate
   * @returns {boolean} True if the question is complete and valid
   */
  const checkQuestionReady = (question: Question): boolean => {
    return !!(
      question.title &&
      (question.description || question.imageUrl) &&
      question.answers.filter((a) => a.isCorrect).length >=
        quiz.correctAnswersCount
    );
  };

  // Automatyczne zapisywanie pytania
  const saveCurrentQuestion = () => {
    const updatedQuestions = [...quiz.questions];
    if (updatedQuestions[currentQuestionIndex]) {
      updatedQuestions[currentQuestionIndex].isReady = checkQuestionReady(
        updatedQuestions[currentQuestionIndex],
      );
      setQuiz({
        ...quiz,
        questions: updatedQuestions,
      });
    }
  };

  // Nawigacja między pytaniami
  /**
   * Handles navigation between questions
   * @param {'prev' | 'next'} direction - Direction to navigate
   */
  const handleNavigateQuestion = (direction: "prev" | "next") => {
    saveCurrentQuestion();
    const newIndex =
      direction === "prev"
        ? currentQuestionIndex - 1
        : currentQuestionIndex + 1;
    setCurrentQuestionIndex(newIndex);
  };

  // Dodawanie nowego pytania
  /**
   * Adds a new question to the quiz
   * Creates a question with default values and empty answers
   */
  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      title: `Question ${quiz.questions.length + 1}`,
      description: "",
      answers: [],
      isReady: false,
    };
    setQuiz({
      ...quiz,
      questions: [...quiz.questions, newQuestion],
    });
  };

  // Dodawanie odpowiedzi
  /**
   * Adds a new answer to the current question
   * Creates an answer with the current newAnswerText value
   */
  const handleAddAnswer = () => {
    if (!newAnswerText.trim()) return;

    const newAnswer: Answer = {
      id: crypto.randomUUID(),
      text: newAnswerText,
      isCorrect: false,
    };

    const updatedQuestions = [...quiz.questions];
    updatedQuestions[currentQuestionIndex].answers.push(newAnswer);

    setQuiz({
      ...quiz,
      questions: updatedQuestions,
    });
    setNewAnswerText("");
  };

  // Zmiana poprawności odpowiedzi
  /**
   * Toggles the correct status of an answer
   * Handles both single and multiple choice questions
   * @param {string} answerId - ID of the answer to toggle
   */
  const handleToggleCorrect = (answerId: string) => {
    const updatedQuestions = [...quiz.questions];
    const currentQuestion = updatedQuestions[currentQuestionIndex];
    const answerIndex = currentQuestion.answers.findIndex(
      (a) => a.id === answerId,
    );

    if (quiz.isMultipleChoice) {
      currentQuestion.answers[answerIndex].isCorrect =
        !currentQuestion.answers[answerIndex].isCorrect;
    } else {
      currentQuestion.answers = currentQuestion.answers.map((answer, i) => ({
        ...answer,
        isCorrect: answer.id === answerId,
      }));
    }

    setQuiz({
      ...quiz,
      questions: updatedQuestions,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <NavigationHeader />
      <Content>
        {/* Tags Section */}

        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          <div className="flex w-full items-center space-x-4 p-4">
            {quiz.tags.map((tag, index) => (
              <Button
                key={index}
                variant="outline"
                className="flex items-center gap-2"
              >
                <icons.Tag className="h-4 w-4" />
                {tag}
              </Button>
            ))}
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Add existing tag" />
              </SelectTrigger>
              <SelectContent>
                {availableTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {
                if (newTagText.trim()) {
                  setQuiz({
                    ...quiz,
                    tags: [...quiz.tags, newTagText],
                  });
                  setNewTagText("");
                }
              }}
            >
              <icons.Plus className="h-4 w-4" />
              New Tag
            </Button>
          </div>
        </ScrollArea>

        {/* Quiz Header */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isEditingName ? (
              <Input
                value={quiz.name}
                onChange={(e) => setQuiz({ ...quiz, name: e.target.value })}
                onBlur={() => setIsEditingName(false)}
                className="w-[300px]"
              />
            ) : (
              <>
                <h1 className="text-2xl font-bold">{quiz.name}</h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditingName(true)}
                >
                  <icons.Pen className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Toggle
              pressed={quiz.isMultipleChoice}
              onPressedChange={(value) =>
                setQuiz({ ...quiz, isMultipleChoice: value })
              }
            >
              Multiple Choice
            </Toggle>
            <Select
              value={quiz.correctAnswersCount.toString()}
              onValueChange={(value) =>
                setQuiz({ ...quiz, correctAnswersCount: parseInt(value) })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Correct answers" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} correct {num === 1 ? "answer" : "answers"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={saveCurrentQuestion}>Save Quiz</Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-6 grid grid-cols-[300px_1fr] gap-6">
          {/* Question Navigation */}
          <div className="space-y-4">
            <ScrollArea className="h-[calc(100vh-300px)]">
              {quiz.questions.map((question, index) => (
                <Tooltip
                  key={question.id}
                  content={
                    !question.isReady ? "Question is not ready" : undefined
                  }
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      currentQuestionIndex === index && "bg-secondary",
                      !question.isReady && "text-red-500 border-red-500",
                    )}
                    onClick={() => {
                      saveCurrentQuestion();
                      setCurrentQuestionIndex(index);
                    }}
                  >
                    Question {index + 1}
                  </Button>
                </Tooltip>
              ))}
            </ScrollArea>
            <Button className="w-full" onClick={handleAddQuestion}>
              <icons.Plus className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </div>

          {/* Question Details */}
          {quiz.questions[currentQuestionIndex] && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isEditingQuestionTitle ? (
                    <Input
                      value={quiz.questions[currentQuestionIndex].title}
                      onChange={(e) => {
                        const updatedQuestions = [...quiz.questions];
                        updatedQuestions[currentQuestionIndex].title =
                          e.target.value;
                        setQuiz({ ...quiz, questions: updatedQuestions });
                      }}
                      onBlur={() => setIsEditingQuestionTitle(false)}
                      className="w-[300px]"
                    />
                  ) : (
                    <>
                      <h2 className="text-xl font-semibold">
                        {quiz.questions[currentQuestionIndex].title}
                      </h2>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsEditingQuestionTitle(true)}
                      >
                        <icons.Pen className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleNavigateQuestion("prev")}
                    disabled={currentQuestionIndex === 0}
                  >
                    <icons.ChevronLeft className="h-4 w-4" />
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
                    <icons.ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label>Description</Label>
                  <textarea
                    className={cn(
                      "w-full min-h-[200px] rounded-md border p-2",
                      !quiz.questions[currentQuestionIndex].description &&
                        "border-red-500",
                    )}
                    value={quiz.questions[currentQuestionIndex].description}
                    onChange={(e) => {
                      const updatedQuestions = [...quiz.questions];
                      updatedQuestions[currentQuestionIndex].description =
                        e.target.value;
                      setQuiz({ ...quiz, questions: updatedQuestions });
                    }}
                    placeholder="Enter question description..."
                  />
                  <Button variant="outline" className="w-full">
                    <icons.ImageIcon className="mr-2 h-4 w-4" />
                    Add Image
                  </Button>
                </div>

                <div className="space-y-4">
                  <Label>Answers</Label>
                  {quiz.questions[currentQuestionIndex].answers.map(
                    (answer) => (
                      <div key={answer.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={answer.isCorrect}
                          onChange={() => handleToggleCorrect(answer.id)}
                        />
                        <Input
                          value={answer.text}
                          onChange={(e) => {
                            const updatedQuestions = [...quiz.questions];
                            const answerIndex = updatedQuestions[
                              currentQuestionIndex
                            ].answers.findIndex((a) => a.id === answer.id);
                            updatedQuestions[currentQuestionIndex].answers[
                              answerIndex
                            ].text = e.target.value;
                            setQuiz({ ...quiz, questions: updatedQuestions });
                          }}
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const updatedQuestions = [...quiz.questions];
                            updatedQuestions[currentQuestionIndex].answers =
                              updatedQuestions[
                                currentQuestionIndex
                              ].answers.filter((a) => a.id !== answer.id);
                            setQuiz({ ...quiz, questions: updatedQuestions });
                          }}
                        >
                          <icons.Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ),
                  )}
                  <div className="flex items-center gap-2">
                    <Input
                      value={newAnswerText}
                      onChange={(e) => setNewAnswerText(e.target.value)}
                      placeholder="New answer..."
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleAddAnswer();
                        }
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleAddAnswer}
                    >
                      <icons.Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Content>
    </div>
  );
}
