import { useState, useEffect } from "react";
import { Content } from "@/components/ui/content.tsx";
import CourseFilter from "@/components/complex/courseFilter.tsx";
import { getUserId } from "@/api/api.ts";
import { getTeacherAvailability } from "@/api/api calls/apiTeacher.ts";
import { QuizSummary } from "@/components/complex/summaries/quizSummary.tsx";
import type {
  ApiDayAvailability,
  ClassSchedule,
  Exercise,
  FileProps,
  LinkProps,
  QuizBrief,
  TimeSlot,
} from "@/types.ts";
import { LinksSummary } from "@/components/complex/summaries/linksSummary.tsx";
import { ExerciseSummary } from "@/components/complex/summaries/exerciseSummary.tsx";
import { FilesSummary } from "@/components/complex/summaries/filesSummary.tsx";
import Schedule from "@/components/complex/schedules/schedule.tsx";
import {
  getClassFiles,
  getClassLinks,
  getTeacherUpcomingClasses,
} from "@/api/api calls/apiClasses.ts";
import { getClassExercises } from "@/api/api calls/apiExercises.ts";
import { getQuizzes } from "@/api/api calls/apiQuizzes.ts";

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
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [quizzes, setQuizzes] = useState<QuizBrief[]>([]);
  const [files, setFiles] = useState<FileProps[]>([]);

  useEffect(() => {
    const teacherId = getUserId(); // assuming this returns teacherId
    if (!teacherId) return;

    const today = new Date();
    const end = new Date();
    end.setDate(today.getDate() + 20);

    const startParam = today.toISOString().slice(0, 10);
    const endParam = end.toISOString().slice(0, 10);

    // Fetch availability
    const fetchAvailability = async () => {
      const data = await getTeacherAvailability();
      setAvailability(data);
    };

    fetchAvailability().then();

    // Fetch upcoming classes
    const fetchClasses = async () => {
      const data = await getTeacherUpcomingClasses(startParam, endParam);
      setAllScheduledClasses(data);
      setScheduledClasses(data);
    };

    fetchClasses().then();
  }, []);

  // RECALCULATE RIGHT COLUMN: depends on [selectedClassId, timeline]
  useEffect(() => {
    if (!selectedClassId) {
      setLinks([]);
      setExercises([]);
      setFiles([]);
      return;
    }

    const teacherId = getUserId(); // assuming this returns teacherId
    if (!teacherId) return;

    async function fetchExercises() {
      if (!selectedClassId) return;
      try {
        const data = await getClassExercises(selectedClassId);
        setExercises(data ?? []);
      } catch (err) {
        console.error("fetchExercises:", err);
      }
    }

    async function fetchQuizzes() {
      if (!selectedClassId) return;
      try {
        const data = await getQuizzes(
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

  function handleSelect(slot: TimeSlot) {
    if (slot.classId) {
      setSelectedClassId(slot.classId);
      console.log("Selected class:", slot.classId);
    }
  }

  function handleStudentSelect(studentId: string | null) {
    setSelectedStudentId(studentId);
  }

  function resetFilters() {
    setQuizzes([]);
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
        resetExternal={resetFilters}
      />
      <div className="flex flex-row gap-8 p-4">
        <div className="w-1/2 sticky top-0 self-start h-fit space-y-2">
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
        <div className="w-1/2 space-y-8">
          <LinksSummary
            links={links}
            student={false}
            classId={selectedClassId ? selectedClassId : undefined}
          />
          <ExerciseSummary
            exercises={exercises}
            student={false}
            classId={selectedClassId ? selectedClassId : undefined}
          />
          <QuizSummary
            quizzes={quizzes}
            student={false}
            classId={selectedClassId ? selectedClassId : undefined}
          />
          <FilesSummary
            files={files}
            lastCount={5}
            student={false}
            classId={selectedClassId ? selectedClassId : undefined}
          />
        </div>
      </div>
    </Content>
  );
}
