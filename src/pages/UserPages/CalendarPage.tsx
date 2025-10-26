import { useUser } from "@/features/user/UserContext.tsx";
import { NavigationBar } from "@/components/complex/navigationBar.tsx";
import { StudentCalendar } from "@/features/calendar/studentCalendar.tsx";
import { TeacherCalendar } from "@/features/calendar/teacherCalendar.tsx";
import ErrorPage from "@/pages/ErrorPage.tsx";

export function CalendarPage() {
  let { user } = useUser();

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
