import { useState } from "react";
import { useParams } from "react-router-dom";
import { Content } from "@/components/ui/content.tsx";
import type { Course } from "@/features/course/course.tsx";
import { useUser } from "@/features/user/UserContext.tsx";
import { NavigationBar } from "@/components/complex/navigationBar.tsx";
import Summary from "@/components/complex/summaries/summary.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { StudentDetailsCard } from "@/components/complex/studentDetailsCard.tsx";
import CourseFilter from "@/components/complex/courseFilter.tsx";
import type { CourseBrief } from "@/api/types.ts";
import { CalendarSummary } from "@/components/complex/summaries/calendarSummary.tsx";
import {
  type AnyTask,
  AssignmentSummary,
} from "@/components/complex/summaries/assignmentSummary.tsx";
import { ChatSummary } from "@/components/complex/summaries/chatSummary.tsx";
import { Label } from "@/components/ui/label.tsx";
import { FileGallery } from "@/components/complex/fileGallery.tsx";
/**
 * CoursePage component displays detailed information about a specific course.tsx
 * and allows switching between class setup and course.tsx details views.
 * It includes filtering options for language, level, and price,
 * as well as a detailed card showing course.tsx information.
 */
export function StudentsPage() {
  const { user } = useUser();
  //navigation and filtering
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );
  //courses for specific student from current teacher (user)
  const [courses, setCourses] = useState<CourseBrief[]>([]);

  let sampleCourse = {
    id: "1",
    name: "GameDev",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    thumbnailUrl:
      "https://i.pinimg.com/736x/ee/2a/71/ee2a7149341c2b23ae2e9c7358ec247d.jpg",
    teacherId: "1",
  };

  const sampleAssignment: AnyTask = {
    id: "1",
    name: "task 1",
    completed: true,
    courseName: "Course A",
    className: "Class 1",
    type: "assignment",
    status: "to be graded",
    graded: false,
  };
  /** The course.tsx identifier extracted from the URL parameters */
  let { courseId } = useParams();
  /** To be downloaded from backend*/
  // let [course, setCourse] = useState<Course>(sampleCourse);
  /** Using string array because filter dropdown is universal*/

  //TODO: get student data to display in student card. Can be here or in StudentCard component.

  return (
    <div className="bg-white min-h-screen">
      <NavigationBar />
      <Content>
        <div className={"space-y-4"}>
          <CourseFilter
            student={false}
            selectedCourseId={selectedCourseId}
            setSelectedCourseId={setSelectedCourseId}
            selectedStudentId={selectedStudentId}
            setSelectedStudentId={setSelectedStudentId}
            setupClassButton={false}
          />
          {selectedStudentId ? (
            <div className="flex flex-row gap-8">
              <div className="w-1/4 sticky top-0 align-self-flex-start h-fit">
                {selectedStudentId && (
                  <StudentDetailsCard
                    id={selectedStudentId}
                    name={"Alice Green"}
                    image={
                      "https://i.pinimg.com/736x/af/f0/1c/aff01cea24b478bec034cf412406dbe5.jpg"
                    }
                    courses={[
                      { courseId: "1", courseName: "one" },
                      { courseId: "2", courseName: "two" },
                      { courseId: "3", courseName: "three" },
                    ]}
                    selectedCourseId={selectedCourseId}
                    setSelectedCourseId={setSelectedCourseId}
                  />
                )}
              </div>

              <div className="w-3/4 space-y-8">
                <CalendarSummary courses={courses} />
                <AssignmentSummary
                  student={false}
                  assignments={[sampleAssignment]}
                />
                <ChatSummary />
                {/*<FilesSharedSummary student={false} />*/}
                <Summary
                  label={"Shared files"}
                  labelIcon={icons.File}
                  canHide={true}
                >
                  <FileGallery
                    slim={true}
                    studentId={selectedStudentId}
                    courseId={selectedCourseId ? selectedCourseId : undefined}
                  />
                </Summary>
              </div>
            </div>
          ) : (
            <Label className={"text-xl"}>Please select student</Label>
          )}
        </div>
      </Content>
    </div>
  );
}
