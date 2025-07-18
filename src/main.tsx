import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import MainPage from "@/pages/MainPage";
import { CoursePage } from "@/pages/CoursePage";
// import {StudentsPage} from './components/pages/StudentsPage'
// import {CalendarPage} from './components/pages/CalendarPage'
// import {AssignmentsPage} from './components/pages/AssignmentsPage'
import { FilesPage } from "@/pages/FilesPage";
// import {ChatsPage} from './components/pages/ChatsPage'
// import {SpectatingPage} from './components/pages/SpectatingPage'
import { CreateQuizPage } from "@/pages/CreateQuizPage";
import "./index.css";
import { SolveQuizPage } from "@/pages/SolveQuizPage.tsx";
import { QuizPage } from "@/pages/QuizPage.tsx";
import { UserProvider } from "@/features/user/UserContext.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <Toaster richColors={true} position={"top-center"} />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/course/:id" element={<CoursePage />} />
          <Route path="/quizzes" element={<QuizPage />} />
          <Route path="/quizzes/edit" element={<CreateQuizPage />} />
          <Route path="/quiz/:quizId" element={<SolveQuizPage />} />
          {/*<Route path="/students" element={<StudentsPage/>}/>*/}
          {/*<Route path="/calendar" element={<CalendarPage/>}/>*/}
          {/*<Route path="/assignments" element={<AssignmentsPage/>}/>*/}
          <Route path="/files" element={<FilesPage />} />
          {/*<Route path="/chats" element={<ChatsPage/>}/>*/}
          {/*<Route path="/spectating" element={<SpectatingPage/>}/>*/}
        </Routes>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
