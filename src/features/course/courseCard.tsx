import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";

interface CourseCardProps {
  title: string;
  imageUrl: string;
  rating: number;
  levels: string[];
  language: string;
  price: string;
  description: string;
  teacher: {
    name: string;
    surname: string;
  };
  onClick?: () => void;
}

export function CourseCard({
  title,
  imageUrl,
  rating,
  levels,
  language,
  price,
  description,
  teacher,
  onClick,
}: CourseCardProps) {
  return (
    <Card
      className="w-[350px] overflow-hidden pt-0 spacing-y-4"
      onClick={onClick}
    >
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, index) => (
              <icons.Star
                key={index}
                className={`h-4 w-4 ${
                  index < rating
                    ? "fill-yellow-200 text-yellow-300"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {/*a collection of levels*/}
          <span>{levels.map((value) => value + " ")}</span>
          <span>•</span>
          <span>{language}</span>
          <span>•</span>
          <span>${price}</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground text-left">
          {teacher.name + " " + teacher.surname + "\n"}
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
