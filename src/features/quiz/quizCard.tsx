import { Button } from "@/components/ui/button.tsx";
import { Pen, Trash2 } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.tsx";
import { cn } from "@/lib/utils.ts";
import type { Quiz } from "@/interfaces/QuizInterface.tsx";
import type { Tag } from "@/interfaces/TagInterface.tsx";

interface QuizCardProps {
  quiz: Quiz;
  selectedFilters: Record<string, string[]>;
  onEdit: () => void;
  onDelete: () => void;
  isTagSelected: (
    tag: Tag,
    selectedFilters: Record<string, string[]>,
  ) => boolean;
}
export function QuizCard({
  quiz,
  selectedFilters,
  onEdit,
  onDelete,
  isTagSelected,
}: QuizCardProps) {
  // Sortuj tagi tak, aby wybrane były na początku
  const sortedTags = [...quiz.tags].sort((a, b) => {
    const aSelected = isTagSelected(a, selectedFilters);
    const bSelected = isTagSelected(b, selectedFilters);
    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    return 0;
  });

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold truncate">{quiz.title}</h3>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Pen className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm text-gray-500">
          {quiz.questions.length} questions
        </div>
        {quiz.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {quiz.description}
          </p>
        )}
      </div>

      <ScrollArea className="w-full">
        <div className="flex gap-2">
          <ScrollBar orientation="horizontal" />
          {sortedTags.map((tag) => (
            <div
              key={tag.id}
              className={cn(
                "px-2 py-1 text-sm rounded-full border",
                isTagSelected(tag, selectedFilters)
                  ? "border-primary text-primary"
                  : "border-gray-200 text-gray-500",
              )}
            >
              {tag.name}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
