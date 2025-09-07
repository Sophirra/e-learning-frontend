import { Label } from "@/components/ui/label.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Badge } from "../ui/badge";
import { Button } from "@/components/ui/button.tsx";
import { useNavigate } from "react-router-dom";

interface TeacherDetailsCardProps {
  id: string;
  name: string;
  image: string;
  description: string;
  courses: { id: string; name: string }[];
  availability: number[];
}


export function TeacherDetailsCard({
  availability,
  courses,
  description,
  id,
  image,
  name,
}: TeacherDetailsCardProps) {
  let week = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
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
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className={"space-y-2 text-left"}>
        <Label className={"text-sm"}>This week available class slots:</Label>
        <div className="grid grid-cols-7 gap-1">
          {week.map((day, index) => (
            <div className={"flex flex-col items-center justify-center"}>
              <div className={"text-xs text-muted-foreground"}>
                {day.slice(0, 3)}
              </div>
              <Badge
                variant={availability[index] == 0 ? "secondary" : "default"}
                className={"text-xs w-full py-1 "}
              >
                {availability[index]}
              </Badge>
            </div>
          ))}
        </div>
        <Label className={"text-sm text-left"}>Other courses:</Label>
        <div className="grid gap-2">
          {courses.map((course) => (
              <Button
                  key={course.id}
                  variant={"outline"}
                  size={"sm"}
                  className="justify-start text-left h-auto py-2 px-3"
                  onClick={() => {
                    navigate(`/course/${course.id}`, { state: { teacherId: id } });
                  }}
              >
                Go to course {course.name}
              </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
