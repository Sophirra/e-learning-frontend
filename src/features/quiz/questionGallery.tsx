import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "@/features/user/UserContext.tsx";
import {
  FilterDropdown,
  type SelectableItem,
} from "@/components/complex/filterDropdown.tsx";
import type { Question } from "@/api/types.ts";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { getUserCategories, getUserQuestions } from "@/api/apiCalls.ts";
import Summary from "@/components/complex/summaries/summary.tsx";
import { QuestionDetailsPopup } from "@/components/complex/popups/questionDetailsPopup.tsx";
import { LoadingTile } from "@/components/complex/LoadingTile.tsx";

export function QuestionGallery({ enableSelect }: { enableSelect: boolean }) {
  const { user } = useUser();
  const navigate = useNavigate();
  const [questionCategories, setQuestionCategories] = useState<
    SelectableItem[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<SelectableItem[]>(
    [],
  );
  // const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        if (user?.activeRole !== "teacher") return;
        const data = await getUserQuestions(
          selectedCategory.map((c) => c.value),
        );
        setQuestions(data);
        console.log("set questions: ", data);
      } catch (e) {
        console.error("Error fetching questions:", e);
      }
    }
    fetchQuestions();
  }, [selectedCategory]);

  useEffect(() => {
    async function fetchCategories() {
      const categoriesData = await getUserCategories();
      setQuestionCategories(
        categoriesData.map((c) => {
          return { value: c.id, name: c.name };
        }),
      );
    }
    fetchCategories();
  }, []);

  return (
    <Summary
      label={"Questions"}
      labelIcon={icons.Question}
      customButton={() => <QuestionDetailsPopup />}
      canHide={true}
    >
      <FilterDropdown
        items={questionCategories}
        onSelectionChange={setSelectedCategory}
        placeholder={"Categories"}
        emptyMessage={"Categories"}
        multiselect={true}
        reset={true}
        label={"Categories"}
        className={"w-80"}
      />
      {questions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {questions.map((question) => (
            <QuestionDetailsPopup key={question.id} questionBrief={question} />
          ))}
        </div>
      ) : (
        <LoadingTile text={"No questions found"} />
      )}
    </Summary>
  );
}
