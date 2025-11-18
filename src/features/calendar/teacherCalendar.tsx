import { useState, useEffect } from "react";
import { Content } from "@/components/ui/content.tsx";
/* import Summary from "@/components/complex/summaries/summary.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx"; */
import CourseFilter from "@/components/complex/courseFilter.tsx";
import {
  type LinkProps,
  LinksSummary,
} from "@/components/complex/summaries/linksSummary.tsx";
import {
  type AnyTask,
  AssignmentSummary,
  type QuizTask,
} from "@/components/complex/summaries/assignmentSummary.tsx";
import {
  type FileProps,
  FilesSummary,
} from "@/components/complex/summaries/filesSummary.tsx";
import Schedule, {
  type ApiDayAvailability,
  type ClassSchedule,
  type TimeSlot,
} from "@/components/complex/schedules/schedule.tsx";
import { getUserId } from "@/api/api.ts";
import {
  getClassBrief,
  getQuizzes,
  getTeacherAvailability,
  getTeacherUpcomingClasses,
} from "@/api/apiCalls.ts";
import { QuizSummary } from "@/components/complex/summaries/quizSummary.tsx";

export type ClassBriefDto = {
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
    title: string;
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

export function TeacherCalendar() {
  // Course filter
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );

  // Left column
  const [availability, setAvailability] = useState<ApiDayAvailability[]>([]);
  const [allScheduledClasses, setAllScheduledClasses] = useState<
    ClassSchedule[]
  >([]);
  const [scheduledClasses, setScheduledClasses] = useState<ClassSchedule[]>([]);

  // The class selected in the left column
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  // Right column: the result of filtering
  const [links, setLinks] = useState<LinkProps[]>([]);
  const [assignments, setAssignments] = useState<AnyTask[]>([]);
  const [quizzes, setQuizzes] = useState<AnyTask[]>([]);
  const [files, setFiles] = useState<FileProps[]>([]);

  useEffect(() => {
    const teacherId = getUserId(); // assuming this returns teacherId
    if (!teacherId) return;

    const today = new Date();
    const end = new Date();
    end.setDate(today.getDate() + 6);

    const startParam = today.toISOString().slice(0, 10);
    const endParam = end.toISOString().slice(0, 10);

    // Fetch availability
    const fetchAvailability = async () => {
      const data = await getTeacherAvailability(teacherId);
      setAvailability(data);
    };

    fetchAvailability().then();

    // Fetch upcoming classes
    const fetchExercises = async () => {
      const data = await getTeacherUpcomingClasses(
        teacherId,
        startParam,
        endParam,
      );
      setAllScheduledClasses(data);
      setScheduledClasses(data);
    };

    fetchExercises().then();
  }, []);

  // RECALCULATE RIGHT COLUMN: depends on [selectedClassId, timeline]
  useEffect(() => {
    if (!selectedClassId) {
      setLinks([]);
      setAssignments([]);
      setFiles([]);
      return;
    }

    const fetchUnsolvedExercises = async () => {
      const data = await getClassBrief(selectedClassId);

      const cls = data;
      const now = new Date();
      const start = new Date(cls.startTime);
      const isMeetingActive =
        !!cls.linkToMeeting &&
        Math.abs(now.getTime() - start.getTime()) < 10 * 60 * 1000;

      // LINKS
      const allLinks = [...(cls.links ?? [])];
      if (isMeetingActive && cls.linkToMeeting) {
        allLinks.unshift(cls.linkToMeeting);
      }

      const mappedLinks: LinkProps[] = allLinks.map((link) => ({
        path: link,
        isMeeting: link === cls.linkToMeeting,
        courseName: cls.courseName,
        className: `[${cls.startTime.toString().slice(0, 10)}]`,
      }));

      // ASSIGNMENTS
      const courseName = cls.courseName;
      const className = `Class ${cls.id.toString().slice(0, 4)}`;
      const classDate = cls.startTime.toString().slice(0, 10);

      const exercises = (cls.exercises ?? []).map((ex) => ({
        id: ex.id,
        name: `Exercise ${courseName} [${classDate}]`,
        className,
        courseName,
        completed: !!ex.grade,
        type: "assignment" as const,
        status: ex.exerciseStatus === "completed" ? "good" : "behind",
        graded: ex.grade !== undefined,
        grade: ex.grade ?? null,
      }));

      const quizzes = (cls.quizzes ?? []).map((qz) => ({
        id: qz.id,
        name: `Quiz ${courseName} [${classDate}]`,
        className,
        courseName,
        completed: !!qz.score,
        type: "quiz" as const,
        graded: qz.score !== undefined,
        grade: qz.score ?? null,
      }));

      const mappedAssignments: AnyTask[] = [...exercises, ...quizzes];

      // FILES
      const mappedFiles: FileProps[] = (cls.files ?? []).map((f) => ({
        id: f.id,
        name: f.name,
        filePath: f.path,
        associatedCourseName: cls.courseName,
        associatedClassDate: cls.startTime.toString().slice(0, 10),
      }));

      setLinks(mappedLinks);
      setAssignments(mappedAssignments);
      setFiles(mappedFiles);
    };

    fetchUnsolvedExercises();
  }, [selectedClassId]);

  // Filter scheduled classes when filter changes
  useEffect(() => {
    let filtered = allScheduledClasses;

    if (selectedStudentId) {
      filtered = filtered.filter((cls) => cls.studentId === selectedStudentId);
    }

    if (selectedCourseId) {
      filtered = filtered.filter((cls) => cls.courseId === selectedCourseId);
    }

    setScheduledClasses(filtered);

    setSelectedClassId((prev) =>
      prev && !filtered.some((cls) => cls.classId === prev) ? null : prev,
    );
  }, [selectedStudentId, selectedCourseId]);

  useEffect(() => {
    if (!selectedClassId) return;

    const fetchQuizzes = async () => {
      const data = await getQuizzes(undefined, undefined, undefined, selectedClassId);

      const mapped = data.map(q => ({
        id: q.id,
        name: q.name,
        courseName: q.courseName,
        className: undefined,
        completed: q.completed,
        type: "quiz",
      } satisfies QuizTask));

      setQuizzes(mapped);
    };

    fetchQuizzes();
  }, [selectedClassId]);

  function handleSelect(slot: TimeSlot) {
    if (slot.classId) {
      setSelectedClassId(slot.classId);
      console.log("Selected class:", slot.classId);
    }
  }

  function handleStudentSelect(studentId: string | null) {
    setSelectedStudentId(studentId);
  }

  return (
    <Content>
      <CourseFilter
        student={false}
        setSelectedStudentId={(s) => handleStudentSelect(s)}
        setSelectedCourseId={(id) => {
          setSelectedCourseId(id);
          setSelectedClassId(null);
        }}
        selectedCourseId={selectedCourseId}
        selectedStudentId={selectedStudentId}
        setupClassButton={false}
      />
      <div className="flex flex-row gap-8 p-4">
        <div className="w-3/5 sticky top-0 self-start h-fit space-y-2">
          <Schedule
            daysCount={3}
            startDate={new Date()}
            apiDayAvailability={availability}
            displayMode={"class"}
            classes={scheduledClasses}
            onSelect={handleSelect}
            selectedClassId={selectedClassId ?? undefined}
          />
        </div>
        <div className="w-2/5 space-y-8">
          <LinksSummary
            links={links}
            student={false}
            classId={selectedClassId ? selectedClassId : undefined}
          />
          <AssignmentSummary
            assignments={assignments}
            student={false}
            classId={selectedClassId ? selectedClassId : undefined}
          />
          <QuizSummary
            quizzes={quizzes}
            student={false}
            classId={selectedClassId ? selectedClassId : undefined}
          />
          <FilesSummary files={files} lastCount={5} student={false} />
        </div>
      </div>
    </Content>
  );
}
