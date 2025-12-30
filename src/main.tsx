import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Outlet } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import MainPage from "@/pages/GuestPages/MainPage.tsx";
import { CoursePage } from "@/pages/GuestPages/CoursePage.tsx";
import { FilesPage } from "@/pages/UserPages/FilesPage.tsx";
import "./index.css";
import { SolveQuizPage } from "@/pages/UserPages/QuizPages/SolveQuizPage.tsx";
import { QuizPage } from "@/pages/UserPages/QuizPages/QuizPage.tsx";
import { UserProvider, useUser } from "@/lib/user/UserContext.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import { StudentsPage } from "@/pages/UserPages/StudentsPage.tsx";
import { CalendarPage } from "@/pages/UserPages/CalendarPage.tsx";
import { ChatsPage } from "@/pages/UserPages/ChatsPage.tsx";
import { ExercisePage } from "@/pages/UserPages/ExercisePage.tsx";
import { HomePage } from "@/pages/UserPages/HomePage.tsx";
import ErrorPage from "@/pages/ErrorPage.tsx";
import SpectatorAcceptPage from "@/components/complex/popups/spectators/spectatorAcceptPage.tsx";
import { SpectatorPage } from "@/pages/UserPages/SpectatorPage.tsx";

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
          <Route path="/accept" element={<SpectatorAcceptPage />} />
          {/*protected by login*/}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/quizzes" element={<QuizPage />} />
            <Route path="/quizzes/:quizId/solve" element={<SolveQuizPage />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route
              path="/calendar/course/:courseId"
              element={<CalendarPage />}
            />
            <Route path="/exercise" element={<ExercisePage />} />
            <Route path="/files" element={<FilesPage />} />
            <Route path="/chats" element={<ChatsPage />} />
            <Route path="/spectate" element={<SpectatorPage />} />
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Routes>
        ;
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
