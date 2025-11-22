import { useState, useEffect, useCallback } from "react";
import { Content } from "@/components/ui/content.tsx";
/* import Summary from "@/components/complex/summaries/summary.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx"; */
import CourseFilter from "@/components/complex/courseFilter.tsx";
import ClassTile, {
  type ClassTileProps,
} from "@/components/complex/classTile.tsx";
import {
  type LinkProps,
  LinksSummary,
} from "@/components/complex/summaries/linksSummary.tsx";
import {
  type AnyTask,
  ExerciseSummary,
  type QuizTask,
} from "@/components/complex/summaries/exerciseSummary.tsx";
import { getUserId } from "@/api/api.ts";
import {
  type FileProps,
  FilesSummary,
} from "@/components/complex/summaries/filesSummary.tsx";
import { useSearchParams } from "react-router-dom";
import { getQuizzes, getStudentTimeline } from "@/api/apiCalls.ts";
import { QuizSummary } from "@/components/complex/summaries/quizSummary.tsx";

type ClassBriefDto = {
  id: string;
  startTime: string;
  status: string;
  linkToMeeting?: string;
  links: string[];
  userId: string;
  courseId: string;
  courseName: string;
  exercises: {
    id: string;
    exerciseStatus: string;
    grade?: number;
  }[];
  quizzes: {
    id: string;
    score?: number;
  }[];
  files: {
    id: string;
    name: string;
    path: string;
    courseName: string;
    classDate: string;
  }[];
};

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

  // Raw timeline data (to recalculate when clicking a class)
  const [timeline, setTimeline] = useState<ClassBriefDto[]>([]);

  // Left column: class tiles
  const [classes, setClasses] = useState<ClassTileProps[]>([]);

  // Right column: the result of filtering
  const [links, setLinks] = useState<LinkProps[]>([]);
  const [assignments, setAssignments] = useState<AnyTask[]>([]);
  const [quizzes, setQuizzes] = useState<QuizTask[]>([]);
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

  // RETRIEVE TIMELINE
  useEffect(() => {
    const studentId = getUserId();
    if (!studentId) return;

    const fetchExercises = async () => {
      const data = await getStudentTimeline(studentId, selectedCourseId);
      setTimeline(data); // save raw data

      // Build left column data
      const now = new Date();
      const mappedClasses: ClassTileProps[] = data
        .map((cls) => {
          const start = new Date(cls.startTime);
          let state: "upcoming" | "ongoing" | "completed" = "completed";

          if (start > now) state = "upcoming";
          else if (
            start <= now &&
            now.getTime() - start.getTime() < 60 * 60 * 1000
          )
            // 60 * 60 * 1000 = 1 hour
            state = "ongoing";

          return {
            id: cls.id,
            state,
            date: start,
            title: cls.courseName,
            duration: 60,
          };
        })
        // Sort by date descending
        .sort((a, b) => b.date.getTime() - a.date.getTime());

      setClasses(mappedClasses);

      // If the selected class no longer exists (course change) -> clear the filter
      setSelectedClassId((prev) =>
        prev && !data.some((c) => c.id === prev) ? null : prev,
      );
    };

    fetchExercises().then();
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

  // RECALCULATE RIGHT COLUMN: depends on [selectedClassId, timeline]
  useEffect(() => {
    // A source data for aggregation: either a single class or the entire timeline
    const source = selectedClassId
      ? timeline.filter((c) => c.id === selectedClassId)
      : timeline;

    // Links
    const now = new Date();
    const mappedLinks: LinkProps[] = source.flatMap((cls) => {
      const start = new Date(cls.startTime);
      const isMeetingActive =
        !!cls.linkToMeeting &&
        Math.abs(now.getTime() - start.getTime()) < 10 * 60 * 1000;

      const allLinks = [...(cls.links ?? [])];
      if (isMeetingActive && cls.linkToMeeting) {
        // If the meeting is "active", put it at the beginning
        allLinks.unshift(cls.linkToMeeting);
      }

      return allLinks.map((link) => ({
        path: link,
        isMeeting: link === cls.linkToMeeting,
        courseName: cls.courseName,
        className: `[${cls.startTime.slice(0, 10)}]`,
      }));
    });

    // Assignments (exercises + quizzes)
    const mappedAssignments: AnyTask[] = source.flatMap((cls) => {
      const courseName = cls.courseName;
      const className = `Class ${cls.id.slice(0, 4)}`;
      const classDate = cls.startTime.slice(0, 10);

      const exercises = (cls.exercises ?? []).map((ex) => ({
        id: ex.id,
        name: `Exercise ${courseName} [${classDate}]`,
        className,
        courseName,
        completed: !!ex.grade,
        type: "assignment" as const,
        status: ex.exerciseStatus === "completed" ? "good" : "behind",
        graded: ex.grade !== undefined,
        grade: ex.grade,
      }));

      const quizzes = (cls.quizzes ?? []).map((qz) => ({
        id: qz.id,
        name: `Quiz ${courseName} [${classDate}]`,
        className,
        courseName,
        completed: !!qz.score,
        type: "quiz" as const,
        graded: qz.score !== undefined,
        grade: qz.score,
      }));

      return [...exercises, ...quizzes];
    });

    // Files
    const mappedFiles: FileProps[] = source.flatMap((cls) =>
      (cls.files ?? []).map((f) => ({
        id: f.id,
        name: f.name,
        filePath: f.path,
        associatedCourseName: cls.courseName,
        associatedClassDate: cls.startTime.slice(0, 10),
      })),
    );

    setLinks(mappedLinks);
    setAssignments(mappedAssignments);
    setFiles(mappedFiles);
  }, [selectedClassId, timeline]);

  useEffect(() => {
    const studentId = getUserId();
    if (!studentId) return;

    const fetchQuizzes = async () => {
      const data = await getQuizzes(
        studentId,
        selectedCourseId ?? undefined,
        undefined,
        selectedClassId ?? undefined,
      );

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
  }, [selectedCourseId, selectedClassId]);

  // Auto-scroll do wybranej kafelki (gdy przyszło z URL lub po kliknięciu)
  useEffect(() => {
    if (!selectedClassId) return;
    const el = document.getElementById(`class-${selectedClassId}`);
    if (el) {
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
  }, [classes, selectedClassId]);

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
          <LinksSummary links={links} student={true} />
          <ExerciseSummary exercises={assignments} student={true} />
          <QuizSummary quizzes={quizzes} student={true} />
          <FilesSummary files={files} lastCount={5} student={true} />
        </div>
      </div>
    </Content>
  );
}
