import type { Course } from "@/types.ts";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";

export function CourseDetailCard({ description, name, profilePictureUrl }: Course) {
  return (
    <Card className="mb-8 bg-slate-100 rounded-lg p-4 flex flex-row gap-4 w-full">
      <img
        src={profilePictureUrl}
        alt="course thumbnail"
        className="aspect-square h-1/4 w-1/4 object-cover rounded-lg"
      />
      <CardContent className="flex flex-col gap-4 text-left justify-start p-0 w-full">
        <div className="flex flex-row items-center justify-stretch">
          <CardTitle className="text-xl">{name}</CardTitle>
          <Button
            className="ml-auto self-start text-right"
            size="icon"
            variant="ghost"
            onClick={() => window.history.back()}
          >
            <icons.X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
