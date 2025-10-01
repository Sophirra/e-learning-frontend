import { Button } from "@/components/ui/button.tsx";
import type { CourseBrief } from "@/components/complex/studentDetailsCard.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";

export default function CourseFilter({
  courses,
  selectedCourseId,
  setSelectedCourseId,
  // setupClassButton = false,
}: {
  courses: CourseBrief[];
  selectedCourseId: string | null;
  setSelectedCourseId: (courseId: string | null) => void;
  // setupClassButton: boolean;
}) {
  return (
    <div className="flex flex-row items-start gap-4">
      <div className="flex flex-wrap gap-2 text-left">
        <Button
          variant={selectedCourseId ? "outline" : "default"}
          onClick={() => setSelectedCourseId(null)}
        >
          All courses
        </Button>
        {courses.map((course: CourseBrief) => (
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
      </div>
      <Button variant={"outline"}>
        Setup new class <icons.Plus />
      </Button>
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
