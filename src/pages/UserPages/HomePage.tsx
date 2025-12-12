import { useEffect, useMemo, useRef, useState } from "react";
import { Content } from "@/components/ui/content.tsx";
import { useUser } from "@/features/user/UserContext.tsx";
import { NavigationBar } from "@/components/complex/navigationBar.tsx";
import type { ClassBrief, Exercise, QuizBrief } from "@/api/types.ts";
import CourseFilter from "@/components/complex/courseFilter.tsx";
import { CalendarSummary } from "@/components/complex/summaries/calendarSummary.tsx";
import { ExerciseSummary } from "@/components/complex/summaries/exerciseSummary.tsx";
import { ChatSummary } from "@/components/complex/summaries/chatSummary.tsx";
import { toast } from "sonner";
import { getUserId } from "@/api/api.ts";
import { QuizSummary } from "@/components/complex/summaries/quizSummary.tsx";
import { getClassBriefs } from "@/api/api calls/apiClasses.ts";
import {
  getExercisesReadyToGrade,
  getStudentUnsolvedExercises,
} from "@/api/api calls/apiExercises.ts";
import { getQuizzes } from "@/api/api calls/apiQuizzes.ts";

export function HomePage() {
  const { user } = useUser();
  const activeRole = user?.activeRole ?? null;

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [classes, setClasses] = useState<ClassBrief[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [quizzes, setQuizzes] = useState<QuizBrief[]>([]);

  // Unieważnianie starych odpowiedzi (race condition guard)
  const requestIdRef = useRef(0);

  // Refetch kursów przy każdej zmianie roli
  useEffect(() => {
    const currentReqId = ++requestIdRef.current;
    setClasses([]);
    setSelectedCourseId(null);

    const fetchClasses = async () => {
      try {
        const data = await getClassBriefs(user?.activeRole);
        // jeśli w międzyczasie rola się zmieniła, ignorujemy tę odpowiedź
        if (currentReqId !== requestIdRef.current) return;
        setClasses(data);
      } catch {
        if (currentReqId !== requestIdRef.current) return;
        // brak toasta przy 204 jest obsłużony w getCourseBriefs -> zwróci []
        // pokaż błąd tylko dla faktycznych błędów
        toast.error("Failed to load courses. Please try again later.");
      }
    };

    fetchClasses();
    // brak cleanupu potrzebnego   unieważnianie robi requestIdRef
  }, [activeRole]);

  useEffect(() => {
    const fetchUnsolvedExercises = async () => {
      try {
        if (activeRole === "student") {
          console.log("activeRole", activeRole);
          const data = await getStudentUnsolvedExercises(
            selectedCourseId ? [selectedCourseId] : undefined,
          );
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
        } else if (activeRole === "teacher") {
          const data = await getExercisesReadyToGrade(
            selectedStudentId ? [selectedStudentId] : undefined,
            selectedCourseId ? [selectedCourseId] : undefined,
          );
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
        } else {
          setExercises([]);
        }
      } catch (e) {
        console.error("Failed to fetch exercises", e);
        toast.error("Error getting exercises");
        setExercises([]);
      }
    };
    fetchUnsolvedExercises();
  }, [activeRole]);

  useEffect(() => {
    let studentId = getUserId();

    if (activeRole === "teacher") {
      studentId = selectedStudentId;
    }

    if (!studentId) return;

    const fetchQuizzes = async () => {
      try {
        const data = await getQuizzes(studentId, selectedCourseId ?? undefined);
        setQuizzes(data);
      } catch (e: any) {
        toast.error("Error getting quizzes");
      }
    };

    fetchQuizzes();
  }, [selectedCourseId, selectedStudentId]);

  const filteredClasses = useMemo(() => {
    if (!selectedCourseId) return classes;
    return classes.filter((c) => c.courseId === selectedCourseId);
  }, [classes, selectedCourseId]);

  return (
    <div className="bg-white h-screen">
      <NavigationBar />
      <Content>
        <div className="space-y-4">
          <CourseFilter
            student={activeRole === "student" || false}
            setSelectedCourseId={setSelectedCourseId}
            selectedCourseId={selectedCourseId}
            setSelectedStudentId={
              activeRole === "teacher" ? setSelectedStudentId : undefined
            }
            selectedStudentId={
              activeRole === "teacher" ? selectedStudentId : undefined
            }
            setupClassButton={activeRole === "student" || false}
          />
          <CalendarSummary
            key={`${activeRole ?? "none"}-${selectedCourseId ?? "all"}`}
            classes={filteredClasses}
          />

          <ExerciseSummary
            exercises={exercises}
            student={activeRole === "student" || false}
          />

          <QuizSummary
            quizzes={quizzes}
            student={activeRole === "student" || false}
          />
          <ChatSummary />
        </div>
      </Content>
    </div>
  );
}
