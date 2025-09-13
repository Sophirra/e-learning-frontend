import { useState } from "react";
import { Content } from "@/components/ui/content.tsx";
import { useUser } from "@/features/user/UserContext.tsx";
import { NavigationBar } from "@/components/complex/navigationBar.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import type { CourseBrief } from "@/components/complex/studentDetailsCard.tsx";
import CourseFilter from "@/components/complex/courseFilter.tsx";
import { CalendarSummary } from "@/components/complex/summaries/calendarSummary.tsx";
import { AssignmentSummary } from "@/components/complex/summaries/assignmentSummary.tsx";
import { ChatSummary } from "@/components/complex/summaries/chatSummary.tsx";

export function HomePage() {
  let { user } = useUser();
  let [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

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
        <div className="space-y-4">
          {/*<div className="flex flex-row gap-8">*/}
          {/*overflow-y-auto">*/}
          <CourseFilter
            courses={courses}
            setSelectedCourseId={setSelectedCourseId}
            selectedCourseId={selectedCourseId}
          />
          <CalendarSummary courses={courses} />
          <AssignmentSummary courses={courses} />
          <ChatSummary courses={courses} />
        </div>
      </Content>
    </div>
  );
}
