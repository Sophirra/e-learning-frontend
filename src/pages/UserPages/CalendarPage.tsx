import { useUser } from "@/lib/user/UserContext.tsx";
import { NavigationBar } from "@/components/complex/bars/navigationBar.tsx";
import { StudentCalendar } from "@/components/complex/calendar/studentCalendar.tsx";
import { TeacherCalendar } from "@/components/complex/calendar/teacherCalendar.tsx";
import ErrorPage from "@/pages/ErrorPage.tsx";

export function CalendarPage() {
  const { user } = useUser();

  return (
    <div className="bg-white h-screen">
      <NavigationBar />
      {user?.activeRole == "teacher" ? (
        <TeacherCalendar />
      ) : user?.activeRole == "student" ? (
        <StudentCalendar />
      ) : (
        <ErrorPage />
      )}
    </div>
  );
}
