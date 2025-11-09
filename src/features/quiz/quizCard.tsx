import { Button } from "@/components/ui/button.tsx";
import type { QuizBrief } from "@/api/types.ts";
import { useNavigate } from "react-router-dom";

export function QuizCard({ quiz }: { quiz: QuizBrief }) {
  const navigate = useNavigate();
  return (
    <Button
      variant={"ghost"}
      className="shadow-md flex flex-col gap-1 h-1/1 items-start "
      // onClick={() => navigate("/quizzes/" + quiz.id)}
    >
      <h3 className="text-lg font-bold truncate">{quiz.name}</h3>
      <p className={"text-sm text-gray-800 font-semibold"}>
        {quiz.questionNumber} questions
      </p>
      <p className="text-m text-gray-500 font-medium">{quiz.courseName}</p>
    </Button>
  );
}
