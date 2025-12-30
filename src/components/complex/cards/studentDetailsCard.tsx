import { Label } from "@/components/ui/label.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useNavigate } from "react-router-dom";
import type { CourseBrief } from "@/types.ts";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";

interface StudentDetailsCardProps {
  id: string;
  name: string;
  courses: CourseBrief[];
  selectedCourseId: string | null;
  setSelectedCourseId: (courseId: string) => void;
}

export function StudentDetailsCard({
  id,
  name,
  // image,
  courses,
  selectedCourseId,
  setSelectedCourseId,
}: StudentDetailsCardProps) {
  let navigate = useNavigate();
  return (
    <Card className="bg-slate-100 rounded-lg p-6">
      <CardHeader className={"flex-col text-left"}>
        <CardTitle className={"text-xl"}>{name}</CardTitle>
      </CardHeader>
      <CardContent className={"space-y-2 text-left"}>
        <Label className={"text-sm"}>Attends:</Label>
        <div className="grid gap-2">
          {courses &&
            courses.map((course: CourseBrief) => (
              <Button
                key={course.id}
                variant={
                  selectedCourseId && selectedCourseId == course.id
                    ? "default"
                    : "outline"
                }
                size={"sm"}
                className="justify-start text-left h-auto py-1 px-2"
                onClick={() => {
                  setSelectedCourseId(course.id);
                }}
              >
                {course.name}
              </Button>
            ))}
        </div>
        <Label className={"text-sm text-left"}>See associated:</Label>
        <nav className="flex gap-2 justify-center">
          {[
            { to: "/home", icon: icons.Home, label: "Home" },
            { to: "/calendar", icon: icons.Calendar, label: "Calendar" },
            {
              to: "/exercise",
              icon: icons.ClipboardList,
              label: "Assignments",
            },
            { to: "/files", icon: icons.FolderOpen, label: "Files" },
            { to: "/chats", icon: icons.MessageSquare, label: "Chats" },
            { to: "/quizzes", icon: icons.Brain, label: "Quizzes" },
          ]
            //filter to remove null from the list
            .filter(Boolean)
            .map(({ to, icon: Icon }) => {
              return (
                <Button
                  onClick={() =>
                    navigate(to, {
                      state: { selectedStudentId: id },
                    })
                  }
                  variant={"link"}
                  size={"icon"}
                  className={"text-gray-500 hover:text-gray-700 !shrink"}
                >
                  <Icon />
                </Button>
              );
            })}
        </nav>
      </CardContent>
    </Card>
  );
}
