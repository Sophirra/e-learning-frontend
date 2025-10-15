import {useEffect, useMemo, useState} from "react";
import {Content} from "@/components/ui/content.tsx";
import {useUser} from "@/features/user/UserContext.tsx";
import {NavigationBar} from "@/components/complex/navigationBar.tsx";
import type {CourseBrief} from "@/api/types.ts";
import CourseFilter from "@/components/complex/courseFilter.tsx";
import {CalendarSummary} from "@/components/complex/summaries/calendarSummary.tsx";
import {type AnyTask, AssignmentSummary} from "@/components/complex/summaries/assignmentSummary.tsx";
import {ChatSummary} from "@/components/complex/summaries/chatSummary.tsx";
import {getCourseBriefs} from "@/api/apiCalls.ts";
import {toast} from "sonner";
import api, {getUserId} from "@/api/api.ts";

export type ExerciseBrief = {
    id: string;
    courseId: string;
    courseName: string;
    classStartTime: string;
    exerciseStatus: string;
};

export function HomePage() {
    const { user } = useUser();
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [courses, setCourses] = useState<CourseBrief[]>([]);

    const [assignmentsRaw, setAssignmentsRaw] = useState<ExerciseBrief[]>([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getCourseBriefs();
                setCourses(data);
            } catch {
                toast.error("Failed to load courses. Please try again later.");
            }
        };
        fetchCourses();
    }, []);

    // Get only once (or when user changes), filtering is done on the frontend
    useEffect(() => {
        const studentId = getUserId();
        if (!studentId) return;

        api
            .get<ExerciseBrief[]>(`/api/exercises/unsolved-by-user/${studentId}`)
            .then((res) => setAssignmentsRaw(res.data ?? []))
            .catch((err) => console.error("Assignments could not be retrieved:", err));
    }, []);

    const filteredRaw = useMemo(() => {
        if (!selectedCourseId) return assignmentsRaw;
        return assignmentsRaw.filter((ex) => ex.courseId === selectedCourseId);
    }, [assignmentsRaw, selectedCourseId]);

    const visibleAssignments: AnyTask[] = useMemo(() => {
        return filteredRaw.map((ex) => {
            const classDate = ex.classStartTime.slice(0, 10);
            return {
                id: ex.id,
                name: `Exercise ${ex.courseName} [${classDate}]`,
                courseName: ex.courseName,
                className: undefined,
                completed: false,
                type: "assignment",
                status: ex.exerciseStatus === "completed" ? "good" : "behind",
                graded: false,
                grade: undefined,
                comments: undefined,
            };
        });
    }, [filteredRaw]);

    return (
        <div className="bg-white h-screen">
            <NavigationBar />
            <Content>
                <div className="space-y-4">
                    <CourseFilter
                        student={user?.student || false}
                        setSelectedCourseId={setSelectedCourseId}
                        selectedCourseId={selectedCourseId}
                        setupClassButton={true}
                    />
                    <CalendarSummary courses={courses} />
                    <AssignmentSummary
                        assignments={visibleAssignments}
                        student={user?.student || false}
                    />
                    <ChatSummary />
                </div>
            </Content>
        </div>
    );
}
