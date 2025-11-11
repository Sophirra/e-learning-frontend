import { useEffect, useMemo, useRef, useState } from "react";
import { Content } from "@/components/ui/content.tsx";
import { useUser } from "@/features/user/UserContext.tsx";
import { NavigationBar } from "@/components/complex/navigationBar.tsx";
import type { ClassBrief } from "@/api/types.ts";
import CourseFilter from "@/components/complex/courseFilter.tsx";
import { CalendarSummary } from "@/components/complex/summaries/calendarSummary.tsx";
import {
  type AnyTask,
  AssignmentSummary,
} from "@/components/complex/summaries/assignmentSummary.tsx";
import { ChatSummary } from "@/components/complex/summaries/chatSummary.tsx";
import { getClassBriefs, getStudentUnsolvedExercises } from "@/api/apiCalls.ts";
import { toast } from "sonner";
import { getUserId } from "@/api/api.ts";

export type ExerciseBrief = {
  id: string;
  courseId: string;
  courseName: string;
  classStartTime: string;
  exerciseStatus: string;
};

export function HomePage() {
  const { user } = useUser();
  const activeRole = user?.activeRole ?? null;

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [classes, setClasses] = useState<ClassBrief[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );
  const [assignmentsRaw, setAssignmentsRaw] = useState<ExerciseBrief[]>([]);
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

    const run = async () => {
      try {
        if (!activeRole) {
          // brak roli   nie fetchujemy nic
          return;
        }
        const data = await getClassBriefs(activeRole);
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

    run();
    // brak cleanupu potrzebnego   unieważnianie robi requestIdRef
  }, [activeRole]);

  // Pobranie zadań raz (jeśli mają zależeć od użytkownika/roli, dodaj zależność)
  useEffect(() => {
    const studentId = getUserId();
    if (!studentId) return;

    const fetchUnsolvedExercises = async () => {
      const data = await getStudentUnsolvedExercises(studentId)
      setAssignmentsRaw(data);
    };

    fetchUnsolvedExercises();
  }, []);

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
        status: ex.exerciseStatus === "completed" ? "good" : "behind",
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

          <AssignmentSummary
            assignments={visibleAssignments}
            student={activeRole === "student" || false}
          />
          <ChatSummary />
        </div>
      </Content>
    </div>
  );
}
