import { useEffect, useState } from "react";
import { Content } from "@/components/ui/content.tsx";
import { NavigationBar } from "@/components/complex/navigationBar.tsx";
import type {
  ClassBrief,
  Exercise,
  QuizBrief,
  StudentBrief,
} from "@/api/types.ts";
import { LoadingTile } from "@/components/complex/tiles/loadingTile.tsx";
import { StudentTile } from "@/components/complex/tiles/studentTile.tsx";
import { toast } from "sonner";
import { CalendarSummary } from "@/components/complex/summaries/calendarSummary.tsx";
import { ExerciseSummary } from "@/components/complex/summaries/exerciseSummary.tsx";
import { QuizSummary } from "@/components/complex/summaries/quizSummary.tsx";
import { getClassBriefs } from "@/api/api calls/apiClasses.ts";
import { getStudentUnsolvedExercises } from "@/api/api calls/apiExercises.ts";
import { getSpectated as getSpectatedApi } from "@/api/api calls/apiSpectators.ts";
import { getQuizzes } from "@/api/api calls/apiQuizzes.ts";

//Can spectate only as a student (parent is a student without classes?)
export function SpectatorPage() {
  const [students, setStudents] = useState<StudentBrief[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [quizzes, setQuizzes] = useState<QuizBrief[]>([]);
  const [classes, setClasses] = useState<ClassBrief[]>([]);

  useEffect(() => {
    getSpectated();

    async function getSpectated() {
      try {
        const data = await getSpectatedApi();
        setStudents([data]);
      } catch (e: any) {
        toast.error("Failed to fetch spectated students: " + e.message);
      }
    }
  }, []);

  useEffect(() => {
    if (!selectedStudentId) return;
    else {
      fetchUnsolvedExercises();
      fetchQuizzes();
      fetchClasses();
    }
    async function fetchUnsolvedExercises() {
      try {
        if (!selectedStudentId) return;
        const data = await getStudentUnsolvedExercises([], selectedStudentId);
        setExercises(
          data.map((e) => {
            return {
              id: e.id,
              name:
                e.name ||
                e.courseName +
                  " [" +
                  e.classStartTime.toString().split("T")[0] +
                  "]",
              courseName: e.courseName,
              status: e.exerciseStatus,
              graded: false,
              date: e.classStartTime,
            };
          }),
        );
      } catch (e: any) {
        toast.error("Failed to fetch exercises: " + e.message);
      }
    }

    async function fetchQuizzes() {
      try {
        const data = await getQuizzes(selectedStudentId);
        setQuizzes(data);
      } catch (e: any) {
        toast.error("Failed to fetch quizzes: " + e.message);
      }
    }
    async function fetchClasses() {
      try {
        const data = await getClassBriefs("student");
        setClasses(data);
      } catch {
        toast.error("Failed to load courses. Please try again later.");
      }
    }
  }, [selectedStudentId]);

  return (
    <div className="bg-white h-screen">
      <NavigationBar />
      <Content>
        <div className="flex flex-row gap-8 p-4">
          {/*overflow-y-auto">*/}
          <div className="w-1/4 sticky top-0 self-start h-fit space-y-2">
            {students === null ||
            students === undefined ||
            students.length === 0 ? (
              <LoadingTile text={"No spectated students found."} />
            ) : (
              students.map((student) => (
                <StudentTile
                  student={student}
                  selectedStudentId={selectedStudentId}
                  setSelectedStudentId={setSelectedStudentId}
                />
              ))
            )}
          </div>

          <div className="w-3/4 space-y-8">
            {students.length !== 0 &&
            selectedStudentId &&
            students.some((e) => e.id === selectedStudentId) ? (
              <>
                <CalendarSummary classes={classes} />
                <ExerciseSummary exercises={exercises} student={true} />
                <QuizSummary quizzes={quizzes} student={true} />
              </>
            ) : (
              <LoadingTile text={"Select a student to see their details."} />
            )}
          </div>
        </div>
      </Content>
    </div>
  );
}
