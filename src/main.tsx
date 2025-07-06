import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
import MainPage from './components/pages/MainPage'
import { CoursePage } from './components/pages/CoursePage'
// import {StudentsPage} from './components/pages/StudentsPage'
// import {CalendarPage} from './components/pages/CalendarPage'
// import {AssignmentsPage} from './components/pages/AssignmentsPage'
// import {FilesPage} from './components/pages/FilesPage'
// import {ChatsPage} from './components/pages/ChatsPage'
// import {SpectatingPage} from './components/pages/SpectatingPage'
import {CreateQuizPage} from './components/pages/CreateQuizPage'
import './index.css'
import {SolveQuizPage} from "@/components/pages/SolveQuizPage.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                
                <Route path="/" element={<MainPage />} />
                <Route path="/course/:id" element={<CoursePage />} />
                <Route path="/quizzes" element={<CreateQuizPage/>}/>
                <Route path="/quiz/:quizId" element={<SolveQuizPage />} />
                {/*<Route path="/students" element={<StudentsPage/>}/>*/}
                {/*<Route path="/calendar" element={<CalendarPage/>}/>*/}
                {/*<Route path="/assignments" element={<AssignmentsPage/>}/>*/}
                {/*<Route path="/files" element={<FilesPage/>}/>*/}
                {/*<Route path="/chats" element={<ChatsPage/>}/>*/}
                {/*<Route path="/spectating" element={<SpectatingPage/>}/>*/}
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
)