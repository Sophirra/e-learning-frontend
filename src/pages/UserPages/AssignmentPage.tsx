import { useCallback, useState } from "react";
import { Content } from "@/components/ui/content.tsx";
import { useUser } from "@/features/user/UserContext.tsx";
import { NavigationBar } from "@/components/complex/navigationBar.tsx";
import CourseFilter from "@/components/complex/courseFilter.tsx";
import type { CourseBrief } from "@/components/complex/studentDetailsCard.tsx";
import AssignmentTile from "@/components/complex/AssignmentTile.tsx";
import { AssignmentTitle } from "@/components/complex/assignmentPageContent/AssignmentTitle.tsx";
import { AssignmentAttachedFiles } from "@/components/complex/assignmentPageContent/AssignmentAttachedFiles.tsx";
import { AssignmentSolution } from "@/components/complex/assignmentPageContent/AssignmentSolution.tsx";
import { AssignmentGrade } from "@/components/complex/assignmentPageContent/AssignmentGrade.tsx";

export type AssignmentBrief = {
  id?: string;
  name: string;
  courseName: string;
  className?: string;
  status: "unsolved" | "solutionAdded" | "submitted" | "graded";
  graded: boolean; // TO JEST RACZEJ BEZ SENSU BO JAK STATUS TO GRADED I JEST GRADE, TO TO Z TEGO WYNIKA
  grade?: number;
  comments?: string;
  instruction?: string;
  date?: Date; // TO CHYBA MUSI BYC DATA ZAJEC BO SAM QUIZ/EXERCISE NIE MA DATY
  files?: AssignmentFile[];
};

export type AssignmentFile = {
  id?: string;
  name: string;
  path: string;
  type: "solution" | "content";
  uploadDate?: Date;
};

export function AssignmentPage() {
  let { user } = useUser();
  let [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );
  let [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(
    null,
  );

  //TODO: temp data to be replaced from backend
  let courses: CourseBrief[] = [
    //todo: GET FROM API
    { id: "1", name: "one" },
    { id: "2", name: "two" },
    { id: "3", name: "three" },
  ];

  const assignments: AssignmentBrief[] = [
    {
      id: "a1",
      name: "Intro to TypeScript",
      courseName: "Web Development",
      className: "WD101",
      status: "graded",
      graded: true,
      grade: 85,
      comments: "Good job overall.",
      instruction: "Implement basic types and interfaces.",
      date: new Date("2024-05-10"),
      files: [
        {
          id: "f1",
          name: "solution.ts",
          path: "/files/solution.ts",
          type: "solution",
          uploadDate: new Date("2024-05-10"),
        },
      ],
    },
    {
      id: "a2",
      name: "React Components",
      courseName: "Frontend Frameworks",
      status: "submitted",
      graded: false,
      date: new Date("2022-05-10"),
    },
    {
      id: "a3",
      name: "Database Design",
      courseName: "Backend Development",
      className: "BD202",
      status: "graded",
      graded: true,
      grade: 92,
      comments: "Excellent normalization.",
      instruction: "Design a relational schema for a bookstore.",
      date: new Date("2023-05-10"),
      files: [
        {
          id: "f2",
          name: "schema.sql",
          path: "/files/schema.sql",
          type: "solution",
        },
        {
          id: "f3",
          name: "assignment.pdf",
          path: "/files/assignment.pdf",
          type: "content",
        },
      ],
    },
    {
      id: "a4",
      name: "API Integration",
      courseName: "Backend Development",
      status: "submitted",
      graded: false,
      instruction: "Integrate with a public REST API.",
      date: new Date("2024-01-15"),
    },
    {
      id: "a5",
      name: "CSS Grid Layout",
      courseName: "Web Design",
      className: "WD102",
      status: "graded",
      graded: true,
      grade: 78,
      comments: "Layout works but lacks responsiveness.",
      date: new Date("2022-05-10"),
      files: [
        {
          id: "f4",
          name: "grid.html",
          path: "/files/grid.html",
          type: "solution",
        },
      ],
    },
    {
      id: "a6",
      name: "Unit Testing",
      courseName: "Software Engineering",
      status: "submitted",
      graded: false,
      instruction: "Write unit tests for a calculator module.",
      date: new Date("2023-05-10"),
    },
    {
      id: "a7",
      name: "Git & GitHub Basics",
      courseName: "DevOps",
      className: "DV101",
      status: "graded",
      graded: true,
      grade: 88,
      comments: "Well documented commits.",
      date: new Date("2022-05-10"),
      files: [
        {
          id: "f5",
          name: "repo.zip",
          path: "/files/repo.zip",
          type: "solution",
        },
      ],
    },
    {
      id: "a8",
      name: "Power Platform Integration",
      courseName: "Business Applications",
      status: "solutionAdded",
      graded: false,
      date: new Date("2024-05-10"),
    },
    {
      id: "a9",
      name: "Excel Automation",
      courseName: "MS365 Tools",
      className: "MS101",
      status: "submitted",
      graded: false,
      instruction: "Automate data entry using Power Automate.",
      date: new Date("2023-05-10"),
      files: [
        {
          id: "f6",
          name: "flow.json",
          path: "/files/flow.json",
          type: "solution",
        },
      ],
    },
    {
      id: "a10",
      name: "Security Best Practices",
      courseName: "Cybersecurity",
      status: "graded",
      graded: true,
      grade: 95,
      comments: "Comprehensive and well structured.",
      instruction: "List and explain top 10 OWASP vulnerabilities.",
      date: new Date("2022-05-10"),
    },
  ];

  const handleSelectAssignmentId = useCallback((id: string | null) => {
    setSelectedAssignmentId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div className="bg-white h-screen">
      <NavigationBar />
      <Content>
        <CourseFilter
          student={user?.activeRole == "student"}
          setSelectedStudentId={setSelectedStudentId}
          selectedStudentId={selectedStudentId}
          setSelectedCourseId={setSelectedCourseId}
          selectedCourseId={selectedCourseId}
          setupClassButton={false}
        />
        <div className="flex flex-row gap-8 p-4">
          {/*overflow-y-auto">*/}
          <div className="w-1/4 sticky top-0 self-start h-fit space-y-2">
            {assignments.length === 0 ? (
              <div className="gap-2 p-4 bg-slate-100 rounded-lg shadow-md hover:bg-slate-200 transition-all text-base">
                No assignments available for the selected course.
              </div>
            ) : (
              assignments.map((assignment) => (
                <AssignmentTile
                  assignment={assignment}
                  selectedAssignmentId={selectedAssignmentId}
                  setSelectedAssignmentId={handleSelectAssignmentId}
                />
              ))
            )}
          </div>

          <div className="w-3/4 space-y-8">
            <AssignmentTitle
              assignment={
                assignments.find((a) => a.id === selectedAssignmentId) ||
                assignments[0]
              }
            />
            <AssignmentAttachedFiles
              assignment={
                assignments.find((a) => a.id === selectedAssignmentId) ||
                assignments[0]
              }
            />
            <AssignmentSolution
              assignment={
                assignments.find((a) => a.id === selectedAssignmentId) ||
                assignments[0]
              }
            />
            <AssignmentGrade
              assignment={
                assignments.find((a) => a.id === selectedAssignmentId) ||
                assignments[0]
              }
            />
          </div>
        </div>
      </Content>
    </div>
  );
}
