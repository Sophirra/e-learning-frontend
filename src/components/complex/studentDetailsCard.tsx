import { Label } from "@/components/ui/label.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useNavigate } from "react-router-dom";
import type { CourseBrief } from "@/api/types.ts";

interface StudentDetailsCardProps {
  id: string;
  name: string;
  image?: string;
  courses: CourseBrief[];
}

export function StudentDetailsCard({
  id,
  name,
  image,
  courses,
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
              key={course.id}
              variant={"outline"}
              size={"sm"}
              className="justify-start text-left h-auto py-2 px-3"
              onClick={() => {
                navigate(`/course/${course.id}`);
              }}
            >
              Go to course {course.name}
            </Button>
          ))}
        </div>
        <Label className={"text-sm text-left"}>See associated:</Label>
        Tutaj mamy przefiltrowaną nawigację do zakładek
      </CardContent>
    </Card>
  );
}
