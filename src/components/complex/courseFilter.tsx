import { Button } from "@/components/ui/button.tsx";
import type { CourseBrief } from "@/api/types.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { FilterDropdown } from "@/components/complex/filterDropdown.tsx";
import { SetupNewClassPopup } from "@/components/complex/popups/setupNewClassPopup.tsx";

type StudentBrief = { id: string; name: string; surname: string };

export default function CourseFilter({
  student,
  courses,
  selectedCourseId,
  setSelectedCourseId,
  setupClassButton = false,
}: {
  student: boolean;
  courses: CourseBrief[];
  selectedCourseId: string | null;
  setSelectedCourseId: (courseId: string | null) => void;
  setupClassButton: boolean;
}) {
  let students: StudentBrief[] = [
    { id: "1", name: "John", surname: "Doe" },
    { id: "2", name: "Jane", surname: "Doe" },
    { id: "3", name: "Bob", surname: "Smith" },
    { id: "4", name: "Alice", surname: "Johnson" },
  ];

  return (
    <div className="flex flex-row items-start gap-4">
      <div className="flex flex-wrap gap-2 text-left">
        <Button
          variant={selectedCourseId ? "outline" : "default"}
          onClick={() => setSelectedCourseId(null)}
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
                name: c.name,
                value: c.id,
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
