import { useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "@/features/user/UserContext.tsx";
import { NavigationBar } from "@/components/complex/navigationBar.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import type { CourseBrief } from "@/components/complex/studentDetailsCard.tsx";
import { StudentCalendar } from "@/features/calendar/studentCalendar.tsx";
import ErrorPage from "@/pages/ErrorPage.tsx";

export function CalendarPage() {
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
      {user?.student ? (
        <StudentCalendar />
      ) : user?.teacher ? (
        <TeacherCalendar />
      ) : (
        <ErrorPage />
      )}
    </div>
  );
}
