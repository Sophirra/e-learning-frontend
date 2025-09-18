import { useState } from "react";
import { Content } from "@/components/ui/content.tsx";
// import { useUser } from "@/features/user/UserContext.tsx";
import Summary from "@/components/complex/summaries/summary.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import CourseFilter from "@/components/complex/courseFilter.tsx";
import type { CourseBrief } from "@/components/complex/studentDetailsCard.tsx";
import { Button } from "@/components/ui/button.tsx";
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

export function StudentCalendar() {
  // let { user } = useUser();
  let [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  let [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  //TODO: when all courses selected do not display meeting links.
  //   Always only display data from past 30 days (links, assignments
  //   and files shared). After that a "load more" button that downloads
  //   older data (30 days).

  // TODO: "setup new class" button should open a popup with course selection.
  //  If one course was filtered, it should be automatically selected in the
  //  course selection

  //TODO: temp data to be replaced from backend
  let courses: CourseBrief[] = [
    //todo: GET FROM API
    { id: "1", name: "one" },
    { id: "2", name: "two" },
    { id: "3", name: "three" },
  ];
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
      <div className="flex flex-row gap-4">
        <CourseFilter
          courses={courses}
          setSelectedCourseId={setSelectedCourseId}
          selectedCourseId={selectedCourseId}
        />
        <Button variant={"outline"}>
          Setup new class <icons.Plus />
          {/*
        TODO: should open a popup with course selection (already selected
          if single course is filtered) and class slot picker
        */}
        </Button>
      </div>
      <div className="flex flex-row gap-8 p-4">
        {/*overflow-y-auto">*/}
        <div className="w-1/4 sticky top-0 align-self-flex-start h-fit space-y-2">
          {classes.map((c) => (
            <ClassTile
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
