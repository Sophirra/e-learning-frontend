import { useEffect, useMemo, useRef, useState } from "react";
import { Content } from "@/components/ui/content.tsx";
import { useUser } from "@/features/user/UserContext.tsx";
import { NavigationBar } from "@/components/complex/navigationBar.tsx";
import type { AnyTask, ClassBrief, Exercise, QuizTask } from "@/api/types.ts";
import CourseFilter from "@/components/complex/courseFilter.tsx";
import { CalendarSummary } from "@/components/complex/summaries/calendarSummary.tsx";
import { ExerciseSummary } from "@/components/complex/summaries/exerciseSummary.tsx";
import { ChatSummary } from "@/components/complex/summaries/chatSummary.tsx";
import {
  getClassBriefs, getExercisesReadyToGrade,
  getQuizzes,
  getStudentUnsolvedExercises,
} from "@/api/apiCalls.ts";
import { toast } from "sonner";
import {getRoles, getUserId} from "@/api/api.ts";
import { QuizSummary } from "@/components/complex/summaries/quizSummary.tsx";
import {readPersistedRole} from "@/features/user/RolePersistence.ts";

export function HomePage() {
  const { user } = useUser();
  const activeRole = user?.activeRole ?? null;

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [classes, setClasses] = useState<ClassBrief[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );
  const [assignmentsRaw, setAssignmentsRaw] = useState<Exercise[]>([]);
  const [quizzes, setQuizzes] = useState<QuizTask[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  // Unieważnianie starych odpowiedzi (race condition guard)
  const requestIdRef = useRef(0);

  // Refetch kursów przy każdej zmianie roli
  useEffect(() => {
    const currentReqId = ++requestIdRef.current;

    // natychmiast wyczyść widok po zmianie roli
    setClasses([]);
    setSelectedCourseId(null);
    setLoadingCourses(true);

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
      } finally {
        if (currentReqId === requestIdRef.current) setLoadingCourses(false);
      }
    };

    fetchClasses();
    // brak cleanupu potrzebnego   unieważnianie robi requestIdRef
  }, [activeRole]);

  // Pobranie zadań raz (jeśli mają zależeć od użytkownika/roli, dodaj zależność)
  // TODO:  Komentarz czatu nie został dostosowany do naszej apki!!!!!
  //    dla nauczyciela powinna być analogiczna końcówka getTeacherUngradedExercises
  useEffect(() => {
    const userId = getUserId(); // albo user?.id, jeśli masz w kontekście
    if (!userId || !activeRole) return;

    const fetchUnsolvedExercises = async () => {
      try {
        if (activeRole === "student") {
          const data = await getStudentUnsolvedExercises(userId);
          setAssignmentsRaw(data);
        } else if (activeRole === "teacher") {
          const data = await getExercisesReadyToGrade(userId);
          setAssignmentsRaw(data);
        } else {
          setAssignmentsRaw([]);
        }
      } catch (e) {
        console.error("Failed to fetch exercises", e);
        toast.error("Nie udało się pobrać zadań.");
        setAssignmentsRaw([]);
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
      const data = await getQuizzes(studentId, selectedCourseId ?? undefined);

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
    };

    fetchQuizzes();
  }, [selectedCourseId, selectedStudentId]);

  const filteredClasses = useMemo(() => {
    if (!selectedCourseId) return classes;
    return classes.filter((c) => c.courseId === selectedCourseId);
  }, [classes, selectedCourseId]);

  const filteredRaw = useMemo(() => {
    if (!selectedCourseId) return assignmentsRaw;
    return assignmentsRaw.filter((ex) => ex.courseId === selectedCourseId);
  }, [assignmentsRaw, selectedCourseId]);

  const visibleAssignments: AnyTask[] = useMemo(() => {
    return filteredRaw.map((ex) => {
      const classDate = ex.classStartTime.slice(0, 10);
      return {
        id: ex.id,
        name: `Exercise ${ex.courseName} [${classDate}]`,
        courseName: ex.courseName,
        className: undefined,
        completed: false,
        type: "assignment",
        status: ex.exerciseStatus,
        graded: false,
        grade: undefined,
        comments: undefined,
      };
    });
  }, [filteredRaw]);

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
            exercises={visibleAssignments}
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
