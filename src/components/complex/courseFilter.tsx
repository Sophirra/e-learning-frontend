import { Button } from "@/components/ui/button.tsx";
import type { CourseBrief, StudentBrief } from "@/types.ts";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { FilterDropdown } from "@/components/complex/filterDropdown.tsx";
import { SetupNewClassPopup } from "@/components/complex/popups/setupNewClassPopup.tsx";
import { useEffect, useRef, useState } from "react";
import { getUserId } from "@/api/api.ts";
import { useUser } from "@/lib/user/UserContext.tsx";
import {
  getTeacherCourses,
  getTeacherStudents,
  getTeacherStudentsWithSpecificCourse,
} from "@/api/api calls/apiTeacher.ts";
import {
  getStudentCoursesWithSpecificTeacher,
  getStudentParticipations,
} from "@/api/api calls/apiStudents.ts";
import { toast } from "sonner";

type CourseFilterProps = {
  student: boolean;
  selectedCourseId: string | null;
  setSelectedCourseId: (courseId: string | null) => void;
  selectedStudentId?: string | null;
  setSelectedStudentId?: (studentId: string | null) => void;
  setupClassButton?: boolean;
  resetExternal?: () => void;
};

export default function CourseFilter({
  student,
  selectedCourseId,
  setSelectedCourseId,
  selectedStudentId,
  setSelectedStudentId,
  setupClassButton = false,
  resetExternal,
}: CourseFilterProps) {
  const [courses, setCourses] = useState<CourseBrief[]>([]);
  const [students, setStudents] = useState<StudentBrief[]>([]);
  const { user } = useUser();
  const userId = getUserId();
  const [filterKey, setFilterKey] = useState(0);
  const fetchGen = useRef(0); // protection against late responses

  // FOR STUDENT: get courses they participate in
  // FOR TEACHER: initial fetch of all students and courses
  useEffect(() => {
    if (!userId || !user?.activeRole) return;
    let canceled = false;

    const fetchData = async () => {
      try {
        if (user.activeRole === "student") {
          const mapped = await getStudentParticipations(userId);

          if (!canceled) {
            setCourses(mapped);

            if (!mapped.some((c) => c.id === selectedCourseId)) {
              setSelectedCourseId(null);
            }
          }
        } else if (user.activeRole === "teacher") {
          if (!canceled) {
            setStudents(await getTeacherStudents(userId));
            setCourses(await getTeacherCourses(userId));
          }
        }
      } catch (err: any) {
        toast.error("Could not filter data:", err.message);
      }
    };

    fetchData();

    return () => {
      canceled = true;
    };
  }, [user, userId]);

  // A STUDENT WAS SELECTED -> LOAD ONLY THEIR COURSES
  useEffect(() => {
    if (!userId || user?.activeRole !== "teacher") return;
    if (!selectedStudentId) return; // nothing was selected -> skip

    // Bumps a request generation counter to identify the newest request.
    const gen = ++fetchGen.current;
    // Creates an abort controller to cancel this request if dependencies change.
    const ac = new AbortController();

    (async () => {
      try {
        const courseList = await getStudentCoursesWithSpecificTeacher(
          selectedStudentId,
          ac.signal,
        );

        // Ignores this response if a newer request has already been issued.
        if (gen !== fetchGen.current) return;

        setCourses(courseList);

        // Clears the selected course if it no longer exists in the new course set.
        if (
          selectedCourseId &&
          !courseList.some((c) => c.id === selectedCourseId)
        ) {
          setSelectedCourseId(null);
        }
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          toast.error("Could not load courses for selected student:", err);
        }
      }
    })();

    // Cancels the in-flight request when the effect is re-run or unmounted.
    return () => ac.abort();
  }, [selectedStudentId, userId, user?.activeRole]);

  // Timeline simulation (race protection with fetchGen + AbortController):
  //
  // 1) User selects Student A:
  //    - The effect runs, gen = 1, and request A is sent.
  // 2) After ~100 ms, the user changes selection to Student B:
  //    - The effect's cleanup aborts request A,
  //    - The effect runs again, gen = 2, and request B is sent.
  // 3) Response from request A still arrives (despite the abort):
  //    - We check: if (gen !== fetchGen.current) -> 1 !== 2,
  //    - This response is considered stale and is ignored (no state update).
  // 4) Response from request B arrives:
  //    - We check: if (gen !== fetchGen.current) -> 2 === 2,
  //    - This is the latest response, so we update the course list from it.

  // A COURSE WAS SELECTED -> LOAD ONLY ITS STUDENTS
  useEffect(() => {
    if (!userId || user?.activeRole !== "teacher") return;
    if (!selectedCourseId) return;

    const gen = ++fetchGen.current;
    const ac = new AbortController();

    (async () => {
      try {
        const studentList = await getTeacherStudentsWithSpecificCourse(
          userId,
          selectedCourseId,
          ac.signal,
        );

        if (gen !== fetchGen.current) return;

        setStudents(studentList);

        // A selected student is no longer valid - clear it.
        if (
          selectedStudentId &&
          !studentList.some((s) => s.id === selectedStudentId)
        ) {
          setSelectedStudentId?.(null);
        }
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          toast.error(
            "Could not load students for selected course:",
            err.message,
          );
        }
      }
    })();

    return () => ac.abort();
  }, [selectedCourseId, userId, user?.activeRole]);

  // RESET FILTERS
  const resetFilters = async () => {
    setSelectedCourseId(null);
    setSelectedStudentId?.(null);
    setFilterKey((prev) => prev + 1);

    if (user?.activeRole === "teacher" && userId) {
      setStudents(await getTeacherStudents(userId));
      setCourses(await getTeacherCourses(userId));
    }

    resetExternal?.();
  };

  return (
    <div className="flex flex-row justify-between gap-4">
      <div className="flex gap-2 text-left overflow-x-auto scr">
        <Button
          variant={
            selectedCourseId || selectedStudentId ? "outline" : "default"
          }
          onClick={resetFilters}
        >
          All courses
        </Button>
        {student &&
          courses.map((course: CourseBrief) => (
            <Button
              key={course.id}
              variant={selectedCourseId == course.id ? "default" : "outline"}
              size={"sm"}
              className="justify-start text-left h-auto py-2 px-3"
              onClick={() => {
                setSelectedCourseId(course.id);
              }}
            >
              {course.name}
            </Button>
          ))}
        {!student && setSelectedStudentId && (
          <FilterDropdown
            reset={false}
            key={`students-${filterKey}`}
            items={students.map((s) => ({
              name: s.name + " " + s.surname,
              value: s.id,
            }))}
            icon={icons.People}
            searchable={true}
            placeholder={"Students list"}
            emptyMessage={"No students found"}
            multiselect={false}
            onSelectionChange={(v) =>
              setSelectedStudentId(v[0] ? v[0].value : null)
            }
          />
        )}
        {!student && setSelectedCourseId && (
          <FilterDropdown
            reset={false}
            key={`courses-${filterKey}`}
            items={courses.map((c) => ({
              name: c.name,
              value: c.id,
            }))}
            icon={icons.BookOpen}
            searchable={true}
            placeholder={"Courses list"}
            emptyMessage={"No courses found"}
            multiselect={false}
            onSelectionChange={(v) =>
              setSelectedCourseId(v[0] ? v[0].value : null)
            }
          />
        )}
        <Button variant={"outline"} size={"icon"} onClick={resetFilters}>
          <icons.Reset />
        </Button>
      </div>
      {setupClassButton ? <SetupNewClassPopup /> : null}
    </div>
  );
}
