import { useState, useEffect, useCallback } from "react";
import { Content } from "@/components/ui/content.tsx";
import CourseFilter from "@/components/complex/courseFilter.tsx";
import ClassTile, {
  type ClassTileProps,
} from "@/components/complex/tiles/classTile.tsx";
import { LinksSummary } from "@/components/complex/summaries/linksSummary.tsx";
import { ExerciseSummary } from "@/components/complex/summaries/exerciseSummary.tsx";
import { getUserId } from "@/api/api.ts";
import { FilesSummary } from "@/components/complex/summaries/filesSummary.tsx";
import { useSearchParams } from "react-router-dom";
import { QuizSummary } from "@/components/complex/summaries/quizSummary.tsx";
import type { Exercise, FileProps, LinkProps, QuizBrief } from "@/types.ts";
import { LoadingTile } from "@/components/complex/tiles/loadingTile.tsx";
import { getClassFiles, getClassLinks } from "@/api/api calls/apiClasses.ts";
import { getClassExercises } from "@/api/api calls/apiExercises.ts";
import { getQuizzes } from "@/api/api calls/apiQuizzes.ts";
import { getStudentClasses } from "@/api/api calls/apiStudents.ts";

export function StudentCalendar() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(
    () => {
      return searchParams.get("courseId");
    },
  );

  // selectedClassId: init z URL
  const [selectedClassId, setSelectedClassId] = useState<string | null>(() => {
    return searchParams.get("classId");
  });

  // Left column: class tiles
  const [classes, setClasses] = useState<ClassTileProps[]>([]);

  // Right column: the result of filtering
  const [links, setLinks] = useState<LinkProps[]>([]);
  const [assignments, setAssignments] = useState<Exercise[]>([]);
  const [quizzes, setQuizzes] = useState<QuizBrief[]>([]);
  const [files, setFiles] = useState<FileProps[]>([]);

  // Sync with ?courseId & ?classId in URL
  useEffect(() => {
    const incomingCourseId = searchParams.get("courseId");
    const incomingClassId = searchParams.get("classId");

    setSelectedCourseId((prev) =>
      prev !== incomingCourseId ? incomingCourseId : prev,
    );
    setSelectedClassId((prev) =>
      prev !== incomingClassId ? incomingClassId : prev,
    );
  }, [searchParams]);

  // RETRIEVE CLASSES
  useEffect(() => {
    const studentId = getUserId();
    if (!studentId) return;

    const fetchClasses = async () => {
      const data = await getStudentClasses(studentId, selectedCourseId);
      setClasses(data);

      // If the selected class no longer exists (course change) -> clear the filter
      setSelectedClassId((prev) =>
        prev && !data.some((c) => c.id === prev) ? null : prev,
      );
    };

    fetchClasses().then();
  }, [selectedCourseId]);

  // Handler to toggle the selected class (clicking the same tile again clears the filter)
  const handleSelectClassId = useCallback(
    (id: string | null) => {
      setSelectedClassId((prev) => {
        const next = prev === id ? null : id;

        const params: Record<string, string> = {};
        const currentCourseId = searchParams.get("courseId");
        if (currentCourseId) params.courseId = currentCourseId;
        if (next) params.classId = next;

        setSearchParams(params, { replace: true });
        return next;
      });
    },
    [searchParams, setSearchParams],
  );

  // RECALCULATE RIGHT COLUMN: depends on [selectedClassId]
  useEffect(() => {
    if (!selectedClassId) {
      setLinks([]);
      setAssignments([]);
      setFiles([]);
      return;
    }

    const teacherId = getUserId(); // assuming this returns teacherId
    if (!teacherId) return;

    async function fetchExercises() {
      if (!selectedClassId) return;
      try {
        const data = await getClassExercises(selectedClassId);
        setAssignments(data ?? []);
      } catch (err) {
        console.error("fetchExercises:", err);
      }
    }

    async function fetchQuizzes() {
      if (!selectedClassId) return;
      try {
        const data = await getQuizzes(
          "student",
          undefined,
          undefined,
          undefined,
          selectedClassId,
        );
        setQuizzes(data ?? []);
      } catch (err) {
        console.error("fetchQuizzes:", err);
      }
    }

    async function fetchFiles() {
      if (!selectedClassId) return;
      try {
        const data = await getClassFiles(selectedClassId);
        setFiles(data ?? []);
      } catch (err) {
        console.error("fetchFiles:", err);
      }
    }

    async function fetchLinks() {
      if (!selectedClassId) return;
      try {
        const data = await getClassLinks(selectedClassId);
        setLinks(data ?? []);
      } catch (err) {
        console.error("fetchLinks:", err);
      }
    }

    fetchExercises().then();
    fetchQuizzes().then();
    fetchFiles().then();
    fetchLinks().then();
  }, [selectedClassId]);

  return (
    <Content>
      <CourseFilter
        student={true}
        setSelectedCourseId={(val) => {
          const nextId =
            typeof val === "function"
              ? (val as (p: string | null) => string | null)(selectedCourseId)
              : val;

          if (nextId === selectedCourseId) {
            // nic nie rób: nie czyść selectedClassId ani query stringa
            return;
          }

          setSelectedCourseId(nextId);
          setSelectedClassId(null);

          // aktualizacja query paramów   bez classId po realnej zmianie kursu
          if (nextId) {
            setSearchParams({ courseId: nextId }, { replace: true });
          } else {
            setSearchParams({}, { replace: true });
          }
        }}
        selectedCourseId={selectedCourseId}
        setupClassButton={true}
      />

      <div className="flex flex-row gap-8 p-4">
        <div className="w-1/4 sticky top-0 self-start h-fit space-y-2">
          {classes.length === 0 ? (
            <div className="gap-2 p-4 bg-slate-100 rounded-lg shadow-md hover:bg-slate-200 transition-all text-base">
              No classes available for the selected course
            </div>
          ) : (
            classes.map((c) => (
              <div key={c.id} id={`class-${c.id}`}>
                <ClassTile
                  {...c}
                  setSelectedClassId={handleSelectClassId}
                  selectedClassId={selectedClassId}
                />
              </div>
            ))
          )}
        </div>
        <div className="w-3/4 space-y-8">
          {selectedClassId ? (
            <>
              <LinksSummary links={links} student={true} />
              <ExerciseSummary exercises={assignments} student={true} />
              <QuizSummary quizzes={quizzes} student={true} />
              <FilesSummary files={files} lastCount={5} student={true} />
            </>
          ) : (
            <LoadingTile text={"Select a class to view its details."} />
          )}
        </div>
      </div>
    </Content>
  );
}
