import { useState, useEffect, useCallback } from "react";
import { Content } from "@/components/ui/content.tsx";
/* import Summary from "@/components/complex/summaries/summary.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx"; */
import CourseFilter from "@/components/complex/courseFilter.tsx";
import { type ClassTileProps } from "@/components/complex/classTile.tsx";
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
import Schedule, {
  type ApiDayAvailability,
  type ClassSchedule,
  type TimeSlot,
} from "@/components/complex/schedules/schedule.tsx";

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

  //TODO: MODIFY TO ACCOMMODATE TO TEACHER

  // RETRIEVE TIMELINE
  // useEffect(() => {
  //   const studentId = getUserId();
  //   if (!studentId) return;
  //
  //   const from = new Date();
  //   from.setDate(from.getDate() - 30);
  //   const to = new Date();
  //
  //   const params: any = {
  //     from: from.toISOString(),
  //     to: to.toISOString(),
  //   };
  //
  //   if (selectedCourseId) {
  //     params.participationIds = selectedCourseId;
  //   }
  //
  //   api
  //     .get<ClassBriefDto[]>(`/api/students/${studentId}/timeline`, { params })
  //     .then((res) => {
  //       const data = (res.data ?? []) as ClassBriefDto[];
  //
  //       setTimeline(data); // Save raw data
  //
  //       // Build left column data
  //       const now = new Date();
  //       const mappedClasses: ClassTileProps[] = data
  //         .map((cls) => {
  //           const start = new Date(cls.startTime);
  //           let state: "upcoming" | "ongoing" | "completed" = "completed";
  //
  //           if (start > now) state = "upcoming";
  //           else if (
  //             start <= now &&
  //             now.getTime() - start.getTime() < 60 * 60 * 1000
  //           )
  //             // 60 * 60 * 1000 = 1 hour
  //             state = "ongoing";
  //
  //           return {
  //             id: cls.id,
  //             state,
  //             date: start,
  //             title: cls.courseName,
  //             duration: 60,
  //           };
  //         })
  //         // Sort by date descending
  //         .sort((a, b) => b.date.getTime() - a.date.getTime());
  //
  //       setClasses(mappedClasses);
  //
  //       // If the selected class no longer exists (course change) -> clear the filter
  //       setSelectedClassId((prev) =>
  //         prev && !data.some((c) => c.id === prev) ? null : prev,
  //       );
  //     })
  //     .catch((err) => {
  //       console.error("Timeline could not be retrieved:", err);
  //     });
  // }, [selectedCourseId]);

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

  let tempAvailability: ApiDayAvailability[] = [
    {
      day: new Date().toISOString().slice(0, 10), // Dzisiaj
      timeslots: [
        { timeFrom: "10:00", timeUntil: "11:00" },
        { timeFrom: "14:00", timeUntil: "15:00" },
        { timeFrom: "15:00", timeUntil: "16:00" },
      ],
    },
    {
      day: new Date(Date.now() + 86400000).toISOString().slice(0, 10), // Jutro
      timeslots: [
        { timeFrom: "08:00", timeUntil: "09:00" },
        { timeFrom: "11:00", timeUntil: "12:00" },
        { timeFrom: "13:00", timeUntil: "14:00" },
        { timeFrom: "16:00", timeUntil: "17:00" },
      ],
    },
    {
      day: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10), // Pojutrze
      timeslots: [
        { timeFrom: "10:00", timeUntil: "11:00" },
        { timeFrom: "12:00", timeUntil: "13:00" },
        { timeFrom: "14:00", timeUntil: "15:00" },
      ],
    },
    {
      day: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
      timeslots: [
        { timeFrom: "10:00", timeUntil: "11:00" },
        { timeFrom: "11:00", timeUntil: "12:00" },
        { timeFrom: "15:00", timeUntil: "16:00" },
      ],
    },
    {
      day: new Date(Date.now() + 86400000 * 4).toISOString().slice(0, 10),
      timeslots: [],
    },
    {
      day: new Date(Date.now() + 86400000 * 5).toISOString().slice(0, 10),
      timeslots: [
        { timeFrom: "13:00", timeUntil: "14:00" },
        { timeFrom: "14:00", timeUntil: "15:00" },
      ],
    },
    {
      day: new Date(Date.now() + 86400000 * 6).toISOString().slice(0, 10),
      timeslots: [
        { timeFrom: "09:00", timeUntil: "10:00" },
        { timeFrom: "10:00", timeUntil: "11:00" },
        { timeFrom: "12:00", timeUntil: "13:00" },
        { timeFrom: "13:00", timeUntil: "14:00" },
        { timeFrom: "14:00", timeUntil: "15:00" },
      ],
    },
  ];

  const tempClasses: ClassSchedule[] = [
    {
      classId: "class-001",
      studentName: "Jan Kowalski",
      courseName: "Mathematics",
      classDate: new Date(),
      classStartTime: "09:00",
      classEndTime: "10:00",
    },
    {
      classId: "class-002",
      studentName: "Anna Nowak",
      courseName: "Physics",
      classDate: new Date(),
      classStartTime: "11:00",
      classEndTime: "12:00",
    },
    {
      classId: "class-003",
      studentName: "Piotr Wiśniewski",
      courseName: "Chemistry",
      classDate: new Date(Date.now() + 86400000), // Jutro
      classStartTime: "10:00",
      classEndTime: "11:00",
    },
    {
      classId: "class-004",
      studentName: "Maria Lewandowska",
      courseName: "Biology",
      classDate: new Date(Date.now() + 86400000), // Jutro
      classStartTime: "14:00",
      classEndTime: "15:00",
    },
    {
      classId: "class-005",
      studentName: "Tomasz Kamiński",
      courseName: "Mathematics",
      classDate: new Date(Date.now() + 86400000 * 2), // Pojutrze
      classStartTime: "09:00",
      classEndTime: "10:00",
    },
    {
      classId: "class-006",
      studentName: "Katarzyna Wójcik",
      courseName: "English",
      classDate: new Date(Date.now() + 86400000 * 2), // Pojutrze
      classStartTime: "13:00",
      classEndTime: "14:00",
    },
  ];

  function handleSelect(slot: TimeSlot) {
    if (slot.classId) {
      setSelectedClassId(slot.classId);
      console.log("Selected class:", slot.classId);
    }
  }

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
          <Schedule
            daysCount={3}
            startDate={new Date()}
            apiDayAvailability={tempAvailability}
            displayMode={"class"}
            classes={tempClasses}
            onSelect={handleSelect}
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
          <FilesSummary files={files} lastCount={5} student={false} />
        </div>
      </div>
    </Content>
  );
}
