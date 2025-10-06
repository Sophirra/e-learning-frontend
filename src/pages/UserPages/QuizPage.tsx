import { NavigationBar } from "@/components/complex/navigationBar.tsx";
import { QuizGallery } from "@/features/quiz/quizGallery.tsx";

export function QuizPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />
      <QuizGallery />
    </div>
  );
}
