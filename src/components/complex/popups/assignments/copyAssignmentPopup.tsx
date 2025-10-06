import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@radix-ui/react-label";
import type { PopupType } from "@/components/complex/popups/assignments/addTaskPopup.tsx";

export function CopyAssignmentPopup({
  setOpenedPopup,
}: {
  setOpenedPopup: (val: PopupType) => void;
}) {
  return (
    <div>
      <DialogHeader>
        <DialogTitle>Choose assignment from library</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>

      <div className={"flex flex-col gap-4 pt-2"}>
        <Label>Here will be assignments library</Label>
        <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
          <Button
            onClick={() => {
              setOpenedPopup("addTask");
            }}
          >
            Cancel
          </Button>
          <Button variant={"outline"} onSelect={() => {}}>
            Confirm
          </Button>
        </DialogFooter>
      </div>
    </div>
  );
}
