import {Button} from "@/components/ui/button.tsx";
import type {CourseBrief} from "@/components/complex/studentDetailsCard.tsx";
import {iconLibrary as icons} from "@/components/iconLibrary.tsx";
import {useEffect, useState} from "react";
import api, {getUserId} from "@/api/api.ts";

export default function CourseFilter({
                                         selectedCourseId,
                                         setSelectedCourseId,
                                         // setupClassButton = false,
                                     }: {
    selectedCourseId: string | null;
    setSelectedCourseId: (courseId: string | null) => void;
    // setupClassButton: boolean;
}) {
    const [courses, setCourses] = useState<CourseBrief[]>([]);

    // GET PARTICIPATIONS/COURSES
    useEffect(() => {
        const studentId = getUserId();
        if (!studentId) return;

        let canceled = false;

        api
            .get(`/api/students/${studentId}/participations`)
            .then((res) => {
                const data = res.data ?? [];
                const mapped: CourseBrief[] = data
                    .map((p: any) => {
                        const id = p.courseId ?? p.CourseId ?? "";
                        const name = p.courseName ?? p.CourseName ?? "";
                        return {id, name};
                    })
                    .filter((c) => c.id && c.name);

                if (!canceled) {
                    setCourses(mapped);
                    // @ts-ignore
                    setSelectedCourseId((prev) =>
                        mapped.some((c) => c.id === prev) ? prev : null
                    );
                }
            })
            .catch((err) => {
                if (err?.response?.status === 404) {
                    if (!canceled) setCourses([]);
                    return;
                }
                console.error("Courses could not be retrieved:", err);
            });

        return () => {
            canceled = true;
        };
    }, []);

    return (
        <div className="flex flex-row items-start gap-4">
            <div className="flex flex-wrap gap-2 text-left">
                <Button
                    variant={selectedCourseId ? "outline" : "default"}
                    onClick={() => setSelectedCourseId(null)}
                >
                    All courses
                </Button>
                {courses.map((course: CourseBrief) => (
                    <Button
                        key={course.id}
                        variant={selectedCourseId == course.id ? "default" : "outline"}
                        size={"sm"}
                        className="justify-start text-left h-auto py-2 px-3"
                        onClick={() => {
                            setSelectedCourseId(course.id);
                        }}
                    >
                        {course.name}
                    </Button>
                ))}
            </div>
            <Button variant={"outline"}>
                Setup new class <icons.Plus/>
            </Button>
        </div>
    );
}

// function SetupClassPopup({
//   role,
//   selectedCourseId,
// }: {
//   role: "student" | "teacher";
//   selectedCourseId?: string | null;
// }) {}
