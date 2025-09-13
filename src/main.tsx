import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Outlet } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import MainPage from "@/pages/MainPage";
import { CoursePage } from "@/pages/CoursePage";
import { FilesPage } from "@/pages/FilesPage";
import { CreateQuizPage } from "@/pages/CreateQuizPage";
import "./index.css";
import { SolveQuizPage } from "@/pages/SolveQuizPage.tsx";
import { QuizPage } from "@/pages/QuizPage.tsx";
import { UserProvider, useUser } from "@/features/user/UserContext.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import { StudentsPage } from "@/pages/StudentsPage.tsx";
import { CalendarPage } from "@/pages/CalendarPage.tsx";
import { ChatsPage } from "@/pages/ChatsPage.tsx";
import { AssignmentPage } from "@/pages/AssignmentPage.tsx";
import { HomePage } from "@/pages/HomePage.tsx";
import ErrorPage from "@/pages/ErrorPage.tsx";

function ProtectedRoute() {
  let { loading, user } = useUser();
  if (loading) {
    return <div>Loading...</div>;
  }
  return user ? <Outlet /> : <Navigate to="/" replace />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <Toaster richColors={true} position={"top-center"} />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/course/:courseId" element={<CoursePage />} />
          {/*protected by login*/}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/quizzes" element={<QuizPage />} />
            <Route path="/quizzes/edit" element={<CreateQuizPage />} />
            <Route path="/quiz/:quizId" element={<SolveQuizPage />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/assignments" element={<AssignmentPage />} />
            <Route path="/files" element={<FilesPage />} />
            <Route path="/chats" element={<ChatsPage />} />
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Routes>
        ;
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
