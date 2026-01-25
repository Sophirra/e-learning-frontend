import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { FileGallery } from "@/components/complex/galleries/fileGallery.tsx";
import { useState } from "react";
import type { FileBrief } from "@/types.ts";
import CourseFilter from "@/components/complex/courseFilter.tsx";
import { useUser } from "@/lib/user/UserContext.tsx";

export function ChooseFilePopup({
  setChosenFile,
}: {
  setChosenFile: (file: FileBrief) => void;
}) {
  const { user } = useUser();
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );
  const [selectedFile, setSelectedFile] = useState<FileBrief | undefined>();
  const [open, setOpen] = useState(false);
  function addFileToAssignment(file: FileBrief) {
    setChosenFile(file);
    console.log(file);
    setOpen(false);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Choose file</Button>
      </DialogTrigger>
      <DialogContent className={"min-w-fit"}>
        <DialogHeader>
          <DialogTitle>Choose file from library</DialogTitle>
        </DialogHeader>
        <div className={"flex flex-col gap-4 pt-2"}>
          <CourseFilter
            student={user?.activeRole === "student"}
            selectedCourseId={selectedCourseId}
            setSelectedCourseId={setSelectedCourseId}
            selectedStudentId={selectedStudentId}
            setSelectedStudentId={setSelectedStudentId}
            setupClassButton={false}
          />
          <FileGallery
            setSelectedFileParent={setSelectedFile}
            courseId={selectedCourseId ? selectedCourseId : undefined}
            studentId={selectedStudentId ? selectedStudentId : undefined}
          />
          <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
            <DialogClose>
              <Button>Cancel</Button>
            </DialogClose>
            <Button
              variant={"outline"}
              onClick={() => {
                console.log("adding file to assignment");
                selectedFile && addFileToAssignment(selectedFile);
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
