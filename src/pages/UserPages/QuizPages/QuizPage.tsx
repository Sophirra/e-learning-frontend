import { NavigationBar } from "@/components/complex/navigationBar.tsx";
import { QuizGallery } from "@/features/quiz/quizGallery.tsx";
import { Content } from "@/components/ui/content.tsx";
import { QuestionGallery } from "@/features/quiz/questionGallery.tsx";
import { useUser } from "@/features/user/UserContext.tsx";

export function QuizPage() {
  const { user } = useUser();
  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />
      <Content>
        <QuizGallery />
        {user?.activeRole === "teacher" && (
          <QuestionGallery
            enableSelect={true}
            selectedQuestionIds={[]}
            setSelectedQuestionIds={() => []}
          />
        )}
      </Content>
    </div>
  );
}
