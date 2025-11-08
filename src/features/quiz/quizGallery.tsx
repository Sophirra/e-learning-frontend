import { Button } from "@/components/ui/button.tsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { QuizCard } from "@/features/quiz/quizCard.tsx";
import CourseFilter from "@/components/complex/courseFilter.tsx";
import { useUser } from "@/features/user/UserContext.tsx";
import { type SelectableItem } from "@/components/complex/filterDropdown.tsx";
import type { QuizBrief } from "@/api/types.ts";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { getQuizzes } from "@/api/apiCalls.ts";
import Summary from "@/components/complex/summaries/summary.tsx";

export function QuizGallery() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );
  const [quizzes, setQuizzes] = useState<QuizBrief[]>([]);
  const [selectedCreatedBy, setSelectedCreatedBy] = useState<SelectableItem[]>(
    [],
  );
  const [multiChoice, setMultiChoice] = useState<SelectableItem[]>([]); //

  const resetFilters = () => {
    setSelectedStudentId(null);
    setSelectedCourseId(null);
  };

  const mockQuizzes: QuizBrief[] = [
    {
      id: "1",
      name: "test",
      courseId: "1",
      courseName: "test course",
      questionNumber: 10,
    },
  ];

  useEffect(() => {
    fetchQuizzes();
  }, [selectedStudentId, selectedCourseId]);

  async function fetchQuizzes() {
    try {
      const data = await getQuizzes(
        selectedStudentId ? selectedStudentId : undefined,
        selectedCourseId ? selectedCourseId : undefined,
        multiChoice ? multiChoice[0].value == "multi" : undefined,
        searchQuery,
      );
      setQuizzes(data);
    } catch (e) {
      console.error("Error fetching quizzes:", e);
    }
  }

  function addNewQuizButton() {
    return (
      <Button onClick={() => navigate("/quizzes/create")} variant={"ghost"}>
        <icons.Plus />
        Create New
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <CourseFilter
        student={user?.activeRole == "student"}
        setSelectedStudentId={setSelectedStudentId}
        selectedStudentId={selectedStudentId}
        setSelectedCourseId={setSelectedCourseId}
        selectedCourseId={selectedCourseId}
        setupClassButton={false}
      />
      {/*<div className={"flex flex-row gap-2"}>*/}
      {/*  <FilterDropdown*/}
      {/*    reset={true}*/}
      {/*    label={"Created by"}*/}
      {/*    placeholder={"Who created the quiz"}*/}
      {/*    emptyMessage={"Origin"}*/}
      {/*    items={[*/}
      {/*      { name: "Uploaded", value: "uploaded" },*/}
      {/*      { name: "Generated", value: "generated" },*/}
      {/*    ]}*/}
      {/*    onSelectionChange={setSelectedCreatedBy}*/}
      {/*  />*/}
      {/*  <FilterDropdown*/}
      {/*    reset={true}*/}
      {/*    label={"Multi-choice?"}*/}
      {/*    placeholder={"Multi-choice?"}*/}
      {/*    emptyMessage={"Multi-choice?"}*/}
      {/*    multiselect={false}*/}
      {/*    items={[*/}
      {/*      { name: "single choice", value: "single" },*/}
      {/*      { name: "multi choice", value: "multi" },*/}
      {/*    ]}*/}
      {/*    onSelectionChange={setMultiChoice}*/}
      {/*  />*/}
      {/*  <Button>*/}
      {/*    <icons.Check /> Filter*/}
      {/*  </Button>*/}
      {/*</div>*/}

      {/* Header with Create button */}
      <Summary
        label={"Quizzes"}
        labelIcon={icons.Quiz}
        customButton={() => addNewQuizButton()}
      >
        {/* Quiz Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockQuizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      </Summary>
    </div>
  );
}
