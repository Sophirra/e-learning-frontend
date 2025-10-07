import {useEffect, useState} from "react";
import { Content } from "@/components/ui/content.tsx";
import { useUser } from "@/features/user/UserContext.tsx";
import { NavigationBar } from "@/components/complex/navigationBar.tsx";
import type { CourseBrief } from "@/api/types.ts";
import CourseFilter from "@/components/complex/courseFilter.tsx";
import { CalendarSummary } from "@/components/complex/summaries/calendarSummary.tsx";
import { AssignmentSummary } from "@/components/complex/summaries/assignmentSummary.tsx";
import { ChatSummary } from "@/components/complex/summaries/chatSummary.tsx";
import { getCourseBriefs } from "@/api/apiCalls.ts";
import {toast} from "sonner";

export function HomePage() {
  let { user } = useUser();
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [courses, setCourses] = useState<CourseBrief[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await getCourseBriefs();
        setCourses(data);
      } catch (err) {
        toast.error("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="bg-white h-screen">
      <NavigationBar />
      <Content>
        <div className="space-y-4">
          {/*<div className="flex flex-row gap-8">*/}
          {/*overflow-y-auto">*/}
          <CourseFilter
            student={user?.student || false}
            courses={courses}
            setSelectedCourseId={setSelectedCourseId}
            selectedCourseId={selectedCourseId}
            setupClassButton={true}
          />
          <CalendarSummary courses={courses} />
          <AssignmentSummary student={user?.student || false} />
          <ChatSummary courses={courses} />
        </div>
      </Content>
    </div>
  );
}
