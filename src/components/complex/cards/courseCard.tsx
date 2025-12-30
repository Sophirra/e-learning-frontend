import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";

interface CourseCardProps {
  title: string;
  imageUrl: string;
  rating: number;
  levels?: string[];
  language?: string[];
  price: string;
  description: string;
  teacher?: {
    name?: string;
    surname?: string;
  };
  onClick?: () => void;
}

export function CourseCard({
  title,
  imageUrl,
  rating,
  levels = [],
  language = [],
  price,
  description,
  teacher = { name: "Unknown", surname: "" },
  onClick,
}: CourseCardProps) {
  return (
    <Card
      className="w-[350px] overflow-hidden pt-0 spacing-y-4 cursor-pointer"
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
          <div className="flex flex-col items-start">
            <h3 className="text-lg font-semibold truncate">{title}</h3>
            <h4 className="text-sm text-left font-medium truncate">
              {teacher.name} {teacher.surname}
            </h4>
          </div>
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, index) => {
              const filled = index + 1 <= Math.floor(rating);
              const halfFilled = index < rating && index + 1 > rating;
              return (
                <icons.Star
                  key={index}
                  className={`h-4 w-4 ${
                    filled
                      ? "fill-yellow-200 text-yellow-300"
                      : halfFilled
                        ? "fill-yellow-200 text-yellow-300/50" 
                        : "text-gray-300"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          {levels.length > 0 && <span>{levels.join(", ")}</span>}
          {levels.length > 0 && language.length > 0 && <span>•</span>}
          {language.length > 0 && <span>{language.join(", ")}</span>}
          {(levels.length > 0 || language.length > 0) && <span>•</span>}
          <span>{price}</span>
        </div>

        <p className="mt-1 text-sm text-muted-foreground text-left">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
