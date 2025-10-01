import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@radix-ui/react-label";
import type { PopupType } from "@/components/complex/popups/addTaskPopup.tsx";

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
  );
}
