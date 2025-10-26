import { useEffect, useMemo, useState } from "react";
import {
    FilterDropdown,
    type SelectableItem,
} from "@/components/complex/filterDropdown.tsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { AddAssignmentPopup } from "@/components/complex/popups/assignments/addAssignmentPopup.tsx";
import { iconLibrary as icons } from "@/components/iconLibrary.tsx";
import { CopyAssignmentPopup } from "@/components/complex/popups/assignments/copyAssignmentPopup.tsx";
import { CopyQuizPopup } from "@/components/complex/popups/assignments/copyQuizPopup.tsx";
import { DialogClose } from "@radix-ui/react-dialog";
import { useNavigate } from "react-router-dom";
import { getTeacherClassesWithStudents } from "@/api/apiCalls.ts";
import type { ClassWithStudentsDTO } from "@/api/types.ts";
import { toast } from "sonner";

export function AddTaskPopup(_classId?: string) {
    function AddTaskPopupContent() {
        const navigate = useNavigate();

        // Raw API payload (classes + their students)
        const [classesWithStudents, setClassesWithStudents] = useState<ClassWithStudentsDTO[]>([]);
        const [loading, setLoading] = useState(false);

        // Dropdown model states
        const [selectedClass, setSelectedClass] = useState<SelectableItem[]>([]);
        const [selectedStudent, setSelectedStudent] = useState<SelectableItem[]>([]);
        const [selectedTaskType, setSelectedTaskType] = useState<SelectableItem[]>([]);

        // Klucz wymuszający remount dropdownu studenta
        const [studentKey, setStudentKey] = useState(0);

        // Derived dropdown items (tolerujemy classId albo courseId)
        const availableClasses: SelectableItem[] = useMemo(
            () =>
                classesWithStudents.map((c: any) => ({
                    name: c.courseName ?? c.className ?? "Unnamed",
                    value: c.classId ?? c.courseId, // wspiera oba pola ID
                })),
            [classesWithStudents],
        );

        const availableStudents: SelectableItem[] = useMemo(() => {
            if (selectedClass.length === 0) return [];
            const classId = selectedClass[0].value;
            const entry = classesWithStudents.find((c: any) => (c.classId ?? c.courseId) === classId);
            if (!entry) return [];
            return (entry.students ?? []).map((s: any) => ({
                name: `${s.name} ${s.surname}`,
                value: s.id,
            }));
        }, [selectedClass, classesWithStudents]);

        // Fetch once on mount
        useEffect(() => {
            let alive = true;
            (async () => {
                try {
                    setLoading(true);
                    const data = await getTeacherClassesWithStudents();
                    if (!alive) return;
                    setClassesWithStudents(Array.isArray(data) ? data : []);
                } catch (e) {
                    toast.error("Failed to load classes/students. Please try again.");
                    console.error(e);
                } finally {
                    if (alive) setLoading(false);
                }
            })();
            return () => {
                alive = false;
            };
        }, []);

        // Gdy lista dostępnych studentów się zmieni i obecny wybór już nie pasuje, wyczyść wybór
        useEffect(() => {
            if (selectedStudent.length === 0) return;
            const current = selectedStudent[0]?.value;
            const stillExists = availableStudents.some((s) => s.value === current);
            if (!stillExists) {
                setSelectedStudent([]);
                // Nie remountujemy tu, bo to efekt pasywny   UI i tak zostanie wyczyszczony poprzez brak selekcji
            }
        }, [availableStudents, selectedStudent]);

        const resetForm = () => {
            setSelectedClass([]);
            setSelectedStudent([]);
            setSelectedTaskType([]);
            setStudentKey((k) => k + 1); // też wyczyść UI dropdownu studenta
        };

        const canProceed =
            selectedTaskType.length > 0 && selectedClass.length > 0 && selectedStudent.length > 0;

        return (
            <Dialog onOpenChange={resetForm}>
                <DialogTrigger asChild>
                    <Button variant={"ghost"} disabled={loading}>
                        <icons.Plus />
                        {loading ? "Loading..." : "Add"}
                    </Button>
                </DialogTrigger>

                <DialogContent className={"sm:max-w-[425px]"}>
                    <DialogHeader>
                        <DialogTitle>Add new task to class</DialogTitle>
                        <DialogDescription>Choose class and task type</DialogDescription>
                    </DialogHeader>

                    <div className={"flex flex-col gap-4"}>
                        <FilterDropdown
                            key={"class"}
                            items={availableClasses}
                            placeholder={"Select class"}
                            label={"Class"}
                            emptyMessage={loading ? "Loading classes..." : "No classes found"}
                            onSelectionChange={(sel) => {
                                setSelectedClass(sel);
                                setSelectedStudent([]);      // 1) czyść model
                                setStudentKey((k) => k + 1); // 2) wymuś remount UI dropdownu studenta
                            }}
                            multiselect={false}
                            disabled={loading}
                        />

                        <FilterDropdown
                            key={`student-${studentKey}`} // remount zawsze po zmianie klasy
                            disabled={selectedClass.length === 0 || loading}
                            label={"For student"}
                            placeholder={"Select student"}
                            emptyMessage={
                                selectedClass.length === 0 ? "Select class first" : "No students found"
                            }
                            items={availableStudents}
                            onSelectionChange={setSelectedStudent}
                            multiselect={false}
                        />

                        <FilterDropdown
                            key={"taskType"}
                            disabled={selectedStudent.length === 0 || selectedClass.length === 0 || loading}
                            items={[
                                { name: "Assignment", value: "assignment" },
                                { name: "Quiz", value: "quiz" },
                            ]}
                            placeholder={"Select task type"}
                            label={"Task type"}
                            emptyMessage={"Select task type"}
                            onSelectionChange={setSelectedTaskType}
                            multiselect={false}
                        />

                        <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
                            {canProceed ? (
                                selectedTaskType[0].value === "quiz" ? (
                                    <CopyQuizPopup />
                                ) : (
                                    <CopyAssignmentPopup />
                                )
                            ) : (
                                <Button variant={"outline"} disabled>
                                    Copy
                                </Button>
                            )}

                            {canProceed ? (
                                selectedTaskType[0].value === "quiz" ? (
                                    <DialogClose asChild>
                                        <Button
                                            onClick={() =>
                                                navigate(`/quizzes/create`, {
                                                    state: {
                                                        classId: selectedClass[0].value,
                                                        studentId: selectedStudent[0].value,
                                                    },
                                                })
                                            }
                                        >
                                            Add new quiz
                                        </Button>
                                    </DialogClose>
                                ) : (
                                    <AddAssignmentPopup
                                        // if your popup supports pre-filling:
                                        // classId={selectedClass[0].value}
                                        // studentId={selectedStudent[0].value}
                                    />
                                )
                            ) : (
                                <Button variant={"outline"} disabled>
                                    Add
                                </Button>
                            )}
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return <AddTaskPopupContent />;
}
