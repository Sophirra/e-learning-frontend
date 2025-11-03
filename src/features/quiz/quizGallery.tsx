import { Button } from "@/components/ui/button.tsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { Quiz } from "@/interfaces/QuizInterface.tsx";
import type { Tag } from "@/interfaces/TagInterface.tsx";
import { QuizCard } from "@/features/quiz/quizCard.tsx";
import CourseFilter from "@/components/complex/courseFilter.tsx";
import { useUser } from "@/features/user/UserContext.tsx";
import {
  FilterDropdown,
  type SelectableItem,
} from "@/components/complex/filterDropdown.tsx";
import type { FileData } from "@/api/types.ts";

//actually template gallery
export function QuizGallery() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );
  const [quizzes, setQuizzes] = useState<FileData[]>([]);
  const [selectedOrigin, setSelectedOrigin] = useState<SelectableItem[]>([]);
  const [selectedCreatedBy, setSelectedCreatedBy] = useState<SelectableItem[]>(
    [],
  );
  const [multiChoice, setMultiChoice] = useState<SelectableItem[]>([]);
  const [questionNumber, setQuestionNumber] = useState<SelectableItem[]>([]);

  const resetFilters = () => {
    setSelectedStudentId(null);
    setSelectedCourseId(null);
  };

  return (
    <div>
      <CourseFilter
        student={user?.activeRole == "student"}
        setSelectedStudentId={setSelectedStudentId}
        selectedStudentId={selectedStudentId}
        setSelectedCourseId={setSelectedCourseId}
        selectedCourseId={selectedCourseId}
        setupClassButton={false}
      />
      <div className={"flex flex-row gap-2"}>
        <FilterDropdown
          reset={true}
          label={"Created ny"}
          placeholder={"Who created the quiz"}
          emptyMessage={"Origin"}
          items={[
            { name: "Uploaded", value: "uploaded" },
            { name: "Generated", value: "generated" },
          ]}
          onSelectionChange={setSelectedOrigin}
        />
      </div>
      {/*<div className="sticky top-[80px] bg-white z-10 border-b pb-4">*/}
      {/*  <div className="flex items-center gap-4">*/}
      {/*    <Button variant="outline" onClick={resetFilters}>*/}
      {/*      All*/}
      {/*    </Button>*/}

      {/*    <ScrollArea className="flex-1">*/}
      {/*      <div className="flex gap-2">*/}
      {/*        <ScrollBar orientation="horizontal" />*/}
      {/*        <Select>*/}
      {/*          <SelectTrigger className="w-[150px]">*/}
      {/*            <SelectValue placeholder="Students" />*/}
      {/*          </SelectTrigger>*/}
      {/*          <SelectContent>*/}
      {/*            <ScrollArea className="h-[200px]">*/}
      {/*              <SelectItem value="student1">Student 1</SelectItem>*/}
      {/*              <SelectItem value="student2">Student 2</SelectItem>*/}
      {/*              <ScrollBar />*/}
      {/*            </ScrollArea>*/}
      {/*          </SelectContent>*/}
      {/*        </Select>*/}

      {/*        <Select>*/}
      {/*          <SelectTrigger className="w-[150px]">*/}
      {/*            <SelectValue placeholder="Courses" />*/}
      {/*          </SelectTrigger>*/}
      {/*          <SelectContent>*/}
      {/*            <ScrollArea className="h-[200px]">*/}
      {/*              <SelectItem value="course1">Course 1</SelectItem>*/}
      {/*              <SelectItem value="course2">Course 2</SelectItem>*/}
      {/*            </ScrollArea>*/}
      {/*          </SelectContent>*/}
      {/*        </Select>*/}

      {/*        <Select>*/}
      {/*          <SelectTrigger className="w-[150px]">*/}
      {/*            <SelectValue placeholder="Created by" />*/}
      {/*          </SelectTrigger>*/}
      {/*          <SelectContent>*/}
      {/*            <ScrollArea className="h-[200px]">*/}
      {/*              <SelectItem value="creator1">Creator 1</SelectItem>*/}
      {/*              <SelectItem value="creator2">Creator 2</SelectItem>*/}
      {/*            </ScrollArea>*/}
      {/*          </SelectContent>*/}
      {/*        </Select>*/}

      {/*        <Select>*/}
      {/*          <SelectTrigger className="w-[150px]">*/}
      {/*            <SelectValue placeholder="Level" />*/}
      {/*          </SelectTrigger>*/}
      {/*          <SelectContent>*/}
      {/*            <SelectItem value="beginner">Beginner</SelectItem>*/}
      {/*            <SelectItem value="intermediate">Intermediate</SelectItem>*/}
      {/*            <SelectItem value="advanced">Advanced</SelectItem>*/}
      {/*          </SelectContent>*/}
      {/*        </Select>*/}

      {/*        <Select>*/}
      {/*          <SelectTrigger className="w-[150px]">*/}
      {/*            <SelectValue placeholder="Other tags" />*/}
      {/*          </SelectTrigger>*/}
      {/*          <SelectContent>*/}
      {/*            <ScrollArea className="h-[200px]">*/}
      {/*              <SelectItem value="tag1">Tag 1</SelectItem>*/}
      {/*              <SelectItem value="tag2">Tag 2</SelectItem>*/}
      {/*            </ScrollArea>*/}
      {/*          </SelectContent>*/}
      {/*        </Select>*/}
      {/*      </div>*/}
      {/*    </ScrollArea>*/}

      {/*    <div className="flex items-center gap-2">*/}
      {/*      <Input*/}
      {/*        value={searchQuery}*/}
      {/*        onChange={(e) => setSearchQuery(e.target.value)}*/}
      {/*        placeholder="Search quizzes..."*/}
      {/*        className="w-[200px]"*/}
      {/*      />*/}
      {/*      <Button*/}
      {/*        variant="ghost"*/}
      {/*        size="icon"*/}
      {/*        onClick={() => setSearchQuery("")}*/}
      {/*      >*/}
      {/*        <Reset className="h-4 w-4" />*/}
      {/*      </Button>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}

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
            isTagSelected={isTagSelected}
          />
        ))}
      </div>
    </div>
  );
}
