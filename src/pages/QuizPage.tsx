import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.tsx";
import { Plus, Pen, Trash2, X as Reset } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils.ts";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { NavigationHeader } from "@/components/complex/navigationHeader.tsx";
import type { Quiz } from "@/interfaces/QuizInterface.tsx";
import type { Tag } from "@/interfaces/TagInterface.tsx";
import { Content } from "@/components/ui/content.tsx";

export function QuizPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({
    students: [],
    courses: [],
    creators: [],
    levels: [],
    otherTags: [],
  });

  const mockQuizzes: Quiz[] = [
    {
      id: "1",
      title: "JavaScript Basics",
      description: "Test your JavaScript knowledge",
      questions: [],
      isMultipleChoice: false,
      tags: [
        { id: "1", name: "Programming", category: "other" },
        { id: "2", name: "Beginner", category: "level" },
        { id: "3", name: "Web Development", category: "course" },
      ],
    },
  ];

  const resetFilters = () => {
    setSelectedFilters({
      students: [],
      courses: [],
      creators: [],
      levels: [],
      otherTags: [],
    });
  };

  const isTagSelected = (tag: Tag) => {
    const categoryMap = {
      student: "students",
      course: "courses",
      creator: "creators",
      level: "levels",
      other: "otherTags",
    };
    return selectedFilters[categoryMap[tag.category]]?.includes(tag.name);
  };

  return (
    <div className="min-h-screen bg-white">
      <NavigationHeader />
      <Content>
        {/* Filters Bar */}
        <div className="sticky top-[80px] bg-white z-10 border-b pb-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={resetFilters}>
              All
            </Button>

            <ScrollArea className="flex-1">
              <div className="flex gap-2">
                <ScrollBar orientation="horizontal" />
                <Select>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Students" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-[200px]">
                      <SelectItem value="student1">Student 1</SelectItem>
                      <SelectItem value="student2">Student 2</SelectItem>
                      <ScrollBar />
                    </ScrollArea>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Courses" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-[200px]">
                      <SelectItem value="course1">Course 1</SelectItem>
                      <SelectItem value="course2">Course 2</SelectItem>
                    </ScrollArea>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Created by" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-[200px]">
                      <SelectItem value="creator1">Creator 1</SelectItem>
                      <SelectItem value="creator2">Creator 2</SelectItem>
                    </ScrollArea>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Other tags" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-[200px]">
                      <SelectItem value="tag1">Tag 1</SelectItem>
                      <SelectItem value="tag2">Tag 2</SelectItem>
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>
            </ScrollArea>

            <div className="flex items-center gap-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search quizzes..."
                className="w-[200px]"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery("")}
              >
                <Reset className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Header with Create button */}
        <div className="flex items-center justify-between my-6">
          <h1 className="text-2xl font-bold">Quizzes</h1>
          <Button
            onClick={() => navigate("/quizzes/create")}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create New
          </Button>
        </div>

        {/* Quiz Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockQuizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              selectedFilters={selectedFilters}
              onEdit={() => navigate(`/quizzes/edit/${quiz.id}`)}
              onDelete={() => {
                /* handle delete */
              }}
            />
          ))}
        </div>
      </Content>
    </div>
  );
}

interface QuizCardProps {
  quiz: Quiz;
  selectedFilters: Record<string, string[]>;
  onEdit: () => void;
  onDelete: () => void;
}

function QuizCard({ quiz, selectedFilters, onEdit, onDelete }: QuizCardProps) {
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

function isTagSelected(tag: Tag, selectedFilters: Record<string, string[]>) {
  const categoryMap = {
    student: "students",
    course: "courses",
    creator: "creators",
    level: "levels",
    other: "otherTags",
  };
  return selectedFilters[categoryMap[tag.category]]?.includes(tag.name);
}
