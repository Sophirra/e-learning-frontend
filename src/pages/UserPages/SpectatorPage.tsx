import { useEffect, useState } from "react";
import { Content } from "@/components/ui/content.tsx";
import { NavigationBar } from "@/components/complex/navigationBar.tsx";
import type {
  AnyTask,
  ClassBrief,
  QuizTask,
  StudentBrief,
} from "@/api/types.ts";
import { LoadingTile } from "@/components/complex/tiles/loadingTile.tsx";
import { StudentTile } from "@/components/complex/tiles/studentTile.tsx";
import { toast } from "sonner";
import {
  getClassBriefs,
  getQuizzes,
  getSpectated as getSpectatedApi,
  getStudentUnsolvedExercises,
} from "@/api/apiCalls.ts";
import { CalendarSummary } from "@/components/complex/summaries/calendarSummary.tsx";
import { ExerciseSummary } from "@/components/complex/summaries/exerciseSummary.tsx";
import { QuizSummary } from "@/components/complex/summaries/quizSummary.tsx";

//Can spectate only as a student (parent is a student without classes?)
export function SpectatorPage() {
  const [students, setStudents] = useState<StudentBrief[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>();
  const [exercises, setExercises] = useState<AnyTask[]>([]);
  const [quizzes, setQuizzes] = useState<AnyTask[]>([]);
  const [classes, setClasses] = useState<ClassBrief[]>([]);

  useEffect(() => {
    getSpectated();

    async function getSpectated() {
      try {
        const data = await getSpectatedApi();
        setStudents(data);
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
        const data = await getStudentUnsolvedExercises(selectedStudentId || "");
        const mapped: AnyTask[] = data.map((e) => ({
          id: e.id,
          name: `Exercise ${e.courseName} [${e.classStartTime.slice(0, 10)}]`,
          courseName: e.courseName,
          className: undefined,
          completed: false,
          type: "assignment",
          status: e.exerciseStatus === "completed" ? "good" : "behind",
          graded: false,
        }));
        setExercises(mapped);
      } catch (e: any) {
        toast.error("Failed to fetch exercises: " + e.message);
      }
    }

    async function fetchQuizzes() {
      try {
        const data = await getQuizzes(selectedStudentId, undefined);
        const mapped = data.map(
          (q) =>
            ({
              id: q.id,
              name: q.name,
              courseName: q.courseName,
              className: undefined,
              completed: q.completed,
              type: "quiz",
            }) satisfies QuizTask,
        );
        setQuizzes(mapped);
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
