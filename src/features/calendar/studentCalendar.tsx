import { useState, useEffect } from "react";
import { Content } from "@/components/ui/content.tsx";
import Summary from "@/components/complex/summaries/summary.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import CourseFilter from "@/components/complex/courseFilter.tsx";
import type { CourseBrief } from "@/components/complex/studentDetailsCard.tsx";
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
} from "@/components/complex/summaries/assignmentSummary.tsx"
import api, { getUserId } from "../../api/api";

// Typ odpowiedzi – obsługa camelCase i PascalCase
type ParticipationBriefDTO = {
    courseId?: string;
    CourseId?: string;
    courseName?: string;
    CourseName?: string;
    userId?: string;
    UserId?: string;
};

//TODO: when all courses selected do not display meeting links.
//   Always only display data from past 30 days (links, assignments
//   and files shared). After that a "load more" button that downloads
//   older data (30 days).

// TODO: "setup new class" button should open a popup with course selection.
//  If one course was filtered, it should be automatically selected in the
//  course selection

export function StudentCalendar() {
    const [courses, setCourses] = useState<CourseBrief[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

    useEffect(() => {
        const studentId = getUserId();
        if (!studentId) return;

        let canceled = false;

        api
            .get<ParticipationBriefDTO[]>(`/api/students/${studentId}/participations`)
            .then((res) => {
                const data = res.data ?? [];
                const mapped: CourseBrief[] = data
                    .map((p) => {
                        const id = p.courseId ?? p.CourseId ?? "";
                        const name = p.courseName ?? p.CourseName ?? "";
                        return { id, name };
                    })
                    .filter((c) => c.id && c.name); // remove entries with missing id or name

                if (!canceled) {
                    setCourses(mapped);
                    setSelectedCourseId((prev) =>
                        mapped.some((c) => c.id === prev) ? prev : null
                    );
                }
            })
            .catch((err) => {
                if (err?.response?.status === 404) {
                    if (!canceled) setCourses([]);
                    return;
                }
                console.error("Courses could not be retrieved:", err);
            });

        return () => {
            canceled = true;
        };
    }, []);

    // MIESIĄCE LICZĄ SIĘ PO INDEKSACH, NIE NUMERACH W KALENDARZU!!
    let classes: ClassTileProps[] = [
        {
            id: "0",
            state: "upcoming",
            date: new Date(2025, 8, 28, 16, 30),
            title: "class 0",
            duration: 60,
        },
        {
            id: "1",
            state: "ongoing",
            date: new Date(Date.now()),
            title: "class 1",
            duration: 40,
        },
        {
            id: "2",
            state: "completed",
            date: new Date(2025, 8, 12, 16, 20),
            title: "class 2",
            duration: 60,
        },
        {
            id: "3",
            state: "completed",
            date: new Date(2025, 8, 7, 13),
            title: "class 3",
            duration: 45,
        },
    ];

  //TODO: meeting links should not be retrieved when a class is not in progress
  //    (or 10 minutes in advance and after).

  let links: LinkProps[] = [
    {
      isMeeting: true,
      path: "linkthatleads2meeting.com",
      courseName: "Course 1",
      className: "Class 2",
    },
    {
      path: "randomlink.com",
      courseName: "Course 2",
      className: "Introduction",
    },
    { path: "anotherlink.com", courseName: "Course 1", className: "Basics" },
  ];

  let assignments: AnyTask[] = [
    {
      id: "1",
      name: "assignment 1",
      className: "class 1",
      courseName: "course 1",
      completed: false,
      comments: "some kind of a comment",
      type: "assignment",
      status: "behind",
      graded: false,
    },
    {
      id: "2",
      name: "quiz 1",
      className: "class 2",
      courseName: "course 1",
      completed: true,
      type: "quiz",
    },
    {
      id: "3",
      name: "assignment 2",
      className: "class 2",
      courseName: "course 2",
      completed: true,
      comments: "some kind of a comment v2",
      type: "assignment",
      status: "good",
      graded: true,
      grade: 10,
    },
  ];

    return (
        <Content>
            <CourseFilter
                student={true}
        courses={courses}
        setSelectedCourseId={setSelectedCourseId}
        selectedCourseId={selectedCourseId}
        setupClassButton={true}
            />
            <div className="flex flex-row gap-8 p-4">
                <div className="w-1/4 sticky top-0 align-self-flex-start h-fit space-y-2">
                    {classes.map((c) => (
                        <ClassTile
                            key={c.id}
                            id={c.id}
                            state={c.state}
                            date={c.date}
                            title={c.title}
                            duration={c.duration}
                            setSelectedClassId={setSelectedClassId}
                            selectedClassId={selectedClassId}
                        />
                    ))}
                </div>

                <div className="w-3/4 space-y-8">
                    <LinksSummary links={links} />
                    <AssignmentSummary assignments={assignments} student={true} />
                    <Summary label={"Files shared"} labelIcon={icons.File} canHide={true}>
                        content
                    </Summary>
                </div>
            </div>
        </Content>
    );
}
