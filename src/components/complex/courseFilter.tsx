import { Button } from "@/components/ui/button.tsx";
import type { CourseBrief } from "@/api/types.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { FilterDropdown } from "@/components/complex/filterDropdown.tsx";
import { SetupNewClassPopup } from "@/components/complex/popups/setupNewClassPopup.tsx";
import { useEffect, useState } from "react";
import api, { getUserId } from "@/api/api.ts";

type StudentBrief = { id: string; name: string; surname: string };

export default function CourseFilter({
  student,
  selectedCourseId,
  setSelectedCourseId,
  setupClassButton = false,
}: {
  student: boolean;
  selectedCourseId: string | null;
  setSelectedCourseId: (courseId: string | null) => void;
  setupClassButton: boolean;
}) {
  const [courses, setCourses] = useState<CourseBrief[]>([]);

  let students: StudentBrief[] = [
    { id: "1", name: "John", surname: "Doe" },
    { id: "2", name: "Jane", surname: "Doe" },
    { id: "3", name: "Bob", surname: "Smith" },
    { id: "4", name: "Alice", surname: "Johnson" },
  ];

  // GET PARTICIPATIONS/COURSES
  useEffect(() => {
    const studentId = getUserId();
    if (!studentId) return;

    let canceled = false;

    api
      .get(`/api/students/${studentId}/participations`)
      .then((res) => {
        const data = res.data ?? [];
        const mapped: CourseBrief[] = data
          .map((p: any) => ({
            courseId: p.courseId ?? p.CourseId ?? "",
            courseName: p.courseName ?? p.CourseName ?? "",
          }))
          .filter((c: any) => c.courseId && c.courseName);

        if (!canceled) {
          setCourses(mapped);
          // @ts-ignore
          setSelectedCourseId((prev) =>
            mapped.some((c) => c.courseId === prev) ? prev : null,
          );
        }
      })
      .catch((err) => {
        if (err?.response?.status === 404) {
          if (!canceled) setCourses([]);
          return;
        }
        console.error("Courses could not be retrieved:", err);
      });

    return () => {
      canceled = true;
    };
  }, []);

  return (
    <div className="flex flex-row justify-between gap-4">
      <div className="flex gap-2 text-left overflow-x-auto scr">
        <Button
          variant={selectedCourseId ? "outline" : "default"}
          onClick={() => setSelectedCourseId(null)}
        >
          All courses
        </Button>
        {student &&
          courses.map((course: CourseBrief) => (
            <Button
              key={course.courseId}
              variant={
                selectedCourseId == course.courseId ? "default" : "outline"
              }
              size={"sm"}
              className="justify-start text-left h-auto py-2 px-3"
              onClick={() => {
                setSelectedCourseId(course.courseId);
              }}
            >
              {course.courseName}
            </Button>
          ))}
        {/*TODO: dodać obsługę filtrów studentów i kursów*/}
        {!student && (
          <FilterDropdown
            reset={false}
            key={"students"}
            items={students.map((s) => {
              return {
                name: s.name + " " + s.surname,
                value: s.id,
              };
            })}
            icon={icons.People}
            searchable={true}
            placeholder={"Students list"}
            emptyMessage={"No students found"}
          ></FilterDropdown>
        )}
        {!student && (
          <FilterDropdown
            reset={false}
            key={"courses"}
            items={courses.map((c) => {
              return {
                name: c.courseName,
                value: c.courseId,
              };
            })}
            icon={icons.BookOpen}
            searchable={true}
            placeholder={"Courses list"}
            emptyMessage={"No courses found"}
          ></FilterDropdown>
        )}
      </div>
      {setupClassButton && (
        // <Button variant={"outline"}>
        //   Setup new class <icons.Plus />
        // </Button>
        <SetupNewClassPopup course={selectedCourseId ? selectedCourseId : ""} />
      )}
    </div>
  );
}

// function SetupClassPopup({
//   role,
//   selectedCourseId,
// }: {
//   role: "student" | "teacher";
//   selectedCourseId?: string | null;
// }) {}
