import { useEffect, useState } from "react";
import { Content } from "@/components/ui/content.tsx";
import { NavigationBar } from "@/components/complex/navigationBar.tsx";
import type { StudentBrief } from "@/api/types.ts";
import { LoadingTile } from "@/components/complex/LoadingTile.tsx";
import { StudentTile } from "@/components/complex/studentTile.tsx";
import { toast } from "sonner";
import { getSpectated as getSpectatedApi } from "@/api/apiCalls.ts";

//Can spectate only as a student (parent is a student without classes?)
export function SpectatorPage() {
  const [students, setStudents] = useState<StudentBrief[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    getSpectated();

    async function getSpectated() {
      try {
        const data = await getSpectatedApi();
        setStudents(data);
      } catch (e: any) {
        toast.error("Failed to fetch spectated students: " + e.message);
      }
    }
  }, []);

  return (
    <div className="bg-white h-screen">
      <NavigationBar />
      <Content>
        <div className="flex flex-row gap-8 p-4">
          {/*overflow-y-auto">*/}
          <div className="w-1/4 sticky top-0 self-start h-fit space-y-2">
            {students === null ||
            students === undefined ||
            students.length === 0 ? (
              <LoadingTile text={"No spectated students found."} />
            ) : (
              students.map((student) => (
                <StudentTile
                  student={student}
                  selectedStudentId={selectedStudentId}
                  setSelectedStudentId={setSelectedStudentId}
                />
              ))
            )}
          </div>

          <div className="w-3/4 space-y-8">
            {students.length !== 0 &&
            selectedStudentId &&
            students.some((e) => e.id === selectedStudentId) ? (
              <></>
            ) : (
              <LoadingTile text={"Select a student to see their details."} />
            )}
          </div>
        </div>
      </Content>
    </div>
  );
}
