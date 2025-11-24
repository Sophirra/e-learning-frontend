import { useEffect, useState } from "react";
import CourseFilter from "@/components/complex/courseFilter.tsx";
import { useUser } from "@/features/user/UserContext.tsx";
import type { QuizBrief } from "@/api/types.ts";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { getQuizzes } from "@/api/apiCalls.ts";
import Summary from "@/components/complex/summaries/summary.tsx";
import { QuizDetailsPopup } from "@/components/complex/popups/quiz/quizDetailsPopup.tsx";
import { LoadingTile } from "@/components/complex/loadingTile.tsx";

export function QuizGallery({
  enableSelect,
  selected,
  setSelected,
}: {
  enableSelect: boolean;
  selected?: QuizBrief | null;
  setSelected?: (quiz: QuizBrief) => void;
}) {
  const { user } = useUser();
  // const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );
  const [quizzes, setQuizzes] = useState<QuizBrief[]>([]);

  // const resetFilters = () => {
  //   setSelectedStudentId(null);
  //   setSelectedCourseId(null);
  // };

  useEffect(() => {
    fetchQuizzes();
  }, [selectedStudentId, selectedCourseId]);

  async function fetchQuizzes() {
    try {
      const data = await getQuizzes(
        selectedStudentId ? selectedStudentId : undefined,
        selectedCourseId ? selectedCourseId : undefined,
        // searchQuery,
      );
      setQuizzes(data);
      console.log("set quizzes: ", data);
    } catch (e) {
      console.error("Error fetching quizzes:", e);
    }
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
      <Summary
        label={"Quizzes"}
        labelIcon={icons.Quiz}
        canHide={user?.activeRole === "teacher"}
      >
        {quizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-150 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
            {quizzes.map((quiz) => (
              <QuizDetailsPopup
                key={quiz.id}
                quizBrief={quiz}
                selected={selected ? selected.id === quiz.id : undefined}
                setSelected={
                  !enableSelect
                    ? undefined
                    : () => setSelected && setSelected(quiz)
                }
              />
            ))}
          </div>
        ) : (
          <LoadingTile text={"No quizzes found"} />
        )}
      </Summary>
      <div />
    </div>
  );
}
