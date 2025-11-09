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
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useEffect, useState } from "react";
import { useUser } from "@/features/user/UserContext.tsx";
import type { Quiz, QuizBrief } from "@/api/types.ts";
import { getQuiz, getStudentById, getTeacherById } from "@/api/apiCalls.ts";
import { useNavigate } from "react-router-dom";

export function QuizDetailsPopup({ quizBrief }: { quizBrief: QuizBrief }) {
  const { user } = useUser();
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);
  const [quiz, setQuiz] = useState<Quiz>({
    id: "1",
    name: "Quiz number 1",
    classId: "1",
    courseId: "1",
    courseName: "course A",
    teacherId: "11111111-1111-1111-1111-111111111111",
    studentId: "11111111-1111-1111-1111-111111111111",
    // questions: Question[];
    isMultipleChoice: true,
    // score: 6
    maxScore: 10,
  });

  const [teacher, setTeacher] = useState<string>("");
  const [student, setStudent] = useState<string>("");

  useEffect(() => {
    async function getPersonDetails() {
      if (load) {
        //TODO: odkomentować jak będzie działał backend
        // const quizData = await getQuiz(quizBrief.id);
        // setQuiz(quizData);
        if (user?.activeRole === "teacher") {
          const studentData = await getStudentById(quiz.studentId);
          setStudent(studentData.name + " " + studentData.surname);
        } else if (user?.activeRole === "student") {
          const teacherData = await getTeacherById(quiz.teacherId);
          setTeacher(teacherData.name + " " + teacherData.surname);
        }
      }
    }
    getPersonDetails();
  }, [load]);

  return (
    <Dialog onOpenChange={() => setLoad(false)}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="shadow-md flex flex-col gap-1 h-1/1 items-start "
          onClick={() => setLoad(true)}
        >
          <h3 className="text-lg font-bold truncate">{quizBrief.name}</h3>
          <p className={"text-sm text-gray-800 font-semibold"}>
            {quizBrief.questionNumber} questions
          </p>
          <p className="text-m text-gray-500 font-medium">
            {quizBrief.courseName}
          </p>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{quiz.name}</DialogTitle>
          <DialogDescription>
            {quiz.courseName}
            {user?.activeRole === "teacher"
              ? " for " + student
              : " by " + teacher}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Label>
            {quizBrief.questionNumber} questions,{" "}
            {quiz.isMultipleChoice ? "multiple choice" : "single choice"}
          </Label>
          <Label>
            Score:{" "}
            {quiz.score ? quiz.score + "/" + quiz.maxScore : "not solved yet"}
          </Label>
        </div>
        <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
          <DialogClose>
            <Button>Cancel</Button>
          </DialogClose>
          <Button
            variant={"outline"}
            onClick={() => {
              navigate(
                "/quizzes/" +
                  quiz.id +
                  (user?.activeRole === "student" ? "/solve" : "/edit"),
              );
            }}
            disabled={user?.activeRole !== "student"}
          >
            {user?.activeRole === "student" ? "Solve" : "Edit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
