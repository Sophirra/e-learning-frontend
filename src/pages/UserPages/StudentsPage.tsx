import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Content } from "@/components/ui/content.tsx";
import { useUser } from "@/features/user/UserContext.tsx";
import { NavigationBar } from "@/components/complex/navigationBar.tsx";
import Summary from "@/components/complex/summaries/summary.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { StudentDetailsCard } from "@/components/complex/studentDetailsCard.tsx";
import CourseFilter from "@/components/complex/courseFilter.tsx";
import type { CourseBrief, Student } from "@/api/types.ts";
import { CalendarSummary } from "@/components/complex/summaries/calendarSummary.tsx";
import {
  AssignmentSummary,
  type AssignmentTask,
  type QuizTask,
} from "@/components/complex/summaries/assignmentSummary.tsx";
import { ChatSummary } from "@/components/complex/summaries/chatSummary.tsx";
import { Label } from "@/components/ui/label.tsx";
import { FileGallery } from "@/components/complex/fileGallery.tsx";
import {
  getStudentData,
  getStudentWithTeacherExercises,
  getStudentWithTeacherQuizzes,
} from "@/api/apiCalls.ts";
import { getUserId } from "@/api/api.ts";
import { QuizSummary } from "@/components/complex/summaries/quizSummary.tsx";
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
  const [studentBrief, setStudentBrief] = useState<Student>();
  //courses for specific student from current teacher (user)
  const [courses, setCourses] = useState<CourseBrief[]>([]);
  const [assignments, setAssignments] = useState<AssignmentTask[]>([]);
  const [quizzes, setQuizzes] = useState<QuizTask[]>([]);

  /** The course.tsx identifier extracted from the URL parameters */
  let { courseId } = useParams();
  /** To be downloaded from backend*/
  // let [course, setCourse] = useState<Course>(sampleCourse);
  /** Using string array because filter dropdown is universal*/

  //TODO: get student data to display in student card. Can be here or in StudentCard component.

  useEffect(() => {
    selectedStudentId && fetchStudent(selectedStudentId);
  }, [selectedStudentId]);

  useEffect(() => {
    const teacherId = getUserId();
    if (!teacherId) return;

    if (!selectedStudentId) return;

    const fetchExercises = async () => {
      const data = await getStudentWithTeacherExercises(
        teacherId,
        selectedStudentId,
        selectedCourseId ?? undefined,
      );
      setAssignments(data);
    };

    fetchExercises();
  }, [selectedStudentId, selectedCourseId]);

  useEffect(() => {
    const teacherId = getUserId();
    if (!teacherId) return;

    if (!selectedStudentId) return;

    const fetchQuizzes = async () => {
      const data = await getStudentWithTeacherQuizzes(
        teacherId,
        selectedStudentId,
        selectedCourseId ?? undefined,
      );
      setQuizzes(data);
    };

    fetchQuizzes();
  }, [selectedStudentId, selectedCourseId]);

  async function fetchStudent(studentId: string) {
    try {
      const data = await getStudentData(studentId);
      setStudentBrief(data);
      setCourses(data.courses);
      console.log("Fetched student:", data, data.courses);
      // data = await getStudentCourses(studentId);
    } catch (err) {
      console.log("Error geting student:", err);
    }
  }

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
                {selectedStudentId && studentBrief && (
                  <StudentDetailsCard
                    id={selectedStudentId}
                    name={studentBrief.name}
                    image={
                      "https://i.pinimg.com/736x/af/f0/1c/aff01cea24b478bec034cf412406dbe5.jpg"
                    }
                    courses={courses}
                    selectedCourseId={selectedCourseId}
                    setSelectedCourseId={setSelectedCourseId}
                  />
                )}
              </div>

              <div className="w-3/4 space-y-8">
                <CalendarSummary classes={[]} />
                <AssignmentSummary student={false} assignments={assignments} />
                <QuizSummary quizzes={quizzes} student={false} />
                <ChatSummary />
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
