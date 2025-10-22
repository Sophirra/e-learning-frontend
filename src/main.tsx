import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Outlet } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import MainPage from "@/pages/GuestPages/MainPage.tsx";
import { CoursePage } from "@/pages/GuestPages/CoursePage.tsx";
import { FilesPage } from "@/pages/UserPages/FilesPage.tsx";
import { CreateQuizPage } from "@/pages/UserPages/CreateQuizPage.tsx";
import "./index.css";
import { SolveQuizPage } from "@/pages/UserPages/SolveQuizPage.tsx";
import { QuizPage } from "@/pages/UserPages/QuizPage.tsx";
import { UserProvider, useUser } from "@/features/user/UserContext.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import { StudentsPage } from "@/pages/UserPages/StudentsPage.tsx";
import { CalendarPage } from "@/pages/UserPages/CalendarPage.tsx";
import { ChatsPage } from "@/pages/UserPages/ChatsPage.tsx";
import { AssignmentPage } from "@/pages/UserPages/AssignmentPage.tsx";
import { HomePage } from "@/pages/UserPages/HomePage.tsx";
import ErrorPage from "@/pages/ErrorPage.tsx";
import SpectatorAcceptPage from "@/components/complex/popups/spectators/spectatorAcceptPage.tsx";

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
          <Route path="/accept" element={<SpectatorAcceptPage  />} />
          {/*protected by login*/}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/quizzes" element={<QuizPage />} />
            <Route path="/quizzes/edit" element={<CreateQuizPage />} />
            <Route path="/quiz/:quizId" element={<SolveQuizPage />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/calendar/course/:courseId" element={<CalendarPage />} />
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
