import { useState } from "react";
import { Content } from "@/components/ui/content.tsx";
import { useUser } from "@/features/user/UserContext.tsx";
import { NavigationBar } from "@/components/complex/navigationBar.tsx";
import Summary from "@/components/complex/summaries/summary.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import CourseFilter from "@/components/complex/courseFilter.tsx";
import type { CourseBrief } from "@/components/complex/studentDetailsCard.tsx";

export type AssignmentBrief = {
  id?: string;
  name: string;
  courseName: string;
  className?: string;
  status: string;
  graded: boolean;
  grade?: number;
  comments?: string;
  instruction?: string;
  files?: AssignmentFile[];
};

type AssignmentFile = {
  id?: string;
  name: string;
  path: string;
  type: "solution" | "content";
};

export function AssignmentPage() {
  let { user } = useUser();
  let [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  //TODO: temp data to be replaced from backend
  let courses: CourseBrief[] = [
    //todo: GET FROM API
    { id: "1", name: "one" },
    { id: "2", name: "two" },
    { id: "3", name: "three" },
  ];
  return (
    <div className="bg-white h-screen">
      <NavigationBar />
      <Content>
        <CourseFilter
          student={user.activeRole == "student"}
          courses={courses}
          setSelectedCourseId={setSelectedCourseId}
          selectedCourseId={selectedCourseId}
          setupClassButton={false}
        />
        <div className="flex flex-row gap-8">
          {/*overflow-y-auto">*/}
          <div className="w-1/4 sticky top-0 align-self-flex-start h-fit"></div>

          <div className="w-3/4 space-y-8">
            <Summary
              label={"temp"}
              labelIcon={icons.TempIcon}
              canHide={true}
              onAddButtonClick={() => {}}
            >
              content
            </Summary>
          </div>
        </div>
      </Content>
    </div>
  );
}
