// import { useNavigate } from "react-router-dom";
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
import { QuestionDetailsPopup } from "@/components/complex/popups/quiz/questions/questionDetailsPopup.tsx";
import { LoadingTile } from "@/components/complex/loadingTile.tsx";
import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";

export function QuestionGallery({
  enableSelect,
  selectedQuestionIds,
  setSelectedQuestionIds,
}: {
  enableSelect: boolean;
  selectedQuestionIds?: string[];
  setSelectedQuestionIds?: (questionId: string[]) => void;
}) {
  const { user } = useUser();
  // const navigate = useNavigate();
  const [questionCategories, setQuestionCategories] = useState<
    SelectableItem[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<SelectableItem[]>(
    [],
  );
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
      label={
        "Questions" +
        (selectedQuestionIds
          ? `: (${selectedQuestionIds.length} selected)`
          : "")
      }
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
          {!enableSelect
            ? questions.map((question) => (
                <QuestionDetailsPopup
                  key={question.id}
                  questionBrief={question}
                />
              ))
            : questions.map((question) => (
                <Button
                  key={question.id}
                  disabled={user?.activeRole !== "teacher"}
                  variant={"ghost"}
                  className={cn(
                    "shadow-md flex flex-col gap-1 h-1/1 items-start border-1",
                    selectedQuestionIds &&
                      selectedQuestionIds.some((q) => q === question.id)
                      ? "border-slate-300"
                      : "border-transparent",
                  )}
                  onClick={() => {
                    if (selectedQuestionIds && setSelectedQuestionIds) {
                      if (selectedQuestionIds.some((q) => q === question.id)) {
                        console.log("remove: ", question.id);
                        setSelectedQuestionIds(
                          selectedQuestionIds.filter((q) => q !== question.id),
                        );
                        console.log("selected: ", selectedQuestionIds);
                      } else {
                        if (question.id) {
                          console.log("add: ", question.id);
                          setSelectedQuestionIds([
                            ...selectedQuestionIds,
                            question.id,
                          ]);
                        }
                        console.log("selected: ", selectedQuestionIds);
                      }
                    }
                  }}
                >
                  <div className={"flex flex-col gap-1"}>
                    <h3 className="text-lg font-bold truncate">
                      {question.content}
                    </h3>
                    <div className={"flex flex-row gap-2 "}>
                      {question.categories.map((category) => (
                        <p
                          key={category.id}
                          className="text-m text-gray-500 font-medium"
                        >
                          {category.name}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div></div>
                </Button>
              ))}
        </div>
      ) : (
        <LoadingTile text={"No questions found"} />
      )}
    </Summary>
  );
}
