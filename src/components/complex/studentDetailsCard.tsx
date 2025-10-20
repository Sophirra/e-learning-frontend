import { Label } from "@/components/ui/label.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { CourseBrief } from "@/api/types.ts";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";

interface StudentDetailsCardProps {
  id: string;
  name: string;
  image?: string;
  courses: CourseBrief[];
  selectedCourseId: string | null;
  setSelectedCourseId: (courseId: string) => void;
}

export function StudentDetailsCard({
  id,
  name,
  image,
  courses,
  selectedCourseId,
  setSelectedCourseId,
}: StudentDetailsCardProps) {
  let navigate = useNavigate();
  return (
    <Card className="bg-slate-100 rounded-lg p-6">
      <CardHeader className={"flex-col gap-4 text-left"}>
        <img
          src={image}
          alt={"profile picture"}
          className={"aspect-square text-left rounded-full"}
        />
        <CardTitle className={"text-xl"}>{name}</CardTitle>
      </CardHeader>
      <CardContent className={"space-y-2 text-left"}>
        <Label className={"text-sm"}>Attends:</Label>
        <div className="grid gap-2">
          {courses.map((course: CourseBrief) => (
            <Button
              key={course.courseId}
              variant={
                selectedCourseId && selectedCourseId == course.courseId
                  ? "default"
                  : "outline"
              }
              size={"sm"}
              className="justify-start text-left h-auto py-1 px-2"
              onClick={() => {
                setSelectedCourseId(course.courseId);
              }}
            >
              Filter by {course.courseName}
            </Button>
          ))}
        </div>
        <Label className={"text-sm text-left"}>See associated:</Label>
        <nav className="flex gap-2 justify-center">
          {[
            { to: "/home", icon: icons.Home, label: "Home" },
            { to: "/calendar", icon: icons.Calendar, label: "Calendar" },
            {
              to: "/assignments",
              icon: icons.ClipboardList,
              label: "Assignments",
            },
            { to: "/files", icon: icons.FolderOpen, label: "Files" },
            { to: "/chats", icon: icons.MessageSquare, label: "Chats" },
            { to: "/quizzes", icon: icons.Brain, label: "Quizzes" },
          ]
            //filter to remove null from list
            .filter(Boolean)
            //ignore warnings - null is filtered out
            // @ts-ignore
            .map(({ to, icon: Icon, label }) => {
              let isActive = useLocation().pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={
                    "flex items-center gap-1 transition-all text-gray-500 hover:text-gray-700"
                  }
                >
                  <Icon className={"text-gray-500 hover:text-gray-700"} />
                  {/*<span className={"text-sm"}>{label}</span>*/}
                </Link>
              );
            })}
        </nav>
      </CardContent>
    </Card>
  );
}
