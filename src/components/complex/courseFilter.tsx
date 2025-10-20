import {Button} from "@/components/ui/button.tsx";
import type {CourseBrief} from "@/api/types.tsx";
import {iconLibrary as icons} from "@/components/iconLibrary.tsx";
import {FilterDropdown} from "@/components/complex/filterDropdown.tsx";
import {SetupNewClassPopup} from "@/components/complex/popups/setupNewClassPopup.tsx";
import {useEffect, useRef, useState} from "react";
import api, {getUserId} from "@/api/api.ts";
import {useUser} from "@/features/user/UserContext.tsx";
import {mapParticipationToCourseBrief, mapApiCourseToCourseBrief} from "@/mappers/courseMappers.ts";

type StudentBrief = { id: string; name: string; surname: string };

export default function CourseFilter({
                                         student,
                                         selectedCourseId,
                                         setSelectedCourseId,
                                         selectedStudentId,
                                         setSelectedStudentId,
                                         setupClassButton = false,
                                     }: {
    student: boolean;
    selectedCourseId: string | null;
    setSelectedCourseId: (courseId: string | null) => void;
    selectedStudentId?: string | null;
    setSelectedStudentId?: (studentId: string | null) => void;
    setupClassButton: boolean;
}) {

    const [courses, setCourses] = useState<CourseBrief[]>([]);
    const [students, setStudents] = useState<StudentBrief[]>([]);
    const {user} = useUser();
    const userId = getUserId();
    const [filterKey, setFilterKey] = useState(0);
    const fetchGen = useRef(0); // protection against late responses

    // FOR STUDENT: get courses they participate in
    // FOR TEACHER: initial fetch of all students and courses
    useEffect(() => {
        if (!userId || !user?.activeRole) return;
        let canceled = false;

        const fetchData = async () => {
            try {
                if (user.activeRole === "student") {
                    const res = await api.get(`/api/students/${userId}/participations`);
                    const data = res.data ?? [];
                    const mapped: CourseBrief[] = data
                        .map(mapParticipationToCourseBrief)
                        .filter((c): c is CourseBrief => !!c);

                    if (!canceled) {
                        setCourses(mapped);
                        setSelectedCourseId((prev) =>
                            mapped.some((c) => c.courseId === prev) ? prev : null
                        );
                    }
                } else if (user.activeRole === "teacher") {
                    const [sRes, cRes] = await Promise.all([
                        api.get(`/api/teacher/${userId}/students`),
                        api.get(`/api/teacher/${userId}/courses`),
                    ]);

                    const studentList = sRes.data ?? [];
                    const courseList: CourseBrief[] = (cRes.data ?? [])
                        .map((c: any) => mapApiCourseToCourseBrief(c, userId))
                        .filter((c): c is CourseBrief => !!c);

                    if (!canceled) {
                        setStudents(studentList);
                        setCourses(courseList);
                    }
                }
            } catch (err) {
                console.error("Could not load initial data:", err);
            }
        };

        fetchData();

        return () => {
            canceled = true;
        };
    }, [user, userId]);

    // FOR TEACHER: fetch courses for selected student
    // FOR TEACHER: fetch students for selected course
    /*useEffect(() => {
        if (!userId || user?.activeRole !== "teacher") return;

        const fetchRelatedData = async () => {
            try {
                if (selectedStudentId) {
                    const res = await api.get(`/api/teacher/${userId}/students/${selectedStudentId}/courses`);
                    const courseList: CourseBrief[] = (res.data ?? [])
                        .map((c: any) => mapApiCourseToCourseBrief(c, userId))
                        .filter((c): c is CourseBrief => !!c);
                    setCourses(courseList);
                } else if (selectedCourseId) {
                    const res = await api.get(`/api/teacher/${userId}/courses/${selectedCourseId}/students`);
                    setStudents(res.data ?? []);
                }
            } catch (err) {
                console.error("Could not load related data:", err);
            }
        };

        fetchRelatedData();
    }, [selectedStudentId, selectedCourseId, user?.activeRole, userId]);*/

    // A STUDENT WAS SELECTED -> LOAD ONLY THEIR COURSES
    useEffect(() => {
        if (!userId || user?.activeRole !== "teacher") return;
        if (!selectedStudentId) return; // nothing was selected -> skip

        // Bumps a request generation counter to identify the newest request.
        const gen = ++fetchGen.current;
        // Creates an abort controller to cancel this request if dependencies change.
        const ac = new AbortController();

        (async () => {
            try {
                const res = await api.get(
                    `/api/teacher/${userId}/students/${selectedStudentId}/courses`,
                    {signal: ac.signal as any}
                );

                // Ignores this response if a newer request has already been issued.
                if (gen !== fetchGen.current) return;

                const courseList: CourseBrief[] = (res.data ?? [])
                    .map((c: any) => mapApiCourseToCourseBrief(c, userId))
                    .filter((c): c is CourseBrief => !!c);

                setCourses(courseList);

                // Clears the selected course if it no longer exists in the new course set.
                if (selectedCourseId && !courseList.some(c => c.courseId === selectedCourseId)) {
                    setSelectedCourseId(null);
                }
            } catch (err: any) {
                if (err?.name !== "AbortError") {
                    console.error("Could not load courses for selected student:", err);
                }
            }
        })();

        // Cancels the in-flight request when the effect is re-run or unmounted.
        return () => ac.abort();
    }, [selectedStudentId, userId, user?.activeRole]);

    // Timeline simulation (race protection with fetchGen + AbortController):
    //
    // 1) User selects Student A:
    //    - The effect runs, gen = 1, and request A is sent.
    // 2) After ~100 ms, user changes selection to Student B:
    //    - The effect's cleanup aborts request A,
    //    - The effect runs again, gen = 2, and request B is sent.
    // 3) Response from request A still arrives (despite the abort):
    //    - We check: if (gen !== fetchGen.current) -> 1 !== 2,
    //    - This response is considered stale and is ignored (no state update).
    // 4) Response from request B arrives:
    //    - We check: if (gen !== fetchGen.current) -> 2 === 2,
    //    - This is the latest response, so we update the courses list from it.

    // A COURSE WAS SELECTED -> LOAD ONLY ITS STUDENTS
    useEffect(() => {
        if (!userId || user?.activeRole !== "teacher") return;
        if (!selectedCourseId) return;

        const gen = ++fetchGen.current;
        const ac = new AbortController();

        (async () => {
            try {
                const res = await api.get(
                    `/api/teacher/${userId}/courses/${selectedCourseId}/students`,
                    {signal: ac.signal as any}
                );
                if (gen !== fetchGen.current) return;

                const studentList: StudentBrief[] = res.data ?? [];
                setStudents(studentList);

                // A selected student is no longer valid? Clear it.
                if (selectedStudentId && !studentList.some(s => s.id === selectedStudentId)) {
                    setSelectedStudentId?.(null);
                }
            } catch (err: any) {
                if (err?.name !== "AbortError") {
                    console.error("Could not load students for selected course:", err);
                }
            }
        })();

        return () => ac.abort();
    }, [selectedCourseId, userId, user?.activeRole]);

    // RESET FILTERS
    const resetFilters = () => {
        setSelectedCourseId(null);
        setSelectedStudentId?.(null);
        setFilterKey((prev) => prev + 1);

        if (user?.activeRole === "teacher" && userId) {
            Promise.all([
                api.get(`/api/teacher/${userId}/students`),
                api.get(`/api/teacher/${userId}/courses`),
            ])
                .then(([sRes, cRes]) => {
                    setStudents(sRes.data ?? []);
                    const courseList: CourseBrief[] = (cRes.data ?? [])
                        .map((c: any) => mapApiCourseToCourseBrief(c, userId))
                        .filter((c): c is CourseBrief => !!c);
                    setCourses(courseList);
                })
                .catch((err) => console.error("Could not reload initial lists:", err));
        }
    };

    return (
        <div className="flex flex-row justify-between gap-4">
            <div className="flex gap-2 text-left overflow-x-auto scr">
                <Button
                    variant={selectedCourseId || selectedStudentId ? "outline" : "default"}
                    onClick={resetFilters}
                >
                    All courses
                </Button>
                {student &&
                    courses.map((course: CourseBrief) => (
                        <Button
                            key={course.courseId}
                            variant={
                                selectedCourseId == course.courseId ? "default" : "outline"
                            }
                            size={"sm"}
                            className="justify-start text-left h-auto py-2 px-3"
                            onClick={() => {
                                setSelectedCourseId(course.courseId);
                            }}
                        >
                            {course.courseName}
                        </Button>
                    ))}
                {!student && setSelectedStudentId && (
                    <FilterDropdown
                        reset={false}
                        key={`students-${filterKey}`}
                        items={students.map((s) => ({
                            name: s.name + " " + s.surname,
                            value: s.id,
                        }))}
                        icon={icons.People}
                        searchable={true}
                        placeholder={"Students list"}
                        emptyMessage={"No students found"}
                        multiselect={false}
                        onSelectionChange={(v) =>
                            setSelectedStudentId(v[0] ? v[0].value : null)
                        }
                    />
                )}
                {!student && setSelectedCourseId && (
                    <FilterDropdown
                        reset={false}
                        key={`courses-${filterKey}`}
                        items={courses.map((c) => ({
                            name: c.courseName,
                            value: c.courseId,
                        }))}
                        icon={icons.BookOpen}
                        searchable={true}
                        placeholder={"Courses list"}
                        emptyMessage={"No courses found"}
                        multiselect={false}
                        onSelectionChange={(v) =>
                            setSelectedCourseId(v[0] ? v[0].value : null)
                        }
                    />
                )}
                <Button
                    variant={"outline"}
                    size={"icon"}
                    onClick={resetFilters}
                >
                    <icons.Reset/>
                </Button>
            </div>
            {setupClassButton && (
                <SetupNewClassPopup course={selectedCourseId ? selectedCourseId : ""}/>
            )}
        </div>
    );
}
