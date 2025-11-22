import { NavigationBar } from "@/components/complex/navigationBar.tsx";
import { useState } from "react";
import { Content } from "@/components/ui/content.tsx";
import CourseFilter from "@/components/complex/courseFilter.tsx";
import { useUser } from "@/features/user/UserContext.tsx";
import { FileGallery } from "@/components/complex/galleries/fileGallery.tsx";

export function FilesPage() {
  const { user } = useUser();
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );

  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />
      <Content>
        <div className={"flex flex-col gap-2"}>
          <CourseFilter
            student={user?.activeRole === "student"}
            selectedCourseId={selectedCourseId}
            setSelectedCourseId={setSelectedCourseId}
            selectedStudentId={selectedStudentId}
            setSelectedStudentId={setSelectedStudentId}
            setupClassButton={false}
          />
          <FileGallery
            courseId={selectedCourseId ? selectedCourseId : undefined}
            studentId={selectedStudentId ? selectedStudentId : undefined}
          />
        </div>
      </Content>
    </div>
  );
}
