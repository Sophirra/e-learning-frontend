import { NavigationBar } from "@/components/complex/navigationBar.tsx";
import { QuizGallery } from "@/features/quiz/quizGallery.tsx";
import { Content } from "@/components/ui/content.tsx";

export function QuizPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />
      <Content>
        <QuizGallery />
      </Content>
    </div>
  );
}
