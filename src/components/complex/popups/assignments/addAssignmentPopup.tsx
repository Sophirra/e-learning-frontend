import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import type { PopupType } from "@/components/complex/popups/assignments/addTaskPopup.tsx";

export function AddAssignmentPopup({
  setOpenedPopup,
}: {
  setOpenedPopup: (val: PopupType) => void;
}) {
  return (
    <div>
      <DialogHeader>
        <DialogTitle>Create new assignment</DialogTitle>
        <DialogDescription>Choose class and task type</DialogDescription>
      </DialogHeader>
      <div className={"flex flex-col gap-4 pt-2"}>
        <Label>Title</Label>
        <Input id={"title"} type={"text"} disabled={false} />
        <Label>Description</Label>
        <Input id={"descr"} type={"text"} />
        <Label>Additional file</Label>
        <div className={"flex flex-row gap-4"}>
          <Button variant={"outline"}>Choose from library</Button>
          <Button
            variant={"outline"}
            onClick={() => setOpenedPopup("uploadFile")}
          >
            Upload new file
          </Button>
        </div>
        <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
          <Button onClick={() => setOpenedPopup("addTask")}>Cancel</Button>
          <Button
            variant={"outline"}
            onSelect={() => {
              setOpenedPopup("addTask");
            }}
          >
            Create
          </Button>
        </DialogFooter>
      </div>
    </div>
  );
}
