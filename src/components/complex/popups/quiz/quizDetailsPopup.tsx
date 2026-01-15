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
import { useUser } from "@/lib/user/UserContext.tsx";
import type { Quiz, QuizBrief } from "@/types.ts";
import { getTeacherById } from "@/api/api calls/apiTeacher.ts";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils.ts";
import { CreateQuizPopup } from "@/components/complex/popups/quiz/createQuizPopup.tsx";
import { getQuiz } from "@/api/api calls/apiQuizzes.ts";
import { getStudentById } from "@/api/api calls/apiStudents.ts";

export function QuizDetailsPopup({
  quizBrief,
  selected,
  setSelected,
}: {
  quizBrief: QuizBrief;
  selected?: boolean;
  setSelected?: (quiz: QuizBrief | null) => void;
}) {
  const { user } = useUser();
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);
  const [quiz, setQuiz] = useState<Quiz>({
    id: "1",
    name: "Loading quiz..",
    classId: "1",
    courseId: "1",
    courseName: "",
    teacherId: "11111111-1111-1111-1111-111111111111",
    studentId: "11111111-1111-1111-1111-111111111111",
    isMultipleChoice: true,
    maxScore: 0,
  });

  const [teacher, setTeacher] = useState<string>("");
  const [student, setStudent] = useState<string>("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getPersonDetails();
    async function getPersonDetails() {
      console.log("load", load);
      if (load) {
        console.log("Loading quiz details...");
        const quizData = await getQuiz(quizBrief.id);
        setQuiz(quizData);
        console.log("Set quiz:", quiz);
        if (quiz) {
          if (user?.activeRole === "teacher") {
            const studentData = await getStudentById(quiz.studentId);
            setStudent(studentData.name + " " + studentData.surname);
          } else if (user?.activeRole === "student") {
            const teacherData = await getTeacherById(quiz.teacherId);
            setTeacher(teacherData.name + " " + teacherData.surname);
          }
        }
      }
    }
  }, [load]);

  function handleSelect() {
    if (setSelected) {
      setSelected(quizBrief);
      toast.success("Selected quiz: " + quizBrief.name);
      setOpen(true);
    } else {
      toast.error("Couldn't select quiz");
    }
  }

  return (
    <Dialog
      onOpenChange={async (open) => {
        if (open) {
          setLoad(true);
        }
        setOpen(open);
      }}
      open={open}
    >
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className={cn(
            "shadow-md flex flex-col gap-1 h-1/1 items-start ",
            selected && "bg-slate-200",
          )}
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
      {quiz && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{quiz.name}</DialogTitle>
            <DialogDescription>{quiz.courseName}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Label>
              {quizBrief.questionNumber} questions,{" "}
              {quiz.isMultipleChoice ? "multiple choice" : "single choice"}
            </Label>
            <Label>
              Score:{" "}
              {quiz.score
                ? `${Math.floor(quiz.score)}` + "/100%"
                : "not solved yet"}
            </Label>
          </div>
          <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
            <DialogClose>
              <Button>Cancel</Button>
            </DialogClose>
            {setSelected ? (
              <Button variant={"outline"} onClick={() => handleSelect()}>
                Choose
              </Button>
            ) : user?.activeRole === "student" ? (
              <Button
                variant={"outline"}
                onClick={() => {
                  navigate("/quizzes/" + quiz.id + "/solve");
                }}
                disabled={!!quiz.score}
              >
                Solve
              </Button>
            ) : (
              !load && (
                <CreateQuizPopup
                  classId={quiz.classId}
                  editingQuiz={quizBrief}
                />
              )
            )}
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
