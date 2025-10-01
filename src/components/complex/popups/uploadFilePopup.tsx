import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input.tsx";
import type { PopupType } from "@/components/complex/popups/addTaskPopup.tsx";

export function UploadFilePopup({
  setOpenedPopup,
}: {
  setOpenedPopup: (val: PopupType) => void;
}) {
  return (
    <div>
      <DialogHeader>
        <DialogTitle>Upload new file</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <Label>Choose file</Label>
      <Input type={"file"} />
      <DialogFooter className={"flex flex-row gap-4 sm:justify-center"}>
        <Button
          onClick={() => {
            setOpenedPopup("addAssignment");
          }}
        >
          Cancel
        </Button>
        <Button variant={"outline"} onSelect={() => {}}>
          Upload
        </Button>
      </DialogFooter>
    </div>
  );
}
