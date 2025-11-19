import { useCallback, useEffect, useState } from "react";
import { Content } from "@/components/ui/content.tsx";
import { useUser } from "@/features/user/UserContext.tsx";
import { NavigationBar } from "@/components/complex/navigationBar.tsx";
import CourseFilter from "@/components/complex/courseFilter.tsx";
import AssignmentTile from "@/components/complex/AssignmentTile.tsx";
import { AssignmentTitle } from "@/components/complex/summaries/assignmentPageContent/AssignmentTitle.tsx";
import { AssignmentAttachedFiles } from "@/components/complex/summaries/assignmentPageContent/AssignmentAttachedFiles.tsx";
import { AssignmentSolution } from "@/components/complex/summaries/assignmentPageContent/AssignmentSolution.tsx";
import { AssignmentGrade } from "@/components/complex/summaries/assignmentPageContent/AssignmentGrade.tsx";
import { getUserId } from "@/api/api.ts";
import { getExercises } from "@/api/apiCalls.ts";
import { LoadingTile } from "@/components/complex/LoadingTile.tsx";

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

export type Role = "teacher" | "student";
export type Mode = "view" | "edit";

export function AssignmentPage() {
  const { user } = useUser();
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<
    string | null
  >(null);
  const [pageMode, setAssignmentPageMode] = useState<Mode>("view");
  const [assignments, setAssignments] = useState<AssignmentBrief[]>([]);
  const activeRole = user?.activeRole ?? null;

  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;

    const fetchExercises = async () => {
      const data = await getExercises(
        userId,
        activeRole,
        selectedCourseId,
        selectedStudentId,
      );
      setAssignments(data);
    };

    fetchExercises().then();
  }, [activeRole, selectedCourseId, selectedStudentId]);

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
            {assignments === null ||
            assignments === undefined ||
            assignments.length === 0 ? (
              <LoadingTile
                text={"No assignments available for the selected course."}
              />
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
            {assignments.length !== 0 &&
            selectedAssignmentId &&
            assignments.some((e) => e.id === selectedAssignmentId) ? (
              <>
                <AssignmentTitle
                  assignment={
                    assignments.find((a) => a.id === selectedAssignmentId) ||
                    null
                  }
                  pageMode={pageMode}
                  setPageMode={setAssignmentPageMode}
                />
                <AssignmentAttachedFiles
                  assignment={
                    assignments.find((a) => a.id === selectedAssignmentId) ||
                    null
                  }
                  pageMode={pageMode}
                />
                <AssignmentSolution
                  assignment={
                    assignments.find((a) => a.id === selectedAssignmentId) ||
                    null
                  }
                />
                <AssignmentGrade
                  assignment={
                    assignments.find((a) => a.id === selectedAssignmentId) ||
                    null
                  }
                />
              </>
            ) : (
              <LoadingTile text={"Select an assignment to view its details."} />
            )}
          </div>
        </div>
      </Content>
    </div>
  );
}
