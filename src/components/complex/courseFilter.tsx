import { Button } from "@/components/ui/button.tsx";
import type { CourseBrief } from "@/components/complex/studentDetailsCard.tsx";

export default function CourseFilter({
  courses,
  selectedCourseId,
  setSelectedCourseId,
}: {
  courses: CourseBrief[];
  selectedCourseId: string | null;
  setSelectedCourseId: (courseId: string | null) => void;
}) {
  return (
    <div className="w-1/1 sticky top-0 space-x-4 text-left">
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
  );
}
