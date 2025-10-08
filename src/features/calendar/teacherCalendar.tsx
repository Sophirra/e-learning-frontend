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
  AssignmentSummary,
} from "@/components/complex/summaries/assignmentSummary.tsx";
import api, { getUserId } from "../../api/api";
import {
  type FileProps,
  FilesSummary,
} from "@/components/complex/summaries/filesSummary.tsx";
import { DaySchedule } from "@/components/complex/daySchedule.tsx";
import type { TimeSlot } from "@/components/complex/weekSchedule.tsx";
import { Button } from "@/components/ui/button.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";

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

export function TeacherCalendar() {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // The class selcted in the left column
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  // Raw timeline data (to recalculate when clicking a class)
  const [timeline, setTimeline] = useState<ClassBriefDto[]>([]);

  // Left column: class tiles
  const [classes, setClasses] = useState<ClassTileProps[]>([]);

  // Right column: the result of filtering
  const [links, setLinks] = useState<LinkProps[]>([]);
  const [assignments, setAssignments] = useState<AnyTask[]>([]);
  const [files, setFiles] = useState<FileProps[]>([]);

  // RETRIEVE TIMELINE
  useEffect(() => {
    const studentId = getUserId();
    if (!studentId) return;

    const from = new Date();
    from.setDate(from.getDate() - 30);
    const to = new Date();

    const params: any = {
      from: from.toISOString(),
      to: to.toISOString(),
    };

    if (selectedCourseId) {
      params.participationIds = selectedCourseId;
    }

    api
      .get<ClassBriefDto[]>(`/api/students/${studentId}/timeline`, { params })
      .then((res) => {
        const data = (res.data ?? []) as ClassBriefDto[];

        setTimeline(data); // Save raw data

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
      })
      .catch((err) => {
        console.error("Timeline could not be retrieved:", err);
      });
  }, [selectedCourseId]);

  // Handler to toggle the selected class (clicking the same tile again clears the filter)
  const handleSelectClassId = useCallback((id: string | null) => {
    setSelectedClassId((prev) => (prev === id ? null : id));
  }, []);

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

  //tymczasowe dane
  // Selected time slots for booking
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);

  // Helper functions for DaySchedule
  const formatTime = (hour: number) => {
    return `${hour.toString().padStart(2, "0")}:00`;
  };

  const getDayName = (date: Date) => {
    const days = [
      "Niedziela",
      "Poniedziałek",
      "Wtorek",
      "Środa",
      "Czwartek",
      "Piątek",
      "Sobota",
    ];
    return days[date.getDay()];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const isSelected = (slot: TimeSlot) => {
    return selectedSlots.some(
      (s) =>
        s.start === slot.start &&
        s.end === slot.end &&
        s.dayIndex === slot.dayIndex,
    );
  };

  const onSelectSlot = (slot: TimeSlot) => {
    setSelectedSlots((prev) => {
      const exists = prev.some(
        (s) =>
          s.start === slot.start &&
          s.end === slot.end &&
          s.dayIndex === slot.dayIndex,
      );
      if (exists) {
        return prev.filter(
          (s) =>
            !(
              s.start === slot.start &&
              s.end === slot.end &&
              s.dayIndex === slot.dayIndex
            ),
        );
      }
      return [...prev, slot];
    });
  };

  // Example dates (today, tomorrow, day after tomorrow)
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

  // Example time slots
  const todaySlots: TimeSlot[] = [
    { start: 9, end: 10, dayIndex: 0, date: today },
    { start: 10, end: 11, dayIndex: 0, date: today },
    { start: 14, end: 15, dayIndex: 0, date: today },
    { start: 15, end: 16, dayIndex: 0, date: today },
  ];

  const tomorrowSlots: TimeSlot[] = [
    { start: 8, end: 9, dayIndex: 1, date: tomorrow },
    { start: 11, end: 12, dayIndex: 1, date: tomorrow },
    { start: 13, end: 14, dayIndex: 1, date: tomorrow },
  ];

  const dayAfterSlots: TimeSlot[] = [
    { start: 10, end: 11, dayIndex: 2, date: dayAfterTomorrow },
    { start: 12, end: 13, dayIndex: 2, date: dayAfterTomorrow },
  ];

  return (
    <Content>
      <CourseFilter
        student={false}
        setSelectedCourseId={(id) => {
          setSelectedCourseId(id);
          setSelectedClassId(null);
        }}
        selectedCourseId={selectedCourseId}
        setupClassButton={false}
      />
      <div className="flex flex-row gap-8 p-4">
        <div className="w-3/5 sticky top-0 self-start h-fit space-y-2">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
              disabled={!canGoBack}
            >
              <icons.ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="text-lg font-semibold">
              {formatDate(weekDays[0])} - {formatDate(weekDays[6])}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
              disabled={!canGoForward}
            >
              <icons.ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className={"grid grid-cols-3 gap-4"}>
            <DaySchedule
              date={today}
              dayIndex={0}
              timeSlots={todaySlots}
              isActive={true}
              isSelected={isSelected}
              onSelect={onSelectSlot}
              formatTime={formatTime}
              getDayName={getDayName}
              formatDate={formatDate}
            />
            <DaySchedule
              date={tomorrow}
              dayIndex={1}
              timeSlots={tomorrowSlots}
              isActive={true}
              isSelected={isSelected}
              onSelect={onSelectSlot}
              formatTime={formatTime}
              getDayName={getDayName}
              formatDate={formatDate}
            />
            <DaySchedule
              date={dayAfterTomorrow}
              dayIndex={2}
              timeSlots={dayAfterSlots}
              isActive={true}
              isSelected={isSelected}
              onSelect={onSelectSlot}
              formatTime={formatTime}
              getDayName={getDayName}
              formatDate={formatDate}
            />
          </div>
          {/*{classes === null || classes.length === 0 ? (*/}
          {/*  <div className="gap-2 p-4 bg-slate-100 rounded-lg shadow-md hover:bg-slate-200 transition-all text-base">*/}
          {/*    No classes available for the selected course*/}
          {/*  </div>*/}
          {/*) : (*/}
          {/*  classes.map((c) => (*/}
          {/*    <ClassTile*/}
          {/*      key={c.id}*/}
          {/*      {...c}*/}
          {/*      setSelectedClassId={handleSelectClassId}*/}
          {/*      selectedClassId={selectedClassId}*/}
          {/*    />*/}
          {/*  ))*/}
          {/*)}*/}
        </div>
        <div className="w-2/5 space-y-8">
          <LinksSummary links={links} />
          <AssignmentSummary assignments={assignments} student={false} />
          <FilesSummary files={files} lastCount={5} />
        </div>
      </div>
    </Content>
  );
}
