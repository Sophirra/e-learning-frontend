import { NavigationBar } from "@/components/complex/bars/navigationBar.tsx";
import { QuizGallery } from "@/components/complex/galleries/quizGallery.tsx";
import { Content } from "@/components/ui/content.tsx";
import { QuestionGallery } from "@/components/complex/galleries/questionGallery.tsx";
import { useUser } from "@/lib/user/UserContext.tsx";

export function QuizPage() {
  const { user } = useUser();
  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />
      <Content>
        <QuizGallery enableSelect={false} />
        {user?.activeRole === "teacher" && (
          <QuestionGallery enableSelect={false} />
        )}
      </Content>
    </div>
  );
}
